import { useEffect, useState } from 'react'
import { Table, Column, HeaderCell, Cell } from 'rsuite-table'
import 'rsuite-table/lib/less/index.less'
import type { OpenClosePositionsTraderInfo } from '@coti-cvi/lw-sdk'
import { PolygonPositionsTheGraphInversifyService, toUsdcNumber, sumBigNumber, ChainId } from '@coti-cvi/lw-sdk'
// @ts-ignore
import prettyNum from 'pretty-num'
import prettyMs from 'pretty-ms'
import { initInversify } from '../cvi-ui-init-inversify'
import sum from 'lodash/sum'

const container = initInversify(ChainId.PolygonStaging)

export type WalletInfo = {
  walletId: string
  postionsInfo: OpenClosePositionsTraderInfo
}

export type ColumnType = 'pnl-column' | 'wallet-id-column' | 'positions-length-column'

export type WalletsInfoState = {
  walletsInfo: WalletInfo[]
  column: ColumnType
  order: 'desc' | 'asc'
}

// eslint-disable-next-line clean-regex/no-constant-capturing-group
const thousands = (value: string): string => `${value}`.replace(/(?=(?!(\b))(\d{3})+$)/g, '$1,')

const HeaderSummary = ({
  title,
  summary,
  color,
  unit,
}: {
  title: number | string | JSX.Element
  summary: string
  unit?: number | string | JSX.Element
  color: string
}) => (
  <span>
    <label>{title} </label>
    <label
      style={{
        fontSize: 18,
        color,
      }}
    >
      {unit ? (
        <span>
          ({thousands(summary)} {unit})
        </span>
      ) : (
        <span>({thousands(summary)})</span>
      )}
    </label>
  </span>
)

function sortWalletsInfo({ column, order, walletsInfo }: WalletsInfoState): WalletInfo[] {
  return walletsInfo.slice().sort((a, b) => {
    switch (column) {
      case 'pnl-column':
        return order === 'desc'
          ? b.postionsInfo.pnl.sub(a.postionsInfo.pnl).toNumber()
          : a.postionsInfo.pnl.sub(b.postionsInfo.pnl).toNumber()
      case 'wallet-id-column':
        return order === 'desc' ? b.walletId.localeCompare(a.walletId) : a.walletId.localeCompare(b.walletId)
      case 'positions-length-column':
        return order === 'desc'
          ? b.postionsInfo.positionsHistory.length - a.postionsInfo.positionsHistory.length
          : a.postionsInfo.positionsHistory.length - b.postionsInfo.positionsHistory.length
      default:
        throw new Error(`column is not supported yet: ${column}`)
    }
  })
}

const strategies: {
  'all-time': { strategy: 'all-time' }
  '1d': { strategy: 'last-x-sec'; lastXSec: number }
  '1w': { strategy: 'last-x-sec'; lastXSec: number }
  '2w': { strategy: 'last-x-sec'; lastXSec: number }
  '1m': { strategy: 'last-x-sec'; lastXSec: number }
  '3m': { strategy: 'last-x-sec'; lastXSec: number }
  '6m': { strategy: 'last-x-sec'; lastXSec: number }
} = {
  'all-time': {
    strategy: 'all-time',
  },
  '1d': {
    strategy: 'last-x-sec',
    lastXSec: 60 * 60 * 24 * 1,
  },
  '1w': {
    strategy: 'last-x-sec',
    lastXSec: 60 * 60 * 24 * 7,
  },
  '2w': {
    strategy: 'last-x-sec',
    lastXSec: 60 * 60 * 24 * 7 * 2,
  },
  '1m': {
    strategy: 'last-x-sec',
    lastXSec: 60 * 60 * 24 * 30,
  },
  '3m': {
    strategy: 'last-x-sec',
    lastXSec: 60 * 60 * 24 * 30 * 3,
  },
  '6m': {
    strategy: 'last-x-sec',
    lastXSec: 60 * 60 * 24 * 30 * 6,
  },
}

export function Ui() {
  const [walletInfoState, setWalletInfoState] = useState<WalletsInfoState>({
    walletsInfo: [],
    column: 'pnl-column',
    order: 'desc',
  })

  const [tradersStrategy, setTradersStrategy] = useState<
    { strategy: 'all-time' } | { strategy: 'last-x-sec'; lastXSec: number }
  >(strategies['1d'])

  const [polygonPositionsTheGraphInversifyService, setPolygonPositionsTheGraphInversifyService] =
    useState<PolygonPositionsTheGraphInversifyService>()

  useEffect(() => {
    async function init() {
      const polygonPositionsTheGraphInversifyService = await container.getAsync(
        PolygonPositionsTheGraphInversifyService,
      )
      setPolygonPositionsTheGraphInversifyService(polygonPositionsTheGraphInversifyService)
    }
    init()
  }, [])

  useEffect(() => {
    if (!polygonPositionsTheGraphInversifyService) {
      return
    }
    const { eventEmitter, stopReceivingData: stopReceivingData } =
      polygonPositionsTheGraphInversifyService.pollingOpenClosePositionsTraders(tradersStrategy)

    eventEmitter.on('openClosePositionsTradersUpdate', ({ tradersInfo }) => {
      setWalletInfoState(prev => ({
        ...prev,
        walletsInfo: sortWalletsInfo({
          ...prev,
          walletsInfo: Array.from(tradersInfo.entries()).map(([walletId, postionsInfo]) => ({
            walletId,
            postionsInfo,
          })),
        }),
      }))
    })

    return () => stopReceivingData()
  }, [tradersStrategy, polygonPositionsTheGraphInversifyService])

  return (
    <div>
      <button
        onClick={() => {
          if (tradersStrategy !== strategies['all-time']) {
            setTradersStrategy(strategies['all-time'])
            setWalletInfoState(prev => ({ ...prev, walletsInfo: [] }))
          }
        }}
      >
        all-time
      </button>
      <button
        onClick={() => {
          if (tradersStrategy !== strategies['1d']) {
            setTradersStrategy(strategies['1d'])
            setWalletInfoState(prev => ({ ...prev, walletsInfo: [] }))
          }
        }}
      >
        1 day
      </button>
      <button
        onClick={() => {
          if (tradersStrategy !== strategies['1w']) {
            setTradersStrategy(strategies['1w'])
            setWalletInfoState(prev => ({ ...prev, walletsInfo: [] }))
          }
        }}
      >
        1 week
      </button>
      <button
        onClick={() => {
          if (tradersStrategy !== strategies['2w']) {
            setTradersStrategy(strategies['2w'])
            setWalletInfoState(prev => ({ ...prev, walletsInfo: [] }))
          }
        }}
      >
        2 weeks
      </button>
      <button
        onClick={() => {
          if (tradersStrategy !== strategies['1m']) {
            setTradersStrategy(strategies['1m'])
            setWalletInfoState(prev => ({ ...prev, walletsInfo: [] }))
          }
        }}
      >
        1 month
      </button>
      <button
        onClick={() => {
          if (tradersStrategy !== strategies['3m']) {
            setTradersStrategy(strategies['3m'])
            setWalletInfoState(prev => ({ ...prev, walletsInfo: [] }))
          }
        }}
      >
        3 months
      </button>
      <button
        onClick={() => {
          if (tradersStrategy !== strategies['6m']) {
            setTradersStrategy(strategies['6m'])
            setWalletInfoState(prev => ({ ...prev, walletsInfo: [] }))
          }
        }}
      >
        6 months
      </button>
      <span>
        {tradersStrategy.strategy === 'all-time'
          ? 'all-time'
          : `from last ${prettyMs(tradersStrategy.lastXSec * 1000, {
              compact: true,
            })}`}
      </span>
      <Table
        autoHeight={true}
        data={walletInfoState.walletsInfo}
        sortColumn={walletInfoState.column}
        sortType={walletInfoState.order}
        // @ts-ignore
        onSortColumn={(column: ColumnType, order: 'desc' | 'asc') => {
          setWalletInfoState(prev => ({
            column,
            order,
            walletsInfo: sortWalletsInfo({
              column,
              order,
              walletsInfo: prev.walletsInfo,
            }),
          }))
        }}
      >
        <Column width={200} sortable fixed resizable>
          <HeaderCell>
            <HeaderSummary title="Wallet Id" summary={walletInfoState.walletsInfo.length.toString()} color="#2eabdf" />
          </HeaderCell>
          <Cell dataKey="wallet-id-column">
            {
              // @ts-ignore
              (rowData: WalletInfo) =>
                rowData.walletId === '0x9cd552551ec130b50c1421649c8d11e76ac821e1' ? (
                  <a
                    style={rowData.walletId === '0x9cd552551ec130b50c1421649c8d11e76ac821e1' ? { color: 'red' } : {}}
                    target="_blank"
                    href={`https://polygonscan.com/address/${rowData.walletId}`}
                    rel="noreferrer"
                  >
                    {`${rowData.walletId.slice(0, 10)}...(contract)`}
                  </a>
                ) : (
                  <a
                    target="_blank"
                    href={`https://polygonscan.com/address/${rowData.walletId}`}
                    style={{ color: 'blue' }}
                    rel="noreferrer"
                  >
                    {`${rowData.walletId.slice(0, 10)}...`}
                  </a>
                )
            }
          </Cell>
        </Column>

        <Column width={300} sortable resizable>
          <HeaderCell>
            {tradersStrategy.strategy === 'all-time' ? (
              <HeaderSummary
                title="P&L"
                summary={toUsdcNumber(sumBigNumber(walletInfoState.walletsInfo.map(t => t.postionsInfo.pnl)), {
                  kCovert: true,
                })}
                unit="$"
                color="green"
              />
            ) : (
              <HeaderSummary
                title="P&L"
                summary={`${toUsdcNumber(sumBigNumber(walletInfoState.walletsInfo.map(t => t.postionsInfo.pnl)), {
                  kCovert: true,
                })}/${toUsdcNumber(sumBigNumber(walletInfoState.walletsInfo.map(t => t.postionsInfo.allPnl)), {
                  kCovert: true,
                })}`}
                unit="$"
                color="green"
              />
            )}
          </HeaderCell>
          <Cell dataKey="pnl-column">
            {
              // @ts-ignore
              (rowData: WalletInfo) => (
                <span style={{ color: 'green' }}>
                  {tradersStrategy.strategy === 'all-time'
                    ? `${toUsdcNumber(rowData.postionsInfo.pnl, {
                        kCovert: true,
                      })}`
                    : `${toUsdcNumber(rowData.postionsInfo.pnl, {
                        kCovert: true,
                      })}/${toUsdcNumber(rowData.postionsInfo.allPnl, {
                        kCovert: true,
                      })}`}
                  <span style={{ color: 'green' }}> $</span>
                </span>
              )
            }
          </Cell>
        </Column>

        <Column width={300} sortable resizable>
          <HeaderCell>
            {tradersStrategy.strategy === 'all-time' ? (
              <HeaderSummary
                title="Positions"
                summary={prettyNum(sum(walletInfoState.walletsInfo.map(t => t.postionsInfo.positionsHistory.length)), {
                  precision: 0,
                  thousandsSeparator: ',',
                })}
                color="#2eabdf"
              />
            ) : (
              <HeaderSummary
                title="Positions"
                summary={`${prettyNum(
                  sum(walletInfoState.walletsInfo.map(t => t.postionsInfo.positionsHistory.length)),
                  {
                    precision: 0,
                    thousandsSeparator: ',',
                  },
                )}/${prettyNum(sum(walletInfoState.walletsInfo.map(t => t.postionsInfo.allPositionsHistory.length)), {
                  precision: 0,
                  thousandsSeparator: ',',
                })}`}
                color="#2eabdf"
              />
            )}
          </HeaderCell>
          <Cell dataKey="positions-length-column">
            {
              // @ts-ignore
              (rowData: WalletInfo) => (
                <div onClick={() => console.log(rowData)}>
                  {tradersStrategy.strategy === 'all-time'
                    ? rowData.postionsInfo.positionsHistory.length
                    : `${rowData.postionsInfo.positionsHistory.length}/${rowData.postionsInfo.allPositionsHistory.length}`}
                </div>
              )
            }
          </Cell>
        </Column>
      </Table>
    </div>
  )
}
