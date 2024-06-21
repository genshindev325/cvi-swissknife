import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'
import { DeployHelper } from '../../../helpers'
import { fromNumber } from '../../../../../lw-sdk/src/util/big-number'
import { shouldSkipNotTest } from '../../../skippers'
import { cviDecimals, cviMaxIndex, cviInitialIndex } from '../../../../test/utils/initial-test-state'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const helper = DeployHelper.get(hre)

  const decimals = cviDecimals
  const maxIndex = cviMaxIndex
  const initialIndex = cviInitialIndex

  const feedOracle = await helper.deploy('CVIFeedOracle', { args: [decimals, fromNumber(initialIndex, decimals)] })

  const feedOracleDeploy = await helper.get('CVIFeedOracle')
  await hre.deployments.save('CVIDeviationOracle', feedOracleDeploy)

  await helper.deploy('CVIOracle', {
    args: [feedOracle.address, feedOracle.address, fromNumber(maxIndex, decimals), 1],
  })
}

func.tags = ['test-cvi-oracle']
func.skip = async (env: HardhatRuntimeEnvironment) => shouldSkipNotTest(env, func.tags)

export default func
