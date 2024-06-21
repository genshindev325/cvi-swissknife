import type { AllDeployFunctionsTags } from '@coti-cvi/auto-generated-code'
import { deployments } from 'hardhat'
import type { DeploymentsExtension } from 'hardhat-deploy/types'

export const runFixture = async (
  tags?: AllDeployFunctionsTags | AllDeployFunctionsTags[],
  options?: { fallbackToGlobal?: boolean; keepExistingDeployments?: boolean },
): ReturnType<DeploymentsExtension['fixture']> => {
  return deployments.fixture(tags, options)
}
