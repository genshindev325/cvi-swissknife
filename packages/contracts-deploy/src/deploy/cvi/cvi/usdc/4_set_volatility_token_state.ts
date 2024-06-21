import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'
import { DeployHelper } from '../../../../helpers'
import { shouldSkipThetaVaultContractsDeploy } from '../../../../skippers'
import {
  VOL,
  TOKEN,
  enableWhitelist,
  maxMinRequestIncrements,
  minTimeWindow,
  maxTimeWindow,
  beforeTargetTimeMaxPenaltyFeePercent,
  afterTargetMidTime,
  afterTargetMidTimePenaltyFeePercent,
  afterTargetMaxTime,
  afterTargetMaxTimePenaltyFeePercent,
  deviationPerSingleRebaseLag,
  minDeviationPercentage,
  maxDeviationPercentage,
  verifyTotalRequestsAmount,
  maxTotalRequestsAmount,
  cappedRebase,
  minKeepersMintAmount,
  minKeepersBurnAmount,
  keepersFeePercent,
  keepersFeeMax,
  VOL_TOKEN_NAME,
  VOL_TOKEN_SYMBOL,
} from '../../../../state/cvi-state'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const helper = DeployHelper.get(hre)

  const currentName = await helper.read(`${VOL}${TOKEN}VolatilityToken`, 'name')
  const currentSymbol = await helper.read(`${VOL}${TOKEN}VolatilityToken`, 'symbol')
  if (currentName !== VOL_TOKEN_NAME || currentSymbol !== VOL_TOKEN_SYMBOL) {
    console.log(`Before change - name: ${currentName}, symbol: ${currentSymbol}`)
    await helper.execute(`${VOL}${TOKEN}VolatilityToken`, 'setNameAndSymbol', {}, VOL_TOKEN_NAME, VOL_TOKEN_SYMBOL)

    const newName = await helper.read(`${VOL}${TOKEN}VolatilityToken`, 'name')
    const newSymbol = await helper.read(`${VOL}${TOKEN}VolatilityToken`, 'symbol')
    console.log(`After change - name: ${newName}, symbol: ${newSymbol}`)
  }

  const { address: platformAddress } = await helper.get(`${VOL}${TOKEN}Platform`)
  const currentPlatformAddress = await helper.read(`${VOL}${TOKEN}VolatilityToken`, 'platform')
  if (currentPlatformAddress !== platformAddress) {
    await helper.execute(`${VOL}${TOKEN}VolatilityToken`, 'setPlatform', {}, platformAddress)
  }

  const { address: feesCalculatorAddress } = await helper.get(`${VOL}${TOKEN}FeesCalculator`)
  const currentFeesCalculatorAddress = await helper.read(`${VOL}${TOKEN}VolatilityToken`, 'feesCalculator')
  if (currentFeesCalculatorAddress !== feesCalculatorAddress) {
    await helper.execute(`${VOL}${TOKEN}VolatilityToken`, 'setFeesCalculator', {}, feesCalculatorAddress)
  }

  const { address: feesCollectorAddress } = await helper.get(`FeesCollector`)
  const currentFeesCollectorAddress = await helper.read(`${VOL}${TOKEN}VolatilityToken`, 'feesCollector')
  if (currentFeesCollectorAddress !== feesCollectorAddress) {
    await helper.execute(`${VOL}${TOKEN}VolatilityToken`, 'setFeesCollector', {}, feesCollectorAddress)
  }

  const { address: cviOracleAddress } = await helper.get(`${VOL}Oracle`)
  const currentCVIOracleAddress = await helper.read(`${VOL}${TOKEN}VolatilityToken`, 'cviOracle')
  if (currentCVIOracleAddress !== cviOracleAddress) {
    await helper.execute(`${VOL}${TOKEN}VolatilityToken`, 'setCVIOracle', {}, cviOracleAddress)
  }

  const { address: requestFulfillerAddress } = await helper.get(`${VOL}${TOKEN}VolTokenRequestFulfiller`)
  const currentRequestFulfillerAddress = await helper.read(`${VOL}${TOKEN}VolatilityToken`, 'fulfiller')
  if (currentRequestFulfillerAddress !== requestFulfillerAddress) {
    await helper.execute(`${VOL}${TOKEN}VolatilityToken`, 'setFulfiller', {}, requestFulfillerAddress)
  }

  const { address: keepersFeeVaultAddress } = await helper.get(`KeepersFeeVault`)
  const currentKeepersFeeVaultAddress = await helper.read(`${VOL}${TOKEN}VolatilityToken`, 'keepersFeeVaultAddress')
  if (currentKeepersFeeVaultAddress !== keepersFeeVaultAddress) {
    await helper.execute(`${VOL}${TOKEN}VolatilityToken`, 'setKeepersFeeVaultAddress', {}, keepersFeeVaultAddress)
  }

  const { address: volatilityTokenAddress } = await helper.get(`${VOL}${TOKEN}VolatilityToken`)
  const noLock = await helper.read(`${VOL}${TOKEN}Platform`, 'noLockPositionAddresses', {}, volatilityTokenAddress)
  const noPremium = await helper.read(
    `${VOL}${TOKEN}Platform`,
    'positionHoldersAllowedAddresses',
    {},
    volatilityTokenAddress,
  )
  const increasedSharedPool = await helper.read(
    `${VOL}${TOKEN}Platform`,
    'increaseSharedPoolAllowedAddresses',
    {},
    volatilityTokenAddress,
  )
  const liquidityProvider = await helper.read(
    `${VOL}${TOKEN}Platform`,
    'liquidityProviders',
    {},
    volatilityTokenAddress,
  )
  if (noLock !== true || noPremium !== true || increasedSharedPool !== false || liquidityProvider !== true) {
    await helper.execute(
      `${VOL}${TOKEN}Platform`,
      'setAddressSpecificParameters',
      {},
      volatilityTokenAddress,
      false,
      true,
      false,
      true,
    )
  }

  const currentEnableWhitelist = await helper.read(`${VOL}${TOKEN}VolTokenRequestFulfiller`, 'enableWhitelist')
  if (currentEnableWhitelist !== enableWhitelist) {
    await helper.execute(`${VOL}${TOKEN}VolTokenRequestFulfiller`, 'setEnableWhitelist', {}, enableWhitelist)
  }

  const { address: requestFeesCalculatorAddress } = await helper.get(`${VOL}${TOKEN}RequestFeesCalculator`)
  const currentRequestFeesCalculatorAddress = await helper.read(
    `${VOL}${TOKEN}VolatilityToken`,
    'requestFeesCalculator',
  )
  if (currentRequestFeesCalculatorAddress !== requestFeesCalculatorAddress) {
    await helper.execute(`${VOL}${TOKEN}VolatilityToken`, 'setRequestFeesCalculator', {}, requestFeesCalculatorAddress)
  }

  const currentMaxMinRequestIncrements = await helper.read(`${VOL}${TOKEN}VolatilityToken`, 'maxMinRequestIncrements')
  if (currentMaxMinRequestIncrements.toNumber() !== maxMinRequestIncrements) {
    await helper.execute(`${VOL}${TOKEN}VolatilityToken`, 'setMaxMinRequestIncrements', {}, maxMinRequestIncrements)
  }

  const currentMinTimeWindow = await helper.read(`${VOL}${TOKEN}RequestFeesCalculator`, 'minTimeWindow')
  const currentMaxTimeWindow = await helper.read(`${VOL}${TOKEN}RequestFeesCalculator`, 'maxTimeWindow')
  if (minTimeWindow !== currentMinTimeWindow || maxTimeWindow !== currentMaxTimeWindow) {
    await helper.execute(`${VOL}${TOKEN}RequestFeesCalculator`, 'setTimeWindow', {}, minTimeWindow, maxTimeWindow)
  }

  const currentBeforeTargetTimeMaxPenaltyFeePercent = await helper.read(
    `${VOL}${TOKEN}RequestFeesCalculator`,
    'beforeTargetTimeMaxPenaltyFeePercent',
  )
  const currentAfterTargetMidTime = await helper.read(`${VOL}${TOKEN}RequestFeesCalculator`, 'afterTargetMidTime')
  const currentAfterTargetMidTimePenaltyFeePercent = await helper.read(
    `${VOL}${TOKEN}RequestFeesCalculator`,
    'afterTargetMidTimePenaltyFeePercent',
  )
  const currentAfterTargetMaxTime = await helper.read(`${VOL}${TOKEN}RequestFeesCalculator`, 'afterTargetMaxTime')
  const currentAfterTargetMaxTimePenaltyFeePercent = await helper.read(
    `${VOL}${TOKEN}RequestFeesCalculator`,
    'afterTargetMaxTimePenaltyFeePercent',
  )
  if (
    beforeTargetTimeMaxPenaltyFeePercent !== currentBeforeTargetTimeMaxPenaltyFeePercent ||
    afterTargetMidTime !== currentAfterTargetMidTime ||
    afterTargetMidTimePenaltyFeePercent !== currentAfterTargetMidTimePenaltyFeePercent ||
    afterTargetMaxTime !== currentAfterTargetMaxTime ||
    afterTargetMaxTimePenaltyFeePercent !== currentAfterTargetMaxTimePenaltyFeePercent
  ) {
    await helper.execute(
      `${VOL}${TOKEN}RequestFeesCalculator`,
      'setTimePenaltyFeeParameters',
      {},
      beforeTargetTimeMaxPenaltyFeePercent,
      afterTargetMidTime,
      afterTargetMidTimePenaltyFeePercent,
      afterTargetMaxTime,
      afterTargetMaxTimePenaltyFeePercent,
    )
  }

  const currentDeviationPerSingleRebaseLag = await helper.read(
    `${VOL}${TOKEN}VolatilityToken`,
    'deviationPerSingleRebaseLag',
  )
  const currentMinDeviationPercentage = await helper.read(`${VOL}${TOKEN}VolatilityToken`, 'minDeviationPercentage')
  const currentminDeviationPercentage = await helper.read(`${VOL}${TOKEN}VolatilityToken`, 'maxDeviationPercentage')
  if (
    currentDeviationPerSingleRebaseLag !== deviationPerSingleRebaseLag ||
    currentMinDeviationPercentage !== minDeviationPercentage ||
    currentminDeviationPercentage !== maxDeviationPercentage
  ) {
    await helper.execute(
      `${VOL}${TOKEN}VolatilityToken`,
      'setDeviationParameters',
      {},
      deviationPerSingleRebaseLag,
      minDeviationPercentage,
      maxDeviationPercentage,
    )
  }

  const currentVerifyTotalRequestsAmount = await helper.read(
    `${VOL}${TOKEN}VolatilityToken`,
    'verifyTotalRequestsAmount',
  )
  if (currentVerifyTotalRequestsAmount !== verifyTotalRequestsAmount) {
    await helper.execute(`${VOL}${TOKEN}VolatilityToken`, 'setVerifyTotalRequestsAmount', {}, verifyTotalRequestsAmount)
  }

  const currentMaxTotalRequestsAmount = await helper.read(`${VOL}${TOKEN}VolatilityToken`, 'maxTotalRequestsAmount')
  if (!currentMaxTotalRequestsAmount.eq(maxTotalRequestsAmount)) {
    await helper.execute(`${VOL}${TOKEN}VolatilityToken`, 'setMaxTotalRequestsAmount', {}, maxTotalRequestsAmount)
  }

  const currentCappedRebase = await helper.read(`${VOL}${TOKEN}VolatilityToken`, 'cappedRebase')
  if (currentCappedRebase !== cappedRebase) {
    await helper.execute(`${VOL}${TOKEN}VolatilityToken`, 'setCappedRebase', {}, cappedRebase)
  }

  const currentMinKeepersMintAmount = await helper.read(`${VOL}${TOKEN}VolatilityToken`, 'minKeepersMintAmount')
  const currentMinKeepersBurnAmount = await helper.read(`${VOL}${TOKEN}VolatilityToken`, 'minKeepersBurnAmount')
  if (!currentMinKeepersMintAmount.eq(minKeepersMintAmount) || !currentMinKeepersBurnAmount.eq(minKeepersBurnAmount)) {
    await helper.execute(
      `${VOL}${TOKEN}VolatilityToken`,
      'setMinKeepersAmounts',
      {},
      minKeepersMintAmount,
      minKeepersBurnAmount,
    )
  }

  const currentKeepersFeePercent = await helper.read(`${VOL}${TOKEN}RequestFeesCalculator`, 'keepersFeePercent')
  if (currentKeepersFeePercent !== keepersFeePercent) {
    await helper.execute(`${VOL}${TOKEN}RequestFeesCalculator`, 'setKeepersFeePercent', {}, keepersFeePercent)
  }

  const currentKeepersFeeMax = await helper.read(`${VOL}${TOKEN}RequestFeesCalculator`, 'keepersFeeMax')
  if (!currentKeepersFeeMax.eq(keepersFeeMax)) {
    await helper.execute(`${VOL}${TOKEN}RequestFeesCalculator`, 'setKeepersFeeMax', {}, keepersFeeMax)
  }
}

func.tags = ['set-cvi-usdc-volatility-token-state']
func.skip = async (env: HardhatRuntimeEnvironment) => shouldSkipThetaVaultContractsDeploy(env, func.tags)

export default func
