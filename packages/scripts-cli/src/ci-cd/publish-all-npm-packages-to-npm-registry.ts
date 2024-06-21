import execa from 'execa'
import path from 'path'
import os from 'os'
import fs from 'fs'
import semver from 'semver'
import type { PackageJSON } from '@changesets/types'
import type { CiCdContext } from './types'

async function getNpmHighestVersionInfo({
  packageName,
  repoPath,
  registryAddress,
}: {
  packageName: string
  repoPath: string
  registryAddress: string
}): Promise<
  | {
      highestVersion?: string
      allVersions: Array<string>
    }
  | undefined
> {
  try {
    const command = `npm view ${packageName} --json --registry ${registryAddress}`

    console.log(`searching the latest tag: "${command}"`)

    const result = await execa.command(command, {
      cwd: repoPath,
      stdio: 'pipe',
      env: { NODE_ENV: 'production', npm_config_registry: registryAddress },
    })
    const resultJson = JSON.parse(result.stdout) || {}
    const allVersions: Array<string> = resultJson.versions || []
    const distTags = resultJson['dist-tags'] as { [key: string]: string }
    const highestVersion = distTags.latest

    const latest = {
      highestVersion,
      allVersions,
    }
    console.log(`latest tag for "${packageName}" is: "${latest.highestVersion}"`)
    return latest
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    if (e.message.includes('code E404')) {
      console.log(`"${packageName}" weren't published`)
    } else {
      throw e
    }
  }
}

function calculateHighestVersion(versions: Array<string>): string {
  const sortedVersions = versions.sort(semver.compare)
  return sortedVersions[sortedVersions.length - 1]
}

function calculateNewVersion({
  packagePath,
  packageJsonVersion,
  allPublishedVersions = [],
}: {
  packagePath: string
  packageJsonVersion: string
  allPublishedVersions?: Array<string>
}): string {
  if (!semver.valid(packageJsonVersion)) {
    throw new Error(`version packgeJson in ${packagePath} is invalid: ${packageJsonVersion}`)
  }

  const incVersion = (version: string) => {
    if (!semver.valid(version)) {
      throw new Error(`version is invalid: ${version} in ${packagePath}`)
    }
    const formattedVersion = version.includes('-') ? version.split('-')[0] : version
    const newVersion = semver.inc(formattedVersion, 'patch')
    if (!newVersion) {
      throw new Error(`could not path-increment version: ${formattedVersion} in ${packagePath}`)
    }
    return newVersion
  }

  const allValidVersions = allPublishedVersions.filter(version => semver.valid(version))
  const sorted = semver.sort(allValidVersions)

  if (sorted.length === 0) {
    return packageJsonVersion
  }

  const highestPublishedVersion = sorted[sorted.length - 1]

  let nextVersion: string
  if (sorted.includes(packageJsonVersion)) {
    nextVersion = incVersion(highestPublishedVersion)
  } else {
    if (semver.compare(packageJsonVersion, highestPublishedVersion) === 1) {
      nextVersion = packageJsonVersion
    } else {
      nextVersion = incVersion(highestPublishedVersion)
    }
  }
  console.log(`calculated next-version: "${nextVersion}" - params:`, {
    packagePath,
    packageJsonVersion,
    highestPublishedVersion,
  })

  return nextVersion
}

async function calculateNextNewVersion({
  packageJson,
  packagePath,
  repoPath,
  registryAddress,
}: {
  packageJson: PackageJSON
  packagePath: string
  repoPath: string
  registryAddress: string
}): Promise<string> {
  const npmhighestVersionInfo = await getNpmHighestVersionInfo({
    packageName: packageJson.name,
    repoPath,
    registryAddress,
  })
  return calculateNewVersion({
    packagePath,
    packageJsonVersion: packageJson.version,
    allPublishedVersions: npmhighestVersionInfo?.allVersions,
  })
}

async function npmRegistryLogin({
  npmRegistry,
}: {
  npmRegistry: {
    token: string
    registryAddress: string
  }
}): Promise<void> {
  const npmrcPath = path.join(os.homedir(), '.npmrc')

  const line = `//${npmRegistry.registryAddress.replace('http://', '').replace('https://', '')}/:_authToken=${
    npmRegistry.token
  }`

  if (!fs.existsSync(npmrcPath) || !(await fs.promises.readFile(npmrcPath, 'utf-8')).includes(line)) {
    await fs.promises.appendFile(npmrcPath, `${line}${os.EOL}`)
  }

  console.log(`logged in to npm-registry: "${npmRegistry.registryAddress}"`)
}

export async function publicAllNpmPackagesToNpmRegistry({
  context,
  npmRegistry,
  publishNpmPackages,
}: {
  npmRegistry: {
    token: string
    registryAddress: string
  }
  publishNpmPackages: boolean
  context: CiCdContext
}): Promise<void> {
  if (publishNpmPackages) {
    console.log('Start publishing to npm-registry')
  } else {
    console.log('Start mock-publishing to npm-registry')
  }

  const packagesToPublish = context.packages.packages.filter(
    p => p.packageJson.publishConfig && context.runOnlyOnPackageNames.includes(p.packageJson.name),
  )

  if (packagesToPublish.length > 0) {
    // there is at least one package we need to publish.
    await npmRegistryLogin({
      npmRegistry,
    })
    const nextVersions = await Promise.all(
      packagesToPublish.map(async packageInfo =>
        calculateNextNewVersion({
          packageJson: packageInfo.packageJson,
          packagePath: packageInfo.dir,
          repoPath: context.repoPath,
          registryAddress: npmRegistry.registryAddress,
        }),
      ),
    )

    // it's easier that all packages will be published with the same version because you know what
    // packages-versions works with what other-packages-versions
    const newVersionToAllPublishedPackages = calculateHighestVersion(nextVersions)

    const { registryAddress } = npmRegistry

    await Promise.all(
      packagesToPublish.map(async packageInfo => {
        const publishCommand = !publishNpmPackages ? `npm publish --dry-run` : `npm publish`

        if (!publishNpmPackages) {
          console.log(
            `publishing (dry-run) "${packageInfo.dir}" to "${registryAddress}" with version "${newVersionToAllPublishedPackages}". command: ${publishCommand}`,
          )
        } else {
          console.log(
            `publishing "${packageInfo.dir}" to "${registryAddress}" with version "${newVersionToAllPublishedPackages}". command: ${publishCommand}`,
          )
        }

        const originalPackageJsonString = await fs.promises.readFile(
          path.join(packageInfo.dir, 'package.json'),
          'utf-8',
        )

        const modifiedPackageJsonStringDuringPublish = originalPackageJsonString
          .replace(`"version": "1.0.0"`, `"version": "${newVersionToAllPublishedPackages}"`)
          .replace(/workspace:packages\/[^"]*/g, newVersionToAllPublishedPackages)

        console.log(`all packages will be published with version: ${newVersionToAllPublishedPackages}`)

        try {
          await fs.promises.writeFile(
            path.join(packageInfo.dir, 'package.json'),
            modifiedPackageJsonStringDuringPublish,
            'utf-8',
          )

          await execa.command(publishCommand, {
            cwd: packageInfo.dir,
            stdio: 'inherit',
            env: {
              NODE_ENV: 'production',
              NODE_AUTH_TOKEN: npmRegistry.token,
              npm_config_registry: npmRegistry.registryAddress,
            },
          })
        } catch (e) {
          throw new Error(
            JSON.stringify(
              {
                name: 'npm-publish-error',
                message: `failed to publish a package to npm registry`,
                cause: e,
                extras: {
                  publishCommand,
                  dryRun: !!publishNpmPackages,
                  packageInfo,
                  originalPackageJsonString,
                  modifiedPackageJsonStringDuringPublish,
                },
              },
              null,
              2,
            ),
          )
        } finally {
          await fs.promises.writeFile(path.join(packageInfo.dir, 'package.json'), originalPackageJsonString, 'utf-8')
        }

        if (!publishNpmPackages) {
          console.log(
            `published (dry-run) "${packageInfo.dir}" to "${registryAddress}" with version "${newVersionToAllPublishedPackages}"`,
          )
        } else {
          console.log(
            `published "${packageInfo.dir}" to "${registryAddress}" with version "${newVersionToAllPublishedPackages}"`,
          )
        }
      }),
    )
  }

  console.log(`end npm-publish phase`)
}
