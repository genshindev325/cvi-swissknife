import type {
  ProtectionNFTDetailsStruct,
  ProtectionNFTDetailsStructOutput,
} from 'auto-generated-code/src/git-contract-types/packages/contracts-deploy/artifacts/@coti-cvi/contracts-il/contracts/interfaces/ILProtectionNFTInterface'
import type {
  PremiumParamsStruct,
  TokenPairStructOutput,
} from 'auto-generated-code/src/git-contract-types/packages/contracts-deploy/artifacts/@coti-cvi/contracts-il/contracts/interfaces/ITokenPairRepository'
import type { PremiumParamsStructOutput } from 'auto-generated-code/src/git-contract-types/packages/contracts-deploy/artifacts/@coti-cvi/contracts-il/contracts/interfaces/ILProtectionControllerInterface'
import type { Result } from 'ethers/lib/utils'
import { expect } from '.'
import type {
  TransferEvent,
  TransferEventObject,
} from 'auto-generated-code/src/git-contract-types/packages/contracts-deploy/artifacts/@coti-cvi/contracts-il/contracts/test/USDC'

export function assertPair(
  pair: TokenPairStructOutput,
  symbol1: string,
  symbol2: string,
  priceOracle1Address: string,
  priceOracle2Address: string,
  pairExists: boolean,
) {
  expect(pair.token1Symbol).is.equal(symbol1)
  expect(pair.token2Symbol).is.equal(symbol2)
  expect(pair.token1PriceAggregator).is.equal(priceOracle1Address)
  expect(pair.token2PriceAggregator).is.equal(priceOracle2Address)
  expect(pair.exists).is.equal(pairExists)
}

export function assertPremiumParams(
  premiumParams: PremiumParamsStructOutput,
  expectedPremiumParams: PremiumParamsStruct,
) {
  expect(premiumParams.A).is.equal(expectedPremiumParams.A)
  expect(premiumParams.X0).is.equal(expectedPremiumParams.X0)
  expect(premiumParams.C).is.equal(expectedPremiumParams.C)
}

export function assertProtectionDetails(
  protectionDetails: ProtectionNFTDetailsStructOutput,
  expectedProtection: ProtectionNFTDetailsStruct | Result,
  assertDiscountData = true,
) {
  expect(protectionDetails.id).is.equal(expectedProtection.id)
  expect(protectionDetails.owner).is.equal(expectedProtection.owner)
  expect(protectionDetails.protectionStartTimestamp).is.equal(expectedProtection.protectionStartTimestamp)
  expect(protectionDetails.protectionEndTimestamp).is.equal(expectedProtection.protectionEndTimestamp)
  expect(protectionDetails.premiumCostUSD).is.equal(expectedProtection.premiumCostUSD)

  if (assertDiscountData) {
    expect(protectionDetails.premiumCostDiscountUSD).is.equal(expectedProtection.premiumCostDiscountUSD)
    expect(protectionDetails.discountNFTType).is.equal(expectedProtection.discountNFTType)
  }

  expect(protectionDetails.lpTokensWorthAtBuyTimeUSD).is.equal(expectedProtection.lpTokensWorthAtBuyTimeUSD)
  expect(protectionDetails.token1Symbol).is.equal(expectedProtection.token1Symbol)
  expect(protectionDetails.token2Symbol).is.equal(expectedProtection.token2Symbol)
  expect(protectionDetails.policyPeriod).is.equal(expectedProtection.policyPeriod)
}

export function assertTransferEvents(transferEvents: TransferEvent[], expectedTransferEvents: TransferEventObject[]) {
  for (let i = 0; i < transferEvents.length; i++) {
    expect(transferEvents[i].args.from).is.equal(expectedTransferEvents[i].from)
    expect(transferEvents[i].args.to).is.equal(expectedTransferEvents[i].to)
    expect(transferEvents[i].args.value).is.equal(expectedTransferEvents[i].value)
  }
}
