import type { FC } from 'react'
import { useCallback, useEffect } from 'react'
import { useState } from 'react'
import classNames from 'classnames'
import Button from '../../../Button/Button'
import PoolPair from '../../../PoolPair/PoolPair'
import Spinner from '../../../Spinner/Spinner'
import { useAppDispatch } from 'beta-cvi-ui/src/redux/hooks'
import { FullTableSizeTr } from 'beta-cvi-ui/src/components/FullTableSizeTr/FullTableSizeTr'
import { actions } from 'beta-cvi-ui/src/redux'
import { useWallet } from 'beta-cvi-ui/src/hooks/useWallet'
import type { ArmadilloSupportedPair, State } from '@coti-cvi/lw-sdk'
import { catDecimalsBase } from '@coti-cvi/lw-sdk'
import { GetSvg } from 'beta-cvi-ui/src/utils/GetSvg'
import ReactTooltip from 'react-tooltip'
import { useLocalStorage } from 'beta-cvi-ui/src/hooks/use-local-storage-state'
import { useShowRestrictRegionModal } from 'beta-cvi-ui/src/hooks/use-show-restrict-region-modal'
import { useAddress } from '../../../../hooks/use-address'

type Props = {
  pair: ArmadilloSupportedPair
  tvlInAllDexesUSD?: State<number>
  worstIlPercentage: State<number>
}

const SupportPairTableRow: FC<Props> = ({ pair, tvlInAllDexesUSD, worstIlPercentage }) => {
  const dispatch = useAppDispatch()
  const { globalEventsInversifyService } = useWallet()

  const [openBuyProtection, setOpenBuyProtection] = useState(false)
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const connectifNotRestrict = useShowRestrictRegionModal()
  const [showCviIntroModal] = useLocalStorage('showCviIntroModal')
  const { address } = useAddress()

  const onConnect = () => {
    if (connectifNotRestrict) {
      dispatch(actions.setShowRestrictModal(true))
      return
    }

    if (showCviIntroModal) {
      dispatch(actions.setShowCviIntroModal(true))
      return
    }

    if (!address) {
      dispatch(actions.setConnectWalletModal({ modalIsOpen: true }))
      setOpenBuyProtection(true)
    }
  }

  useEffect(() => {
    if (globalEventsInversifyService && tvlInAllDexesUSD?.status === 'rejected') {
      if (tvlInAllDexesUSD?.error) {
        globalEventsInversifyService.eventEmitter.emit('errors', tvlInAllDexesUSD.error)
      }
    }
  }, [globalEventsInversifyService, tvlInAllDexesUSD])

  useEffect(() => {
    if (globalEventsInversifyService && worstIlPercentage?.status === 'rejected') {
      if (worstIlPercentage?.error) {
        globalEventsInversifyService.eventEmitter.emit('errors', worstIlPercentage.error)
      }
    }
  }, [globalEventsInversifyService, worstIlPercentage])

  const onBuyProtection = useCallback(() => {
    dispatch(
      actions.setAvailablePairSelectedProtection({
        modalIsOpen: true,
        pair,
      }),
    )
  }, [dispatch, pair])

  useEffect(() => {
    if (openBuyProtection === true && address) {
      onBuyProtection()
      setOpenBuyProtection(false)
    }
  }, [address, onBuyProtection, openBuyProtection])

  const getTd = (type: 'pair' | 'il' | 'your_liquidity' | 'button') => {
    switch (type) {
      case 'pair': {
        return <PoolPair tokenName1={pair.tokenName1} tokenName2={pair.tokenName2} />
      }

      case 'il': {
        if (worstIlPercentage.data === undefined) {
          if (worstIlPercentage.status === 'rejected') {
            return (
              <span className="flex flex-row gap-1 items-center">
                N/A
                <span className="flex items-center" data-tip data-for="NAiLTip">
                  <GetSvg svgName="tooltipArmadillo" className=" cursor-pointer" />
                </span>
                <ReactTooltip
                  id="NAiLTip"
                  place="bottom"
                  effect="solid"
                  data-html={true}
                  insecure={true}
                  multiline={true}
                  className="default-react-tooltip-style "
                  delayHide={0}
                >
                  Currently we are unable to view your defi liquidity providing
                </ReactTooltip>
              </span>
            )
          }
          return <Spinner className="w-3 h-3 border" />
        } else {
          return (
            <span className="text-common-xsGray font-bold">{`${catDecimalsBase(worstIlPercentage.data, 2)}%`}</span>
          )
        }
      }
      case 'your_liquidity': {
        if (tvlInAllDexesUSD) {
          if (tvlInAllDexesUSD.data === undefined) {
            if (tvlInAllDexesUSD.status === 'rejected') {
              return (
                <span className="flex flex-row gap-1 items-center">
                  N/A
                  <span className="flex items-center" data-tip data-for="NAyourLiquidityTip">
                    <GetSvg svgName="tooltipArmadillo" className=" cursor-pointer" />
                  </span>
                  <ReactTooltip
                    id="NAyourLiquidityTip"
                    place="bottom"
                    effect="solid"
                    data-html={true}
                    insecure={true}
                    multiline={true}
                    className="default-react-tooltip-style "
                    delayHide={0}
                  >
                    Currently we are unable to calculate IL
                  </ReactTooltip>
                </span>
              )
            }
            return <Spinner className="w-3 h-3 border" />
          } else {
            return (
              <span className="font-bold">
                <b>$</b>
                {tvlInAllDexesUSD.data?.toLocaleString('en-US', { maximumFractionDigits: 2 })}
              </span>
            )
          }
        } else {
          return <span>-</span>
        }
      }
      case 'button': {
        return address ? (
          <Button
            type="submit"
            title="Buy protection"
            className={classNames({
              'h-10  w-38 text-sm  font-normal normal-case': true,
              'rounded-lg': true,
            })}
            onClick={onBuyProtection}
          />
        ) : (
          <Button
            type="connect"
            title="Buy protection"
            className={classNames({
              'h-10  w-38 text-sm  font-normal normal-case': true,
              'rounded-lg': true,
            })}
            disabled={!globalEventsInversifyService}
            onClick={() => onConnect()}
          />
        )
      }
    }
  }

  return (
    <>
      <tr
        className={classNames({
          'hover:bg-dark-100': true,
          'odd:bg-dark-250': true,
        })}
      >
        <th scope="row" className="pl-4 py-4 font-medium whitespace-wrap ">
          {getTd('pair')}
        </th>

        <td className="py-4 pr-16 hidden sm:table-cell">{getTd('il')}</td>
        <td className="py-4 hidden md:table-cell">{getTd('your_liquidity')}</td>

        <td className="py-4 pr-4 text-right hidden sm:table-cell">{getTd('button')}</td>
        <td className="pr-8 md:hidden" onClick={() => setIsOpen(prev => !prev)}>
          <GetSvg
            svgName="chevron"
            className={classNames({
              'block ml-auto transition duration-200': true,
              'rotate-180': isOpen,
            })}
          />
        </td>
      </tr>

      {/* isOpen - used for small screens */}
      {isOpen && (
        <>
          <FullTableSizeTr className="bg-custom-400 flex min-h-full ">
            <div className="w-full  px-4 pb-6 flex flex-col flex-wrap ">
              <div className="flex flex-col mt-4 lg:w-auto w-full md:w-1/4 sm:hidden">
                <span className="flex flex-row gap-1 mr-1 text-white text-opacity-50 ">
                  IL
                  <span className="flex items-center" data-tip data-for="ilProtectionTabletMobileTip">
                    <GetSvg svgName="tooltipArmadillo" className=" cursor-pointer" />
                  </span>
                  <ReactTooltip
                    id="ilProtectionTabletMobileTip"
                    place="bottom"
                    effect="solid"
                    data-html={true}
                    insecure={true}
                    multiline={true}
                    className="default-react-tooltip-style "
                    delayHide={0}
                  >
                    The maximum impermanent loss that had occurred in a span of 60 days during the last 18 months
                  </ReactTooltip>
                </span>
                {getTd('il')}
              </div>

              <div className="flex flex-col mt-4 md:hidden lg:flex lg:w-auto  ">
                <span className="flex flex-row gap-1 mr-1 text-white text-opacity-50 ">
                  Your liquidity
                  <span className="flex items-center" data-tip data-for="YourLiquidityTabletMobileTip">
                    <GetSvg svgName="tooltipArmadillo" className=" cursor-pointer" />
                  </span>
                  <ReactTooltip
                    id="YourLiquidityTabletMobileTip"
                    place="bottom"
                    effect="solid"
                    data-html={true}
                    insecure={true}
                    multiline={true}
                    className="default-react-tooltip-style "
                    delayHide={0}
                  >
                    Currently we are unable to view your defi liquidity providing
                  </ReactTooltip>
                </span>
                {getTd('your_liquidity')}
              </div>
              <div className=" mt-4  sm:hidden  ">{getTd('button')}</div>
            </div>
          </FullTableSizeTr>
        </>
      )}
    </>
  )
}

export default SupportPairTableRow
