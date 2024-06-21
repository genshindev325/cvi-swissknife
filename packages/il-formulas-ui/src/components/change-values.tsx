import type { FC } from 'react'
import { useEffect, useState } from 'react'
import type { PremiumValues } from '@coti-cvi/lw-sdk'
import { isNumeric, safeObjectEntries } from '@coti-cvi/lw-sdk'
import { convertPremiumValues } from '../convert-premium-values'
import { getPRemiumFormulaPropertyDisplayName } from '../utils'
import { actions, useAppDispatch, useAppSelector } from '../redux'
import useInversify from '../hooks/use-inversify'

type Props = {
  initialInputs: PremiumValues<string>
}

export const ChangeValues: FC<Props> = ({ initialInputs }) => {
  const dispatch = useAppDispatch()
  const { tokenUSDC } = useInversify()
  const contractPremiumValuesWithoutParams = useAppSelector(state => state.state.contractPremiumValuesWithoutParams)
  const selectedPairAndPeriod = useAppSelector(state => state.state.selectedPairAndPeriod)

  const [inputs, setInputs] = useState(initialInputs)

  useEffect(() => {
    setInputs(prev =>
      contractPremiumValuesWithoutParams && selectedPairAndPeriod && tokenUSDC
        ? convertPremiumValues({
            from: 'number',
            to: 'string',
            tokenUSDC,
            values: { ...contractPremiumValuesWithoutParams, premiumParams: selectedPairAndPeriod.premiumParams },
          })
        : prev,
    )
  }, [contractPremiumValuesWithoutParams, tokenUSDC, selectedPairAndPeriod])

  useEffect(() => {
    if (
      !tokenUSDC ||
      !isNumeric(inputs.lpTokensWorthAtBuyTimeUsdc) ||
      !isNumeric(inputs.expectedLPTokensValueGrowth) ||
      !isNumeric(inputs.totalLPTokensWorthAtBuyTimeUsdc) ||
      !isNumeric(inputs.cvi) ||
      !isNumeric(inputs.liquidityUsdc) ||
      !isNumeric(inputs.maxILProtectedPercentage) ||
      !isNumeric(inputs.premiumParams.A) ||
      !isNumeric(inputs.premiumParams.X0) ||
      !isNumeric(inputs.premiumParams.C)
    ) {
      return
    }
    const inputsAsNumbers = convertPremiumValues({
      from: 'string',
      to: 'number',
      tokenUSDC,
      values: inputs,
    })
    dispatch(actions.setOverridenValues(inputsAsNumbers))
  }, [dispatch, inputs, tokenUSDC])

  return (
    <div>
      {safeObjectEntries({ ...inputs, premiumParams: undefined }).flatMap(([key, value]) =>
        key === 'premiumParams'
          ? []
          : [
              <div key={key}>
                <div>{getPRemiumFormulaPropertyDisplayName(key)}:</div>
                <div>
                  <input
                    type="text"
                    value={value}
                    style={{
                      width: '130px',
                    }}
                    onChange={e => setInputs(prev => (prev ? { ...prev, [key]: e.target.value } : prev))}
                  />
                </div>
              </div>,
            ],
      )}
      {safeObjectEntries(inputs.premiumParams).map(([key, value]) => (
        <div key={key}>
          <div>{key}</div>
          <div>
            <input
              type="text"
              value={value}
              style={{
                width: '130px',
              }}
              onChange={e =>
                setInputs(prev =>
                  prev ? { ...prev, premiumParams: { ...prev.premiumParams, [key]: e.target.value } } : prev,
                )
              }
            />
          </div>
        </div>
      ))}
    </div>
  )
}
