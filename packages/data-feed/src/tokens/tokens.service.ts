import { getCoinGeckoClient, TokenName } from '@coti-cvi/lw-sdk'
import type { OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { Inject } from '@nestjs/common'
import { SentryService } from '@coti-cvi/common-be'

export type Point = {
  x: number
  y: number
}

export class TokensService implements OnModuleInit, OnModuleDestroy {
  private allCoinGeckoTokens: {
    id: string
    symbol: string
    name: string
  }[] = []

  public readonly tokensDailyPriceHistory: Record<'oldPolygonCvi' | TokenName.WBTC | TokenName.ETH, Point[]> = {
    oldPolygonCvi: [],
    [TokenName.WBTC]: [],
    [TokenName.ETH]: [],
  }

  private readonly cleanups: (() => void)[] = []

  constructor(@Inject(SentryService) private readonly sentryService: SentryService) {}

  onModuleDestroy() {
    this.cleanups.forEach(f => f())
  }

  public async onModuleInit() {
    this.allCoinGeckoTokens = (await getCoinGeckoClient().coins.getCoinsList({})) as {
      id: string
      symbol: string
      name: string
    }[]

    const getAllHistories = async () => {
      try {
        await Promise.all([this.updateCviHistory(), this.updateWBtcHistory(), this.updateEthHistory()])
      } catch (error) {
        this.sentryService.sendErrorToSentry(error)
      }
    }

    getAllHistories()
    const id = setInterval(getAllHistories, 60_000)
    this.cleanups.push(() => clearInterval(id))
  }

  private async downloadTokenHistory(tokenId: string): Promise<Point[]> {
    return getCoinGeckoClient()
      .coins.getCoinsMarketChart({
        id: tokenId,
        days: (1500).toString(),
        vsCurrency: 'usd',
      })
      .then((r: { prices: [dateMs: number, priceUsd: number][] }) =>
        r.prices.map<Point>(r => ({
          x: r[0] / 1000,
          y: r[1],
        })),
      )
  }

  private async updateCviHistory() {
    const cviToken = this.allCoinGeckoTokens.find(r => r.id.toLowerCase() === 'crypto-volatility-token')

    if (cviToken) {
      this.tokensDailyPriceHistory.oldPolygonCvi = await this.downloadTokenHistory(cviToken.id)
    } else {
      throw new Error(`cvi was not found on coingecko. pls check it out`)
    }
  }

  private async updateWBtcHistory() {
    const wbtc = this.allCoinGeckoTokens.find(
      token =>
        token.id.toLowerCase() === TokenName.WBTC.toLowerCase() ||
        token.name.toLowerCase() === TokenName.WBTC.toLowerCase() ||
        token.symbol.toLowerCase() === TokenName.WBTC.toLowerCase(),
    )

    if (wbtc) {
      this.tokensDailyPriceHistory[TokenName.WBTC] = await this.downloadTokenHistory(wbtc.id)
    } else {
      throw new Error(`cvi was not found on coingecko. pls check it out`)
    }
  }

  private async updateEthHistory() {
    const wbtc = this.allCoinGeckoTokens.find(
      token =>
        token.id.toLowerCase() === TokenName.ETH.toLowerCase() ||
        token.name.toLowerCase() === TokenName.ETH.toLowerCase() ||
        token.symbol.toLowerCase() === TokenName.ETH.toLowerCase(),
    )

    if (wbtc) {
      this.tokensDailyPriceHistory[TokenName.ETH] = await this.downloadTokenHistory(wbtc.id)
    } else {
      throw new Error(`cvi was not found on coingecko. pls check it out`)
    }
  }
}
