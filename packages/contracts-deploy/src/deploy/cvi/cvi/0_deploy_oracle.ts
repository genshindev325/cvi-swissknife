import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'
import { DeployHelper } from '../../../helpers'
import { shouldSkipDeploy } from '../../../skippers'
import { BlockchainName } from '../../../../../lw-sdk/src'
import { VOL, MAX_INDEX_ORACLE_VALUE } from '../../../state/cvi-state'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const helper = DeployHelper.get(hre)
  const { deployer, owner } = await helper.getNamedAccounts()

  const { address: feedOracleAddress } = await helper.get(`${VOL}FeedOracle`)
  const { address: deviationOracleAddress } = await helper.get(`${VOL}DeviationOracle`)

  const deployed = await helper.getOrNull(`${VOL}Oracle`)
  if (!deployed) {
    await helper.deploy(`${VOL}Oracle`, {
      args: [feedOracleAddress, deviationOracleAddress, MAX_INDEX_ORACLE_VALUE, 1],
    })

    const currentOwner = await helper.read(`${VOL}Oracle`, 'owner')
    if (currentOwner !== owner) {
      await helper.execute(`${VOL}Oracle`, 'transferOwnership', { from: deployer }, owner)
    }
  }
}

func.tags = ['deploy-cvi-oracle']
func.dependencies = ['test-cvi-oracle']
func.skip = async (env: HardhatRuntimeEnvironment) =>
  shouldSkipDeploy(env, func.tags, true, [], BlockchainName.ARBITRUM)

export default func
