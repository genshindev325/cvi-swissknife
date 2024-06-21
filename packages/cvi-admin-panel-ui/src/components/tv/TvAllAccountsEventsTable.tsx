import type { FC } from 'react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { chain, isNumber } from 'lodash'
import classNames from 'classnames'
import { GetSvg } from 'beta-cvi-ui/src/utils/GetSvg'
import { getAddressGroupAndName, safeObjectEntries } from '@coti-cvi/lw-sdk/src'
import DisplayNumber from '../../../../beta-cvi-ui/src/components/DisplayNumber/DisplayNumber'
import { ToAddress } from '../to-address'
import { useOrderBy } from '../../hooks/useOrderBy'
import { useFilteredEvents } from '../../hooks/use-filtered-events'
import useInversify from '../../hooks/use-inversify'

const titles = [
  {
    title: 'Address Group',
    key: 'address_group',
  },
  {
    title: '$ Current Balance',
    key: 'current_balance_usdc',
  },
] as const

type Props = {}

export const TvAllAccountsEventsTable: FC<Props> = () => {
  const navigate = useNavigate()
  const {
    tvEventsAsc,
    updatedGeneralInfoOfEventByAddressMap,
    addressesWithTvCvisx1AllTime: addressesWithTvCvisx1AllTime,
  } = useFilteredEvents()
  const { cviContractsInversifyService } = useInversify()

  const { orderBy, onOrderBy } = useOrderBy(
    titles.map(t => t.key),
    'current_balance_usdc',
  )

  const aggregateallTvEventsByAccount = chain(tvEventsAsc)
    .groupBy(e => e.args.account)
    .value()

  const onClickRow = (address: string) => {
    navigate(`/theta_vaults/${address}`)
  }

  const onImpersonate = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, address: string) => {
    e.stopPropagation()
    window.open(`https://theta.cvi.finance?impersonate=${address}`, '_blank')
  }

  return (
    <div>
      <table className="table-auto w-full bg-common-cancel bg-opacity-50 rounded-lg overflow-hidden mt-4">
        <thead>
          <tr className="text-left border-b border-gray-600  text-sm">
            <th className="p-4 sm:w-[460px]">Account</th>
            {titles.map(t => (
              <th
                key={t.key}
                className={classNames({
                  'pr-4 cursor-pointer': true,
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
          {Object.keys(aggregateallTvEventsByAccount)
            .flatMap(address => {
              if (!addressesWithTvCvisx1AllTime.has(address)) {
                return []
              }

              if (updatedGeneralInfoOfEventByAddressMap.get(address)?.tvCvix1Balance === 0) {
                return []
              }

              const rowData = {
                address_group: cviContractsInversifyService
                  ? getAddressGroupAndName(address, cviContractsInversifyService).addressGroup
                  : 'Loading...',
                current_balance_usdc: updatedGeneralInfoOfEventByAddressMap.get(address)?.tvCvix1BalanceInUsdc ?? 0,
              }

              if (!safeObjectEntries(rowData).every(([k]) => new Set(titles.map(t => t.key)).has(k))) {
                throw new Error('AllAccountsEventsTable.tsx - titles keys not match the row data keys.')
              }

              return {
                address,
                rowData,
              }
            })
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
                <td>
                  <DisplayNumber state={rowData.current_balance_usdc} dollar />
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
}
