import { inject, injectable } from 'inversify'
import type { Block, IERC20, TokenName, CVISupportedChainIds } from '../../types'
import type { Event } from 'ethers'
import type { GetContractInversifyService } from '../../get-contract.inversify.service'
import type { VtInversifyService } from '../../volatility-token'
import type { ConnectedPair, Token } from '../../token'
import type { TvInfo } from '../../theta-vault'
import type { ThetaVaultInversifyService } from '../../theta-vault'
import type { CacheInversifyService } from '../../cache.inversify.service'
import type { GlobalEventsInversifyService } from '../../global-events.inversify.service'
import type { CVIOracleInversifyService } from '../../cvi-oracle.inversify.service'
import type { UniswapInversifyService } from '../../uniswap'
import type { JsonRpcProvider } from '@ethersproject/providers'
import { toNumber } from '../../util/big-number'

export type GeneralInfoOfEvent = {
  tvInfo: TvInfo
  cviIndex: number
  vtCviPriceInUsdc: number
  vtCviPriceDexInUsdc: number
  tvCvix1PriceInUsdc: number
  tvAprByLast30Days: number
  totalSupplyOfCviUsdcLpTokens: number
  vtCviUsdcLpTokenWorthInUsdc: number
}

export type GeneralInfoOfEventByAddress = {
  usdcBalance: number
  vtCviBalance: number
  vtCvix1BalanceInUsdc: number
  vtCvix1BalanceInUsdcInDex: number
  tvCvix1Balance: number
  tvCvix1BalanceInUsdc: number
  vtCviUsdcLpTokens: number
  vtCviUsdcLpTokensInUsdc: number
  vtCviUsdcLpTokensInCvi: number
}

export type GeneralInfoOfEventFromBlock = { block: Block; generalInfoOfEvent: GeneralInfoOfEvent }

@injectable()
export class CviCacheEventsApiInversifyService {
  constructor(
    @inject('EthersJsonRpcBatchProvider') public readonly provider: JsonRpcProvider,
    @inject('CacheInversifyService') public readonly cacheInversifyService: CacheInversifyService,
    @inject('GlobalEventsInversifyService') public readonly globalEventsInversifyService: GlobalEventsInversifyService,
    @inject('ChainId') public readonly chainId: CVISupportedChainIds,
    @inject('CVIOracleInversifyService') private readonly cviOracleInversifyService: CVIOracleInversifyService,
    @inject('GetContractInversifyService') private readonly getContractService: GetContractInversifyService,
    @inject('VtInversifyService') private readonly vtInversifyService: VtInversifyService,
    @inject('ThetaVaultInversifyService') private readonly thetaVaultInversifyService: ThetaVaultInversifyService,
    @inject('TokenUSDC') private readonly tokenUSDC: Token<IERC20, TokenName.USDC>,
    @inject('CVIUSDCThetaToken') private readonly vaultToken: Token<IERC20, TokenName.T_CVI_LP>,
    @inject('CVIUSDCVolatilityToken') public readonly tokenCvi: Token<IERC20, TokenName.CVI>,
    @inject('UniswapInversifyService') public readonly uniswapInversifyService: UniswapInversifyService,
    @inject('cviUsdcPairContractAndLpToken') public readonly pairContract: ConnectedPair,
  ) {}

  public async getBlockInfoOfEvent(e: Event) {
    const getData = (block: Block) => ({
      block,
      base: {
        address: e.address,
        blockHash: e.blockHash,
        blockNumber: e.blockNumber,
        data: e.data,
        event: e.event,
        eventSignature: e.eventSignature,
        logIndex: e.logIndex,
        removed: e.removed,
        topics: e.topics,
        transactionHash: e.transactionHash,
        transactionIndex: e.transactionIndex,
      },
      generalInfoOfEvent: undefined,
      generalInfoOfEventByAddress: undefined,
      generalInfoOfEventByAddressFromOneBlockBefore: undefined,
    })

    const block = await this.cacheInversifyService.get({
      key: `block`,
      blockTag: e.blockNumber,
      getFromBlockchain: () =>
        this.getContractService.provider
          .getBlock(e.blockNumber)
          .then(b => ({ timestamp: b.timestamp, number: b.number })),
    })

    return getData(block)
  }

  public async getGeneralInfoOfEvent(blockNumber: number): Promise<GeneralInfoOfEventFromBlock> {
    const [
      block,
      cviIndex,
      vtCviPriceInUsdc,
      vtCviPriceDexInUsdc,
      tvCvix1PriceInUsdc,
      tvAprByLast30Days,
      totalSupplyOfCviUsdcLpTokens,
    ] = await Promise.all([
      this.cacheInversifyService.get({
        key: `block`,
        blockTag: blockNumber,
        getFromBlockchain: () =>
          this.getContractService.provider
            .getBlock(blockNumber)
            .then(b => ({ timestamp: b.timestamp, number: b.number })),
      }),
      this.cviOracleInversifyService.getCviIndex(blockNumber).then(r => r.cviNumber),
      this.vtInversifyService.getIntrinsicPrice(blockNumber),
      this.vtInversifyService.getDexPrice(blockNumber),
      this.thetaVaultInversifyService.thetaTokenToUSDC(1, blockNumber).then(r => r.usdcAmount),
      this.thetaVaultInversifyService.calculateAPR(30, undefined, blockNumber).then(r => r.apr),
      this.cacheInversifyService.get({
        key: `lp-token::${this.pairContract.address}::totalSupply`,
        invalidationKey: '1',
        blockTag: blockNumber,
        getFromBlockchain: () =>
          this.pairContract
            .contract(this.provider)
            .totalSupply({ blockTag: blockNumber })
            .then(totalSupply => toNumber(totalSupply, this.pairContract.decimals)),
      }),
    ])

    const tvInfo = await this.thetaVaultInversifyService.info({ overrides: { blockTag: blockNumber }, cviIndex })

    if (vtCviPriceInUsdc === 0 || vtCviPriceDexInUsdc === 0) {
      console.log(
        `Warning: ${blockNumber}:${new Date(
          block.timestamp * 1000,
        ).toISOString()} Need to investigate: tokenPricecvi=${vtCviPriceInUsdc} | tokenPricecviDex=${vtCviPriceDexInUsdc} should be higher than 0`,
      )
    }

    return {
      block,
      generalInfoOfEvent: {
        tvInfo,
        cviIndex,
        vtCviPriceInUsdc,
        vtCviPriceDexInUsdc,
        tvCvix1PriceInUsdc,
        tvAprByLast30Days,
        totalSupplyOfCviUsdcLpTokens,
        vtCviUsdcLpTokenWorthInUsdc:
          totalSupplyOfCviUsdcLpTokens === 0 ? 0 : (tvInfo.dexCviBalanceUsdc * 2) / totalSupplyOfCviUsdcLpTokens,
      },
    }
  }

  public async getGeneralInfoOfEventByAddress({
    address,
    generalInfoOfEvent,
    blockNumber,
  }: {
    address: string
    generalInfoOfEvent: GeneralInfoOfEvent
    blockNumber: number
  }): Promise<GeneralInfoOfEventByAddress> {
    const [usdcBalance, vtCviBalance, tvCvix1Balance, vtCviUsdcLpTokens] = await Promise.all([
      this.cacheInversifyService.get({
        key: `usdcBalance`,
        blockTag: blockNumber,
        address,
        getFromBlockchain: async () => this.tokenUSDC.toNumber(await this.tokenUSDC.getBalance(address, blockNumber)),
      }),
      this.cacheInversifyService.get({
        key: `vtCviBalance`,
        blockTag: blockNumber,
        address,
        getFromBlockchain: async () => this.tokenCvi.toNumber(await this.tokenCvi.getBalance(address, blockNumber)),
      }),
      this.cacheInversifyService.get({
        key: `tvCvix1Balance`,
        blockTag: blockNumber,
        address,
        getFromBlockchain: async () => this.vaultToken.toNumber(await this.vaultToken.getBalance(address, blockNumber)),
      }),
      this.cacheInversifyService.get({
        key: `vtCviUsdcLpTokens`,
        blockTag: blockNumber,
        address,
        getFromBlockchain: async () =>
          toNumber(
            await this.pairContract.contract(this.provider).balanceOf(address, { blockTag: blockNumber }),
            this.pairContract.decimals,
          ),
      }),
    ])

    return this.calculateGeneralInfoOfEventByAddress({
      usdcBalance,
      vtCviBalance,
      tvCvix1Balance,
      vtCviUsdcLpTokens,
      generalInfoOfEvent,
    })
  }

  public calculateGeneralInfoOfEventByAddress({
    usdcBalance,
    vtCviBalance,
    tvCvix1Balance,
    vtCviUsdcLpTokens,
    generalInfoOfEvent,
  }: {
    usdcBalance: number
    vtCviBalance: number
    tvCvix1Balance: number
    vtCviUsdcLpTokens: number
    generalInfoOfEvent: GeneralInfoOfEvent
  }): GeneralInfoOfEventByAddress {
    const vtCviUsdcLpTokensInUsdc = vtCviUsdcLpTokens * generalInfoOfEvent.vtCviUsdcLpTokenWorthInUsdc
    return {
      usdcBalance,
      vtCviBalance,
      vtCvix1BalanceInUsdc: vtCviBalance * generalInfoOfEvent.vtCviPriceInUsdc,
      vtCvix1BalanceInUsdcInDex: vtCviBalance * generalInfoOfEvent.vtCviPriceDexInUsdc,
      tvCvix1Balance,
      tvCvix1BalanceInUsdc: tvCvix1Balance * generalInfoOfEvent.tvCvix1PriceInUsdc,
      vtCviUsdcLpTokens,
      vtCviUsdcLpTokensInUsdc,
      vtCviUsdcLpTokensInCvi:
        generalInfoOfEvent.vtCviPriceDexInUsdc === 0
          ? 0
          : vtCviUsdcLpTokensInUsdc / generalInfoOfEvent.vtCviPriceDexInUsdc,
    }
  }

  public async formatBaseVaultTransitionEvent(e: Event) {
    const [{ block, generalInfoOfEvent }, generalInfoOfEventOneBlockBefore] = await Promise.all([
      this.getGeneralInfoOfEvent(e.blockNumber),
      this.getGeneralInfoOfEvent(e.blockNumber - 1).then(r => r.generalInfoOfEvent),
    ])

    return {
      base: {
        address: e.address,
        blockNumber: e.blockNumber,
        logIndex: e.logIndex,
        transactionHash: e.transactionHash,
        transactionIndex: e.transactionIndex,
      },
      block,
      generalInfoOfEvent,
      generalInfoOfEventOneBlockBefore,
    }
  }
}
