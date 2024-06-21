import type { State, SupportedDecimals, TokenName } from '@coti-cvi/lw-sdk'
import { WebSite } from '@coti-cvi/lw-sdk'
import { useAddress } from 'beta-cvi-ui/src/hooks/use-address'
import { useAppSelector } from 'beta-cvi-ui/src/redux/hooks'
import classNames from 'classnames'
import type { BigNumber } from 'ethers'
import type { FC } from 'react'
import { useCallback } from 'react'
import { useEffect, useState } from 'react'
import { getInputAmount } from '../../utils/utilities'
import DisplayNumber from '../DisplayNumber/DisplayNumber'

type Props = {
  typeOfBalance?: TokenName
  userBalanceText?: string
  userBalance: State<number>
  customDecimalUserBalance: number
  fromWhereThisPageInput?: 'mint' | 'burn' | 'deposit' | 'withdraw' | 'stakeAll' | 'unstakeAll' | ''
  setIsMaxClicked?: React.Dispatch<React.SetStateAction<boolean>> | undefined
  defaultValue?: number
  autoFocus?: boolean
  value?: number
  fractionDigits: SupportedDecimals
  setValue: React.Dispatch<React.SetStateAction<number | undefined>>
  maxValues?: {
    value?: number
    errorMessage?: JSX.Element
  }[]
  maxBalance?: BigNumber | number
  maxBalanceTitle?: 'Max'
  custompPaceholder?: string
  type: TokenName | 'CVI'
  className?: string
  customTitle: string
  customTitleSize?: string
}

const InputAmount: FC<Props> = ({
  typeOfBalance,
  userBalanceText = 'Your available balance:',
  userBalance,
  customDecimalUserBalance,
  fromWhereThisPageInput,
  setIsMaxClicked,
  defaultValue = undefined,
  value,
  setValue,
  autoFocus,
  fractionDigits,
  maxValues,
  maxBalance,
  maxBalanceTitle,
  custompPaceholder,
  type,
  className,
  customTitle,
  customTitleSize,
}) => {
  const { address } = useAddress()
  const themeWeb = useAppSelector(({ state }) => state.themeWeb)
  const [valueWithCommas, setAmountWithCommas] = useState<string>('')
  const [errorMessages, setErrorMessages] = useState<JSX.Element[]>([])
  const [focus, setFocus] = useState<boolean>(false)
  const [isTouched, setIsTouched] = useState(false)
  const themeWebSite = useAppSelector(state => state.state.themeWeb)

  const checkIsInsufficientBalance = useCallback(
    () => userBalance.data !== undefined && value !== undefined && value > userBalance.data,
    [value, userBalance.data],
  )

  const onChangeAmountWithCommas = useCallback(
    (onChangeValue: string) => {
      const _onChangeValue = getInputAmount(onChangeValue, fractionDigits)

      const _valueWithoutCommas = _onChangeValue.replace(/,/g, '')

      if (Number(_valueWithoutCommas) > 100_000_000_000) {
        // it's too big anyways
        return
      }

      setAmountWithCommas(_onChangeValue)
    },
    [fractionDigits],
  )

  const onClickOnMax = () => {
    if (window.gtag && fromWhereThisPageInput !== '') {
      window.gtag('event', 'max_amount', {
        page_title: 'max_amount',
        max_amount_title: `Click on max amount on ${fromWhereThisPageInput}`,
        description: `The user clicked on max amount in ${fromWhereThisPageInput} input`,
        page_path: window.location.pathname,
      })
    }
    setIsMaxClicked?.(true)
    if (maxBalance !== undefined) {
      onChangeAmountWithCommas(maxBalance.toLocaleString('en-US', { maximumFractionDigits: 20 }))
    }
  }

  useEffect(() => {
    const _valueWithoutCommas = valueWithCommas.replace(/,/g, '')

    setValue(_valueWithoutCommas === '' ? undefined : Number(_valueWithoutCommas))
    if (maxValues) {
      const maxErrors = _valueWithoutCommas
        ? maxValues
            .filter(max => max?.value !== undefined && Number(_valueWithoutCommas) > max?.value)
            .map(r => r.errorMessage)
            .filter((m): m is JSX.Element => Boolean(m))
        : []
      setErrorMessages(maxErrors)
    }
  }, [valueWithCommas, onChangeAmountWithCommas, setValue, maxValues])

  useEffect(() => {
    if (value === undefined) {
      onChangeAmountWithCommas('')
    }
  }, [onChangeAmountWithCommas, value])

  useEffect(() => {
    if (!isTouched && defaultValue !== undefined) {
      const _value = getInputAmount(defaultValue.toString(), fractionDigits)
      setAmountWithCommas(_value)
    }
  }, [isTouched, defaultValue, fractionDigits, onChangeAmountWithCommas])

  return (
    <span className="leading-tight flex flex-col  mx-1">
      <span
        className={classNames({ 'mb-4 -mx-1 text-white capitalize': true, [customTitleSize ?? '']: !!customTitleSize })}
      >
        {customTitle}
      </span>

      <div
        className={classNames({
          'flex flex-row w-full rounded-lg outline outline-2 transition-all duration-75 overflow-hidden': true,
          'outline-none': !focus,
          'outline-common-orange': focus,
          'outline-common-turquoise': focus && !className && themeWebSite === WebSite.Armadillo,
          'outline-common-lightRed': errorMessages.length > 0,
          [className ?? '']: !!className,
        })}
      >
        <input
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          autoComplete="off"
          className={classNames({
            ' text-white h-12 px-4 shadow-sm placeholder:text-sm outline-none w-full rounded-tl-lg rounded-bl-lg': true,
            'bg-dark-300': themeWebSite === WebSite.Cvi,
            'bg-common-armadilloBg': themeWebSite === WebSite.Armadillo,
          })}
          autoFocus={autoFocus}
          placeholder={custompPaceholder ? custompPaceholder : "Enter the amount you'd like to protect"}
          value={valueWithCommas}
          name="covered-amount"
          onChange={({ target: { value } }) => {
            setIsTouched(true)
            onChangeAmountWithCommas(value)
            setIsMaxClicked?.(false)
          }}
        />
        {maxBalanceTitle && (
          <button
            className={classNames({
              'text-common-orange text-xs flex items-center px-2 cursor-pointer justify-center hover:opacity-75': true,
              'bg-dark-300': themeWebSite === WebSite.Cvi,
              'bg-common-armadilloBg': themeWebSite === WebSite.Armadillo,
            })}
            onClick={onClickOnMax}
          >
            Max
          </button>
        )}
        <span
          className={`${themeWebSite} ${classNames({
            'text-11 border-visible bg-custom-400 w-3/12  items-center flex justify-center rounded-tr-lg rounded-br-lg  outline-none':
              true,
          })}`}
        >
          {type}
        </span>
      </div>
      <div className="mt-2 flex flex-col">
        {errorMessages.map((errorMessage, i) => (0 === i ? <span key={i}>{errorMessage}</span> : null))}
      </div>
      {themeWeb === WebSite.Cvi && (
        <span
          className={classNames({
            'text-xs mr-1 flex flex-row gap-1 mt-1': true,
            'text-xs text-common-lightRed': checkIsInsufficientBalance(),
          })}
        >
          {userBalanceText}
          {!address ? (
            ''
          ) : (
            <DisplayNumber
              state={userBalance.data}
              tokenName={typeOfBalance}
              className={classNames({ 'font-bold text-xs': true })}
              tokenNameClassName="font-normal"
              millify={{
                precision: 0,
                units: ['', 'K', 'M', 'B', 'T', 'P', 'E'],
              }}
              withTooltip
              customDecimal={customDecimalUserBalance}
            />
          )}
        </span>
      )}
    </span>
  )
}

export default InputAmount
