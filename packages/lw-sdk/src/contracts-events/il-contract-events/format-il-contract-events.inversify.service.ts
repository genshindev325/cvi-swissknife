import { inject, injectable } from 'inversify'
import type {
  ProtectionBoughtEvent,
  ProtectionClosedEvent,
} from '../../../../auto-generated-code/src/git-contract-types/packages/contracts-deploy/artifacts/@coti-cvi/contracts-il/contracts/ILProtectionController'
import type { BlockchainEventBase } from '../types'
import type { Token } from '../../token'
import { ArmadilloSupportedTokenName } from '../../types'
import type { TokenName, IERC20 } from '../../types'
import { toNumber } from '../../util'
import type { Event } from 'ethers'
import type {
  LiquidityAddedEvent,
  LiquidityWithdrawnEvent,
} from '../../../../auto-generated-code/src/git-contract-types/packages/contracts-deploy/artifacts/@coti-cvi/contracts-il/contracts/LiquidityController'
import type {
  FormattedProtectionBoughtEvent,
  FormattedProtectionClosedEvent,
  FormattedLiquidityAddedEvent,
  FormattedLiquidityWithdrawnEvent,
  FormattedProtectionMintDiscountDetailsEvent,
} from '../il-types'
import type { ProtectionMintDiscountDetailsEvent } from '@coti-cvi/auto-generated-code/src/git-contract-types/packages/contracts-deploy/artifacts/@coti-cvi/contracts-il/contracts/ILProtectionNFT'

@injectable()
export class FormatILContractsEventsInversifyService {
  constructor(@inject('TokenUSDC') private readonly tokenUSDC: Token<IERC20, TokenName.USDC>) {}

  public formatBaseProtectionBoughtEvent(e: Event): BlockchainEventBase {
    return {
      blockNumber: e.blockNumber,
      logIndex: e.logIndex,
      transactionHash: e.transactionHash,
      transactionIndex: e.transactionIndex,
    }
  }

  public toFormattedProtectionBoughtEvent(e: ProtectionBoughtEvent): FormattedProtectionBoughtEvent {
    const token1 = Object.values(ArmadilloSupportedTokenName).find(t => t === e.args.token1Symbol)
    const token2 = Object.values(ArmadilloSupportedTokenName).find(t => t === e.args.token2Symbol)

    if (!token1 || !token2) {
      throw new Error(`Unknown token(s): ${e.args.token1Symbol}-${e.args.token2Symbol}`)
    }

    return {
      ...this.formatBaseProtectionBoughtEvent(e),
      type: 'ProtectionBoughtEvent',
      args: {
        collateral: this.tokenUSDC.toNumber(e.args.collateral),
        id: e.args.id.toString(),
        owner: e.args.owner,
        policyPeriodDays:
          (e.args.protectionEndTimestamp.toNumber() - e.args.protectionStartTimestamp.toNumber()) / 86400,
        policyPeriodSeconds: e.args.protectionEndTimestamp.toNumber() - e.args.protectionStartTimestamp.toNumber(),
        protectionStartTimestamp: e.args.protectionStartTimestamp.toNumber(),
        protectionStartTimestampUtc: new Date(e.args.protectionStartTimestamp.toNumber() * 1000).toISOString(),
        protectionEndTimestamp: e.args.protectionEndTimestamp.toNumber(),
        protectionEndTimestampUtc: new Date(e.args.protectionEndTimestamp.toNumber() * 1000).toISOString(),
        tokenName1: {
          ArmadilloSupportedTokenName: token1,
        },
        tokenName2: {
          ArmadilloSupportedTokenName: token2,
        },
        token1EntryPriceUSD: toNumber(e.args.token1EntryPriceUSD, 8),
        token2EntryPriceUSD: toNumber(e.args.token2EntryPriceUSD, 8),
        premiumCostUSD: this.tokenUSDC.toNumber(e.args.premiumCostUSD),
      },
    }
  }

  public toFormattedProtectionClosedEvent(e: ProtectionClosedEvent): FormattedProtectionClosedEvent {
    const token1 = Object.values(ArmadilloSupportedTokenName).find(t => t === e.args.token1Symbol)
    const token2 = Object.values(ArmadilloSupportedTokenName).find(t => t === e.args.token2Symbol)

    if (!token1 || !token2) {
      throw new Error(`Unknown token(s): ${e.args.token1Symbol}-${e.args.token2Symbol}`)
    }
    return {
      ...this.formatBaseProtectionBoughtEvent(e),
      type: 'ProtectionClosedEvent',
      args: {
        collateral: this.tokenUSDC.toNumber(e.args.collateral),
        id: e.args.id.toString(),
        owner: e.args.owner,
        policyPeriodDays:
          (e.args.protectionEndTimestamp.toNumber() - e.args.protectionStartTimestamp.toNumber()) / 86400,
        policyPeriodSeconds: e.args.protectionEndTimestamp.toNumber() - e.args.protectionStartTimestamp.toNumber(),
        protectionStartTimestamp: e.args.protectionStartTimestamp.toNumber(),
        protectionStartTimestampUtc: new Date(e.args.protectionStartTimestamp.toNumber() * 1000).toISOString(),
        protectionEndTimestamp: e.args.protectionEndTimestamp.toNumber(),
        protectionEndTimestampUtc: new Date(e.args.protectionEndTimestamp.toNumber() * 1000).toISOString(),
        tokenName1: {
          ArmadilloSupportedTokenName: token1,
        },
        tokenName2: {
          ArmadilloSupportedTokenName: token2,
        },
        premiumCostUSD: this.tokenUSDC.toNumber(e.args.premiumCostUSD),
        token1EndPriceUSD: toNumber(e.args.token1EndPriceUSD, 8),
        token2EndPriceUSD: toNumber(e.args.token2EndPriceUSD, 8),
        amountPaidUSD: this.tokenUSDC.toNumber(e.args.amountPaidUSD),
      },
    }
  }

  public toFormattedLiquidityAddedEvent(e: LiquidityAddedEvent): FormattedLiquidityAddedEvent {
    return {
      ...this.formatBaseProtectionBoughtEvent(e),
      type: 'LiquidityAdded',
      args: {
        from: e.args.from,
        amount: this.tokenUSDC.toNumber(e.args.amount),
        updatedTotalLiquidity: this.tokenUSDC.toNumber(e.args.updatedTotalLiquidity),
      },
    }
  }

  public toFormattedLiquidityWithdrawnEvent(e: LiquidityWithdrawnEvent): FormattedLiquidityWithdrawnEvent {
    return {
      ...this.formatBaseProtectionBoughtEvent(e),
      type: 'LiquidityWithdrawn',
      args: {
        to: e.args.to,
        amount: this.tokenUSDC.toNumber(e.args.amount),
        updatedTotalLiquidity: this.tokenUSDC.toNumber(e.args.updatedTotalLiquidity),
      },
    }
  }

  public toFormattedProtectionMintDiscountDetails(
    e: ProtectionMintDiscountDetailsEvent,
  ): FormattedProtectionMintDiscountDetailsEvent {
    return {
      ...this.formatBaseProtectionBoughtEvent(e),
      type: 'ProtectionMintDiscountDetails',
      args: {
        id: e.args.id.toString(),
        discountNFTType: e.args.discountNFTType,
        owner: e.args.owner,
        premiumCostBeforeDiscount: this.tokenUSDC.toNumber(e.args.premiumCostBeforeDiscount),
        premiumCostDiscount: this.tokenUSDC.toNumber(e.args.premiumCostDiscount),
      },
    }
  }
}
