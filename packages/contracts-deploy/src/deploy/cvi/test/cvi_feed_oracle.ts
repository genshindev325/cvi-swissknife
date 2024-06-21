import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'
import { DeployHelper } from '../../../helpers'
import { fromNumber } from '../../../../../lw-sdk/src/util/big-number'
import { shouldSkipNotTest } from '../../../skippers'
import { cviDecimals, cviInitialIndex } from '../../../../test/utils/initial-test-state'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const helper = DeployHelper.get(hre)

  const decimals = cviDecimals
  const initialIndex = cviInitialIndex

  await helper.deploy('CVIFeedOracle', { args: [decimals, fromNumber(initialIndex, decimals)] })

  const feedOracleDeploy = await helper.get('CVIFeedOracle')
  await hre.deployments.save('CVIDeviationOracle', feedOracleDeploy)
}

func.tags = ['test-cvi-feed-oracle']
func.skip = async (env: HardhatRuntimeEnvironment) => shouldSkipNotTest(env, func.tags)

export default func
