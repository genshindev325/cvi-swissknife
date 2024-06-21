import execa from 'execa'
import path from 'path'
import { Octokit } from 'octokit'
import type { CiCdContext } from './types'
import { CustomError } from '@coti-cvi/lw-sdk'
import async from 'async'
import type { Package } from '@manypkg/get-packages'
import fs from 'fs'

async function deploy({
  uiPackagesToDeploy,
  url,
  buildCommand,
  repoPath,
  buildDirPath,
  packageName,
}: {
  uiPackagesToDeploy: Package[]
  url: string
  buildCommand: string
  repoPath: string
  buildDirPath: string
  packageName: string
}): Promise<void> {
  await execa.command(buildCommand, {
    cwd: repoPath,
    stdio: uiPackagesToDeploy.length === 1 ? 'inherit' : 'pipe',
    env: {
      NODE_ENV: 'production',
      // https://github.com/vitejs/vite/issues/2433#issuecomment-792914871
      NODE_OPTIONS: '--max-old-space-size=16384',
    },
  })
  await execa.command(`mv index.html 200.html`, { cwd: buildDirPath, stdio: 'inherit' })
  if (packageName === 'il-admin-panel-ui' || packageName === 'cvi-admin-panel-ui') {
    await fs.promises.rm(path.join(buildDirPath, 'AUTH')).catch(() => {
      //
    })
    await fs.promises.writeFile(path.join(buildDirPath, 'AUTH'), 'cvi:armo123', 'utf-8')
  }
  await execa.command(`yarn surge --project ${buildDirPath} --domain ${url}`, {
    cwd: repoPath,
    env: {
      NODE_ENV: 'production',
      SURGE_LOGIN: 'stav@coti.io',
      SURGE_TOKEN: '784a5c393d8542e6bf89b2cfafbc60b6',
    },
    stdio: uiPackagesToDeploy.length === 1 ? 'inherit' : 'pipe',
  })
}

const packagePrUrl = (packageName: string, branch: string): string => `https://${packageName}-branch-${branch}.surge.sh`

const packageMainUrl = (packageName: string): string => `https://${packageName}.surge.sh`

export async function deployAllUiPackagesToSurge({
  deployUiPackagesStrategy,
  botGithubAccessToken,
  context,
}: {
  deployUiPackagesStrategy: 'skip' | 'pr-branch-url' | 'main-branch-url'
  botGithubAccessToken?: string
  context: CiCdContext
}) {
  if (deployUiPackagesStrategy === 'skip') {
    console.log(`skipping ui packages deployment to surge because deployUiPackagesStrategy is 'skip'`)
    return
  }

  const uiPackagesToDeploy = context.packages.packages
    .filter(p => p.packageJson.name !== 'beta-cvi-ui')
    .filter(p => {
      // @ts-ignore
      const isUi: boolean = p.packageJson.ui
      return isUi && context.runOnlyOnPackageNames.includes(p.packageJson.name)
    })

  if (uiPackagesToDeploy.length === 0) {
    console.log(`skipping ui packages deployment to surge because there are no ui packages to deploy`)
    return
  }

  if (deployUiPackagesStrategy === 'main-branch-url') {
    console.log('Start production-deploying all ui packages')
  } else {
    console.log('Start pr-deploying all ui packages')
  }

  if (!context.gitBranchName) {
    throw new Error(`pls checkout to a branch before publishing to surge...`)
  }

  console.log(`Deploying to surge:`)

  let success = true
  await async.mapLimit(uiPackagesToDeploy, context.isRunningInGithubActions ? 1 : 5, async (packageInfo: Package) => {
    if (deployUiPackagesStrategy === 'main-branch-url') {
      console.log(`Deploying ${packageInfo.packageJson.name}... ${packageMainUrl(packageInfo.packageJson.name)}`)
    } else {
      console.log(
        `Deploying ${packageInfo.packageJson.name}... ${packagePrUrl(
          packageInfo.packageJson.name,
          context.formattedGitBranchName,
        )}`,
      )
    }
    try {
      await deploy({
        uiPackagesToDeploy,
        buildCommand: `yarn bundle`,
        url:
          deployUiPackagesStrategy === 'main-branch-url'
            ? packageMainUrl(packageInfo.packageJson.name)
            : packagePrUrl(packageInfo.packageJson.name, context.formattedGitBranchName),
        repoPath: packageInfo.dir,
        buildDirPath: path.join(packageInfo.dir, 'ui-dist'),
        packageName: packageInfo.packageJson.name,
      })
      console.log(`Deployed ${packageInfo.packageJson.name} successfully.`)
    } catch (e) {
      console.error(`Failed to deploy ${packageInfo.packageJson.name}`)
      CustomError.printErrorToConsole(e)
      success = false
    }
  })

  if (!success) {
    throw new Error(`failed to deploy one of more UIs`)
  }

  console.log('all packages deployed successfully.')

  if (deployUiPackagesStrategy === 'pr-branch-url' && context.gitBranchName) {
    if (botGithubAccessToken) {
      console.log(`Adding Github comment with surge links...`)

      const octokit = new Octokit({
        auth: botGithubAccessToken,
      })

      const { data } = await octokit.request(
        'GET /repos/cotitech-io/cvi-swissknife/pulls?state=open&sort=updated&per_page=100',
      )

      const { html_url, number } =
        data?.find((pullRequest: { head?: { ref?: string } }) =>
          pullRequest?.head?.ref?.toLowerCase().includes(context.gitBranchName.toLowerCase()),
        ) || {}

      if (!html_url) {
        console.log(
          `Skipping adding Github comment with surge links because we failed to find pull request for branch ${context.gitBranchName}`,
        )
        return
      }

      for (const packageInfo of Object.values(uiPackagesToDeploy)) {
        console.log(packagePrUrl(packageInfo.packageJson.name, context.formattedGitBranchName))
      }

      await octokit.request(`POST /repos/cotitech-io/cvi-swissknife/issues/${number}/comments`, {
        // add a comment to pull request
        body: `\
Commit: "${context.gitHeadSha}" deployed to surge:
${Object.values(uiPackagesToDeploy)
  .map(packageInfo => packagePrUrl(packageInfo.packageJson.name, context.formattedGitBranchName))
  .map((url, i) => `${i + 1}. ${url}`)
  .join('\n')}`,
      })
    } else {
      console.log(`Skipping adding Github comment with surge links because no access token is set.`)
      console.log(`To set it: BOT_botGithubAccessToken=<token>`)
    }
  } else {
    console.log(
      `Skipping adding Github comment with surge links because ${
        deployUiPackagesStrategy === 'main-branch-url' ? `we are on main branch` : `no branch is set`
      }`,
    )
  }
}
