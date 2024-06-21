import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import isEqual from 'lodash/isEqual'
import type { DeployFunction } from 'hardhat-deploy/types'
import type { TokenPairRepository } from '@coti-cvi/auto-generated-code/contracts'
import type { PairData, ValidTokenInPairs } from '@coti-cvi/lw-sdk/src/contracts-deploy-utils/types'
import type { TokenName } from '@coti-cvi/lw-sdk/src/types'
import { UntypedToken } from '../../../../lw-sdk/src/token/token'
import {
  maxProtectionsInUpkeep,
  minAmountToBePaid,
  ilProtectionFee,
  treasuryAllowance,
  minTreasuryAllowance,
  policyPeriods,
  pairs,
  premiumGrowthStart,
  premiumSlope,
  buyILProtectionEnabled,
  protectionMetadataCID,
  isDiscountEnabled,
} from '../../state/il-state'
import { DeployHelper } from '../../helpers'
import { shouldSkipILContractsDeploy } from '../../skippers'
import { getAddressOfUSDPriceAggregator } from '../../config'
import { HARDHAT_TEST_CHAIN_ID } from '@coti-cvi/lw-sdk/src/contracts-deploy-utils/constants'

async function toUpdatePair(
  token1PriceAggregator: string,
  token2PriceAggregator: string,
  token1: TokenName,
  token2: TokenName,
  pairRepo: TokenPairRepository,
) {
  try {
    const pair = await pairRepo.getPair(token1, token2)
    return (
      !pair.exists ||
      pair.token1PriceAggregator.toLowerCase() !== token1PriceAggregator.toLowerCase() ||
      pair.token2PriceAggregator.toLowerCase() !== token2PriceAggregator.toLowerCase()
    )
  } catch (e) {
    return true
  }
}

async function toUpdatePairPremium(
  policyPeriods: number[],
  premiumParams: { A: string; X0: string; C: string }[],
  token1: TokenName,
  token2: TokenName,
  pairRepo: TokenPairRepository,
) {
  const paramsRes = await Promise.allSettled(
    policyPeriods.map(period => pairRepo.getPremiumParams(token1, token2, period)),
  )
  const params: ({ A: string; X0: string; C: string } | undefined)[] = paramsRes.map(res =>
    res.status === 'fulfilled'
      ? { A: res.value.A.toString(), X0: res.value.X0.toString(), C: res.value.C.toString() }
      : undefined,
  )
  return !isEqual(premiumParams, params)
}

async function toUpdateCollateralCapComponent(
  token1: TokenName,
  token2: TokenName,
  collateralCapComponent: number,
  pairRepo: TokenPairRepository,
) {
  try {
    const currentCollateralCapComponent = await pairRepo.tokensPairsCollateralCapComponents(token1, token2)
    return currentCollateralCapComponent !== collateralCapComponent
  } catch (e) {
    return true
  }
}

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const helper = DeployHelper.get(hre)
  const { liquidityProvider, treasury } = await helper.getNamedAccounts()

  const { address: usdcAddress } = await helper.get('USDC')
  const usdc = await UntypedToken.fromAddress(usdcAddress, hre.ethers.provider)

  const liquidityProviderRole = await helper.read('LiquidityController', 'LIQUIDITY_PROVIDER_ROLE')
  if (!(await helper.read('ILProtectionController', 'hasRole', {}, liquidityProviderRole, liquidityProvider))) {
    await helper.execute('ILProtectionController', 'grantRole', {}, liquidityProviderRole, liquidityProvider)
  }

  const { address: treasuryControllerAddress } = await helper.get('TreasuryController')
  const currentTreasuryControllerAddress = await helper.read('LiquidityController', 'treasuryController')
  if (currentTreasuryControllerAddress !== treasuryControllerAddress) {
    await helper.execute('LiquidityController', 'setTreasuryController', {}, treasuryControllerAddress)
  }

  const { address: liquidityControllerAddress } = await helper.get('LiquidityController')
  const currentTreasuryAllowance = await usdc.contract.allowance(liquidityControllerAddress, treasuryControllerAddress)
  if (currentTreasuryAllowance < minTreasuryAllowance) {
    await helper.execute('LiquidityController', 'approveTreasury', {}, treasuryAllowance)
  }

  if ((await helper.read('TreasuryController', 'treasury')) !== treasury) {
    await helper.execute('TreasuryController', 'setTreasury', {}, treasury)
  }

  const currentMaxProtectionsInUpkeep = await helper.read('ILProtectionController', 'maxProtectionsInUpkeep')
  if (currentMaxProtectionsInUpkeep.toNumber() !== maxProtectionsInUpkeep) {
    await helper.execute('ILProtectionController', 'setMaxProtectionsInUpkeep', {}, maxProtectionsInUpkeep)
  }

  const protectionDiscountNFTControllerAddress = (await helper.get('ILProtectionDiscountNFTController')).address
  const currentProtectionDiscountNFTControllerAddress = await helper.read(
    'ILProtectionController',
    'protectionDiscountNFTController',
  )

  if (protectionDiscountNFTControllerAddress !== currentProtectionDiscountNFTControllerAddress) {
    await helper.execute(
      'ILProtectionController',
      'setILProtectionDiscountNFTController',
      {},
      protectionDiscountNFTControllerAddress,
    )
  }

  const currentBuyILProtectionEnabled = await helper.read('ILProtectionConfig', 'buyILProtectionEnabled')
  if (currentBuyILProtectionEnabled !== buyILProtectionEnabled) {
    await helper.execute('ILProtectionConfig', 'setBuyILProtectionEnabled', {}, buyILProtectionEnabled)
  }

  const currentPremiumGrowthStart = await helper.read('ILProtectionConfig', 'premiumGrowthStart')
  if (!currentPremiumGrowthStart.eq(premiumGrowthStart)) {
    await helper.execute('ILProtectionConfig', 'setPremiumGrowthStart', {}, premiumGrowthStart)
  }

  const currentPremiumSlope = await helper.read('ILProtectionConfig', 'premiumSlope')
  if (!currentPremiumSlope.eq(premiumSlope)) {
    await helper.execute('ILProtectionConfig', 'setPremiumSlope', {}, premiumSlope)
  }

  const currentMinAmountToBePaid = await helper.read('ILProtectionConfig', 'minAmountToBePaid')
  if (currentMinAmountToBePaid.toNumber() !== minAmountToBePaid) {
    await helper.execute('ILProtectionConfig', 'setMinAmountToBePaid', {}, minAmountToBePaid)
  }

  const currentFeeComponent = await helper.read('ILProtectionConfig', 'feeComponent')
  if (currentFeeComponent !== ilProtectionFee) {
    await helper.execute('ILProtectionConfig', 'setFeeComponent', {}, ilProtectionFee)
  }

  const currentPolicyPeriodsBN = await helper.read('ILProtectionConfig', 'getPolicyPeriodsInSeconds')
  const currentPolicyPeriods = currentPolicyPeriodsBN.map<number>(p => p.toNumber())
  if (!isEqual(policyPeriods, currentPolicyPeriods)) {
    await helper.execute('ILProtectionConfig', 'setPolicyPeriodsInSeconds', {}, policyPeriods)
  }

  const currentProtectionMetadataCID = await helper.read('ILProtectionNFT', 'protectionMetadataCID')
  if (currentProtectionMetadataCID !== protectionMetadataCID) {
    await helper.execute('ILProtectionNFT', 'setProtectionMetadataCID', {}, protectionMetadataCID)
  }

  const currentEnabled = await helper.read('ILProtectionDiscountNFTController', 'enabled')
  if (currentEnabled !== isDiscountEnabled) {
    await helper.execute('ILProtectionDiscountNFTController', 'setEnabled', {}, isDiscountEnabled)
  }

  const pairRepo = await helper.attach('TokenPairRepository')

  const getAggregatorAddress = async (token: ValidTokenInPairs): Promise<string> => {
    if (token === 'WETH') {
      return (await helper.get('ETHUSDOracle')).address
    }

    if (helper.chainId === HARDHAT_TEST_CHAIN_ID) {
      if (token === 'LINK') {
        return (await helper.get('LINKUSDOracle')).address
      } else {
        return (await helper.get('USDUSDOracle')).address
      }
    }

    return getAddressOfUSDPriceAggregator(helper.blockchainName, token)
  }

  const updatePair = async (pair: PairData) => {
    const token0AggregatorAddress = await getAggregatorAddress(pair.token0)
    const token1AggregatorAddress = await getAggregatorAddress(pair.token1)
    const premiumParams = Object.values(pair.policyPeriodParams)
    if (await toUpdatePair(token0AggregatorAddress, token1AggregatorAddress, pair.token0, pair.token1, pairRepo)) {
      await helper.execute(
        'TokenPairRepository',
        'setPair',
        {},
        pair.token0,
        pair.token1,
        token0AggregatorAddress,
        token1AggregatorAddress,
      )
    }

    if (await toUpdatePairPremium(policyPeriods, premiumParams, pair.token0, pair.token1, pairRepo)) {
      await helper.execute(
        'TokenPairRepository',
        'setPremiumsParams',
        {},
        pair.token0,
        pair.token1,
        policyPeriods,
        premiumParams,
      )
    }

    if (await toUpdateCollateralCapComponent(pair.token0, pair.token1, pair.collateralCapComponent, pairRepo)) {
      await helper.execute(
        'TokenPairRepository',
        'setCollateralCapComponent',
        {},
        pair.token0,
        pair.token1,
        pair.collateralCapComponent,
      )
    }
  }

  for (const pair of pairs[helper.blockchainName]) {
    await updatePair(pair)
  }
}

func.tags = ['il-contracts-set-state']
func.dependencies = ['test-price-oracles', 'fake-price-oracle']
func.skip = shouldSkipILContractsDeploy

export default func
