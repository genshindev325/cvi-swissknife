import React, { useContext, useEffect, useState } from 'react'
import { Box, Text, useInput } from 'ink'
import { useRouter } from '../router/useRouter'
import { useK8sApi } from '../hooks/useK8sApi'
import type { V1Pod } from '../k8s/types'
import { deploy } from '../k8s/utils'
import { gitContext } from 'scripts-cli/src/context/GitProvider'
import { sliceGeneratedIdFromPodName } from '@coti-cvi/common-be'
import execa from 'execa'

export const Pod = () => {
  const gitInfo = useContext(gitContext)
  const router = useRouter()
  const podName = router.currentPage.value
  const [pod, setPod] = useState<V1Pod>()
  const { k8sCoreApi, k8sAppsV1Api } = useK8sApi()
  const [lastPromise, setLastPromise] = useState<ReturnType<typeof deploy>>()
  const [selectedRow, setSelectedRow] = useState<number>(0)
  const options = ['1. Set kubernetes image yaml file to point to the latest succeeded deployment.', '2. Restart pod.']
  const podKind = pod?.metadata?.ownerReferences?.[0]?.kind
  const [message, setMessage] = useState<string>('')

  const _deploy = async () => {
    try {
      if (pod && podKind && k8sAppsV1Api && gitInfo?.commitSha && !lastPromise) {
        const deploymentName = pod.spec?.containers?.[0]?.name ?? ''
        const containerImage = pod.spec?.containers?.[0]?.image ?? ''
        const fullImagePath = `coticvi/swissknife-backend:${gitInfo.commitSha}`

        if (fullImagePath && deploymentName && containerImage) {
          const lastPromise = deploy({
            changeCause: `Update production pod id to latest version ${gitInfo.latestTag}`,
            deploymentName: deploymentName,
            containerName: podName ?? '',
            fullImageName: fullImagePath,
            k8sNamesapce: pod.metadata?.namespace ?? '',
            deploymentApi: k8sAppsV1Api,
            podKind: podKind.toLowerCase(),
          })
          setLastPromise(lastPromise)
          await lastPromise

          setMessage(`
            deploy params
            changeCause: Update production pod id to latest version ${gitInfo.latestTag}
            deploymentName: ${deploymentName}
            containerName: ${podName ?? ''}
            fullImageName: ${fullImagePath}
            k8sNamesapce: ${pod.metadata?.namespace}
          `)
        } else {
          throw new Error('failed to deploy')
        }
      } else {
        throw new Error('failed to deploy, pod | k8sAppsV1Api | gitInfo.commitSha not exist.')
      }
    } catch (e) {
      console.log(e)
    } finally {
      setLastPromise(undefined)
    }
  }

  const restartPod = async () => {
    try {
      if (pod && podName) {
        const { runtimeName, isDeployment } = sliceGeneratedIdFromPodName(podName)
        await execa.command(`kubectl rollout restart ${isDeployment ? 'deployment' : 'statefulset'} ${runtimeName}`)
        setMessage('Pod has been restarted successfully!')
      }
    } catch (error) {
      console.log(error)
    }
  }

  useInput((input, key) => {
    if (key.downArrow) {
      setSelectedRow(prev => {
        if (prev === options.length - 1) {
          return 0
        }
        return Math.min((options?.length ?? 0) - 1, prev + 1)
      })
    }

    if (key.upArrow) {
      setSelectedRow(prev => {
        if (prev === 0) {
          return options?.length - 1 ?? 0
        }
        return Math.max(0, prev - 1)
      })
    }

    if (key.return) {
      if (selectedRow === 0) {
        // set kubernetes image yaml file...
        _deploy()
      } else {
        // restart pod
        restartPod()
      }
    }
  })

  useEffect(() => {
    if (k8sCoreApi) {
      const getPod = async () => {
        const r = await k8sCoreApi.listNamespacedPod('default')
        const podList = r.body.items

        const findPod = podList.find(p => p.metadata?.name === podName)
        if (findPod) {
          setPod(findPod)
        }
      }

      getPod()
    }
  }, [k8sCoreApi, podName])

  useEffect(() => {
    if (message !== '') {
      setMessage('')
    }
    // eslint-disable-next-line
  }, [selectedRow])

  return (
    <Box paddingBottom={1} paddingTop={1} flexDirection="column">
      {podKind === undefined || pod === undefined ? (
        <Text color="magenta">Loading...</Text>
      ) : (
        <>
          <Text bold>
            Loaded pod name: {podName} <Text color="magenta">| {podKind}</Text>
          </Text>
          {['test', 'staging'].some(o => podName?.includes(o)) ? null : (
            <Text bold color="red">
              We found that you may trying to update a production pod.
            </Text>
          )}
          <Text bold backgroundColor="yellow">
            BE CAREFUL! in this page you're able to change the production environment!
          </Text>

          <Box paddingTop={1} flexDirection="column">
            {options.map((option, index) => (
              <Text key={option} color={selectedRow === index ? 'green' : 'white'} bold underline>
                {option}
              </Text>
            ))}
          </Box>

          {message ? (
            <Box paddingTop={1}>
              <Text>{message}</Text>
            </Box>
          ) : null}
        </>
      )}
    </Box>
  )
}
