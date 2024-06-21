import { AddressZero } from '@ethersproject/constants'
import type { BigNumber } from 'ethers'
import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'
import { DeployHelper } from '../../helpers'
import { shouldSkipDevDeploy } from '../../skippers'
import { MAX_INDEX_ORACLE_VALUE } from '../../state/cvi-state'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const helper = DeployHelper.get(hre)
  const { address: deployer } = await helper.getDeployerSigner()

  const hasPlatform = !!(await helper.getOrNull('CVIUSDCPlatform'))
  let lastRoundData: { roundId: BigNumber; answer: BigNumber; updatedAt: BigNumber } | undefined
  if (hasPlatform) {
    try {
      const latestPlatformRoundId = await helper.read('CVIUSDCPlatform', 'latestOracleRoundId')
      lastRoundData = await helper.read('CVIFeedOracle', 'getRoundData', {}, latestPlatformRoundId)
    } catch (e) {}
  }
  const roundData = await helper.read('CVIFeedOracle', 'latestRoundData')
  const decimals = await helper.read('CVIFeedOracle', 'decimals')

  const feedOracle = await helper.deploy('CVIFakeFeedOracle', { args: [decimals, roundData.answer] })

  await helper.execute(
    'CVIFakeFeedOracle',
    'updateRoundData',
    { from: deployer },
    roundData.roundId,
    roundData.answer,
    roundData.updatedAt,
    roundData.updatedAt,
  )

  if (lastRoundData) {
    await helper.execute(
      'CVIFakeFeedOracle',
      'updateRoundData',
      { from: deployer },
      lastRoundData.roundId,
      lastRoundData.answer,
      lastRoundData.updatedAt,
      lastRoundData.updatedAt,
    )
  }

  const newOracle = await helper.deploy('CVIOracle', {
    args: [feedOracle.address, feedOracle.address, MAX_INDEX_ORACLE_VALUE, 1],
  })

  if (hasPlatform) {
    const { address: feesCollectorAddress } = await helper.get('FeesCollector')
    const { address: liquidationAddress } = await helper.get('CVIUSDCLiquidation')
    const stakingRewardsAddress = (await helper.getOrNull('CVIUSDCLPStakingRewards'))?.address || AddressZero

    const platformOwner = await helper.read('CVIUSDCPlatform', 'owner')
    await helper.execute(
      'CVIUSDCPlatform',
      'setSubContracts',
      { from: platformOwner },
      feesCollectorAddress,
      newOracle.address,
      AddressZero,
      liquidationAddress,
      stakingRewardsAddress,
    )

    const feesCalculatorOwner = await helper.read('CVIUSDCFeesCalculator', 'owner')
    await helper.execute('CVIUSDCFeesCalculator', 'setOracle', { from: feesCalculatorOwner }, newOracle.address)
  }

  if (await helper.getOrNull('CVIUSDCVolatilityToken')) {
    const volatilityTokenOwner = await helper.read('CVIUSDCVolatilityToken', 'owner')
    await helper.execute('CVIUSDCVolatilityToken', 'setCVIOracle', { from: volatilityTokenOwner }, newOracle.address)
  }
}

func.tags = ['fake-cvi-oracle']
func.skip = async (env: HardhatRuntimeEnvironment) => shouldSkipDevDeploy(env, func.tags)

export default func
