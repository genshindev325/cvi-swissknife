import type { AllTvEvents, AllVtEvents } from '@coti-cvi/lw-sdk/src'
import { sortEventsAsc } from '@coti-cvi/lw-sdk/src'
import { safeObjectEntries } from '@coti-cvi/lw-sdk/src'
import classNames from 'classnames'
import { isNumber } from 'lodash'
import { useMemo, useState } from 'react'
import { GetSvg } from '../../../beta-cvi-ui/src/utils/GetSvg'
import { useOrderBy } from '../hooks/useOrderBy'
import useLocalStorageState from 'use-local-storage-state'
import type { ValueOf } from '../redux/selected-columns-in-tables'
import { ALL_TABLE_COLUMNS } from '../redux/selected-columns-in-tables'
import _ from 'lodash'
import { INVALIDATE_CACHE, useAppSelector } from '../redux'
import { useFilteredEvents } from '../hooks/use-filtered-events'
import { format } from 'date-fns'
import { VtCviTransferEventDto } from '@coti-cvi/auto-generated-code/src/backend-client-apis/cvi-backend-swagger-client'
import { ToAddress } from '../components/to-address'
import { diffTimeFromNow } from '../utils'

type AllVtTvEvents = AllVtEvents | AllTvEvents

const eventStringified = (e: AllVtTvEvents) =>
  JSON.stringify(
    {
      blockNumber: e.blockNumber,
      blockTimestamp: e.blockTimestamp,
      type: e.type,
      transactionIndex: e.transactionIndex,
      logIndex: e.logIndex,
      transactionHash: e.transactionHash,
      args: e.args,
    },
    null,
    2,
  )

type GeneralInfoOfEventColumnNames = Extract<
  keyof typeof ALL_TABLE_COLUMNS,
  | 'generalInfoOfEvent.cviIndex'
  | 'generalInfoOfEvent.vtCviPriceInUsdc'
  | 'generalInfoOfEvent.vtCviPriceDexInUsdc'
  | 'generalInfoOfEvent.tvCvix1PriceInUsdc'
  | 'generalInfoOfEvent.tvInfo.dexCviBalanceUsdcByPlatformPrice'
  | 'generalInfoOfEvent.tvInfo.dexCviBalanceUsdc'
  | 'generalInfoOfEvent.tvInfo.currentThetaVaultUsdcBalance'
  | 'generalInfoOfEvent.tvInfo.platformUSDCLiquidity'
  | 'generalInfoOfEvent.tvInfo.platformVtBalanceUsdcByPlatformPrice'
  | 'generalInfoOfEvent.tvInfo.dexCviBalance'
  | 'generalInfoOfEvent.tvInfo.tvCollateralRatio'
  | 'generalInfoOfEvent.tvInfo.tvPlatformPnl'
>

type AdditionalColumns = {
  [Column in GeneralInfoOfEventColumnNames]: {
    header: JSX.Element
    value: (event: AllVtTvEvents) => ValueOf<Column>
    cell: (v: ValueOf<Column>, event: AllVtTvEvents) => JSX.Element
  }
}

const ADDITIONAL_COLUMNS: AdditionalColumns = _.mapValues(
  _.pickBy(ALL_TABLE_COLUMNS, (_value, key) => key.startsWith('generalInfoOfEvent.')),
  (generateHeaderAndValue, key) => ({
    // @ts-ignore
    header: generateHeaderAndValue.header(''),
    value: (event: AllVtTvEvents) => _.get(event.args, key.split('.')),
    cell: (v: string | number, event: AllVtTvEvents) =>
      // @ts-ignore
      generateHeaderAndValue.value({ value: v, event, table: '' }),
  }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) as any

export const AllEventsTable = () => {
  const { allEventsAsc: allEvents } = useFilteredEvents()
  const latestBlock = useAppSelector(state => state.latestBlock)

  const TABLE = useMemo(
    () =>
      ({
        blockNumber: {
          header: <span>Block</span>,
          value: (event: AllVtTvEvents): number => event.blockNumber,
          cell: (v: number, event: AllVtTvEvents) => <span>{v}</span>,
          overrideSortAsc: sortEventsAsc,
        },
        blockTimestamp: {
          header: <span>Timestamp</span>,
          value: (event: AllVtTvEvents): string => format(new Date(event.blockTimestamp * 1000), 'dd/MM/yyyy HH:mm:ss'),
          cell: (v: string, event: AllVtTvEvents) => (
            <span className="flex gap-2">
              <span>{v}</span>
              {latestBlock.data && (
                <span>
                  ({diffTimeFromNow({ dateMs: event.blockTimestamp * 1000, nowMs: latestBlock.data.timestamp * 1000 })})
                </span>
              )}
            </span>
          ),
          overrideSortAsc: sortEventsAsc,
        },
        transactionIndex: {
          header: <span>Transaction Index</span>,
          value: (event: AllVtTvEvents): number => event.transactionIndex,
          cell: (v: number, event: AllVtTvEvents) => <span>{v}</span>,
        },
        logIndex: {
          header: <span>Log Index</span>,
          value: (event: AllVtTvEvents): number => event.logIndex,
          cell: (v: number, event: AllVtTvEvents) => <span>{v}</span>,
        },
        eventType: {
          header: <span>Type</span>,
          value: (event: AllVtTvEvents): string => event.type,
          cell: (v: string, event: AllVtTvEvents) => <span>{v}</span>,
        },
        trasactionHash: {
          header: <span>Transaction Hash</span>,
          value: (event: AllVtTvEvents): string => event.transactionHash,
          cell: (v: string, event: AllVtTvEvents) => (
            <a href={`https://arbiscan.io/tx/${event.transactionHash}`} target="_blank" rel="noopener noreferrer">
              {v.slice(0, 6)}
            </a>
          ),
        },
        address: {
          header: <span>Address</span>,
          value: (event: AllVtTvEvents): string =>
            event.type === VtCviTransferEventDto.type.VT_CVI_TRANSFER_EVENT
              ? event.args.fromAccount
              : event.args.account,
          cell: (v: string, event: AllVtTvEvents) =>
            event.type === VtCviTransferEventDto.type.VT_CVI_TRANSFER_EVENT ? (
              <span>
                <ToAddress address={event.args.fromAccount} linkToXScan minimize /> {'->'}{' '}
                <ToAddress address={event.args.toAccount} linkToXScan minimize />
              </span>
            ) : (
              <ToAddress address={v} linkToXScan minimize />
            ),
        },
        payload: {
          header: <span>Payload</span>,
          value: (event: AllVtTvEvents): string => eventStringified(event),
          cell: (v: string, event: AllVtTvEvents) => <span>{v}</span>,
        },
        ...ADDITIONAL_COLUMNS,
      } as const),
    [latestBlock.data],
  )

  type Columns = keyof typeof TABLE

  const DEFAULT_COLUMNS: Columns[] = [
    'blockNumber',
    'blockTimestamp',
    'transactionIndex',
    'eventType',
    'trasactionHash',
    'address',
  ]

  const [visibleColumns, setVisibleColumns] = useLocalStorageState<Columns[]>(
    `armadillo::visible-columns::${INVALIDATE_CACHE}`,
    {
      defaultValue: DEFAULT_COLUMNS,
    },
  )

  const nonVisibleColumns = safeObjectEntries(TABLE)
    .filter(([columnName]) => !visibleColumns.includes(columnName))
    .map(([columnName]) => columnName)

  const [search, setSearch] = useState('')

  const eventsStringifiedMap = useMemo(
    () => new Map(allEvents.map(e => [e, eventStringified(e).toLowerCase()])),
    [allEvents],
  )

  const filteredEvents = useMemo(
    () =>
      search ? allEvents.filter(e => eventsStringifiedMap.get(e)?.includes(search.toLocaleLowerCase())) : allEvents,
    [allEvents, eventsStringifiedMap, search],
  )

  const { orderBy, onOrderBy } = useOrderBy(
    safeObjectEntries(TABLE).map(e => e[0]),
    'blockNumber',
  )

  const table = useMemo(
    () =>
      filteredEvents
        .map(event =>
          Object.fromEntries(
            safeObjectEntries(TABLE).map(entrie => [
              entrie[0],
              {
                column: entrie[0],
                header: entrie[1].header,
                value: entrie[1].value(event),
                event,
                cell: entrie[1].cell(
                  // @ts-ignore
                  entrie[1].value(event),
                  event,
                ),
              },
            ]),
          ),
        )
        .sort((a, b) => {
          const info = TABLE[orderBy.key]
          if ('overrideSortAsc' in info) {
            const r = info.overrideSortAsc(a[orderBy.key].event, b[orderBy.key].event)
            return orderBy.option === 'asc' ? r : -1 * r
          }
          const aValue = a[orderBy.key].value
          const bValue = b[orderBy.key].value
          if (isNumber(aValue) && isNumber(bValue)) {
            return orderBy.option === 'asc' ? Number(aValue) - Number(bValue) : Number(bValue) - Number(aValue)
          }
          return orderBy.option === 'asc'
            ? String(aValue).charCodeAt(0) - String(bValue).charCodeAt(0)
            : String(bValue).charCodeAt(0) - String(aValue).charCodeAt(0)
        }),
    [TABLE, filteredEvents, orderBy.key, orderBy.option],
  )

  return (
    <div>
      <input
        className="w-full text-black"
        type="text"
        value={search}
        placeholder="Search Text"
        onChange={e => setSearch(e.target.value)}
      />
      <div className="my-1 h-px " />
      <div className="flex justify-between">
        <span>{filteredEvents.length} results found</span>
      </div>
      <div className="my-1 h-px " />
      <div className="flex gap-4">
        {nonVisibleColumns.length > 0 && (
          <div className="flex gap-2 bg-white p-1 rounded-lg border-2 overflow-auto w-full flex-wrap">
            {nonVisibleColumns.map(c => (
              <button
                key={c}
                className="border border-dark-600 text-xs text-dark-600 py-1 px-2 rounded-lg flex items-center gap-2 self-baseline hover:bg-gray-300"
                onClick={() => setVisibleColumns(prev => [...prev, c])}
              >
                {TABLE[c].header}
                <GetSvg svgName="remove" className="fill-black" />
              </button>
            ))}
          </div>
        )}
      </div>
      <table
        className={classNames({
          'table-auto w-full': true,
          'opacity-50': filteredEvents.length === 0,
        })}
      >
        <thead>
          <tr className="text-left border-b border-gray-600">
            {safeObjectEntries(TABLE)
              .filter(entrie => visibleColumns.some(c => c === entrie[0]))
              .map(([column, columnInfo], i) => (
                <th
                  key={column}
                  className={classNames({
                    'p-4': i === 0,
                    'p-2': i > 0,
                  })}
                >
                  <div
                    className={classNames({
                      'flex gap-1': true,
                      'text-cyan-400': orderBy.key === column,
                    })}
                  >
                    {columnInfo.header}
                    <button type="button" onClick={() => setVisibleColumns(prev => prev.filter(c => c !== column))}>
                      <GetSvg svgName="remove" />
                    </button>
                    <button type="button" onClick={() => onOrderBy(column)}>
                      <GetSvg
                        svgName="chevron"
                        className={classNames({
                          'w-6 h-6 min-w-[24px] fill-white transition-all delay-75': true,
                          ['fill-common-turquoise']: orderBy.key === column,
                          ['rotate-180']: orderBy.key === column && orderBy.option === 'asc',
                        })}
                      />
                    </button>
                  </div>
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {filteredEvents.length === 0 ? (
            <tr>
              <td className="p-4">No Data</td>
            </tr>
          ) : (
            <>
              {table.map((row, i) => (
                <tr key={i} className="odd:bg-common-cancel hover:bg-slate-600">
                  {Object.values(row)
                    .filter(entrie => visibleColumns.some(c => c === entrie.column))
                    .map((cell, i) => (
                      <td
                        key={cell.column}
                        className={classNames({
                          'p-4': i === 0,
                          'p-2': i > 0,
                        })}
                      >
                        {cell.cell}
                      </td>
                    ))}
                </tr>
              ))}
            </>
          )}
        </tbody>
      </table>
    </div>
  )
}
