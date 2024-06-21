import { inject, injectable, postConstruct } from 'inversify'
import { calculateIL } from '../il-offline-calculations'
import { ArmadilloSupportedTokenName } from '../types'
import { startTimer } from '../util'
import type { CoinGeckoInversifyService } from './coin-gecko.inversify.service'
import type { CoinGeckoDailyTokenPrice, WorstIlOfTokenByCoinGeko, WorstIlPointInTime } from './types'

const MAX_IL_PROTECTION_PERIOD_MS = 1000 * 60 * 60 * 24 * 60

@injectable()
export class WorstIlByCoinGeckoDailySwapsInversifyService {
  public readonly worstIls: WorstIlOfTokenByCoinGeko[] = []

  private readonly tokenNameToTokenId = this.coinGeckoInversifyService.getTokenNameToTokenId()

  constructor(
    @inject('CoinGeckoInversifyService') private readonly coinGeckoInversifyService: CoinGeckoInversifyService,
  ) {}

  @postConstruct()
  public async init() {
    const pairs: { tokenName1: ArmadilloSupportedTokenName; tokenName2: ArmadilloSupportedTokenName }[] = []

    for (const t1 of Object.values(ArmadilloSupportedTokenName)) {
      for (const t2 of Object.values(ArmadilloSupportedTokenName)) {
        if (
          t1 !== t2 &&
          !pairs.some(p => (p.tokenName1 === t1 && p.tokenName2 === t2) || (p.tokenName2 === t1 && p.tokenName1 === t2))
        ) {
          pairs.push({ tokenName1: t1, tokenName2: t2 })
        }
      }
    }

    for (const { tokenName1, tokenName2 } of pairs) {
      const tokenId1 = this.tokenNameToTokenId.get(tokenName1)
      const tokenId2 = this.tokenNameToTokenId.get(tokenName2)
      if (!tokenId1 || !tokenId2) {
        throw new Error(
          `can't be here: tokenId1 or tokenId2 are missing: ${JSON.stringify(
            {
              tokenName1,
              tokenName2,
              tokenId1,
              tokenId2,
            },
            null,
            2,
          )}`,
        )
      }
      const prices1 = this.coinGeckoInversifyService.tokenIdToDailyPrices.get(tokenId1)
      const prices2 = this.coinGeckoInversifyService.tokenIdToDailyPrices.get(tokenId2)
      if (!prices1 || !prices2) {
        throw new Error(
          `can't be here: price1 or price2 are missing: ${JSON.stringify(
            {
              tokenName1,
              tokenName2,
              tokenId1,
              tokenId2,
              prices1: prices1?.length,
              prices2: prices2?.length,
            },
            null,
            2,
          )}`,
        )
      }
      const worstIl = this.calcIlInfoPerPair({
        token1: {
          name: tokenName1,
          coinGeckoId: tokenId1,
          prices: prices1,
        },
        token2: {
          name: tokenName2,
          coinGeckoId: tokenId2,
          prices: prices2,
        },
      })
      this.worstIls.push(worstIl)
    }

    console.log(
      'calculated worst ils from coin-gecko:',
      this.worstIls
        .map(
          w =>
            `${w.token1Name.ArmadilloSupportedTokenName}-${
              w.token2Name.ArmadilloSupportedTokenName
            } (${w.worstIlPercentage.toFixed(2)}%)`,
        )
        .join(','),
    )
  }

  private calcIlInfoPerPair({
    token1,
    token2,
  }: {
    token1: { coinGeckoId: string; name: ArmadilloSupportedTokenName; prices: CoinGeckoDailyTokenPrice[] }
    token2: { coinGeckoId: string; name: ArmadilloSupportedTokenName; prices: CoinGeckoDailyTokenPrice[] }
  }): WorstIlOfTokenByCoinGeko {
    const dailySwapsAscByDate = token1.prices
      .filter(({ dateMs }) => dateMs >= Date.now() - 1000 * 60 * 60 * 24 * 30 * 18)
      .flatMap<WorstIlPointInTime>(({ dateMs, priceUsd }) => {
        const token2Price = token2.prices.find(r => r.dateMs === dateMs)
        if (token2Price) {
          return [
            {
              dateMs,
              dateUtc: new Date(dateMs).toISOString(),
              token1PriceUsd: priceUsd,
              token2PriceUsd: token2Price.priceUsd,
            },
          ]
        } else {
          return []
        }
      })
      .sort((a, b) => a.dateMs - b.dateMs)

    let worstIl: WorstIlOfTokenByCoinGeko | undefined

    const e = startTimer()
    for (let i = 0; i < dailySwapsAscByDate.length; i++) {
      for (let j = i + 1; j < dailySwapsAscByDate.length; j++) {
        if (dailySwapsAscByDate[j].dateMs - dailySwapsAscByDate[i].dateMs <= MAX_IL_PROTECTION_PERIOD_MS) {
          const newIl =
            calculateIL(
              dailySwapsAscByDate[i].token1PriceUsd,
              dailySwapsAscByDate[i].token2PriceUsd,
              dailySwapsAscByDate[j].token1PriceUsd,
              dailySwapsAscByDate[j].token2PriceUsd,
              {
                useToFixed: true,
              },
            ) * 100
          if (worstIl === undefined || newIl > worstIl.worstIlPercentage) {
            worstIl = {
              id: `${token1.name}-${token2.name}`,
              worstIlPercentage: newIl,
              coinGeckoToken1Id: token1.coinGeckoId,
              coinGeckoToken2Id: token2.coinGeckoId,
              token1Name: {
                ArmadilloSupportedTokenName: token1.name,
              },
              token2Name: {
                ArmadilloSupportedTokenName: token2.name,
              },
              start: dailySwapsAscByDate[i],
              end: dailySwapsAscByDate[j],
            }
          }
        } else {
          break
        }
      }
    }

    if (worstIl === undefined) {
      throw new Error(
        `bug - worstIl is undefined for pair: ${token1.name}-${token2.name} (is there any data from coin-gecko or s3?)`,
      )
    }

    console.log(
      `calculated worst-il for pair: ${token1.name}-${token2.name}: ${worstIl.worstIlPercentage.toFixed(2)}% (${e()}s)`,
    )

    return worstIl
  }
}
