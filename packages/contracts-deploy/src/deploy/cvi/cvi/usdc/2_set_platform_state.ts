import { AddressZero } from '@ethersproject/constants'
import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'
import isEqual from 'lodash/isEqual'
import { DeployHelper } from '../../../../helpers'
import { shouldSkipThetaVaultContractsDeploy } from '../../../../skippers'
import {
  VOL,
  TOKEN,
  buyersLockupPeriod,
  lpsLockupPeriod,
  maxAllowedLeverage,
  collateralToBuyingPremiumMapping,
  collateralToExtraFundingFeeMapping,
  fundingFeeConstantRate,
  fundingFeeMinRate,
  fundingFeeMaxRate,
  maxFundingFeeCviThreshold,
  minFundingFeeCviThreshold,
  fundingFeeDivisionFactor,
  fundingFeeCoefficients,
} from '../../../../state/cvi-state'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const helper = DeployHelper.get(hre)

  const { address: oracleAddress } = await helper.get(`${VOL}Oracle`)
  const { address: platformAddress } = await helper.get(`${VOL}${TOKEN}Platform`)

  const currentFeesCalculatorCVIOracleAddress = await helper.read(`${VOL}${TOKEN}FeesCalculator`, 'cviOracle')
  if (currentFeesCalculatorCVIOracleAddress !== oracleAddress) {
    await helper.execute(`${VOL}${TOKEN}FeesCalculator`, 'setOracle', {}, oracleAddress)
  }

  const currentFeesCalculatorStateUpdatorAddress = await helper.read(`${VOL}${TOKEN}FeesCalculator`, 'stateUpdator')
  if (currentFeesCalculatorStateUpdatorAddress !== platformAddress) {
    await helper.execute(`${VOL}${TOKEN}FeesCalculator`, 'setStateUpdator', {}, platformAddress)
  }

  // const currentPositionRewardsPlatformAddress = await helper.read(`${VOL}${TOKEN}PositionRewards`, 'platform')
  // if (currentPositionRewardsPlatformAddress !== platformAddress) {
  //   await helper.execute(`${VOL}${TOKEN}PositionRewards`, 'setPlatform', {}, platformAddress)
  // }

  const currentLPSLockupPeriod = await helper.read(`${VOL}${TOKEN}Platform`, 'lpsLockupPeriod')
  const currentbBuyersLockupPeriod = await helper.read(`${VOL}${TOKEN}Platform`, 'buyersLockupPeriod')
  if (
    currentLPSLockupPeriod.toNumber() !== lpsLockupPeriod ||
    currentbBuyersLockupPeriod.toNumber() !== buyersLockupPeriod
  ) {
    await helper.execute(`${VOL}${TOKEN}Platform`, 'setLockupPeriods', {}, lpsLockupPeriod, buyersLockupPeriod)
  }

  const { address: feesCollectorAddress } = await helper.get(`FeesCollector`)
  const { address: liquidationAddress } = await helper.get(`${VOL}${TOKEN}Liquidation`)
  // const { address: stakingRewardsAddress } = await helper.get(`${VOL}${TOKEN}LPStakingRewards`)
  const currentFeesCollectorAddress = await helper.read(`${VOL}${TOKEN}Platform`, 'feesCollector')
  const currentPlatformOracleAddress = await helper.read(`${VOL}${TOKEN}Platform`, 'cviOracle')
  const currentPlatformLiquidationAddress = await helper.read(`${VOL}${TOKEN}Platform`, 'liquidation')
  // const currentPlatformStakingRewardsAddress = await helper.read(`${VOL}${TOKEN}Platform`, 'stakingContractAddress')
  if (
    currentFeesCollectorAddress !== feesCollectorAddress ||
    currentPlatformOracleAddress !== oracleAddress ||
    currentPlatformLiquidationAddress !== liquidationAddress
    // || currentPlatformStakingRewardsAddress !== stakingRewardsAddress
  ) {
    await helper.execute(
      `${VOL}${TOKEN}Platform`,
      'setSubContracts',
      {},
      feesCollectorAddress,
      oracleAddress,
      AddressZero,
      liquidationAddress,
      AddressZero,
    )
  }

  const { address: feesCalculatorAddress } = await helper.get(`${VOL}${TOKEN}FeesCalculator`)
  const currentFeesCalculatorAddress = await helper.read(`${VOL}${TOKEN}Platform`, 'feesCalculator')
  if (currentFeesCalculatorAddress !== feesCalculatorAddress) {
    await helper.execute(`${VOL}${TOKEN}Platform`, 'setFeesCalculator', {}, feesCalculatorAddress)
  }

  const currentMaxAllowedLeverage = await helper.read(`${VOL}${TOKEN}Platform`, 'maxAllowedLeverage')
  if (currentMaxAllowedLeverage !== maxAllowedLeverage) {
    await helper.execute(`${VOL}${TOKEN}Platform`, 'setMaxAllowedLeverage', {}, maxAllowedLeverage)
  }

  const currentFundingFeeMinRate = await helper.read(`${VOL}${TOKEN}FeesCalculator`, 'fundingFeeMinRate')
  if (currentFundingFeeMinRate !== fundingFeeMinRate) {
    await helper.execute(`${VOL}${TOKEN}FeesCalculator`, 'setFundingFeeMinRate', {}, fundingFeeMinRate)
  }

  const currentFundingFeeConstantRate = await helper.read(`${VOL}${TOKEN}FeesCalculator`, 'fundingFeeConstantRate')
  if (currentFundingFeeConstantRate.toNumber() !== fundingFeeConstantRate) {
    await helper.execute(`${VOL}${TOKEN}FeesCalculator`, 'setFundingFeeConstantRate', {}, fundingFeeConstantRate)
  }

  const currentFundingFeeMaxRate = await helper.read(`${VOL}${TOKEN}FeesCalculator`, 'fundingFeeMaxRate')
  if (currentFundingFeeMaxRate !== fundingFeeMaxRate) {
    await helper.execute(`${VOL}${TOKEN}FeesCalculator`, 'setFundingFeeMaxRate', {}, fundingFeeMaxRate)
  }

  const currentMinFundingFeeCviThreshold = await helper.read(
    `${VOL}${TOKEN}FeesCalculator`,
    'minFundingFeeCviThreshold',
  )
  if (currentMinFundingFeeCviThreshold !== minFundingFeeCviThreshold) {
    await helper.execute(`${VOL}${TOKEN}FeesCalculator`, 'setMinFundingFeeCviThreshold', {}, minFundingFeeCviThreshold)
  }

  const currentMaxFundingFeeCviThreshold = await helper.read(
    `${VOL}${TOKEN}FeesCalculator`,
    'maxFundingFeeCviThreshold',
  )
  if (currentMaxFundingFeeCviThreshold !== maxFundingFeeCviThreshold) {
    await helper.execute(`${VOL}${TOKEN}FeesCalculator`, 'setMaxFundingFeeCviThreshold', {}, maxFundingFeeCviThreshold)
  }

  const currentFundingFeeDivisionFactor = await helper.read(`${VOL}${TOKEN}FeesCalculator`, 'fundingFeeDivisionFactor')
  if (currentFundingFeeDivisionFactor !== fundingFeeDivisionFactor) {
    await helper.execute(`${VOL}${TOKEN}FeesCalculator`, 'setFundingFeeDivisionFactor', {}, fundingFeeDivisionFactor)
  }

  const currentFundingFeeCoefficients = await helper.read(`${VOL}${TOKEN}FeesCalculator`, 'getFundingFeeCoefficients')
  if (!isEqual(currentFundingFeeCoefficients, fundingFeeCoefficients)) {
    await helper.execute(`${VOL}${TOKEN}FeesCalculator`, 'setFundingFeeCoefficients', {}, fundingFeeCoefficients)
  }

  const currentCollateralToBuyingPremiumMapping = await helper.read(
    `${VOL}${TOKEN}FeesCalculator`,
    'getCollateralToBuyingPremiumMapping',
  )
  if (!isEqual(currentCollateralToBuyingPremiumMapping, collateralToBuyingPremiumMapping)) {
    await helper.execute(
      `${VOL}${TOKEN}FeesCalculator`,
      'setCollateralToBuyingPremiumMapping',
      {},
      collateralToBuyingPremiumMapping,
    )
  }

  const currentCollateralToExtraFundingFeeMapping = await helper.read(
    `${VOL}${TOKEN}FeesCalculator`,
    'getCollateralToExtraFundingFeeMapping',
  )
  if (!isEqual(currentCollateralToExtraFundingFeeMapping, collateralToExtraFundingFeeMapping)) {
    await helper.execute(
      `${VOL}${TOKEN}FeesCalculator`,
      'setCollateralToExtraFundingFeeMapping',
      {},
      collateralToExtraFundingFeeMapping,
    )
  }
}

func.tags = ['set-cvi-usdc-platform-state']
func.skip = async (env: HardhatRuntimeEnvironment) => shouldSkipThetaVaultContractsDeploy(env, func.tags)

export default func
