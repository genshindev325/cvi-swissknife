import type { FC } from 'react'
import { useEffect, useState } from 'react'
import { isNumeric, safeObjectEntries } from '@coti-cvi/lw-sdk'
import useInversify from '../use-inversify'
import { actions, updateAllChartsThunk, useAppDispatch, useAppSelector } from '../redux'
import { convertPayoutParams } from '../convert-payout-params'
import type { PayoutParams } from '../types'

type Props = {}

export const ChangeValues: FC<Props> = () => {
  const { ilContractsInversifyService, tokenUSDC } = useInversify()
  const dispatch = useAppDispatch()
  const isUpdatingAnyChart = useAppSelector(state =>
    state.state.charts.some(chart =>
      chart.seriesSortedByCreationDateAsc.some(serie => state.state.chartsData[serie.id]?.status === 'pending'),
    ),
  )
  const currentMaxIlRatio = useAppSelector(state => state.state.currentMaxIlRatio)
  const overrides = useAppSelector(state => state.state.overrides)

  const [inputs, setInputs] = useState<PayoutParams<string>>(
    convertPayoutParams({
      from: 'number',
      to: 'string',
      values: overrides,
    }),
  )

  useEffect(() => {
    if (
      !isNumeric(inputs.lpTokensWorthAtBuyTimeUSD) ||
      !isNumeric(inputs.token0EndPriceUSD) ||
      !isNumeric(inputs.token0EntryPriceUSD) ||
      !isNumeric(inputs.token1EndPriceUSD) ||
      !isNumeric(inputs.token1EntryPriceUSD)
    ) {
      return
    }
    const inputsAsNumbers = convertPayoutParams({
      from: 'string',
      to: 'number',
      values: inputs,
    })
    dispatch(actions.setOverrides(inputsAsNumbers))
  }, [dispatch, inputs])

  return (
    <div>
      {safeObjectEntries(inputs).flatMap(([key, value]) => [
        <div key={key}>
          <div>{key}:</div>
          <div>
            <input
              type="text"
              value={value}
              style={{
                width: '130px',
              }}
              onChange={e => setInputs(prev => ({ ...prev, [key]: e.target.value }))}
            />
          </div>
        </div>,
      ])}
      <br />
      <button
        disabled={isUpdatingAnyChart}
        onClick={() =>
          currentMaxIlRatio.status === 'resolved' &&
          dispatch(
            updateAllChartsThunk({
              ilContractsInversifyService,
              tokenUSDC: tokenUSDC,
              currentMaxIlRatio: currentMaxIlRatio.data,
            }),
          )
        }
      >
        Update Charts
      </button>
    </div>
  )
}
