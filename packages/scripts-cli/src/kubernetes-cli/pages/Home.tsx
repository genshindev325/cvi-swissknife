import React from 'react'
import { Box, Text, useInput } from 'ink'
import { useRouter } from '../router/useRouter'

export const Home = () => {
  const router = useRouter()

  useInput((input, key) => {
    if (key.return) {
      router.addPage({ path: '/pods' })
    }
  })

  return (
    <>
      <Text color="white">Welcome to cvi swissknife kubernetes cli</Text>

      <Text bold backgroundColor="yellow">
        BE CAREFUL! In this cli you're able to edit pods in production, use it carefully!
      </Text>

      <Box paddingTop={1} paddingBottom={1} flexDirection="column">
        <Text color="white" bold>
          Options available (1):
        </Text>

        <Text color="green" bold underline>
          1. List all cvi-swissknife pod list.
        </Text>
      </Box>

      <Box paddingBottom={1} flexDirection="column">
        <Text bold underline>
          Click enter to select an option and continue.
        </Text>
      </Box>
    </>
  )
}
