import type { State, TokenName } from '@coti-cvi/lw-sdk'
import { catDecimalsNoRoundUp } from '@coti-cvi/lw-sdk'
import cn from 'classnames'
import type { FC } from 'react'
import Spinner from '../Spinner/Spinner'
import millifyNumber from 'millify'
import type { MillifyOptions } from 'millify/dist/options'

type Props = {
  state?: State<number | undefined> | State<number | false> | number | '-'
  type?: string
  tokenNameClassName?: string
  customDecimal?: number | undefined
  customTooltipDecimal?: number | undefined
  tokenNumberClassName?: string
  className?: string
  millify?: boolean | Partial<MillifyOptions>
  withTooltip?: boolean
  hideDecimals?: boolean
  moreInfoInBrackets?: string | number | false | JSX.Element
  useNumberGrouping?: boolean
  minimizeLessThan0_000001?: boolean
  addPositiveNegativeSymbol?: boolean
} & ({ tokenName?: TokenName | string } | { dollar: true } | { percentage?: true })

const DisplayNumber: FC<Props> = ({
  customDecimal,
  type,
  customTooltipDecimal,
  state,
  tokenNameClassName,
  tokenNumberClassName,
  className,
  withTooltip,
  hideDecimals,
  millify,
  moreInfoInBrackets,
  useNumberGrouping,
  minimizeLessThan0_000001,
  addPositiveNegativeSymbol,
  ...props
}) => {
  if (state === '-') {
    return <div>--</div>
  }
  const number = typeof state === 'number' ? state : state?.data

  if (number === undefined || number === false) {
    return (
      <span
        className={cn({
          [tokenNumberClassName ?? '']: !!tokenNumberClassName,
          [className ?? '']: !!className,
          'flex flex-row gap-1 items-center': true,
        })}
      >
        <Spinner className="w-3 h-3 border-2 border-solid" />
        <b className={cn({ [tokenNameClassName ?? '']: !!tokenNameClassName })}>
          {'tokenName' in props && props.tokenName}
        </b>
      </span>
    )
  }

  if (typeof state !== 'number' && state?.status === 'rejected') {
    return <span>N/A</span>
  }

  const numberToString = (
    decimals: number,
    overrides?: { millify?: boolean | Partial<MillifyOptions>; useGrouping?: boolean },
  ): string => {
    let num = 0
    if (minimizeLessThan0_000001 && number < 0.000001) {
      return ' ~0.000001'
    }
    num = catDecimalsNoRoundUp(number, hideDecimals ? 0 : decimals)

    if (overrides?.useGrouping) {
      return Number(num).toLocaleString('en-US', { maximumFractionDigits: decimals })
    }

    const millified =
      overrides?.millify ?? ((type === 'tvl' && millify && num >= 10000) || (millify && num >= 1000000))
        ? millifyNumber(num, typeof millify === 'boolean' ? undefined : millify)
        : type === 'tvl' && typeof number === 'number'
        ? catDecimalsNoRoundUp(number, 2)
        : Number(num).toLocaleString('en-US', { maximumFractionDigits: decimals })

    const dollar = 'dollar' in props ? `$${millified}` : 'percentage' in props ? `${millified}%` : millified.toString()
    return addPositiveNegativeSymbol ? `${number > 0 ? '+' : ''}${dollar}` : dollar
  }

  const defaultDecimals = typeof number === 'number' ? (-10 < number && number < 10 ? 6 : 2) : 0

  return (
    <span
      className={cn({
        [tokenNumberClassName ?? '']: !!tokenNumberClassName,
        [className ?? '']: !!className,
        'flex flex-row gap-1': true,
      })}
    >
      <span
        data-tooltip={
          withTooltip
            ? numberToString(customTooltipDecimal !== undefined ? customTooltipDecimal : defaultDecimals, {
                millify: false,
                useGrouping: true,
              })
            : null
        }
      >
        {numberToString(customDecimal !== undefined ? customDecimal : defaultDecimals, {
          useGrouping: useNumberGrouping,
        }) === '0' && 'percentage' in props
          ? `${numberToString(customDecimal !== undefined ? customDecimal : defaultDecimals, {
              useGrouping: useNumberGrouping,
            })}%`
          : numberToString(customDecimal !== undefined ? customDecimal : defaultDecimals, {
              useGrouping: useNumberGrouping,
            })}
      </span>
      {'tokenName' in props && (
        <b className={cn({ [tokenNameClassName ?? '']: !!tokenNameClassName })}>
          {'tokenName' in props ? props.tokenName : ''}
        </b>
      )}
      {moreInfoInBrackets !== undefined && <span className="inline-flex">({moreInfoInBrackets})</span>}
    </span>
  )
}

export default DisplayNumber
