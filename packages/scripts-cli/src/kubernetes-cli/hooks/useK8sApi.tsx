import { useState, useEffect } from 'react'
import * as k8s from '@kubernetes/client-node'

export const useK8sApi = () => {
  const [k8sCoreApi, setK8sCoreApi] = useState<k8s.CoreV1Api>()
  const [k8sAppsV1Api, setK8sAppsV1Api] = useState<k8s.AppsV1Api>()

  useEffect(() => {
    const _kc = new k8s.KubeConfig()
    _kc.loadFromDefault()

    setK8sCoreApi(_kc.makeApiClient(k8s.CoreV1Api))
    setK8sAppsV1Api(_kc.makeApiClient(k8s.AppsV1Api))
  }, [])

  return { k8sCoreApi, k8sAppsV1Api }
}
