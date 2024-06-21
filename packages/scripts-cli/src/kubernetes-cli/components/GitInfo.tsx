import React, { useContext } from 'react'
import { Text } from 'ink'
import { gitContext } from 'scripts-cli/src/context/GitProvider'

export const GitInfo = () => {
  const gitInfo = useContext(gitContext)
  return (
    <>
      <Text bold underline>
        Latest deploy details:
      </Text>
      <Text>Tag:&nbsp;{gitInfo.latestTag}</Text>
      <Text>Commit sha:&nbsp;{gitInfo.commitSha}</Text>
      <Text>
        Commit date:&nbsp;{gitInfo.commitDate}, {gitInfo.timeAgo}
      </Text>
      <Text>Author name:&nbsp;{gitInfo.authorName}</Text>
      <Text>Commit message:&nbsp;{gitInfo.commitMessage}</Text>
    </>
  )
}
