import { formatDate, safeObjectEntries, TokenName } from '@coti-cvi/lw-sdk/src'
import classNames from 'classnames'
import _, { isNumber } from 'lodash'
import { useCallback, useMemo } from 'react'
import { GetSvg } from '../../../beta-cvi-ui/src/utils/GetSvg'
import { useOrderBy } from '../hooks/useOrderBy'
import { useFilteredEvents } from '../hooks/use-filtered-events'
import type { CviBackendClientApi } from '@coti-cvi/auto-generated-code'
import {
  TvFulfillDepositEventDto,
  TvFulfillWithdrawEventDto,
  TvLiquidateEventDto,
  TvSubmitEventDto,
  VtBurnEventDto,
  VtLiquidateRequestEventDto,
  VtMintEventDto,
  VtSubmitRequestEventDto,
  VtUniswapSwapEventArgsDto,
  VtUniswapSwapEventDto,
} from '@coti-cvi/auto-generated-code/src/backend-client-apis/cvi-backend-swagger-client'
import DisplayNumber from '../../../beta-cvi-ui/src/components/DisplayNumber/DisplayNumber'
import { ToAddress } from '../components/to-address'
import { CSVLink } from 'react-csv'
import { useEvents } from '../hooks'
import { getAddressGroupAndName } from '@coti-cvi/lw-sdk'
import useInversify from '../hooks/use-inversify'
import type { TvRequest, VtRequest } from '../types'
import { getStatusOfRequest } from '../utils'

type VtTvRequest = CviBackendClientApi.VtUniswapSwapEventDto | TvRequest | VtRequest

type ColumnType = {
  ['Submit Date']: string
  ['Execution Date']: string
  ['Resource']: string
  ['ID']: number
  ['Operation']: string
  ['Status']: string
  ['Address']: string
  ['Address Group']: string
  ['Sumbit Amount']: number
  ['Sumbit Token Name']: string
  ['$ Submit Amount']: number
  ['Received Amount']: number
  ['Received Token Name']: string
  ['$ Received Amount']: number
  ['CVI (Receive Time)']: number
  ['CVI (DEX) (Receive Time)']: number
}

type ColumnsInfo = {
  [Column in keyof ColumnType]: {
    value: (event: VtTvRequest) => ColumnType[Column]
    cell?: (v: ColumnType[Column], request: VtTvRequest, row: ColumnType) => JSX.Element | number | string
    overrideSortAsc?: (a: VtTvRequest, b: VtTvRequest) => number
    displayInUi: boolean
  }
}

export const Report = () => {
  const all = useEvents()
  const { allRequests, vtTransferAndSwapEventsAsc } = useFilteredEvents()
  const { cviContractsInversifyService } = useInversify()

  const requests = useMemo(
    () => [
      ...allRequests,
      ...vtTransferAndSwapEventsAsc.flatMap(e =>
        e.type === VtUniswapSwapEventDto.type.VT_UNISWAP_SWAP_EVENT ? [e] : [],
      ),
    ],
    [allRequests, vtTransferAndSwapEventsAsc],
  )

  const TABLE = useMemo((): ColumnsInfo | undefined => {
    if (!cviContractsInversifyService) {
      return undefined
    }

    // eslint-disable-next-line radar/prefer-immediate-return
    const table: ColumnsInfo = {
      ID: {
        value: request => ('requestId' in request ? request.requestId : -1),
        cell: (value, request) => (value === -1 ? '' : value),
        displayInUi: true,
      },
      Resource: {
        value: request => ('resource' in request ? request.resource : 'vt'),
        displayInUi: true,
      },
      'Submit Date': {
        value: request =>
          formatDate(
            'resource' in request
              ? request.resource === 'tv'
                ? all.tvRequestIdToSubmitEventMap.get(request.requestId)?.blockTimestamp ?? 0
                : all.vtRequestIdToSubmitEventMap.get(request.requestId)?.blockTimestamp ?? 0
              : request.blockTimestamp,
          ),
        displayInUi: true,
        overrideSortAsc: (a, b) => {
          const aDate =
            'resource' in a
              ? a.resource === 'tv'
                ? all.tvRequestIdToSubmitEventMap.get(a.requestId)?.blockTimestamp ?? 0
                : all.vtRequestIdToSubmitEventMap.get(a.requestId)?.blockTimestamp ?? 0
              : a.blockTimestamp
          const bDate =
            'resource' in b
              ? b.resource === 'tv'
                ? all.tvRequestIdToSubmitEventMap.get(b.requestId)?.blockTimestamp ?? 0
                : all.vtRequestIdToSubmitEventMap.get(b.requestId)?.blockTimestamp ?? 0
              : b.blockTimestamp

          return aDate - bDate
        },
      },
      'Execution Date': {
        value: request => {
          return formatDate(
            'resource' in request
              ? request.resource === 'tv'
                ? (
                    request.eventsByType.TvFulfillDepositEvent ??
                    request.eventsByType.TvFulfillWithdrawEvent ??
                    request.eventsByType.TvLiquidateEvent
                  )?.blockTimestamp ??
                  all.tvRequestIdToSubmitEventMap.get(request.requestId)?.args.targetTimestamp ??
                  0
                : (
                    request.eventsByType.VtBurnEvent ??
                    request.eventsByType.VtMintEvent ??
                    request.eventsByType.VtLiquidateEvent
                  )?.blockTimestamp ??
                  all.vtRequestIdToSubmitEventMap.get(request.requestId)?.args.targetTimestamp ??
                  0
              : request.blockTimestamp,
          )
        },
        displayInUi: true,
        overrideSortAsc: (a, b) => {
          const getTimestamp = (request: VtTvRequest) =>
            'resource' in request
              ? request.resource === 'tv'
                ? (
                    request.eventsByType.TvFulfillDepositEvent ??
                    request.eventsByType.TvFulfillWithdrawEvent ??
                    request.eventsByType.TvLiquidateEvent
                  )?.blockTimestamp ??
                  all.tvRequestIdToSubmitEventMap.get(request.requestId)?.args.targetTimestamp ??
                  0
                : (
                    request.eventsByType.VtBurnEvent ??
                    request.eventsByType.VtMintEvent ??
                    request.eventsByType.VtLiquidateEvent
                  )?.blockTimestamp ??
                  all.vtRequestIdToSubmitEventMap.get(request.requestId)?.args.targetTimestamp ??
                  0
              : request.blockTimestamp

          return getTimestamp(a) - getTimestamp(b)
        },
      },
      Operation: {
        value: request =>
          'resource' in request
            ? request.resource === 'tv'
              ? all.tvRequestIdToSubmitEventMap.get(request.requestId)?.args.action ?? 'Loading...'
              : all.vtRequestIdToSubmitEventMap.get(request.requestId)?.args.action ?? 'Loading...'
            : 'Swap',
        displayInUi: false,
      },
      Status: {
        value: request => {
          if ('resource' in request) {
            switch (getStatusOfRequest(request)) {
              case TvFulfillDepositEventDto.type.TV_FULFILL_DEPOSIT_EVENT:
                return 'Deposited'
              case TvFulfillWithdrawEventDto.type.TV_FULFILL_WITHDRAW_EVENT:
                return 'Withrawed'
              case TvLiquidateEventDto.type.TV_LIQUIDATE_EVENT:
                return `Liquidated ${
                  all.tvRequestIdToSubmitEventMap.get(request.requestId)?.args.action ?? 'Loading...'
                }`
              case TvSubmitEventDto.type.TV_SUBMIT_EVENT:
                return `Submitted ${
                  all.tvRequestIdToSubmitEventMap.get(request.requestId)?.args.action ?? 'Loading...'
                }`
              case VtBurnEventDto.type.VT_BURN_EVENT:
                return 'Burned'
              case VtLiquidateRequestEventDto.type.VT_LIQUIDATE_EVENT:
                return `Liquidated ${
                  all.vtRequestIdToSubmitEventMap.get(request.requestId)?.args.action ?? 'Loading...'
                }`
              case VtMintEventDto.type.VT_MINT_EVENT:
                return 'Minted'
              case VtSubmitRequestEventDto.type.VT_SUBMIT_EVENT:
                return `Submitted ${
                  all.vtRequestIdToSubmitEventMap.get(request.requestId)?.args.action ?? 'Loading...'
                }`
            }
          } else {
            return `Swaped (${
              request.args.tokenNameAmountIn === VtUniswapSwapEventArgsDto.tokenNameAmountIn.USDC
                ? '$'
                : request.args.tokenNameAmountIn
            }->${
              request.args.tokenNameAmountOut === VtUniswapSwapEventArgsDto.tokenNameAmountOut.USDC
                ? '$'
                : request.args.tokenNameAmountOut
            })`
          }
        },
        displayInUi: true,
      },
      Address: {
        value: request =>
          'resource' in request
            ? getAddressGroupAndName(request.address, cviContractsInversifyService).addressName
              ? `${getAddressGroupAndName(request.address, cviContractsInversifyService).addressName} (${
                  request.resource === 'tv'
                    ? all.tvRequestIdToSubmitEventMap.get(request.requestId)?.args.account ?? 'Loading...'
                    : all.vtRequestIdToSubmitEventMap.get(request.requestId)?.args.account ?? 'Loading...'
                })`
              : request.resource === 'tv'
              ? all.tvRequestIdToSubmitEventMap.get(request.requestId)?.args.account ?? 'Loading...'
              : all.vtRequestIdToSubmitEventMap.get(request.requestId)?.args.account ?? 'Loading...'
            : request.args.account,
        cell: (value, request) => <ToAddress address={value} linkToXScan />,
        displayInUi: true,
      },
      'Address Group': {
        value: request =>
          'resource' in request
            ? getAddressGroupAndName(request.address, cviContractsInversifyService).addressGroup
            : all.addressToGroupMap.get(request.args.account) ?? 'Loading...',
        displayInUi: true,
      },
      'Sumbit Amount': {
        value: request =>
          'resource' in request
            ? request.resource === 'tv'
              ? all.tvRequestIdToSubmitEventMap.get(request.requestId)?.args.tokenAmount ?? 0
              : all.vtRequestIdToSubmitEventMap.get(request.requestId)?.args.tokenAmountPaid ?? 0
            : request.args.tokenAmountIn,
        displayInUi: false,
      },
      'Sumbit Token Name': {
        value: request =>
          'resource' in request
            ? request.resource === 'tv'
              ? all.tvRequestIdToSubmitEventMap.get(request.requestId)?.args.tokenAmountName ?? 'Loading...'
              : all.vtRequestIdToSubmitEventMap.get(request.requestId)?.args.tokenNameAmountPaid ?? 'Loading...'
            : request.args.tokenNameAmountIn,
        displayInUi: false,
      },
      '$ Submit Amount': {
        value: request => {
          if ('resource' in request) {
            if (request.resource === 'tv') {
              return all.tvRequestIdToSubmitEventMap.get(request.requestId)?.args.tokenAmountInUsdc ?? 0
            } else {
              const s = all.vtRequestIdToSubmitEventMap.get(request.requestId)
              if (!s) {
                return 0
              }
              return s.args.tokenNameAmountPaid === 'USDC'
                ? s.args.tokenAmountPaid
                : s.args.tokenAmountPaid * s.args.generalInfoOfEventOneBlockBefore.vtCviPriceInUsdc
            }
          } else {
            return request.args.tokenNameAmountIn === VtUniswapSwapEventArgsDto.tokenNameAmountIn.USDC
              ? request.args.tokenAmountIn
              : request.args.tokenAmountIn * request.args.generalInfoOfEventOneBlockBefore.vtCviPriceDexInUsdc
          }
        },
        cell: (value, request, row) => (
          <DisplayNumber
            state={value}
            dollar
            moreInfoInBrackets={
              row['Sumbit Token Name'] === TokenName.USDC ? undefined : (
                <DisplayNumber state={row['Sumbit Amount']} tokenName={row['Sumbit Token Name']} />
              )
            }
          />
        ),
        displayInUi: true,
      },
      'Received Amount': {
        value: request => {
          if ('resource' in request) {
            if (request.resource === 'tv') {
              return (
                request.eventsByType.TvFulfillDepositEvent?.args.mintedThetaTokens ??
                request.eventsByType.TvFulfillWithdrawEvent?.args.usdcAmountReceived ??
                request.eventsByType.TvLiquidateEvent?.args.tokenAmount ??
                0
              )
            }

            return (
              request.eventsByType.VtBurnEvent?.args.usdcAmountReceived ??
              request.eventsByType.VtMintEvent?.args.mintedTokens ??
              (request.eventsByType.VtLiquidateEvent &&
                all.vtRequestIdToSubmitEventMap.get(request.requestId)?.args.tokenAmountPaid) ??
              0
            )
          } else {
            return request.args.tokenAmountOut
          }
        },
        displayInUi: false,
      },
      'Received Token Name': {
        value: request => {
          if ('resource' in request) {
            if (request.resource === 'tv') {
              return (
                (request.eventsByType.TvFulfillDepositEvent && TokenName.T_CVI_LP) ??
                (request.eventsByType.TvFulfillWithdrawEvent && TokenName.USDC) ??
                request.eventsByType.TvLiquidateEvent?.args.tokenAmountName ??
                'Loading...'
              )
            }
            return (
              (request.eventsByType.VtBurnEvent && TokenName.USDC) ??
              request.eventsByType.VtMintEvent?.args.cviTokenName ??
              (request.eventsByType.VtLiquidateEvent &&
                all.vtRequestIdToSubmitEventMap.get(request.requestId)?.args.tokenNameAmountPaid) ??
              'Loading...'
            )
          } else {
            return request.args.tokenNameAmountOut
          }
        },
        displayInUi: false,
      },
      '$ Received Amount': {
        value: request => {
          if ('resource' in request) {
            if (request.resource === 'tv') {
              return (
                (request.eventsByType.TvFulfillDepositEvent &&
                  request.eventsByType.TvFulfillDepositEvent.args.mintedThetaTokens *
                    request.eventsByType.TvFulfillDepositEvent.args.generalInfoOfEvent.tvCvix1PriceInUsdc) ??
                request.eventsByType.TvFulfillWithdrawEvent?.args.usdcAmountReceived ??
                (request.eventsByType.TvLiquidateEvent &&
                  (request.eventsByType.TvLiquidateEvent.args.tokenAmountName === 'USDC'
                    ? request.eventsByType.TvLiquidateEvent.args.tokenAmount
                    : request.eventsByType.TvLiquidateEvent.args.tokenAmount *
                      request.eventsByType.TvLiquidateEvent.args.generalInfoOfEvent.tvCvix1PriceInUsdc)) ??
                0
              )
            }
            return (
              request.eventsByType.VtBurnEvent?.args.usdcAmountReceived ??
              (request.eventsByType.VtMintEvent?.args.mintedTokens ?? 0) *
                (request.eventsByType.VtMintEvent?.args.generalInfoOfEvent.vtCviPriceInUsdc ?? 0) ??
              (request.eventsByType.VtLiquidateEvent &&
                (() => {
                  const s = all.vtRequestIdToSubmitEventMap.get(request.requestId)
                  if (s) {
                    return s.args.tokenNameAmountPaid === 'USDC'
                      ? s.args.tokenAmountPaid
                      : s.args.tokenAmountPaid * s.args.generalInfoOfEvent.vtCviPriceInUsdc
                  }
                  return 0
                })()) ??
              0
            )
          } else {
            return request.args.tokenNameAmountOut === VtUniswapSwapEventArgsDto.tokenNameAmountOut.USDC
              ? request.args.tokenAmountOut
              : request.args.tokenAmountOut * request.args.generalInfoOfEvent.vtCviPriceDexInUsdc
          }
        },
        cell: (value, request, row) => (
          <DisplayNumber
            state={value}
            dollar
            moreInfoInBrackets={
              row['Received Token Name'] === TokenName.USDC ? undefined : (
                <DisplayNumber state={row['Received Amount']} tokenName={row['Received Token Name']} />
              )
            }
          />
        ),
        displayInUi: true,
      },
      ['CVI (Receive Time)']: {
        value: request => {
          if ('resource' in request) {
            if (request.resource === 'tv') {
              return (
                (
                  request.eventsByType.TvFulfillDepositEvent ??
                  request.eventsByType.TvFulfillWithdrawEvent ??
                  request.eventsByType.TvLiquidateEvent
                )?.args.generalInfoOfEvent.vtCviPriceInUsdc ?? 0
              )
            }
            return request.eventsByType.VtLiquidateEvent?.args.generalInfoOfEvent.vtCviPriceInUsdc ?? 0
          } else {
            return request.args.generalInfoOfEvent.vtCviPriceInUsdc
          }
        },
        cell: (value, request, row) => <DisplayNumber state={value} />,
        displayInUi: true,
      },
      ['CVI (DEX) (Receive Time)']: {
        value: request => {
          if ('resource' in request) {
            if (request.resource === 'tv') {
              return (
                (
                  request.eventsByType.TvFulfillDepositEvent ??
                  request.eventsByType.TvFulfillWithdrawEvent ??
                  request.eventsByType.TvLiquidateEvent
                )?.args.generalInfoOfEvent.vtCviPriceDexInUsdc ?? 0
              )
            }
            return request.eventsByType.VtLiquidateEvent?.args.generalInfoOfEvent.vtCviPriceDexInUsdc ?? 0
          } else {
            return request.args.generalInfoOfEvent.vtCviPriceDexInUsdc
          }
        },
        cell: (value, request, row) => <DisplayNumber state={value} />,
        displayInUi: true,
      },
    }
    return table
  }, [
    all.addressToGroupMap,
    all.tvRequestIdToSubmitEventMap,
    all.vtRequestIdToSubmitEventMap,
    cviContractsInversifyService,
  ])

  const { orderBy, onOrderBy } = useOrderBy(
    safeObjectEntries(TABLE).map(e => e[0]),
    'Submit Date',
  )

  const getHeaders = useCallback(
    (tableType: 'ui' | 'csv') =>
      safeObjectEntries(TABLE).filter(entrie => tableType === 'csv' || entrie[1].displayInUi),
    [TABLE],
  )

  const getRows = useCallback(
    (tableType: 'ui' | 'csv') =>
      requests
        .map(request => {
          const rowData = Object.fromEntries(
            safeObjectEntries(TABLE).map(entrie => [entrie[0], entrie[1].value(request)]),
          ) as ColumnType
          return Object.fromEntries(
            safeObjectEntries(TABLE)
              .filter(entrie => tableType === 'csv' || entrie[1].displayInUi)
              .map(entrie => {
                const value = entrie[1].value(request)
                return [
                  entrie[0],
                  {
                    column: entrie[0],
                    value,
                    request,
                    cell: entrie[1].cell
                      ? entrie[1].cell(
                          // @ts-ignore
                          value,
                          request,
                          rowData,
                        )
                      : value,
                  },
                ]
              }),
          )
        })
        .sort((a, b) => {
          const info = TABLE?.[orderBy.key]
          if (info?.overrideSortAsc) {
            const r = info.overrideSortAsc(a[orderBy.key].request, b[orderBy.key].request)
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
    [TABLE, requests, orderBy.key, orderBy.option],
  )

  return useMemo(
    () => (
      <div>
        <div className="my-1 h-px " />
        <div className="flex justify-between">
          <span>{requests.length} results found</span>
          <CSVLink
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
            filename="armadillo-export.csv"
            data={getRows('csv').map(r => _.mapValues(r, v => v.value))}
          >
            Download CSV
          </CSVLink>
        </div>
        <div className="my-1 h-px " />
        <table
          className={classNames({
            'table-auto w-full': true,
            'opacity-50': requests.length === 0,
          })}
        >
          <thead>
            <tr className="text-left border-b border-gray-600">
              {getHeaders('ui').map(([column], i) => (
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
                    {column}
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
            {requests.length === 0 ? (
              <tr>
                <td className="p-4">No Data</td>
              </tr>
            ) : (
              <>
                {getRows('ui').map((row, i) => (
                  <tr key={i} className="odd:bg-common-cancel hover:bg-slate-600">
                    {Object.values(row).map((cell, i) => (
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
    ),
    [getHeaders, getRows, onOrderBy, orderBy.key, orderBy.option, requests.length],
  )
}
