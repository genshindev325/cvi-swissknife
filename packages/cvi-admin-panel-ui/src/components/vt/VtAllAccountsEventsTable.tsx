import React, { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { isNumber } from 'lodash'
import classNames from 'classnames'
import { GetSvg } from 'beta-cvi-ui/src/utils/GetSvg'
import { getAddressGroupAndName, TokenName, VtStatisticsApi } from '@coti-cvi/lw-sdk/src'
import DisplayNumber from '../../../../beta-cvi-ui/src/components/DisplayNumber/DisplayNumber'
import { ToAddress } from '../to-address'
import { useOrderBy } from '../../hooks/useOrderBy'
import { useFilteredEvents } from '../../hooks/use-filtered-events'
import { useDatesRange } from '../../hooks/use-dates-range'
import { useEvents } from '../../hooks'
import useInversify from '../../hooks/use-inversify'

const titles = [
  {
    title: 'Address Group',
    key: 'address_group',
  },
  {
    title: 'Trades',
    key: 'trades',
  },
  {
    title: '$ Inflows',
    key: 'inflows_usdc',
  },
  {
    title: '$ Outflows',
    key: 'outflows_usdc',
  },
  {
    title: '$ CVI Balance',
    key: 'cvol_balance_usdc',
  },
  {
    title: '$ P&L',
    key: 'pnl',
  },
  {
    title: '% Marking P&L',
    key: 'marketing_pnl_percentage',
  },
] as const

export const VtAllAccountsEventsTable = ({ statisticsApi }: { statisticsApi?: VtStatisticsApi }) => {
  const navigate = useNavigate()
  const allEvents = useEvents()
  const {
    vtEventsAsc,
    addresses,
    updatedGeneralInfoOfEventByAddressMap,
    swapEventsAsc,
    vtRequests,
    addressesWithCvisx1AllTime: addressesWithCvolsx1AllTime,
  } = useFilteredEvents()
  const datesRange = useDatesRange()
  const { orderBy, onOrderBy } = useOrderBy(
    titles.map(t => t.key),
    'pnl',
  )
  const { cviContractsInversifyService } = useInversify()

  const onClickRow = useCallback(
    (address: string) => {
      navigate(`/volatility_tokens/${address}`)
    },
    [navigate],
  )

  const onImpersonate = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, address: string) => {
    e.stopPropagation()
    window.open(`https://theta.cvi.finance?impersonate=${address}`, '_blank')
  }

  return useMemo(() => {
    const rows = addresses.flatMap(address => {
      if (!addressesWithCvolsx1AllTime.has(address)) {
        return []
      }

      const addressGroup =
        cviContractsInversifyService && getAddressGroupAndName(address, cviContractsInversifyService).addressGroup

      const vtStatisticsApi =
        cviContractsInversifyService &&
        new VtStatisticsApi(
          allEvents.vtEventsAsc,
          vtEventsAsc.filter(e =>
            e.type === 'VtCviTransferEvent'
              ? e.args.fromAccount === address || e.args.toAccount === address
              : e.args.account === address,
          ),
          cviContractsInversifyService,
          updatedGeneralInfoOfEventByAddressMap,
          [address],
        )

      const generalInfoOfAddress = updatedGeneralInfoOfEventByAddressMap.get(address)

      if (!generalInfoOfAddress) {
        return []
      }

      const pnlInfo = vtStatisticsApi?.calculateTradersPnlUsdc()

      const rowData = {
        address_group: addressGroup ?? ['Loading...'],
        trades:
          vtRequests.filter(r => r.address === address).length +
          swapEventsAsc.filter(e => e.args.account === address).length,
        pnlInfo,
        pnl: pnlInfo?.pnlInUsdc,
        cvol_balance: generalInfoOfAddress.vtCviBalance,
        cvol_balance_usdc: generalInfoOfAddress.vtCvix1BalanceInUsdc,
        marketing_pnl_percentage: pnlInfo?.debugging.marketingPnlPercentage,
        inflows_usdc: pnlInfo?.debugging.usdcInfo.inflows$,
        outflows_usdc: pnlInfo?.debugging.usdcInfo.outflows$,
      } as const

      return {
        address,
        rowData,
      }
    })

    return (
      <div>
        <table className="table-auto w-full bg-common-cancel bg-opacity-50 rounded-lg overflow-hidden mt-4">
          <thead>
            <tr className="text-left border-b border-gray-600  text-sm">
              <th className="p-4 sm:w-[460px]">{rows.length} Accounts</th>
              {titles.map(t => (
                <th
                  key={t.key}
                  className={classNames({
                    'pr-10 cursor-pointer': true,
                  })}
                  onClick={() => onOrderBy(t.key)}
                >
                  <div className="flex w-full items-start h-full">
                    <b>{t.title}</b>
                    <GetSvg
                      svgName="chevron"
                      className={classNames({
                        'w-6 h-6 min-w-[24px] fill-white transition-all delay-75': true,
                        ['fill-common-turquoise']: orderBy.key === t.key,
                        ['rotate-180']: orderBy.key === t.key && orderBy.option === 'asc',
                      })}
                    />
                  </div>
                </th>
              ))}
              <th className="p-4 sm:w-[460px] text-right">Impersonate</th>
            </tr>
          </thead>
          <tbody>
            {rows
              .sort((a, b) => {
                if (isNumber(a.rowData[orderBy.key]) && isNumber(b.rowData[orderBy.key])) {
                  return orderBy.option === 'asc'
                    ? Number(a.rowData[orderBy.key]) - Number(b.rowData[orderBy.key])
                    : Number(b.rowData[orderBy.key]) - Number(a.rowData[orderBy.key])
                }
                return orderBy.option === 'asc'
                  ? String(a.rowData[orderBy.key]).charCodeAt(0) - String(b.rowData[orderBy.key]).charCodeAt(0)
                  : String(b.rowData[orderBy.key]).charCodeAt(0) - String(a.rowData[orderBy.key]).charCodeAt(0)
              })
              .map(({ address, rowData }) => (
                <tr
                  key={address}
                  className="odd:bg-common-cancel hover:cursor-pointer hover:bg-opacity-50 active:bg-opacity-20 odd:active:bg-dark-700 active:bg-dark-800"
                  onClick={() => onClickRow(address)}
                >
                  <td scope="th" className="p-4">
                    <b className="text-green-400 mr-4">
                      <ToAddress address={address} />
                    </b>
                  </td>

                  <td>{rowData.address_group}</td>
                  <td>{rowData.trades}</td>
                  <td>
                    <DisplayNumber state={rowData.inflows_usdc} dollar />
                  </td>
                  <td>
                    <DisplayNumber state={rowData.outflows_usdc} dollar />
                  </td>
                  <td>
                    <DisplayNumber
                      state={rowData.cvol_balance_usdc}
                      dollar
                      moreInfoInBrackets={<DisplayNumber state={rowData.cvol_balance} tokenName={TokenName.CVI} />}
                    />
                  </td>
                  <td
                    onClick={() => {
                      console.log(`pnl of: "${address}":`, rowData.pnlInfo)
                    }}
                  >
                    <DisplayNumber state={rowData.pnl} dollar />
                  </td>
                  <td>
                    <DisplayNumber state={rowData.marketing_pnl_percentage} percentage />
                  </td>

                  <td className="text-right pr-4">
                    <button
                      className=" bg-dark-300 border py-2 px-4 rounded-md text-sm"
                      onClick={e => onImpersonate(e, address)}
                    >
                      Impersonate
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    )
  }, [
    addresses,
    addressesWithCvolsx1AllTime,
    allEvents.vtEventsAsc,
    cviContractsInversifyService,
    onClickRow,
    onOrderBy,
    orderBy.key,
    orderBy.option,
    swapEventsAsc,
    updatedGeneralInfoOfEventByAddressMap,
    vtEventsAsc,
    vtRequests,
  ])
}
