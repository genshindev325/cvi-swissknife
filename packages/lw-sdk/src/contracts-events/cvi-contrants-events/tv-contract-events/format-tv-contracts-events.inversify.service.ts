import type { Token } from '../../../token'
import { CHAIN_IDS_INFO, TvRequestType, tokenDecimals, TokenName } from '../../../types'
import type { IERC20, ThetaVaultEvent, VaultTransaction, TvSupportedChainIds } from '../../../types'
import type { CVIUSDCThetaVault } from '@coti-cvi/auto-generated-code/contracts'
import { format } from 'date-fns'
import type {
  FormattedTvFulfillDepositEvent,
  FormattedTvFulfillWithdrawEvent,
  FormattedTvLiquidateEvent,
  FormattedTvSubmitEvent,
} from '../../cvi-types'
import type { GetContractInversifyService } from '../../../get-contract.inversify.service'
import { toNumber } from '../../../util'
import type {
  FulfillDepositEvent,
  FulfillWithdrawEvent,
  LiquidateRequestEvent,
  SubmitRequestEvent,
} from '@coti-cvi/auto-generated-code/src/git-contract-types/packages/contracts-deploy/artifacts/@coti-cvi/contracts-cvi/contracts/ThetaVault'
import type { CviContractsInversifyService } from '../../../cvi-contracts'
import type { CviCacheEventsApiInversifyService } from '@coti-cvi/lw-sdk'
import { inject, injectable } from 'inversify'
import type { CacheInversifyService } from '../../../cache.inversify.service'

@injectable()
export class FormatTvContractsEventsInversifyService {
  public readonly vaultCvi: CVIUSDCThetaVault

  constructor(
    @inject('ChainId') public readonly chainId: TvSupportedChainIds,
    @inject('CacheInversifyService') private readonly cacheInversifyService: CacheInversifyService,
    @inject('GetContractInversifyService') private readonly getContractService: GetContractInversifyService,
    @inject('CviCacheEventsApiInversifyService')
    private readonly cviCacheEventsApiInversifyService: CviCacheEventsApiInversifyService,
    @inject('TokenUSDC') private readonly tokenUSDC: Token<IERC20, TokenName.USDC>,
    @inject('CVIUSDCThetaToken') private readonly vaultToken: Token<IERC20, TokenName.T_CVI_LP>,
    @inject('CviContractsInversifyService') private readonly cviContractsInversifyService: CviContractsInversifyService,
  ) {
    this.vaultCvi = this.getContractService.getContractFromDeploymentsFile(
      CHAIN_IDS_INFO[this.chainId].blockchainName,
      'CVIUSDCThetaVault',
    )
  }

  public formatEventToVaultTransaction = async (event: ThetaVaultEvent): Promise<VaultTransaction> => {
    const block = await this.cacheInversifyService.get({
      key: `block`,
      blockTag: event.request.blockNumber,
      getFromBlockchain: () =>
        this.getContractService.provider
          .getBlock(event.request.blockNumber)
          .then(b => ({ timestamp: b.timestamp, number: b.number })),
    })

    return {
      txHash: event.request.transactionHash,
      // todo: add it but also as millisecond so we can manipulate it later
      // submitDateToString: format(new Date(event.request.args. * 1000), 'dd/MM/yyyy HH:mm:ss'),
      submitDateToString: format(block.timestamp * 1000, 'dd/MM/yyyy HH:mm:ss'),
      targetDateToString: format(event.request.args.targetTimestamp * 1000, 'dd/MM/yyyy HH:mm:ss'),
      targetTimestamp: event.request.args.targetTimestamp,
      amount:
        event.requestType === TvRequestType.Deposit
          ? this.tokenUSDC.toNumber(event.request.args.tokenAmount)
          : toNumber(
              event.request.args.tokenAmount
                .mul(event.request.args.totalUSDCBalance)
                .div(event.request.args.totalSupply),
              tokenDecimals.USDC,
            ),
      status: event.status,
      action: event.requestType === TvRequestType.Deposit ? 'Deposit' : 'Withdraw',
    }
  }

  public async toFormatTvSubmitEvent(e: SubmitRequestEvent): Promise<FormattedTvSubmitEvent> {
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
      ...base,
      blockTimestamp: block.timestamp,
      type: 'TvSubmitEvent',
      args: {
        account: e.args.account,
        requestId: e.args.requestId.toNumber(),
        requestType: e.args.requestType,
        action: e.args.requestType === TvRequestType.Deposit ? 'Deposit' : 'Withdraw',
        tokenAmountInUsdcTokenName: this.tokenUSDC.getTokenName(),
        tokenAmountInUsdc:
          e.args.requestType === TvRequestType.Deposit
            ? toNumber(e.args.tokenAmount, tokenDecimals.USDC)
            : toNumber(e.args.tokenAmount.mul(e.args.totalUSDCBalance).div(e.args.totalSupply), tokenDecimals.USDC),
        tokenAmountName:
          e.args.requestType === TvRequestType.Deposit ? this.tokenUSDC.getTokenName() : this.vaultToken.getTokenName(),
        tokenAmount:
          e.args.requestType === TvRequestType.Deposit
            ? toNumber(e.args.tokenAmount, tokenDecimals.USDC)
            : toNumber(e.args.tokenAmount, tokenDecimals[TokenName.T_CVI_LP]),
        targetTimestamp: e.args.targetTimestamp,
        currentThetaVaultUsdcBalance: toNumber(e.args.totalUSDCBalance, tokenDecimals.USDC),
        totalSupply: toNumber(e.args.totalSupply, tokenDecimals[TokenName.T_CVI_LP]),
        generalInfoOfEventOneBlockBefore,
        generalInfoOfEvent,
        generalInfoOfEventByAddress,
        generalInfoOfEventByAddressFromOneBlockBefore,
      },
    }
  }

  public async toFormatTvFulfillDepositEvent(e: FulfillDepositEvent): Promise<FormattedTvFulfillDepositEvent> {
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
      ...base,
      blockTimestamp: block.timestamp,
      type: 'TvFulfillDepositEvent',
      args: {
        requestId: e.args.requestId.toNumber(),
        account: e.args.account,
        action: 'Deposit',
        submitRequestTokenAmountUsdc: toNumber(e.args.totalUSDCAmount, tokenDecimals.USDC), // tokenAmount of the submit request | tokenAmount = (liquidity + position)
        platformLiquidityAmountUsdc: toNumber(e.args.platformLiquidityAmount, tokenDecimals.USDC), // The liquidity part deposited by the user. (a half~ going to the position)
        dexVolTokenUSDCAmount: toNumber(e.args.dexVolTokenUSDCAmount, tokenDecimals.USDC), // The part of the position deposited by the user
        dexVolTokenAmount: toNumber(e.args.dexVolTokenAmount, tokenDecimals[TokenName.CVI]),
        // vtTokenName: this.vaultToken.getTokenName(),
        // tvTokenName: this.vaultToken.getTokenName(),
        tokenName: this.vaultToken.getTokenName(),
        dexUSDCAmount: toNumber(e.args.dexUSDCAmount, tokenDecimals.USDC), // The usdc part of the liquidty added to the dex
        mintedThetaTokens: toNumber(e.args.mintedThetaTokens, tokenDecimals[TokenName.T_CVI_LP]), // The theta tokens amount the user received.
        generalInfoOfEventOneBlockBefore,
        generalInfoOfEvent,
        generalInfoOfEventByAddress,
        generalInfoOfEventByAddressFromOneBlockBefore,
      },
    }
  }

  public async toFormatTvFulfillWithdrawEvent(e: FulfillWithdrawEvent): Promise<FormattedTvFulfillWithdrawEvent> {
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
      ...base,
      blockTimestamp: block.timestamp,
      type: 'TvFulfillWithdrawEvent',
      args: {
        account: e.args.account,
        requestId: e.args.requestId.toNumber(),
        action: 'Withdraw',
        tokenName: this.tokenUSDC.getTokenName(),
        usdcAmountReceived: toNumber(e.args.totalUSDCAmount, tokenDecimals.USDC), // token amount in usdc (T-CVI-LP -> USDC) | the requested amount to withdraw in USDC
        platformLiquidityAmountUsdc: toNumber(e.args.platformLiquidityAmount, tokenDecimals.USDC),
        dexVolTokenAmount: toNumber(e.args.dexVolTokenAmount, tokenDecimals[TokenName.CVI]), // the volatility tokens amount removed from liquidity
        dexUSDCviTokenAmount: toNumber(e.args.dexUSDCVolTokenAmount, tokenDecimals.USDC), // the volatility tokens amount removed from liquidity in USDC
        dexUSDCAmount: toNumber(e.args.dexUSDCAmount, tokenDecimals.USDC), // the usdc amount removed from liquidity
        burnedThetaTokens: toNumber(e.args.burnedThetaTokens, tokenDecimals[TokenName.T_CVI_LP]), // The amount the user withdrawn
        generalInfoOfEventOneBlockBefore,
        generalInfoOfEvent,
        generalInfoOfEventByAddress,
        generalInfoOfEventByAddressFromOneBlockBefore,
      },
    }
  }

  public async toFormatTvLiquidateEvent(e: LiquidateRequestEvent): Promise<FormattedTvLiquidateEvent> {
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
      ...base,
      blockTimestamp: block.timestamp,
      type: 'TvLiquidateEvent',
      args: {
        requestId: e.args.requestId.toNumber(),
        requestType: e.args.requestType,
        action: e.args.requestType === TvRequestType.Deposit ? 'Deposit' : 'Withdraw',
        account: e.args.account,
        liquidator: e.args.liquidator,
        tokenAmountName:
          e.args.requestType === TvRequestType.Deposit ? this.tokenUSDC.getTokenName() : this.vaultToken.getTokenName(),
        tokenAmount:
          e.args.requestType === TvRequestType.Deposit
            ? this.tokenUSDC.toNumber(e.args.tokenAmount)
            : this.vaultToken.toNumber(e.args.tokenAmount),
        generalInfoOfEventOneBlockBefore,
        generalInfoOfEvent,
        generalInfoOfEventByAddress,
        generalInfoOfEventByAddressFromOneBlockBefore,
      },
    }
  }
}
