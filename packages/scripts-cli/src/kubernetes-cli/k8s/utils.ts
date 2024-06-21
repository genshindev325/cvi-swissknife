import type * as k8s from '@kubernetes/client-node'
import findUp from 'find-up'
import path from 'node:path'
import type { V1Api } from './types'
import execa from 'execa'
import type { DeepPartial } from 'ts-essentials'

export const helmDirectoryPath = path.join(__dirname, '../../../../helm-chart/charts')
export let repoPath: string
export const loadRepoPath = async () => {
  repoPath = path.dirname((await findUp('yarn.lock', { cwd: __dirname })) ?? '')
}

export const deploy = async ({
  changeCause,
  containerName,
  deploymentApi,
  fullImageName,
  deploymentName,
  k8sNamesapce,
  podKind,
}: {
  changeCause: string
  deploymentName: string
  deploymentApi: V1Api
  containerName: string
  fullImageName: string
  k8sNamesapce: string
  podKind: string
}): Promise<k8s.V1Deployment> => {
  try {
    const { stdout: deploymentFile, stderr } = await execa.command(
      `kubectl get ${podKind === 'statefulset' ? 'statefulset' : 'deployment'} ${deploymentName} -o json`,
      {
        cwd: repoPath,
        shell: true,
      },
    )

    const deployFileJsonParse = JSON.parse(deploymentFile)
    deployFileJsonParse.metadata.annotations['kubernetes.io/change-cause'] = changeCause
    deployFileJsonParse.spec.template.spec.containers[0].image = fullImageName

    if (stderr) {
      throw new Error(stderr)
    }

    const update: DeepPartial<k8s.V1Deployment> = {
      ...deployFileJsonParse,
    }

    const newDeployment = await deploymentApi[
      podKind === 'statefulset' ? 'patchNamespacedStatefulSet' : 'patchNamespacedDeployment'
    ](deploymentName, k8sNamesapce, update, undefined, undefined, undefined, undefined, {
      headers: { 'content-type': 'application/strategic-merge-patch+json' },
    })

    console.log('Deploy file has been successfully edited!')
    return newDeployment.body
  } catch (e) {
    throw new Error(`failed to change deployment image. error: ${JSON.stringify(e.response, null, 2)}`)
  }
}
