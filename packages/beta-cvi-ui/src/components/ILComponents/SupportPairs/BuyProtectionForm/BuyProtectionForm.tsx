/* eslint-disable no-console */
import type { RequestStatus, State } from '@coti-cvi/lw-sdk'
import { catDecimalsNoRoundUp } from '@coti-cvi/lw-sdk'
import { Stator, CHAIN_IDS_INFO, CustomError, TokenName } from '@coti-cvi/lw-sdk'
import classNames from 'classnames'
import { BigNumber } from 'ethers'
import type { FC } from 'react'
import { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import usePromise from 'react-use-promise'
import useUsdcBalance from '../../../../hooks/useUsdcBalance'
import { useEventEmitter } from '../../../../hooks/useEventEmitter'
import { useILChainId } from '../../../../hooks/useILChainId'
import { useWallet } from '../../../../hooks/useWallet'
import type { RadioGroupSelectOption } from '../../../../types/common.types'
import { displayNotification } from '../../../../utils/utilities'
import Button from '../../../Button/Button'
import DisplayNumber from '../../../DisplayNumber/DisplayNumber'
import InputAmount from '../../../InputAmount/InputAmount'
import PoolPair from '../../../PoolPair/PoolPair'
import RadioGroupSelect from '../../../RadioGroupSelect/RadioGroupSelect'
import Spinner from '../../../Spinner/Spinner'
import { useAppDispatch, useAppSelector } from 'beta-cvi-ui/src/redux/hooks'
import { actions } from '../../../../redux/store'
import sum from 'lodash/sum'

import { Link } from 'react-router-dom'
import { useLog } from '../../../../hooks/useLog'
import { GetSvg } from 'beta-cvi-ui/src/utils/GetSvg'
import ReactTooltip from 'react-tooltip'
import { useAddress } from '../../../../hooks/use-address'

type Props = {
  setShowBuyProtectionModal?: React.Dispatch<React.SetStateAction<boolean | undefined>>
  setIsScroll?: React.Dispatch<React.SetStateAction<boolean | undefined>>
}
const BuyProtectionForm: FC<Props> = ({ setShowBuyProtectionModal, setIsScroll }) => {
  const isEmbedDiscountFeatureEnabled = useAppSelector(state => state.state.armadillo.isEmbedDiscountFeatureEnabled)
  const embedDiscountInfo = useAppSelector(state => state.state.armadillo.embedDiscountInfo)
  const dispatch = useAppDispatch()
  const [acceptTermsAndConditions, setAcceptTermsAndConditions] = useState(false)
  const availablePairSelectedProtection = useAppSelector(state => state.state.availablePairSelectedProtection.pair)
  const liquiditiesFromZapper = useAppSelector(state => state.state.liquiditiesFromZapper)
  const periodsSeconds = useAppSelector(state => state.state.periodsSeconds)
  const addressCurrentBalance = useUsdcBalance()
  const { inversifyContainer } = useWallet()
  const chainId = useILChainId()
  const [periodSeconds, setPeriodSeconds] = useState<number>()
  const selectedPeriodSeconds = periodSeconds ?? Stator.map(periodsSeconds, p => p[0]).data?.periodSeconds
  const [coveredAmount, setCoveredAmount] = useState<number | undefined>()
  const [submitStatus, setSubmitStatus] = useState<RequestStatus>('resolved')
  const log = useLog()
  const { address } = useAddress()

  const tvlInAllDexesUSD = Stator.map(
    liquiditiesFromZapper,
    data =>
      availablePairSelectedProtection &&
      sum(
        data.lpTokensInfo
          .filter(
            d =>
              (d.symbol0.ArmadilloSupportedTokenName === availablePairSelectedProtection.tokenName1 &&
                d.symbol1.ArmadilloSupportedTokenName === availablePairSelectedProtection.tokenName2) ||
              (d.symbol1.ArmadilloSupportedTokenName === availablePairSelectedProtection.tokenName1 &&
                d.symbol0.ArmadilloSupportedTokenName === availablePairSelectedProtection.tokenName2),
          )
          .map(d => d.balanceUSDTotal),
      ),
  )

  const [ilProtectionInversifyService] = usePromise(
    async () =>
      inversifyContainer?.getByBlockchain(CHAIN_IDS_INFO[chainId].blockchainName, 'ILProtectionInversifyService'),
    [inversifyContainer, chainId],
  )

  const getLeftTvpEventEmitterCallback = useCallback(
    () =>
      availablePairSelectedProtection &&
      ilProtectionInversifyService?.getLeftTvpUsdcAvailableEventEmitter(availablePairSelectedProtection),
    [availablePairSelectedProtection, ilProtectionInversifyService],
  )

  const leftTvpUsdcAvailableState = useEventEmitter({
    getEventEmitter: getLeftTvpEventEmitterCallback,
    subscribeTo: 'leftTvpUsdcAvailable',
  })

  const [globalEventsInversifyService] = usePromise(
    async () => inversifyContainer?.getAsync('GlobalEventsInversifyService'),
    [inversifyContainer],
  )

  const [premiumState, setPremiumState] = useState<
    State<{
      originalPremiumUsdc: number
      originalFeeUsdc: number
      discountUsdc: number
      duePaymentUsdc: number
      maxAmountToBePaidUsdc: number
      premium: BigNumber // do not use
      fee: BigNumber // do not use
      maxAmountToBePaid: BigNumber // do not use
    }>
  >(Stator.pending())

  useEffect(() => {
    setPremiumState(Stator.pending())
  }, [coveredAmount, selectedPeriodSeconds])

  const latestInputValueRequest = useRef<number | undefined>(undefined)

  useEffect(() => {
    async function get() {
      latestInputValueRequest.current = Number(coveredAmount)
      if (coveredAmount === undefined || Number(coveredAmount) === 0) {
        setPremiumState(
          Stator.resolve({
            originalPremiumUsdc: 0,
            originalFeeUsdc: 0,
            discountUsdc: 0,
            duePaymentUsdc: 0,
            maxAmountToBePaidUsdc: 0,
            fee: BigNumber.from(0),
            maxAmountToBePaid: BigNumber.from(0),
            premium: BigNumber.from(0),
          }),
        )

        return
      }
      if (
        address &&
        selectedPeriodSeconds !== undefined &&
        availablePairSelectedProtection &&
        ilProtectionInversifyService
      ) {
        if (latestInputValueRequest.current === Number(coveredAmount)) {
          setPremiumState(prev => Stator.pending(prev))
        }
        try {
          const data = await ilProtectionInversifyService.calculatePremiumUsdc({
            pair: availablePairSelectedProtection,
            lpTokensWorthAtBuyTimeUSD: ilProtectionInversifyService.tokenUSDC.fromNumber(Number(coveredAmount)),
            policyPeriod: selectedPeriodSeconds,
            address,
          })

          if (latestInputValueRequest.current === Number(coveredAmount)) {
            setPremiumState(Stator.resolve(data))
          }
        } catch (error) {
          if (latestInputValueRequest.current === Number(coveredAmount)) {
            setPremiumState(prev => Stator.reject(prev, error))
          }
        }
      }
    }

    get()
  }, [address, availablePairSelectedProtection, coveredAmount, ilProtectionInversifyService, selectedPeriodSeconds])

  const convertMaxSlippage = () => {
    if (premiumState.status === 'resolved' && premiumState.data.premium) {
      const humanNum = ilProtectionInversifyService?.tokenUSDC.toNumber(premiumState.data.premium)
      if (humanNum) {
        const final = (humanNum * (100 + 0.1)) / 100
        return ilProtectionInversifyService?.tokenUSDC.fromNumber(final)
      }
    }
  }

  const canSubmit =
    selectedPeriodSeconds &&
    Number(coveredAmount) > 0 &&
    ilProtectionInversifyService &&
    availablePairSelectedProtection &&
    (addressCurrentBalance.status === 'resolved' || addressCurrentBalance.status === 'pending') &&
    (premiumState.status === 'resolved' || premiumState.status === 'pending') &&
    addressCurrentBalance.data &&
    premiumState.data &&
    addressCurrentBalance.data.balance.gte(premiumState.data.premium)

  const onSubmit = async () => {
    if (canSubmit) {
      try {
        setSubmitStatus('pending')

        await ilProtectionInversifyService.buyProtection({
          pair: availablePairSelectedProtection,
          amountUSD: Number(coveredAmount),
          periodSeconds: selectedPeriodSeconds,
          maxPremiumCostUsdc: convertMaxSlippage() ?? premiumState.data.premium,
        })

        log('New Protection Bought')

        setIsScroll?.(true)
      } catch (error) {
        if (
          error instanceof CustomError &&
          error.causeOfError.message !== undefined &&
          error.causeOfError.message.includes('User denied transaction signature')
        ) {
          displayNotification({
            id: 'buyProtection',
            type: 'danger',
            message: 'Transaction rejected by the user',
          })
        } else if (
          error instanceof CustomError &&
          error.extras?.reason !== undefined &&
          error.extras?.reason.includes('Max premium cost exceeded')
        ) {
          dispatch(actions.setShowSlipageNoticeModal(true))
          displayNotification({
            id: 'buyProtection',
            type: 'danger',
            message: 'Failed to buy protection Due to low slippage',
          })
        }
        displayNotification({
          id: 'buyProtection',
          type: 'danger',
          message: 'Failed to buy protection ',
        })

        globalEventsInversifyService?.eventEmitter.emit('errors', error)
      } finally {
        setSubmitStatus('resolved')
        dispatch(actions.setAvailablePairSelectedProtection({ modalIsOpen: false }))
        if (isEmbedDiscountFeatureEnabled && embedDiscountInfo !== undefined && embedDiscountInfo.isUsed === false) {
          dispatch(
            actions.setEmbedDiscountInfo({
              discountTypeId: embedDiscountInfo.discountTypeId,
              discountTypeName: embedDiscountInfo.discountTypeName,
              isUsed: true,
            }),
          )
        }
      }
    }
  }

  const maxErrors = useMemo(
    () => [
      {
        value:
          leftTvpUsdcAvailableState.leftTvpUsdcAvailable.data &&
          ilProtectionInversifyService?.tokenUSDC.toNumber(leftTvpUsdcAvailableState.leftTvpUsdcAvailable.data),
        errorMessage: ilProtectionInversifyService && (
          <span className="text-common-lightRed text-xs">
            There is not enough liquidity to cover a protection of more than{' '}
            <DisplayNumber
              dollar={true}
              state={Stator.map(leftTvpUsdcAvailableState.leftTvpUsdcAvailable, bn => {
                const newBn = ilProtectionInversifyService.tokenUSDC.toNumber(bn)
                return Number(newBn.toFixed(0))
              })}
            />
          </span>
        ),
      },
      {
        value: addressCurrentBalance.data?.asNumber,
        errorMessage: <span className="text-common-lightRed text-xs">Not enough balance</span>,
      },
    ],
    [
      addressCurrentBalance.data?.asNumber,
      ilProtectionInversifyService,
      leftTvpUsdcAvailableState.leftTvpUsdcAvailable,
    ],
  )

  const notEnoughBalanceClasses = {
    'text-common-lightRed': Boolean(
      addressCurrentBalance.data && premiumState.data?.premium.gt(addressCurrentBalance.data.balance),
    ),
  }

  const checkIsInsufficientBalance = useCallback(
    () =>
      addressCurrentBalance.data?.asNumber !== undefined &&
      coveredAmount !== undefined &&
      coveredAmount > addressCurrentBalance.data?.asNumber,
    [coveredAmount, addressCurrentBalance.data?.asNumber],
  )

  const premiumFeeTooltipDescription = () => {
    return (
      <ReactTooltip
        id="buyProtectionTip"
        place="top"
        effect="solid"
        data-html={true}
        insecure={true}
        multiline={true}
        className="default-react-tooltip-style "
        delayHide={0}
      >
        <span className="flex flex-col gap-2 py-2 text-sm ">
          <span className="flex flex-row justify-between ">
            <>Protection cost:</>
            <DisplayNumber
              state={Stator.map(premiumState, data => data.originalPremiumUsdc)}
              tokenName={TokenName.USDC}
            />
          </span>
          <span className="flex flex-row justify-between">
            <>Platform fee:</>{' '}
            <DisplayNumber state={Stator.map(premiumState, data => data.originalFeeUsdc)} tokenName={TokenName.USDC} />
          </span>
          {isEmbedDiscountFeatureEnabled && embedDiscountInfo && !embedDiscountInfo.isUsed && (
            <span className="flex flex-row justify-between">
              <>{embedDiscountInfo?.discountTypeName} discount:</>{' '}
              <span className="flex flex-row ">
                -
                <DisplayNumber state={Stator.map(premiumState, data => data.discountUsdc)} tokenName={TokenName.USDC} />
              </span>
            </span>
          )}
          <hr className="border border-dark-300 " />
          <span className="flex flex-row justify-between">
            <>Premium:</>{' '}
            <DisplayNumber state={Stator.map(premiumState, data => data.duePaymentUsdc)} tokenName={TokenName.USDC} />
          </span>
        </span>
      </ReactTooltip>
    )
  }
  const InputdefaultValue = () => {
    const val = tvlInAllDexesUSD.data !== undefined ? catDecimalsNoRoundUp(tvlInAllDexesUSD.data, 2) : 0
    // const val = tvlInAllDexesUSD.data?.toLocaleString('en-US', {
    //   maximumFractionDigits: 2,
    // })
    return val === undefined || val === 0 ? undefined : val
  }

  return (
    <div
      className={classNames({
        'flex flex-col mt-7  min-w-full text-lg': true,
      })}
    >
      {periodsSeconds.data?.length === 0 || !availablePairSelectedProtection ? (
        <Spinner />
      ) : (
        <div>
          <span
            className={classNames({
              'flex flex-col gap-4 justify-evenly overflow-y-auto xl:overflow-hidden  w-full xl:h-full': true,
            })}
          >
            <PoolPair
              protection={tvlInAllDexesUSD.data}
              tokenName1={availablePairSelectedProtection.tokenName1}
              tokenName2={availablePairSelectedProtection.tokenName2}
              className="flex "
              type="modal"
            />
            <div className="flex flex-col gap-6">
              <InputAmount
                typeOfBalance={TokenName.USDC}
                userBalance={Stator.map(addressCurrentBalance, d => d.asNumber)}
                customDecimalUserBalance={2}
                fromWhereThisPageInput="mint"
                customTitle="Protected Amount"
                type={TokenName.USDC}
                defaultValue={InputdefaultValue()}
                value={coveredAmount}
                setValue={setCoveredAmount}
                autoFocus
                fractionDigits={2}
                maxValues={maxErrors}
                className={classNames({
                  'outline outline-2 outline-common-lightRed': checkIsInsufficientBalance(),
                  'opacity-70 pointer-events-none': !address,
                })}
              />

              <RadioGroupSelect
                title="Protection Period"
                options={
                  periodsSeconds.data?.map(
                    (p): RadioGroupSelectOption => ({
                      key: p.periodSeconds.toString(),
                      valueToString: p.periodSecondsFormat,
                    }),
                  ) ?? []
                }
                selectedKey={selectedPeriodSeconds?.toString()}
                setSelectedValue={v => setPeriodSeconds(Number(v))}
              />
              <div className="flex flex-col gap-2">
                <span className="flex flex-row justify-between text-center ">
                  <span className="flex items-center gap-1">
                    Premium{' '}
                    <span className="flex items-center" data-tip data-for="buyProtectionTip">
                      <GetSvg svgName="tooltipArmadillo" className=" cursor-pointer" />
                    </span>{' '}
                    {premiumFeeTooltipDescription()}
                  </span>{' '}
                  <DisplayNumber
                    state={Stator.map(premiumState, data => data.duePaymentUsdc)}
                    tokenName={TokenName.USDC}
                    className={classNames(notEnoughBalanceClasses)}
                    withTooltip
                  />
                </span>
                <span className="flex flex-col gap-2 sm:gap-0 sm:flex-row items-center justify-between">
                  <span className="flex flex-row  mr-auto sm:items-center ">
                    <span className={classNames({ ...notEnoughBalanceClasses, 'text-xs mr-1': true })}>
                      Your available balance:
                    </span>
                    <DisplayNumber
                      state={Stator.map(addressCurrentBalance, d => d.asNumber)}
                      tokenName={addressCurrentBalance.data?.tokenName}
                      className={classNames({ 'font-bold text-xs': true, ...notEnoughBalanceClasses })}
                      tokenNameClassName="text-xs ml-1"
                      withTooltip
                    />
                  </span>

                  {isEmbedDiscountFeatureEnabled && embedDiscountInfo && !embedDiscountInfo.isUsed && (
                    <span className="text-xs w-full sm:w-fit flex justify-center border border-common-turquoise bg-common-turquoise bg-opacity-20 rounded-2xl py-1.5 px-7">
                      <span className="flex flex-row  gap-1 ">
                        <GetSvg svgName={'success'} className="w-4 h-4 relative" />
                        <span className="capitalize">{embedDiscountInfo?.discountTypeName}</span>Discount
                      </span>
                    </span>
                  )}
                </span>
                <span
                  onClick={() => setAcceptTermsAndConditions(prev => !prev)}
                  className="flex flex-row gap-1 text-sm items-center"
                >
                  <GetSvg
                    className=" text-common-turquoise cursor-pointer"
                    svgName={acceptTermsAndConditions ? 'selectedCheckbox' : 'checkbox'}
                  />

                  <label>
                    I accept armadillo.is{' '}
                    <Link className=" text-common-turquoise font-bold" to="/terms" target="_blank">
                      Terms of Use
                    </Link>
                  </label>
                </span>
                <span
                  className={classNames({
                    'flex flex-row gap-4 justify-center items-center w-full mt-6': true,
                  })}
                >
                  {setShowBuyProtectionModal && (
                    <span className="w-3/6 ">
                      <Button
                        type="common"
                        title="cancel"
                        onClick={() => setShowBuyProtectionModal(false)}
                        className="border"
                      />
                    </span>
                  )}
                  <span className="w-3/6 ">
                    <Button
                      status={submitStatus}
                      disabled={!canSubmit || !acceptTermsAndConditions}
                      type="submit"
                      title={coveredAmount === undefined || Number(coveredAmount) === 0 ? 'Enter amount' : 'confirm'}
                      onClick={onSubmit}
                    />
                  </span>
                </span>
              </div>
            </div>
          </span>
        </div>
      )}
    </div>
  )
}

export default BuyProtectionForm
