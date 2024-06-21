import execa from 'execa'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { printAwsCodebuildLogsByBuildId, printAwsCodebuildLogsByCurrentBranch } from './aws-code-build-logs'
import { killUsedDevPorts } from './kill-used-dev-ports'
import { runCi } from './ci-cd/utils'
import type { CiCdCommandArguments } from './ci-cd'
import { createAutoGeneratedCode } from './create-auto-generated-code'
import { renderKubernetesCli } from './kubernetes-cli/renderKubernetesCli'
import { getPackages } from '@manypkg/get-packages'
import path from 'path'
import findUp from 'find-up'
import { minimizeIlSolidityLines } from './minimize-il-solidity-lines'

export async function main(argv: string[], env: Omit<NodeJS.ProcessEnv, 'NODE_ENV'>) {
  const repoPath = path.dirname((await findUp('yarn.lock', { cwd: __dirname }))!)
  const packages = await getPackages(repoPath)

  await yargs(hideBin(argv))
    .command<{}>(
      'minimize-il-solidity-lines',
      'minimize il soldiity lines',
      () => {
        //
      },
      () => minimizeIlSolidityLines(repoPath),
    )
    .command<{ watch: boolean; skipCache: boolean }>(
      'create-auto-generated-code',
      'generate types and code from soldiity and backend-swaggers',
      () => {
        //
      },
      argv => createAutoGeneratedCode({ isWatchMode: argv.watch, skipCache: argv.skipCache }),
    )
    .option('watch', {
      type: 'boolean',
      description: 'watch mode',
    })
    .option('skip-cache', {
      type: 'boolean',
      description: 'should skip cache',
    })
    .command<{ url: string }>(
      'surge-teardown',
      'teardown (delete) a surge deployment',
      () => {
        //
      },
      async argv => {
        await execa.command(`yarn surge teardown --domain ${argv.url}`, {
          env: {
            NODE_ENV: 'production',
            SURGE_LOGIN: 'stav@coti.io',
            SURGE_TOKEN: '784a5c393d8542e6bf89b2cfafbc60b6',
          },
          stdio: 'inherit',
        })
      },
    )
    .command<{ url: string }>(
      ['k8s-cli', 'kubernetes-cli'],
      'manage kubernetes pods',
      () => {
        //
      },
      async argv => {
        renderKubernetesCli()
      },
    )
    .option('url', {
      type: 'string',
      description: 'surge url to teardown',
    })
    .command<{ ports: number[] }>(
      'kill-used-dev-ports',
      'kill used dev ports',
      () => {
        //
      },
      async argv => {
        await killUsedDevPorts(argv.ports)
      },
    )
    .option('ports', {
      type: 'number',
      array: true,
      description: 'ports to kill',
      default: [
        80, 4000, 4001, 4002, 4003, 4004, 6999, 7001, 7002, 7003, 7004, 7005, 7006, 8080, 8081, 8083, 8084, 8085, 8001,
        8002, 8003,
      ],
    })
    .command<{ buildId?: string; currentBranch?: boolean }>(
      'aws-code-build-logs',
      'show logs of aws codebuild',
      () => {
        //
      },
      async argv => {
        if (!argv.buildId && !argv.currentBranch) {
          throw new Error('You must provide either --build-id or --current-branch')
        }
        if (argv.buildId) {
          await printAwsCodebuildLogsByBuildId(argv.buildId)
        }
        if (argv.currentBranch) {
          await printAwsCodebuildLogsByCurrentBranch(env)
        }
      },
    )
    .option('build-id', {
      type: 'string',
      description: 'build id. for example: 4f71630d-e03b-45be-9f10-ca7d1d64a3b6',
    })
    .option('current-branch', {
      type: 'boolean',
      description: 'show logs of curent branch',
    })
    .command<CiCdCommandArguments>(
      'run-ci',
      'run CI/CD pipeline: publish all npm packages, deploy all ui packages to surge, deploy all backend packages to k8s',
      () => {
        //
      },
      async commandArguments => runCi({ ciCdCommandArguments: commandArguments, env }),
    )
    .option('packages', {
      type: 'string',
      default: 'all',
      choices: ['all', ...packages.packages.map(p => p.packageJson.name)],
      description: `seperated by comma. run ci/cd only on these packages for steps that support this option`,
    })
    .option('github-username', {
      type: 'string',
      default: env.GITHUB_USERNAME,
      description: `github username. default === (process.env.GITHUB_USERNAME)`,
    })
    .option('run-git-diff-verifications', {
      type: 'boolean',
      default: env.RUN_GITT_DIFF_VERIFICATIONS,
      description: `various checks regarding if git diff is not empty. default === (process.env.RUN_GITT_DIFF_VERIFICATIONS)`,
    })
    .option('run-docker-build', {
      type: 'boolean',
      default: env.RUN_DOCKER_BUILD === 'true',
      description: `run docker build. default === (process.env.RUN_DOCKER_BUILD)`,
    })
    .option('key-value-store-api-key', {
      type: 'string',
      default: env.KEY_VALUE_STORE_API_KEY,
      description: `api-key for the key-value store. default === (process.env.KEY_VALUE_STORE_API_KEY)`,
    })
    .option('deploy-backend-packages-to-k8s', {
      type: 'string',
      choices: ['skip', 'dry-run', 'production'],
      default: env.DEPLOY_BACKEND_PACKAGES_TO_K8S || 'skip',
      description: `should deploy all backend packages to k8s. default === (process.env.DEPLOY_BACKEND_PACKAGES_TO_K8S ?? 'skip')`,
    })
    .option('deploy-ui-packages-strategy', {
      type: 'string',
      choices: ['skip', 'pr-branch-url', 'main-branch-url'],
      default: !env.GITHUB_REF_NAME ? 'skip' : env.GITHUB_REF_NAME === 'main' ? 'main-branch-url' : 'pr-branch-url',
      description: `should deploy all ui packages to surge as main url or pr url or skip deployment. default === (skip on local build, main-branch-url on main branch, pr-branch-url on pr branch)`,
    })
    .option('publish-npm-packages', {
      type: 'boolean',
      default: env.GITHUB_REF_NAME === 'main',
      description: `should publish all npm packages to npm-registry. default === (process.env.GITHUB_REF_NAME === 'main')`,
    })
    .option('github-access-token', {
      type: 'string',
      default: env.GITHUB_ACCESS_TOKEN,
      description: `github access token - is used to comment on prs. default === process.env.GITHUB_ACCESS_TOKEN`,
    })
    .option('npm-registry-address', {
      type: 'string',
      default: env.NPM_REGISTRY_ADDRESS,
      description: `npm registry address (e.g. https://registry.npmjs.org/). default === process.env.NPM_REGISTRY_ADDRESS`,
    })
    .option('npm-registry-token', {
      type: 'string',
      default: env.NPM_REGISTRY_TOKEN,
      description: `npm registry token. default === process.env.NPM_REGISTRY_TOKEN`,
    })
    .option('docker-registry-username', {
      type: 'string',
      default: env.DOCKER_REGISTRY_USERNAME,
      description: `docker registry username. default === process.env.DOCKER_REGISTRY_USERNAME`,
    })
    .option('docker-registry-token', {
      type: 'string',
      default: env.DOCKER_REGISTRY_TOKEN,
      description: `docker registry token. default === process.env.DOCKER_REGISTRY_TOKEN`,
    })
    .option('k8s-config-base64', {
      type: 'string',
      default: env.K8S_CONFIG_BASE64,
      description: `k8s config base64. default === process.env.K8S_CONFIG_BASE64`,
    })
    .option('k8s-namespace-to-deploy', {
      type: 'string',
      default: env.K8S_NAMESPACE_TO_DEPLOY,
      description: `k8s namespace to deploy. default === process.env.K8S_NAMESPACE_TO_DEPLOY`,
    })
    .option('base-git-diff-in-test-mode-only', {
      type: 'string',
      default: env.BASE_GIT_DIFF_IN_TEST_MODE_ONLY,
      description: `only for manually testing scripts-cli package - do not use - change the base commit hash when detecting changes in this repo. default === process.env.BASE_GIT_DIFF_IN_TEST_MODE_ONLY`,
    })
    .demandCommand(1)
    .parse()
}
