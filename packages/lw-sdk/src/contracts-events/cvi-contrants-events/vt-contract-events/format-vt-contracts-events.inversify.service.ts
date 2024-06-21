import { inject, injectable } from 'inversify'
import type { Token, UntypedToken } from '../../../token'
import { tokenDecimals } from '../../../types'
import type { IERC20, Block, TvSupportedChainIds } from '../../../types'
import type { TokenName } from '../../../types'
import type { Event } from 'ethers'
import { format } from 'date-fns'
import { VtRequestType } from '../../../types/vol-token-common-types'
import type { CviContractsInversifyService } from '../../../cvi-contracts'
import type {
  FormattedVtSubmitRequestEvent,
  FormattedVtMintEvent,
  FormattedVtLiquidateRequestEvent,
  FormattedVtFulfillRequestEvent,
  FormattedVtBurnEvent,
  FormattedVtUniswapSwapEvent,
  FormattedVtCviTransferEvent,
} from '../../cvi-types'
import { toNumber } from '../../../util'

import type { BlockchainContractEventsCacheUtils } from '../cvi-oracle-events-cache-utils.inversify.service'
import type {
  LiquidateRequestEvent,
  SubmitRequestEvent,
} from '@coti-cvi/auto-generated-code/src/git-contract-types/packages/contracts-deploy/artifacts/@coti-cvi/contracts-cvi/contracts/interfaces/IVolatilityToken'
import type {
  BurnEvent,
  FulfillRequestEvent,
  MintEvent,
} from '@coti-cvi/auto-generated-code/src/git-contract-types/packages/contracts-deploy/artifacts/contracts/volatility-token/VolatilityTokenContracts.sol/CVIUSDCVolatilityToken'
import type {
  SwapEvent,
  TransferEvent,
} from '@coti-cvi/auto-generated-code/src/git-contract-types/packages/contracts-deploy/artifacts/@coti-cvi/contracts-cvi/contracts/external/IUniswapV2Pair'
import type { VtInversifyService } from '../../../volatility-token'
import type { BlockchainEventBase } from '../../types'
import type { GeneralInfoOfEvent, GeneralInfoOfEventByAddress } from '@coti-cvi/lw-sdk'
import type { CviCacheEventsApiInversifyService } from '../cvi-cache-events-api.inversify.service'

@injectable()
export class FormatVtContractsEventsInversifyService {
  constructor(
    @inject('ChainId') public readonly chainId: TvSupportedChainIds,
    @inject('TokenUSDC') private readonly tokenUSDC: Token<IERC20, TokenName.USDC>,
    @inject('CVIUSDCVolatilityToken') public readonly tokenCvi: UntypedToken,
    @inject('CVIUSDCShortToken') public readonly tokenShort: UntypedToken,
    @inject('CviContractsInversifyService') private readonly cviContractsInversifyService: CviContractsInversifyService,
    @inject('BlockchainContractEventsCacheUtils')
    private readonly blockchainContractEventsCacheUtils: BlockchainContractEventsCacheUtils,
    @inject('CviCacheEventsApiInversifyService')
    private readonly cviCacheEventsApiInversifyService: CviCacheEventsApiInversifyService,
    @inject('VtInversifyService') private readonly vtInversifyService: VtInversifyService,
  ) {}

  public toFormatVolatilityVtTokensEvent(event: Event) {
    return {
      ...this.blockchainContractEventsCacheUtils.formatBaseEvent(event),
      args: event.args,
    }
  }

  private async loadGeneralInfo(
    e: SubmitRequestEvent | LiquidateRequestEvent | FulfillRequestEvent | MintEvent | BurnEvent,
    getGeneralInfo: boolean,
  ): Promise<{
    base: BlockchainEventBase
    block: Block
    generalInfoOfEvent: GeneralInfoOfEvent
    generalInfoOfEventOneBlockBefore: GeneralInfoOfEvent
    generalInfoOfEventByAddress: GeneralInfoOfEventByAddress
    generalInfoOfEventByAddressFromOneBlockBefore: GeneralInfoOfEventByAddress
  }> {
    if (getGeneralInfo) {
      const { base, block, generalInfoOfEvent, generalInfoOfEventOneBlockBefore } =
        await this.cviCacheEventsApiInversifyService.formatBaseVaultTransitionEvent(e)

      const [generalInfoOfEventByAddress, generalInfoOfEventByAddressFromOneBlockBefore] = await Promise.all([
        this.cviCacheEventsApiInversifyService.getGeneralInfoOfEventByAddress({
          blockNumber: e.blockNumber,
          address: e.args.account,
          generalInfoOfEvent,
        }),
        this.cviCacheEventsApiInversifyService.getGeneralInfoOfEventByAddress({
          blockNumber: e.blockNumber - 1,
          address: e.args.account,
          generalInfoOfEvent,
        }),
      ])
      return {
        base,
        block,
        generalInfoOfEvent: generalInfoOfEvent!,
        generalInfoOfEventOneBlockBefore: generalInfoOfEventOneBlockBefore!,
        generalInfoOfEventByAddress: generalInfoOfEventByAddress!,
        generalInfoOfEventByAddressFromOneBlockBefore: generalInfoOfEventByAddressFromOneBlockBefore!,
      }
    } else {
      // @ts-expect-error
      return this.cviCacheEventsApiInversifyService.getBlockInfoOfEvent(e)
    }
  }

  public toFormattedVtSimpleEvent(
    e: SubmitRequestEvent | LiquidateRequestEvent | FulfillRequestEvent | MintEvent | BurnEvent,
  ) {
    const { args, ...base } = e
    const { requestId, ...otherArgs } = args
    return {
      ...base,
      args: {
        ...otherArgs,
        requestId: requestId.toNumber(),
      },
    }
  }

  public toFormattedVtSimpleSubmitRequestEvent(e: SubmitRequestEvent) {
    const { args, ...base } = e
    const { requestId, ...otherArgs } = args
    return {
      ...base,
      args: {
        ...otherArgs,
        requestId: requestId.toNumber(),
      },
    }
  }

  public toFormattedVtSimpleLiquidateRequestEvent(e: LiquidateRequestEvent) {
    const { args, ...base } = e
    const { requestId, ...otherArgs } = args
    return {
      ...base,
      args: {
        ...otherArgs,
        requestId: requestId.toNumber(),
      },
    }
  }

  public toFormattedVtSimpleFulfillRequestEvent(e: FulfillRequestEvent) {
    const { args, ...base } = e
    const { requestId, ...otherArgs } = args
    return {
      ...base,
      args: {
        ...otherArgs,
        requestId: requestId.toNumber(),
      },
    }
  }

  public toFormattedVtSimpleMintEvent(e: MintEvent) {
    const { args, ...base } = e
    const { requestId, ...otherArgs } = args
    return {
      ...base,
      args: {
        ...otherArgs,
        requestId: requestId.toNumber(),
      },
    }
  }

  public toFormattedVtSimpleBurnEvent(e: BurnEvent) {
    const { args, ...base } = e
    const { requestId, ...otherArgs } = args
    return {
      ...base,
      args: {
        ...otherArgs,
        requestId: requestId.toNumber(),
      },
    }
  }

  public async toFormattedVtSubmittedRequest(
    e: SubmitRequestEvent,
    getGeneralInfo: boolean,
  ): Promise<FormattedVtSubmitRequestEvent> {
    const {
      base,
      block,
      generalInfoOfEvent,
      generalInfoOfEventOneBlockBefore,
      generalInfoOfEventByAddress,
      generalInfoOfEventByAddressFromOneBlockBefore,
    } = getGeneralInfo ? await this.loadGeneralInfo(e, true) : await this.loadGeneralInfo(e, false)

    const requestType = Object.values(VtRequestType).find((v): v is VtRequestType => v === e.args.requestType)
    if (!requestType) {
      throw new Error(`can't be here`)
    }

    return {
      ...base,
      type: 'VtSubmitEvent',
      blockTimestamp: block.timestamp,
      args: {
        tokenNameAmountPaid:
          requestType === VtRequestType.Mint ? this.tokenUSDC.getTokenName() : this.tokenCvi.getTokenName(),
        cviTokenName: this.tokenCvi.getTokenName(),
        account: e.args.account,
        requestId: e.args.requestId.toNumber(),
        requestType,
        action: requestType === VtRequestType.Mint ? 'Mint' : 'Burn',
        submitFeesAmount:
          requestType === VtRequestType.Mint
            ? this.tokenUSDC.toNumber(e.args.submitFeesAmount)
            : this.tokenCvi.toNumber(e.args.submitFeesAmount),
        tokenNameSubmitFeesAmount:
          requestType === VtRequestType.Mint ? this.tokenUSDC.getTokenName() : this.tokenCvi.getTokenName(),
        requestTimestamp: e.args.requestTimestamp,
        targetTimestamp: e.args.targetTimestamp,
        tokenAmountPaid:
          requestType === VtRequestType.Mint
            ? this.tokenUSDC.toNumber(e.args.tokenAmount)
            : this.tokenCvi.toNumber(e.args.tokenAmount),
        useKeepers: e.args.useKeepers,
        maxBuyingPremiumFeePercentage: e.args.maxBuyingPremiumFeePercentage,
        generalInfoOfEventByAddress,
        generalInfoOfEventOneBlockBefore,
        generalInfoOfEvent,
        generalInfoOfEventByAddressFromOneBlockBefore,
      },
    }
  }

  public async toFormattedVtMintEvent(e: MintEvent, getGeneralInfo: boolean): Promise<FormattedVtMintEvent> {
    const {
      base,
      block,
      generalInfoOfEvent,
      generalInfoOfEventOneBlockBefore,
      generalInfoOfEventByAddress,
      generalInfoOfEventByAddressFromOneBlockBefore,
    } = getGeneralInfo ? await this.loadGeneralInfo(e, true) : await this.loadGeneralInfo(e, false)

    return {
      ...base,
      blockTimestamp: block.timestamp,
      type: 'VtMintEvent',
      args: {
        cviTokenName: this.tokenCvi.getTokenName(),
        requestId: e.args.requestId.toNumber(),
        account: e.args.account,
        action: 'Mint',
        usdcPaidAfterTimeDelayFee: this.tokenUSDC.toNumber(e.args.tokenAmount), // this is less compared to tokenAmountPaid in the submit event! because there are fees.
        positionedTokenAmount: this.tokenUSDC.toNumber(e.args.positionedTokenAmount),
        positionedTokenNameAmount: this.tokenUSDC.getTokenName(),
        mintedTokens: this.tokenCvi.toNumber(e.args.mintedTokens),
        mintedTokenName: this.tokenCvi.getTokenName(),
        openPositionFee: this.tokenUSDC.toNumber(e.args.openPositionFee),
        openPositionFeeTokenName: this.tokenUSDC.getTokenName(),
        buyingPremiumFee: this.tokenUSDC.toNumber(e.args.buyingPremiumFee),
        buyingPremiumFeeTokenName: this.tokenUSDC.getTokenName(),
        generalInfoOfEvent: generalInfoOfEvent!,
        generalInfoOfEventOneBlockBefore: generalInfoOfEventOneBlockBefore!,
        generalInfoOfEventByAddress: generalInfoOfEventByAddress!,
        generalInfoOfEventByAddressFromOneBlockBefore: generalInfoOfEventByAddressFromOneBlockBefore!,
      },
    }
  }

  public async toFormattedVtLiquidateRequestEvent(
    e: LiquidateRequestEvent,
    getGeneralInfo: boolean,
  ): Promise<FormattedVtLiquidateRequestEvent> {
    const {
      base,
      block,
      generalInfoOfEvent,
      generalInfoOfEventOneBlockBefore,
      generalInfoOfEventByAddress,
      generalInfoOfEventByAddressFromOneBlockBefore,
    } = getGeneralInfo ? await this.loadGeneralInfo(e, true) : await this.loadGeneralInfo(e, false)

    const requestType = Object.values(VtRequestType).find((v): v is VtRequestType => v === e.args.requestType)
    if (!requestType) {
      throw new Error(`can't be here`)
    }

    return {
      ...base,
      type: 'VtLiquidateEvent',
      blockTimestamp: block.timestamp,
      args: {
        cviTokenName: this.tokenCvi.getTokenName(),
        requestId: e.args.requestId.toNumber(),
        requestType,
        action: requestType === VtRequestType.Mint ? 'Mint' : 'Burn',
        account: e.args.account,
        liquidator: e.args.liquidator,
        findersFeeAmount: this.tokenUSDC.toNumber(e.args.findersFeeAmount),
        findersFeeAmountTokenName: this.tokenUSDC.getTokenName(),
        useKeepers: e.args.useKeepers,
        liquidateTimestamp: e.args.liquidateTimestamp,
        liquidateTimestampString: format(new Date(e.args.liquidateTimestamp * 1000), 'dd/MM/yyyy HH:mm:ss'),
        generalInfoOfEventByAddress,
        generalInfoOfEventOneBlockBefore,
        generalInfoOfEvent,
        generalInfoOfEventByAddressFromOneBlockBefore,
      },
    }
  }

  public async toFormattedVtFulfillRequestEvent(
    e: FulfillRequestEvent,
    getGeneralInfo: boolean,
  ): Promise<FormattedVtFulfillRequestEvent> {
    const [
      {
        base,
        block,
        generalInfoOfEvent,
        generalInfoOfEventOneBlockBefore,
        generalInfoOfEventByAddress,
        generalInfoOfEventByAddressFromOneBlockBefore,
      },
      vtCviPriceInUsdc,
    ] = getGeneralInfo
      ? await this.loadGeneralInfo(e, true).then(
          generalInfo => [generalInfo, generalInfo.generalInfoOfEvent?.vtCviPriceInUsdc] as const,
        )
      : await Promise.all([
          this.loadGeneralInfo(e, false),
          this.vtInversifyService.getIntrinsicPrice(e.blockNumber),
        ] as const)

    const requestType = Object.values(VtRequestType).find((v): v is VtRequestType => v === e.args.requestType)
    if (!requestType) {
      throw new Error(`can't be here`)
    }

    return {
      ...base,
      type: 'VtFulfillEvent',
      blockTimestamp: block.timestamp,
      args: {
        tokenNameFulfillFeesAmount:
          requestType === VtRequestType.Mint ? this.tokenUSDC.getTokenName() : this.tokenCvi.getTokenName(),
        cviTokenName: this.tokenCvi.getTokenName(),
        requestId: e.args.requestId.toNumber(),
        requestType,
        action: requestType === VtRequestType.Mint ? 'Mint' : 'Burn',
        account: e.args.account,
        fulfillFeesAmount:
          requestType === VtRequestType.Mint
            ? this.tokenUSDC.toNumber(e.args.fulfillFeesAmount)
            : vtCviPriceInUsdc
            ? this.tokenUSDC.toNumber(e.args.fulfillFeesAmount) / vtCviPriceInUsdc
            : 0,
        isAborted: e.args.isAborted,
        useKeepers: e.args.useKeepers,
        keepersCalled: e.args.keepersCalled,
        fulfiller: e.args.fulfiller,
        fulfillTimestamp: e.args.fulfillTimestamp,
        generalInfoOfEventByAddress,
        generalInfoOfEventOneBlockBefore,
        generalInfoOfEvent,
        generalInfoOfEventByAddressFromOneBlockBefore,
      },
    }
  }

  public async toFormattedVtBurnEvent(e: BurnEvent, getGeneralInfo: boolean): Promise<FormattedVtBurnEvent> {
    const [
      {
        base,
        block,
        generalInfoOfEvent,
        generalInfoOfEventOneBlockBefore,
        generalInfoOfEventByAddress,
        generalInfoOfEventByAddressFromOneBlockBefore,
      },
      vtCviPriceInUsdc,
    ] = getGeneralInfo
      ? await this.loadGeneralInfo(e, true).then(
          generalInfo => [generalInfo, generalInfo.generalInfoOfEvent?.vtCviPriceInUsdc] as const,
        )
      : await Promise.all([
          this.loadGeneralInfo(e, false),
          this.vtInversifyService.getIntrinsicPrice(e.blockNumber),
        ] as const)

    return {
      ...base,
      type: 'VtBurnEvent',
      blockTimestamp: block.timestamp,
      args: {
        cviTokenName: this.tokenCvi.getTokenName(),
        requestId: e.args.requestId.toNumber(),
        account: e.args.account,
        action: 'Burn',
        usdcReceivedBeforeFees: this.tokenUSDC.toNumber(e.args.tokenAmountBeforeFees),
        usdcAmountReceived: this.tokenUSDC.toNumber(e.args.tokenAmount),
        burnedTokensCvi: this.tokenCvi.toNumber(e.args.burnedTokens),
        burnedTokenscviTokenName: this.tokenCvi.getTokenName(),
        closePositionFee:
          vtCviPriceInUsdc > 0 ? this.tokenUSDC.toNumber(e.args.closePositionFee) / vtCviPriceInUsdc : 0,
        tokenNameClosePositionFee: this.tokenCvi.getTokenName(),
        closingPremiumFee: vtCviPriceInUsdc ? this.tokenUSDC.toNumber(e.args.closingPremiumFee) / vtCviPriceInUsdc : 0,
        closingPremiumFeeTokenName: this.tokenCvi.getTokenName(),
        generalInfoOfEvent,
        generalInfoOfEventOneBlockBefore,
        generalInfoOfEventByAddress,
        generalInfoOfEventByAddressFromOneBlockBefore,
      },
    }
  }

  public async toFormattedCviSwapEvents(e: SwapEvent): Promise<FormattedVtUniswapSwapEvent> {
    const { base, block, generalInfoOfEvent, generalInfoOfEventOneBlockBefore } =
      await this.cviCacheEventsApiInversifyService.formatBaseVaultTransitionEvent(e)

    const [generalInfoOfEventByAddress, generalInfoOfEventByAddressFromOneBlockBefore] = await Promise.all([
      this.cviCacheEventsApiInversifyService.getGeneralInfoOfEventByAddress({
        blockNumber: e.blockNumber,
        address: e.args.to,
        generalInfoOfEvent,
      }),
      this.cviCacheEventsApiInversifyService.getGeneralInfoOfEventByAddress({
        blockNumber: e.blockNumber - 1,
        address: e.args.to,
        generalInfoOfEvent,
      }),
    ])

    const tokenName0 = this.tokenCvi.getTokenName()
    const tokenName1 = this.tokenUSDC.getTokenName()
    const amount0In = this.tokenCvi.toNumber(e.args.amount0In)
    const amount1In = this.tokenUSDC.toNumber(e.args.amount1In)
    const amount0Out = this.tokenCvi.toNumber(e.args.amount0Out)
    const amount1Out = this.tokenUSDC.toNumber(e.args.amount1Out)

    return {
      ...base,
      type: 'VtUniswapSwapEvent',
      blockTimestamp: block.timestamp,
      args: {
        account: e.args.to,
        tokenNameAmountIn: amount0In > 0 ? tokenName0 : tokenName1,
        tokenAmountIn: amount0In > 0 ? amount0In : amount1In,
        tokenNameAmountOut: amount0Out > 0 ? tokenName0 : tokenName1,
        tokenAmountOut: amount0Out > 0 ? amount0Out : amount1Out,
        generalInfoOfEventByAddress,
        generalInfoOfEventOneBlockBefore,
        generalInfoOfEvent,
        generalInfoOfEventByAddressFromOneBlockBefore,
      },
    }
  }

  public async toFormattedCviTransferEvent(e: TransferEvent): Promise<FormattedVtCviTransferEvent> {
    const { base, block, generalInfoOfEvent, generalInfoOfEventOneBlockBefore } =
      await this.cviCacheEventsApiInversifyService.formatBaseVaultTransitionEvent(e)

    const [
      generalInfoOfEventBySender,
      generalInfoOfEventByReceiver,
      generalInfoOfEventBySenderOneBlockBefore,
      generalInfoOfEventByReceiverOneBlockBefore,
    ] = await Promise.all([
      this.cviCacheEventsApiInversifyService.getGeneralInfoOfEventByAddress({
        blockNumber: e.blockNumber,
        address: e.args.from,
        generalInfoOfEvent,
      }),
      this.cviCacheEventsApiInversifyService.getGeneralInfoOfEventByAddress({
        blockNumber: e.blockNumber,
        address: e.args.to,
        generalInfoOfEvent,
      }),
      this.cviCacheEventsApiInversifyService.getGeneralInfoOfEventByAddress({
        blockNumber: e.blockNumber - 1,
        address: e.args.from,
        generalInfoOfEvent,
      }),
      this.cviCacheEventsApiInversifyService.getGeneralInfoOfEventByAddress({
        blockNumber: e.blockNumber - 1,
        address: e.args.to,
        generalInfoOfEvent,
      }),
    ])

    return {
      ...base,
      type: 'VtCviTransferEvent',
      blockTimestamp: block.timestamp,
      args: {
        cviTokenName: this.tokenCvi.getTokenName(),
        fromAccount: e.args.from,
        toAccount: e.args.to,
        cviAmount: toNumber(e.args[2], tokenDecimals.CVI), //! Do not change this line.
        generalInfoOfEvent,
        generalInfoOfEventOneBlockBefore,
        generalInfoOfEventBySender,
        generalInfoOfEventByReceiver,
        generalInfoOfEventBySenderOneBlockBefore,
        generalInfoOfEventByReceiverOneBlockBefore,
      },
    }
  }
}
