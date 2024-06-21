import React from 'react'
import execa from 'execa'
import { createContext, useEffect, useState } from 'react'
import type { FC, PropsWithChildren } from 'react'

type TGitInfo = {
  latestTag: string
  commitSha: string
  authorName: string
  timeAgo: string
  commitDate: string
  commitMessage: string
}

const gitContextDetauls = {
  latestTag: 'Unknown',
  commitSha: 'Unknown',
  authorName: 'Unknown',
  timeAgo: 'Unknown',
  commitDate: 'Unknown',
  commitMessage: 'Unknown',
}

export const gitContext = createContext(gitContextDetauls)

export const GitContextProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [gitInfo, setGitInfo] = useState<TGitInfo>(gitContextDetauls)

  useEffect(() => {
    const getLatestGitTag = async () => {
      const { stdout: latestTag } = await execa.command('git tag -l --sort=-version:refname | head -n 1', {
        shell: true,
      })

      const [commitSha, commitDate, timeAgo, authorName, commitMessage] = await Promise.all([
        execa.command(`git rev-list -1 ${latestTag}`).then(r => r.stdout),
        execa.command(`git show -s --format='%ai' ${latestTag}`).then(r => r.stdout),
        execa.command(`git show -s --format='%ar%n' ${latestTag}`).then(r => r.stdout.replace(/\s'/, "'")), // The replace added because there is a bug in this git command, it response with a ' char in a new line.
        execa.command(`git show -s --format='%an' ${latestTag}`).then(r => r.stdout),
        execa.command(`git show -s --format='%s' ${latestTag}`).then(r => r.stdout),
      ])

      setGitInfo({
        latestTag,
        commitSha,
        authorName,
        timeAgo,
        commitDate,
        commitMessage,
      })
    }

    getLatestGitTag()
  }, [])

  return <gitContext.Provider value={gitInfo}>{children}</gitContext.Provider>
}
