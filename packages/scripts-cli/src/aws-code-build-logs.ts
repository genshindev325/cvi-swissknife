import execa from 'execa'
import path from 'path'
import findUp from 'find-up'
import { getBranchName } from './ci-cd/utils'

type AwsCodeBuildLog = {
  timestamp: number
  message: string
  ingestionTime: number
}

async function getBuildsInfo(buildsId: string[]) {
  const r = await execa.command(`aws codebuild batch-get-builds --region eu-west-1 --ids ${buildsId.join(' ')}`, {
    stdio: 'pipe',
  })

  const typedResult: {
    builds: {
      id: string
      buildNumber: number
      currentPhase: string
      startTime: string
      endTime?: string
      buildStatus?: string
      resolvedSourceVersion: string
    }[]
  } = JSON.parse(r.stdout)

  return typedResult.builds
}

const checkIsBuildComplete = async (buildId: string): Promise<boolean> => {
  const build = await getBuildsInfo([buildId])
  return build[0].currentPhase === 'COMPLETED'
}

const getBuildLogs = async (buildId: string): Promise<AwsCodeBuildLog[]> => {
  const shortBuildid = buildId.includes(':') ? buildId.split(':')[1] : buildId
  const { stdout } = await execa.command(
    `aws logs get-log-events --region eu-west-1 --log-group-name /aws/codebuild/cvi-swissknife--main --log-stream-name ${shortBuildid}`,
    { stdio: 'pipe' },
  )
  const result = JSON.parse(stdout) as {
    events: {
      timestamp: number
      message: string
      ingestionTime: number
    }[]
  }
  return result.events
}

export async function printAwsCodebuildLogsByBuildId(buildId: string): Promise<void> {
  let lastIndexShown = -1

  while (true) {
    const [isBuildComplete, logsNow] = await Promise.all([checkIsBuildComplete(buildId), getBuildLogs(buildId)])

    for (let i = lastIndexShown + 1; i < logsNow.length; i++, lastIndexShown++) {
      const { timestamp, message } = logsNow[i]
      process.stdout.write(`${new Date(timestamp).toISOString()} - ${message}`)
    }

    if (isBuildComplete) {
      return
    }
  }
}

export async function printAwsCodebuildLogsByCurrentBranch(env: Omit<NodeJS.ProcessEnv, 'NODE_ENV'>): Promise<void> {
  const repoPath = path.dirname((await findUp('yarn.lock', { cwd: __dirname }))!)

  const [gitHeadSha, gitBranchName, allBuilds] = await Promise.all([
    execa
      .command(`git log -1 --pretty=%H`, {
        stdio: 'pipe',
        cwd: repoPath,
      })
      .then(r => r.stdout),
    getBranchName({ repoPath, env }),
    execa
      .command('aws codebuild list-builds --region eu-west-1 --sort-order DESCENDING --max-items 100', {
        stdio: 'pipe',
        cwd: repoPath,
      })
      .then<{ ids: string[] }>(r => JSON.parse(r.stdout))
      .then(r => r.ids)
      .then(ids => getBuildsInfo(ids)),
  ])

  const isBuildInCurrentBranch = await Promise.all(
    allBuilds.map(b =>
      execa
        .command(`git merge-base --is-ancestor ${b.resolvedSourceVersion} ${gitHeadSha}`, {
          cwd: repoPath,
          stdio: 'pipe',
        })
        .then(
          () => true,
          () => false,
        ),
    ),
  )

  const latestBuildInCurrentBranch = allBuilds.find((b, index) => isBuildInCurrentBranch[index])
  if (!latestBuildInCurrentBranch) {
    throw new Error(`No build found for current branch: "${gitBranchName}" (${gitHeadSha})`)
  }

  await printAwsCodebuildLogsByBuildId(latestBuildInCurrentBranch.id)

  console.log('----------------------')
  console.log('----------------------')
  console.log('----------------------')

  const lengthBetweenCommits = await execa
    .command(`git rev-list --count ${latestBuildInCurrentBranch.resolvedSourceVersion}..${gitHeadSha}`, {
      cwd: repoPath,
      stdio: 'pipe',
    })
    .then(r => Number(r.stdout) - 1)

  if (lengthBetweenCommits > 0) {
    console.log(`this is not the most up to date commit! you have unpushed commits!`)
  }
  console.log(
    `build-id: ${latestBuildInCurrentBranch.id} - commit: ${latestBuildInCurrentBranch.resolvedSourceVersion} - ${latestBuildInCurrentBranch.currentPhase}`,
  )
}
