import type { BigNumber } from 'ethers'
import type { IERC20, ILProtectionInversifyService, PremiumValues, Token, TokenName } from '@coti-cvi/lw-sdk'
import { convertPremiumValues } from '../convert-premium-values'
import type { PremiumPricePoint, PremiumPriceSerieInfo } from '../types'
import type { ErrorObject } from '../utils'
import { toErrorObject } from '../utils'
import range from 'lodash/range'

export const downloadSerieData = async ({
  isDebugMode,
  serieInfo,
  iLProtectionInversifyService,
  tokenUSDC,
}: {
  isDebugMode: boolean
  serieInfo: PremiumPriceSerieInfo
  iLProtectionInversifyService: ILProtectionInversifyService
  tokenUSDC: Token<IERC20, TokenName.USDC>
}) => {
  const errors: ErrorObject[] = []

  const propertyValues = range(serieInfo.rangeInfo.min, serieInfo.rangeInfo.max, serieInfo.rangeInfo.interval)
  const requests = propertyValues.map<PremiumValues<BigNumber>>(propertyValue =>
    convertPremiumValues({
      from: 'number',
      to: 'BigNumber',
      tokenUSDC,
      values: {
        ...serieInfo.premiumValues,
        [serieInfo.chartName]: propertyValue,
      },
    }),
  )

  const results = await Promise.all(
    requests.map(async (request, i) => {
      const premiumPriceUsdc = await iLProtectionInversifyService
        .calculateCustomPremiumUsdc(request)
        .catch<false>(error => {
          if (
            error.errorArgs?.[0] === 'Collateral must be smaller than liquidity' ||
            error.error.message.includes('Collateral must be smaller than liquidity')
          ) {
            return false
          }
          errors.push(
            toErrorObject({
              error,
              request,
              propertyName: serieInfo.chartName,
              propertyValue: i === undefined ? undefined : propertyValues[i],
              tokenUSDC: tokenUSDC,
            }),
          )
          return false
        })
      if (premiumPriceUsdc) {
        return {
          propertyValue: propertyValues[i],
          premiumUsdc: tokenUSDC.toNumber(premiumPriceUsdc),
        }
      }
    }),
  )

  if (errors.length > 0) {
    console.error(`failed to calculate chart: ${serieInfo.chartName}. errors: `, errors)
  }

  const debug = propertyValues.map((propertyValue, i) => ({
    propertyValue,
    rawRequest: requests[i],
    rawParamsToString: {
      ...Object.fromEntries(
        Object.entries(requests[i])
          .filter(([key]) => key !== 'premiumParams')
          .map(([key, value]) => [key, value.toString()]),
      ),
      premiumParams: Object.fromEntries(
        Object.entries(requests[i].premiumParams).map(([key, value]) => [key, value.toString()]),
      ),
    },
    readableRequest: convertPremiumValues({
      from: 'BigNumber',
      to: 'string',
      tokenUSDC,
      values: requests[i],
    }),
    result: results[i]?.premiumUsdc,
  }))

  if (isDebugMode) {
    console.log(`chart: ${serieInfo.chartName} - requests+results`, debug)
  }

  return results
    .filter((r): r is PremiumPricePoint => Boolean(r))
    .filter(r => {
      if (serieInfo.chartName === 'lpTokensWorthAtBuyTimeUsdc') {
        return r.propertyValue > 0
      }
      return true
    })
    .map<[x: number, y: number]>(r => {
      let y: number | undefined = undefined
      if (serieInfo.chartName === 'lpTokensWorthAtBuyTimeUsdc') {
        y = (r.premiumUsdc / r.propertyValue) * 100
      } else {
        y = (r.premiumUsdc / serieInfo.premiumValues.lpTokensWorthAtBuyTimeUsdc) * 100
      }

      return [r.propertyValue, y]
    })
}
