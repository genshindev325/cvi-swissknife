import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'
import { DeployHelper } from '../../../../helpers'
import { shouldSkipThetaVaultContractsDeploy } from '../../../../skippers'
import {
  TOKEN,
  VOL,
  maxCapacity,
  enableWhitelist,
  minDepositAmount,
  minWithdrawAmount,
  minPoolSkewPercentage,
  extraLiqidityPercentage,
  requestDelay,
  lockupPeriod,
  liquidationPeriod,
  minDexPercentageAllowed,
  depositHoldingsPercentage,
} from '../../../../state/cvi-state'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { execute, get, read } = DeployHelper.get(hre)

  const currentMinDepositAmount = await read(`${VOL}${TOKEN}ThetaVault`, 'minDepositAmount')
  const currentMinWithdrawAmount = await read(`${VOL}${TOKEN}ThetaVault`, 'minWithdrawAmount')
  if (!currentMinDepositAmount.eq(minDepositAmount) || !currentMinWithdrawAmount.eq(minWithdrawAmount)) {
    await execute(`${VOL}${TOKEN}ThetaVault`, 'setMinAmounts', {}, minDepositAmount, minWithdrawAmount)
  }

  const currentMinPoolSkewPercentage = await read(`${VOL}${TOKEN}ThetaVault`, 'minPoolSkewPercentage')
  if (currentMinPoolSkewPercentage !== minPoolSkewPercentage) {
    await execute(`${VOL}${TOKEN}ThetaVault`, 'setMinPoolSkew', {}, minPoolSkewPercentage)
  }

  const currentExtraLiqidityPercentage = await read(`${VOL}${TOKEN}ThetaVault`, 'extraLiqidityPercentage')
  const currentMinDexPercentageAllowed = await read(`${VOL}${TOKEN}ThetaVault`, 'minDexPercentageAllowed')
  if (
    currentExtraLiqidityPercentage !== extraLiqidityPercentage ||
    currentMinDexPercentageAllowed !== minDexPercentageAllowed
  ) {
    await execute(
      `${VOL}${TOKEN}ThetaVault`,
      'setLiquidityPercentages',
      {},
      extraLiqidityPercentage,
      minDexPercentageAllowed,
    )
  }

  const currentRequestDelay = await read(`${VOL}${TOKEN}ThetaVault`, 'requestDelay')
  if (currentRequestDelay.toNumber() !== requestDelay) {
    await execute(`${VOL}${TOKEN}ThetaVault`, 'setRequestDelay', {}, requestDelay)
  }

  const currentLockupPeriod = await read(`${VOL}${TOKEN}ThetaVault`, 'lockupPeriod')
  const currentLiquidationPeriod = await read(`${VOL}${TOKEN}ThetaVault`, 'liquidationPeriod')
  if (currentLockupPeriod.toNumber() !== lockupPeriod || currentLiquidationPeriod.toNumber() !== liquidationPeriod) {
    await execute(`${VOL}${TOKEN}ThetaVault`, 'setPeriods', {}, lockupPeriod, liquidationPeriod)
  }

  const currentDepositHoldingsPercentage = await read(`${VOL}${TOKEN}ThetaVault`, 'depositHoldingsPercentage')
  if (currentDepositHoldingsPercentage !== depositHoldingsPercentage) {
    await execute(`${VOL}${TOKEN}ThetaVault`, 'setDepositHoldings', {}, depositHoldingsPercentage)
  }

  const { address: thetaVaultAddress } = await get(`${VOL}${TOKEN}ThetaVault`)
  const currentMinter = await read(`${VOL}${TOKEN}VolatilityToken`, 'minter')
  if (currentMinter !== thetaVaultAddress) {
    await execute(`${VOL}${TOKEN}VolatilityToken`, 'setMinter', {}, thetaVaultAddress)
  }

  const currentFeesCalculatorThetaVaultAddress = await read(`${VOL}${TOKEN}FeesCalculator`, 'thetaVault')
  if (currentFeesCalculatorThetaVaultAddress !== thetaVaultAddress) {
    await execute(`${VOL}${TOKEN}FeesCalculator`, 'setThetaVault', {}, thetaVaultAddress)
  }

  const { address: requestFulfillerAddress } = await get(`${VOL}${TOKEN}ThetaVaultRequestFulfiller`)
  const currentFulfiller = await read(`${VOL}${TOKEN}ThetaVault`, 'fulfiller')
  if (currentFulfiller !== requestFulfillerAddress) {
    await execute(`${VOL}${TOKEN}ThetaVault`, 'setFulfiller', {}, requestFulfillerAddress)
  }

  const currentEnableWhitelist = await read(`${VOL}${TOKEN}ThetaVaultRequestFulfiller`, 'enableWhitelist')
  if (currentEnableWhitelist !== enableWhitelist) {
    await execute(`${VOL}${TOKEN}ThetaVaultRequestFulfiller`, 'setEnableWhitelist', {}, enableWhitelist)
  }

  const currentMaxCapacity = await read(`${VOL}${TOKEN}ThetaVault`, 'depositCap')
  if (!currentMaxCapacity.eq(maxCapacity)) {
    await execute(`${VOL}${TOKEN}ThetaVault`, 'setDepositCap', {}, maxCapacity)
  }

  const noLock = await read(`${VOL}${TOKEN}Platform`, 'noLockPositionAddresses', {}, thetaVaultAddress)
  const noPremium = await read(`${VOL}${TOKEN}Platform`, 'positionHoldersAllowedAddresses', {}, thetaVaultAddress)
  const increasedSharedPool = await read(
    `${VOL}${TOKEN}Platform`,
    'increaseSharedPoolAllowedAddresses',
    {},
    thetaVaultAddress,
  )
  const liquidityProvider = await read(`${VOL}${TOKEN}Platform`, 'liquidityProviders', {}, thetaVaultAddress)
  if (noLock !== false || noPremium !== false || increasedSharedPool !== false || liquidityProvider !== true) {
    await execute(
      `${VOL}${TOKEN}Platform`,
      'setAddressSpecificParameters',
      {},
      thetaVaultAddress,
      true,
      false,
      false,
      true,
    )
  }

  const currentConvertUSDC = await read(`FeesCollector`, 'convertUSDC')
  if (currentConvertUSDC !== true) {
    await execute(`FeesCollector`, 'setConvertUSDC', {}, true)
  }
}

func.tags = ['set-cvi-usdc-theta-vault-state']
func.skip = async (env: HardhatRuntimeEnvironment) => shouldSkipThetaVaultContractsDeploy(env, func.tags)

export default func
