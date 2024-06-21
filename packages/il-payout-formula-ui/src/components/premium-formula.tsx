import { BigNumber } from 'ethers'
import type { FC } from 'react'

import { Equation, defaultErrorHandler } from 'react-equation'
import usePromise from 'react-use-promise'
import { toNumber } from '@coti-cvi/lw-sdk'
import { convertPayoutParams } from '../convert-payout-params'
import { useAppSelector } from '../redux'
import type { PayoutParams } from '../types'
import useInversify from '../use-inversify'

type Props = {}

const propertiesShortName: Record<keyof PayoutParams<string>, string> = {
  lpTokensWorthAtBuyTimeUSD: 'lpTokens_usd',
  token0EntryPriceUSD: 't0_s',
  token0EndPriceUSD: 't0_e',
  token1EntryPriceUSD: 't1_s',
  token1EndPriceUSD: 't1_e',
}

function buildFormula({
  lpTokensWorthAtBuyTimeUSD = propertiesShortName.lpTokensWorthAtBuyTimeUSD,
  token0EntryPriceUSD = propertiesShortName.token0EntryPriceUSD,
  token0EndPriceUSD = propertiesShortName.token0EndPriceUSD,
  token1EntryPriceUSD = propertiesShortName.token1EntryPriceUSD,
  token1EndPriceUSD = propertiesShortName.token1EndPriceUSD,
}: Partial<PayoutParams<number | string>>) {
  return `${lpTokensWorthAtBuyTimeUSD}*${token0EntryPriceUSD}*${token0EndPriceUSD}*${token1EntryPriceUSD}*${token1EndPriceUSD}`
}

export const PayoutFormula: FC<Props> = () => {
  const { ilContractsInversifyService, tokenUSDC } = useInversify()

  const currentMaxIlRatio = useAppSelector(state => state.state.currentMaxIlRatio)
  const overrides = useAppSelector(state => state.state.overrides)
  const isDebugMode = useAppSelector(state => state.state.isDebugMode)

  const formula = buildFormula({})

  const result = usePromise(async () => {
    if (currentMaxIlRatio.status !== 'resolved') {
      return
    }
    const request = convertPayoutParams({
      from: 'number',
      to: 'BigNumber',
      values: overrides,
    })
    // 4 decimals
    const il = await ilContractsInversifyService.controller.calculateIL(
      request.token0EntryPriceUSD,
      request.token1EntryPriceUSD,
      request.token0EndPriceUSD,
      request.token1EndPriceUSD,
    )
    const ilRatio = toNumber(BigNumber.from(il), 4)
    const min = Math.min(currentMaxIlRatio.data, ilRatio)
    const payoutUsdc = await ilContractsInversifyService.controller.calcAmountToBePaid(
      request.lpTokensWorthAtBuyTimeUSD,
      request.token0EntryPriceUSD,
      request.token1EntryPriceUSD,
      request.token0EndPriceUSD,
      request.token1EndPriceUSD,
    )
    const payoutUsdcAsNumber = tokenUSDC.toNumber(payoutUsdc)
    if (isDebugMode) {
      console.log(`call:`, {
        request: { ...overrides, il: min },
        result: payoutUsdcAsNumber,
      })
    }
    return { ilRatio, payoutUsdc: payoutUsdcAsNumber }
  }, [currentMaxIlRatio, overrides, ilContractsInversifyService, tokenUSDC, isDebugMode])

  if (result[0] == undefined) {
    return (
      <div>
        <Equation value={`Payout_usd = (Calculating)`} errorHandler={defaultErrorHandler} />
      </div>
    )
  }

  return (
    <div>
      <Equation value={`Payout_usd = ${result[0].payoutUsdc}_usdc`} errorHandler={defaultErrorHandler} />
    </div>
  )
}
