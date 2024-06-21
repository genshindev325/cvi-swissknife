import type { FC, PropsWithChildren } from 'react'
import { useMemo } from 'react'
import { useEffect, useState } from 'react'
import CommonModal from '../../Modals/CommonModal'
import Table from '../../Table/Table'
import BuyProtectionForm from './BuyProtectionForm/BuyProtectionForm'
import usePromise from 'react-use-promise'
import type { ArmadilloSupportedPair } from '@coti-cvi/lw-sdk/src'
import { sortPairs } from '@coti-cvi/lw-sdk/src'
import { CHAIN_IDS_INFO, MODE, Stator } from '@coti-cvi/lw-sdk/src'
import SupportPairTableRow from './SupportPairsTableRow/SupportPairsTableRow'
import { useILChainId } from '../../../hooks/useILChainId'
import { useAppDispatch, useAppSelector } from 'beta-cvi-ui/src/redux/hooks'
import { useWallet } from '../../../hooks/useWallet'
import { useLocalStorage } from '../../../hooks/use-local-storage-state'
import { actions } from 'beta-cvi-ui/src/redux/store'
import sum from 'lodash/sum'
import ReactTooltip from 'react-tooltip'
import { GetSvg } from 'beta-cvi-ui/src/utils/GetSvg'
import React from 'react'
import { useAddress } from '../../../hooks/use-address'

type SupportPairsTableProps = {}

type DataPairType = {
  coinGeckoToken1Id: string
  coinGeckoToken2Id: string
  end: { dateMs: number; dateUtc: string; token1PriceUsd: number; token2PriceUsd: number }
  id: string
  start: { dateMs: number; dateUtc: string; token1PriceUsd: number; token2PriceUsd: number }
  token1Name: { ArmadilloSupportedTokenName: string }
  token2Name: { ArmadilloSupportedTokenName: string }
  worstIlPercentage: number
}

const SupportPairsTable: FC<PropsWithChildren<SupportPairsTableProps>> = () => {
  const { inversifyContainer } = useWallet()

  const { address } = useAddress()
  const pairsWorstIl = useAppSelector(state => state.state.pairsWorstIl)
  const liquiditiesFromZapper = useAppSelector(state => state.state.liquiditiesFromZapper)
  const dispatch = useAppDispatch()
  const chainId = useILChainId()
  const availablePairSelectedProtection = useAppSelector(state => state.state.availablePairSelectedProtection)

  const [fullMode] = useLocalStorage('fullMode')
  const [isScroll, setIsScroll] = useState<boolean | undefined>(false)

  const [ilProtectionInversifyService] = usePromise(
    async () =>
      inversifyContainer?.getByBlockchain(CHAIN_IDS_INFO[chainId].blockchainName, 'ILProtectionInversifyService'),
    [inversifyContainer, chainId],
  )

  const [pairs] = usePromise(async () => ilProtectionInversifyService?.getPairs(), [ilProtectionInversifyService])
  const orderedPairs = useMemo(() => pairs && sortPairs(pairs), [pairs])

  const [periods] = usePromise(
    async () => ilProtectionInversifyService?.getPeriodsSeconds(),
    [ilProtectionInversifyService],
  )

  useEffect(() => {
    if (periods) {
      if (fullMode === MODE.ON) {
        dispatch(actions.setPeriodsSeconds(Stator.resolve(periods)))
      } else {
        const filtered = periods.filter(r => r.periodSeconds >= 60 * 60 * 24 * 14)
        dispatch(actions.setPeriodsSeconds(Stator.resolve(filtered)))
      }
    }
  }, [periods, fullMode, dispatch])

  useEffect(() => {
    if (isScroll) {
      scroll({
        top: 200,
        left: 150,
        behavior: 'smooth',
      })
      setIsScroll(false)
    }
  }, [isScroll])

  return (
    <>
      <CommonModal
        showModal={availablePairSelectedProtection.modalIsOpen}
        setShowModal={() => dispatch(actions.setAvailablePairSelectedProtection({ modalIsOpen: false }))}
        title={<span>Buy protection</span>}
        type="buyProtectionModal"
      >
        <BuyProtectionForm
          setShowBuyProtectionModal={() => dispatch(actions.setAvailablePairSelectedProtection({ modalIsOpen: false }))}
          setIsScroll={setIsScroll}
        />
      </CommonModal>
      <Table
        state={orderedPairs ? Stator.resolve(orderedPairs) : Stator.pending<ArmadilloSupportedPair[]>()}
        type="supportedPairsTable"
      >
        <thead id="target" className="text-sm text-white text-opacity-50 ">
          <tr>
            <th scope="col" className="pb-3 pl-4 align-baseline">
              Pair
            </th>
            <th scope="col" className="pb-3 align-baseline whitespace-wrap pr-4  hidden sm:table-cell">
              <span className="flex flex-row gap-1 mr-1">
                Impermanent loss{' '}
                <span data-tip data-for="ImpermanentLossTip">
                  <GetSvg svgName="tooltipArmadillo" className=" cursor-pointer" />
                </span>
                <ReactTooltip
                  id="ImpermanentLossTip"
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
            </th>
            <th scope="col" className="pb-3 align-baseline whitespace-nowrap pr-4 hidden md:table-cell">
              <span className="flex flex-row gap-1">
                Your liquidity{' '}
                <span data-tip data-for="YourLiquidityTip">
                  <GetSvg svgName="tooltipArmadillo" className=" cursor-pointer" />
                </span>
                <ReactTooltip
                  id="YourLiquidityTip"
                  place="bottom"
                  effect="solid"
                  data-html={true}
                  insecure={true}
                  multiline={true}
                  className="default-react-tooltip-style "
                  delayHide={0}
                >
                  Net worth of your supplied LP tokens on DEXs
                </ReactTooltip>
              </span>
            </th>

            <th scope="col" className="pr-4 pb-3 align-baseline">
              <span className="sr-only">Edit</span>
            </th>
          </tr>
        </thead>
        {pairs => (
          <tbody className=" text-white text-sm ">
            {pairs.map((pair, index) => (
              <SupportPairTableRow
                key={index}
                pair={pair}
                worstIlPercentage={Stator.map(pairsWorstIl, (data: DataPairType[]) => {
                  const r = data.find(
                    d =>
                      (d.token1Name.ArmadilloSupportedTokenName === pair.tokenName1 &&
                        d.token2Name.ArmadilloSupportedTokenName === pair.tokenName2) ||
                      (d.token2Name.ArmadilloSupportedTokenName === pair.tokenName1 &&
                        d.token1Name.ArmadilloSupportedTokenName === pair.tokenName2),
                  )?.worstIlPercentage
                  if (!r) {
                    throw new Error(`could not find worstIlPercentage for pair: ${pair.tokenName1}/${pair.tokenName2}`)
                  }
                  return r
                })}
                {...(address && {
                  tvlInAllDexesUSD: Stator.map(liquiditiesFromZapper, data =>
                    sum(
                      data.lpTokensInfo
                        .filter(
                          d =>
                            (d.symbol0.ArmadilloSupportedTokenName === pair.tokenName1 &&
                              d.symbol1.ArmadilloSupportedTokenName === pair.tokenName2) ||
                            (d.symbol1.ArmadilloSupportedTokenName === pair.tokenName1 &&
                              d.symbol0.ArmadilloSupportedTokenName === pair.tokenName2),
                        )
                        .map(d => d.balanceUSDTotal),
                    ),
                  ),
                })}
              />
            ))}
          </tbody>
        )}
      </Table>
    </>
  )
}

export default SupportPairsTable
