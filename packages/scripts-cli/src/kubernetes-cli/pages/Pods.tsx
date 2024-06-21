import React, { useEffect, useState } from 'react'
import { Box, Text, useInput } from 'ink'
import { useRouter } from '../router/useRouter'
import fs from 'fs'
import { useK8sApi } from '../hooks/useK8sApi'
import type { V1Pod } from '../k8s/types'
import { helmDirectoryPath } from '../k8s/utils'

export const Pods = () => {
  const router = useRouter()
  const [podList, setPodList] = useState<V1Pod[]>()
  const [selectedRow, setSelectedRow] = useState<number>(0)
  const { k8sCoreApi } = useK8sApi()

  useInput((input, key) => {
    if (key.downArrow) {
      setSelectedRow(prev => {
        if (podList?.length && prev === podList.length - 1) {
          return 0
        }
        return Math.min((podList?.length ?? 0) - 1, prev + 1)
      })
    }

    if (key.upArrow) {
      setSelectedRow(prev => {
        if (prev === 0) {
          return podList?.length ? podList.length - 1 : 0
        }
        return Math.max(0, prev - 1)
      })
    }

    if (key.return) {
      if (podList) {
        router.addPage({
          path: `/pod/${podList[selectedRow].metadata?.name}`,
        })
      }
    }
  })

  useEffect(() => {
    if (k8sCoreApi) {
      const getPods = async () => {
        try {
          const foldersNameList = await fs.readdirSync(helmDirectoryPath)
          const r = await k8sCoreApi.listNamespacedPod('default')

          const podList = r.body.items

          setPodList(podList.filter(p => foldersNameList.some(name => p.metadata?.name?.includes(name))))
        } catch (error) {
          console.log('Failed to get pods', error)
        }
      }

      getPods()
    }
  }, [k8sCoreApi])

  if (podList === undefined || k8sCoreApi === undefined) {
    return (
      <Box padding={1} borderColor="magenta">
        <Text color="magenta">Loading...</Text>
      </Box>
    )
  }

  return (
    <>
      <Text underline>Options available: ({podList.length}):</Text>

      {podList?.map((pod, index) => (
        <Text
          key={index}
          color={selectedRow === index ? 'green' : 'white'}
          bold={selectedRow === index}
          underline={selectedRow === index}
        >
          {selectedRow === index ? '✔' : ''}
          &nbsp;{index}. {pod.metadata?.name} |{' '}
          <Text color={selectedRow === index ? 'green' : 'magenta'}>{pod.metadata?.ownerReferences?.[0]?.kind}</Text>
        </Text>
      ))}

      <Box paddingTop={1} paddingRight={1} flexDirection="column">
        <Text color="white">
          <Text underline backgroundColor="blackBright">
            Selected pod:
          </Text>{' '}
          {selectedRow}. {podList?.[selectedRow]?.metadata?.name}
          <Text color="magenta"> | {podList?.[selectedRow]?.metadata?.ownerReferences?.[0]?.kind}</Text>
        </Text>
      </Box>
    </>
  )
}
