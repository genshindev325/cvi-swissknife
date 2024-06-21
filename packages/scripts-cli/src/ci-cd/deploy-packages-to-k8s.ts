import execa from 'execa'
import fs from 'fs'
import os from 'os'
import path from 'path'
import type { CiCdContext } from './types'
import { replaceInFile } from 'replace-in-file'
import { CustomError, ErrorKind } from '@coti-cvi/lw-sdk'
import { listTags } from '@era-ci/image-registry-client'

async function loginToDockerRegistry(repoPath: string, dockerRegistry: { username: string; token: string }) {
  console.log(`logging in to docker registry with username: "${dockerRegistry.username}"`)
  await execa('docker', ['login', '--username', dockerRegistry.username, '--password', dockerRegistry.token], {
    stdio: 'pipe',
    cwd: repoPath,
  })
  console.log(`logged in to docker registry with username: "${dockerRegistry.username}"`)
}

async function buildPushImages({
  dockerImageName,
  shouldPushImage,
  npmRegistry,
  context,
  runDockerBuild,
  dockerOrg,
  repo,
  dockerRegistry,
}: {
  dockerImageName: string
  shouldPushImage: boolean
  npmRegistry: {
    token: string
    registryAddress: string
  }
  dockerOrg: string
  repo: string
  context: CiCdContext
  runDockerBuild: boolean
  dockerRegistry: {
    username: string
    token: string
  }
}): Promise<void> {
  if (!runDockerBuild) {
    console.log(`skipping docker-build`)
    return
  }

  const existingTags = await listTags({
    dockerOrg,
    repo,
    auth: dockerRegistry,
  })
  const orgWithRepo = `${dockerOrg}/${repo}`
  const repoChecksumTag = `repo-checksum-${context.repoChecksum}`
  const newTag = dockerImageName.split(':')[1]

  if (existingTags.includes(repoChecksumTag)) {
    await execa.command(`docker-retag ${orgWithRepo}:${repoChecksumTag} ${newTag}`, {
      env: {
        DOCKER_USER: dockerRegistry.username,
        DOCKER_PASS: dockerRegistry.token,
      },
    })
    console.log(
      `retagged backend-image: from "${repoChecksumTag}" to "${dockerImageName}" (instead of building it from scratch) because it's already built and pushed with the same repo-checksum`,
    )
    return
  }

  const backendDockerfileDirPath = context.packages.packages.find(p => p.packageJson.name === 'backend-dockerfile')!.dir
  // platform=linux/amd64 is specified because we also building images locally from macbook m1
  // and the target should be for mainly for linux.
  const backendBuildCommand = `docker build \
  --platform=linux/amd64 \
  --build-arg IMAGE_VERSION=${context.gitHeadSha} \
  --build-arg NPM_REGISTRY_ADDRESS=${npmRegistry.registryAddress.replace('http://', '').replace('https://', '')} \
  --build-arg NPM_TOKEN=${npmRegistry.token} \
  -f backend.dockerfile \
  -t ${dockerImageName} \
  -t ${repoChecksumTag} \
  ../..`
  console.log(
    `building backend-image: "${dockerImageName}": "${backendBuildCommand.replace(
      npmRegistry.token,
      '<npm-registry-token>',
    )}"`,
  )
  await execa.command(backendBuildCommand, {
    cwd: backendDockerfileDirPath,
    stdio: 'inherit',
  })
  console.log(`built backend-image: "${dockerImageName}"`)

  if (shouldPushImage) {
    const backendPushCommand = `docker push ${dockerImageName}`
    console.log(`pushing backend-image: "${dockerImageName}": "${backendPushCommand}"`)
    await execa.command(backendPushCommand, {
      stdio: 'inherit',
      shell: true,
    })
    await execa.command(`docker-retag ${orgWithRepo}:${newTag} ${repoChecksumTag}`, {
      env: {
        DOCKER_USER: dockerRegistry.username,
        DOCKER_PASS: dockerRegistry.token,
      },
    })
    console.log(`pushed backend-image: "${dockerImageName}" and: "${orgWithRepo}:${repoChecksumTag}"`)
  } else {
    console.log(`skipping push backend-image: "${dockerImageName}" phase`)
  }
}

async function saveK8sConfigInContainer({
  kubeConfigPath,
  k8sConfigBase64,
}: {
  kubeConfigPath: string
  k8sConfigBase64: string
}): Promise<void> {
  // this is how kubectl find it's config
  process.env.KUBECONFIG = kubeConfigPath
  const k8sConfig = Buffer.from(k8sConfigBase64, 'base64')
  await fs.promises.writeFile(kubeConfigPath, k8sConfig)
}

export async function loginToK8s({ k8sConfigBase64 }: { k8sConfigBase64: string }) {
  // helm uses kubectl so kubectl needs to be configured with access writes to k8s
  const kubeConfigPath = path.join(os.tmpdir(), 'config')
  await saveK8sConfigInContainer({ kubeConfigPath, k8sConfigBase64 })
}

async function deployToK8s({
  dockerImageName,
  helmChartDir,
  k8sNamespaceToDeploy,
  deployBackendPackagesToK8s,
  context,
}: {
  dockerImageName: string
  helmChartDir: string
  k8sNamespaceToDeploy: string
  deployBackendPackagesToK8s: 'skip' | 'dry-run' | 'production'
  context: CiCdContext
}) {
  switch (deployBackendPackagesToK8s) {
    case 'dry-run':
      console.log(`dry-run --- start deployment of all backend packages without actually deploying to k8s phase`)
      break
    case 'production':
      console.log(`start deployment of all backend packages to k8s phase`)
      break
    case 'skip':
      return
  }
  const apiVersionToReplace = '0.0.0-it-will-be-replaced-at-ci-cd'
  const newApiVersion = `0.0.0-${context.gitHeadSha}`

  try {
    await replaceInFile({
      files: path.join(context.repoPath, 'packages', 'helm-chart', '**', '*'),
      from: apiVersionToReplace,
      to: newApiVersion,
    })

    const helmReleaseName = `coti-cvi`
    const deploymentCommand = `\
helm upgrade ${helmReleaseName} \
--debug \
--install \
--wait \
--timeout 10m \
--set global.backend_image=${dockerImageName} \
--namespace ${k8sNamespaceToDeploy} ${deployBackendPackagesToK8s === 'production' ? '' : '--dry-run'} \
${helmChartDir}`

    if (deployBackendPackagesToK8s === 'production') {
      console.log(`deploying with helm: "${deploymentCommand}"`)
    } else {
      console.log(
        `[dry-run] checking deployment phase with helm: "${deploymentCommand}" without really deplying something`,
      )
    }

    try {
      await execa
        .command(deploymentCommand, {
          stdio: deployBackendPackagesToK8s === 'production' ? 'inherit' : 'pipe',
        })
        .then(
          async () => {
            if (deployBackendPackagesToK8s === 'production') {
              const gitTag = `deployed-to-k8s-${new Date().toISOString().replaceAll(':', '-')}`
              await execa.command(`git tag ${gitTag}`, {
                stdio: 'inherit',
                cwd: context.repoPath,
              })
              await execa.command(`git push origin ${gitTag}`, {
                stdio: 'inherit',
                cwd: context.repoPath,
              })
            }
          },
          e => {
            if (
              deployBackendPackagesToK8s === 'dry-run' &&
              e?.message?.includes('another operation (install/upgrade/rollback) is in progress')
            ) {
              return
            }
            throw e
          },
        )

      if (deployBackendPackagesToK8s === 'production') {
        console.log(`end deployment phase`)
      } else {
        console.log(`checked deployment phase with helm. all good :)`)
      }
    } catch (e) {
      throw new CustomError({
        name: 'helm-k8s-deployment-error',
        message: `failed to deploy to k8s using helm`,
        cause: e,
        errorKind: ErrorKind.SystemError,
        extras: {
          deploymentCommand,
          dryRun: deployBackendPackagesToK8s === 'dry-run',
        },
      })
    }
  } finally {
    await replaceInFile({
      files: path.join(context.repoPath, 'packages', 'helm-chart', '**', '*'),
      from: newApiVersion,
      to: apiVersionToReplace,
    })
  }
}

export async function deployAllBackendPackagesToK8s({
  k8sNamespaceToDeploy,
  k8sConfigBase64,
  deployBackendPackagesToK8s,
  dockerRegistry,
  npmRegistry,
  context,
  runDockerBuild,
}: {
  deployBackendPackagesToK8s: 'skip' | 'dry-run' | 'production'
  dockerRegistry: {
    username: string
    token: string
  }
  k8sNamespaceToDeploy: string
  k8sConfigBase64: string
  npmRegistry: {
    token: string
    registryAddress: string
  }
  context: CiCdContext
  runDockerBuild: boolean
}) {
  if (deployBackendPackagesToK8s !== 'skip') {
    await loginToK8s({ k8sConfigBase64 })
  }

  const dockerOrg = 'coticvi'
  const repo = 'swissknife-backend'

  const dockerImageName = `${dockerOrg}/${repo}:${context.gitHeadSha}`

  await loginToDockerRegistry(context.repoPath, dockerRegistry)

  await buildPushImages({
    dockerImageName,
    context,
    shouldPushImage: true,
    npmRegistry,
    runDockerBuild,
    dockerOrg,
    repo,
    dockerRegistry,
  })

  console.log(`end docker-build-push phase`)

  await deployToK8s({
    helmChartDir: context.packages.packages.find(p => p.packageJson.name === 'helm-chart')!.dir,
    dockerImageName,
    k8sNamespaceToDeploy,
    deployBackendPackagesToK8s,
    context,
  })
}
