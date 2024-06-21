import React from 'react'
import { Box, Text, useInput } from 'ink'
import { useRouter } from './useRouter'

export const Back = () => {
  const router = useRouter()

  useInput(input => {
    if (input.toLowerCase() === 'b') {
      router.prevPage()
    }
  })

  return (
    <>
      {router.history.length > 1 && (
        <Box paddingTop={1}>
          <Text color="white" backgroundColor="blue">
            Press on: 'b' to go back.
          </Text>
        </Box>
      )}
    </>
  )
}
