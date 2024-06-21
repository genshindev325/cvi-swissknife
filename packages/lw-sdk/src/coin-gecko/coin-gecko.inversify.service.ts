import { inject, injectable, postConstruct } from 'inversify'
import { ArmadilloSupportedTokenName } from '../types'
import { getCoinGeckoClient } from '../get-auto-generated-backend-clients'
import async from 'async'
import type { GlobalEventsInversifyService } from '../global-events.inversify.service'
import type { CoinGeckoDailyTokenPrice } from './types'
import type { S3InversifyService } from '../s3.inversify.service'

@injectable()
export class CoinGeckoInversifyService {
  private _allTokens:
    | undefined
    | {
        id: string
        symbol: string
        name: string
      }[]

  public readonly tokenIdToDailyPrices = new Map<string, CoinGeckoDailyTokenPrice[]>()

  public readonly tokenIdToTokenName: Record<string, ArmadilloSupportedTokenName> = {}

  constructor(
    @inject('S3InversifyService') private readonly s3InversifyService: S3InversifyService,
    @inject('GlobalEventsInversifyService') private readonly globalEventsInversifyService: GlobalEventsInversifyService,
  ) {}

  private getAllTokens() {
    if (this._allTokens) {
      return this._allTokens
    }
    throw new Error(`can't be here`)
  }

  // not all the token names are supported in coin-gecko
  public getTokenNameToTokenId(): Map<ArmadilloSupportedTokenName, string> {
    return new Map(
      Object.entries(this.tokenIdToTokenName).map<[ArmadilloSupportedTokenName, string]>(([tokenId, tokenName]) => [
        tokenName,
        tokenId,
      ]),
    )
  }

  private getS3Key(tokenId: string) {
    return `all-coin-gecko-token-daily-swaps__token-id-${tokenId}`
  }

  private tokenNameToCoinGeckoId(tokenName: ArmadilloSupportedTokenName): string {
    const result = this.getAllTokens().find(token => {
      if (tokenName === ArmadilloSupportedTokenName.USDC) {
        return token.id === 'usd-coin'
      }
      if (tokenName === ArmadilloSupportedTokenName.SAND) {
        return token.id === 'the-sandbox'
      }
      if (tokenName === ArmadilloSupportedTokenName.DOGE) {
        return token.id === 'dogecoin'
      }
      if (tokenName === ArmadilloSupportedTokenName.UNI) {
        return token.id === 'uniswap'
      }
      if (tokenName === ArmadilloSupportedTokenName.ADA) {
        return token.id === 'cardano'
      }
      return (
        token.id.toLowerCase() === tokenName.toLowerCase() ||
        token.name.toLowerCase() === tokenName.toLowerCase() ||
        token.symbol.toLowerCase() === tokenName.toLowerCase()
      )
    })
    if (result) {
      return result.id
    }
    throw new Error(`tokenName ${tokenName} not found in coin-gecko tokens list`)
  }

  @postConstruct()
  public async init() {
    this._allTokens = (await getCoinGeckoClient().coins.getCoinsList({})) as {
      id: string
      symbol: string
      name: string
    }[]

    await async.mapLimit(
      Object.values(ArmadilloSupportedTokenName),
      5,
      async (tokenName: ArmadilloSupportedTokenName) => {
        try {
          const tokenId = this.tokenNameToCoinGeckoId(tokenName)
          this.tokenIdToTokenName[tokenId] = tokenName

          return await this.getTokenDailyPriceHistory(this.tokenNameToCoinGeckoId(tokenName))
        } catch (error) {
          this.globalEventsInversifyService.eventEmitter.emit('errors', error)
        }
      },
    )
    console.log(
      `finsihed fetching all daily-prices of all relevent coin-gecko tokens: ${Array.from(
        this.tokenIdToDailyPrices.entries(),
      )
        .map(([tokenId, prices]) => `${tokenId} (${prices.length})`)
        .join(', ')}`,
    )
  }

  private async getTokenDailyPriceHistory(tokenId: string, retry = 1): Promise<void> {
    if (retry >= 2) {
      console.log(`retrying ${retry} token ${this.tokenIdToTokenName[tokenId]}`)
    }
    console.log(`getting token ${this.tokenIdToTokenName[tokenId]} from s3`)

    const schemaVersion = 1
    const Body = await this.s3InversifyService.readS3Key_legacy<CoinGeckoDailyTokenPrice[]>(this.getS3Key(tokenId))

    const fromS3: CoinGeckoDailyTokenPrice[] = Body?.version === schemaVersion ? Body.value : []

    console.log(`token ${this.tokenIdToTokenName[tokenId]} daily-swaps length from s3: ${fromS3.length}`)

    if (fromS3.length > 0) {
      const latestTime = [fromS3[0].dateMs, fromS3[fromS3.length - 1].dateMs].find(
        dateMs => dateMs > Date.now() - 1000 * 60 * 60 * 24 * 7,
      )
      if (latestTime === undefined) {
        console.log(
          `token ${this.tokenIdToTokenName[tokenId]} has invalid cache of daily-swaps in s3. fetching it from coin-gecko...`,
        )
      } else {
        this.tokenIdToDailyPrices.set(tokenId, fromS3)
        return
      }
    }

    const fromCoinGecko = await getCoinGeckoClient()
      .coins.getCoinsMarketChart({
        id: tokenId,
        days: (30 * 18).toString(),
        interval: 'daily',
        vsCurrency: 'usd',
      })
      .then<CoinGeckoDailyTokenPrice[]>((r: { prices: [dateMs: number, priceUsd: number][] }) =>
        r.prices.map<CoinGeckoDailyTokenPrice>(r => ({
          dateMs: r[0],
          priceUsd: r[1],
        })),
      )

    this.tokenIdToDailyPrices.set(tokenId, fromCoinGecko)

    await this.s3InversifyService.writeToS3Key_legacy<CoinGeckoDailyTokenPrice[]>(this.getS3Key(tokenId), {
      version: schemaVersion,
      value: fromCoinGecko,
    })
  }
}
