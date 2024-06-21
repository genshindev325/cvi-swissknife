import classNames from 'classnames'
import { safeObjectEntries } from '@coti-cvi/lw-sdk'
import { get, merge, isNumber } from 'lodash'
import { GetSvg } from '../../../beta-cvi-ui/src/utils/GetSvg'
import { useAppDispatch, useAppSelector, actions } from '../redux'
import type { AllEvents } from '../redux/selected-columns-in-tables'
import { ALL_TABLE_COLUMNS } from '../redux/selected-columns-in-tables'
import { useStrictCurrentPath } from '../hooks/use-strict-current-path'
import { useOrderBy } from '../hooks/useOrderBy'
import { useMemo } from 'react'

export const EventsTable = <Event extends AllEvents[keyof AllEvents]>({
  table,
  events,
  showAccountAddress,
  rowOnClick,
  tableRename,
}: {
  table: keyof AllEvents
  events: Event[]
  showAccountAddress: boolean
  tableRename?: string
  rowOnClick?: (event: Event) => void
}) => {
  const currentPath = useStrictCurrentPath()
  const dispatch = useAppDispatch()

  const selectedColumnsInTables = useAppSelector(state => state.selectedColumnsInTables)

  const tablesColumnInfo = useMemo(
    () => merge({}, selectedColumnsInTables.tv, selectedColumnsInTables.vt),
    [selectedColumnsInTables.tv, selectedColumnsInTables.vt],
  )

  const visibleColumns =
    table === 'VtCviTransferEvent'
      ? safeObjectEntries(tablesColumnInfo[table])
          .filter(([_columnName, columnInfo]) => columnInfo.visible)
          .sort((a, b) => a[1].columnIndex - b[1].columnIndex)
      : safeObjectEntries(tablesColumnInfo[table])
          .filter(([columnName, columnInfo]) => {
            if (columnInfo.visible) {
              if (columnName === 'account') {
                return showAccountAddress
              }
              return columnInfo.visible
            }
            return false
          })
          .sort((a, b) => a[1].columnIndex - b[1].columnIndex)

  const { orderBy, onOrderBy } = useOrderBy(
    visibleColumns.map(([columnKey]) => columnKey),
    'blockNumber',
  )

  const nonVisibleColumns = safeObjectEntries(tablesColumnInfo[table])
    .filter(([columnName, _columnInfo]) => visibleColumns.map(a => a).every(v => v[0] !== columnName))
    .sort((a, b) => a[1].columnIndex - b[1].columnIndex)

  return (
    <div key={tableRename ?? table}>
      <span>{tableRename ?? table}</span>
      <div className="flex gap-4">
        {nonVisibleColumns.length > 0 && (
          <div className="flex gap-2 bg-white p-1 rounded-lg border-2 overflow-auto w-full flex-wrap">
            {nonVisibleColumns.map((c, i) => (
              <button
                key={i}
                className="border border-dark-600 text-xs text-dark-600 py-1 px-2 rounded-lg flex items-center gap-2 self-baseline hover:bg-gray-300"
                onClick={() =>
                  dispatch(
                    actions.setColumnVisibilityInTable({
                      tableType: currentPath === '/theta_vaults' ? 'tv' : 'vt',
                      //@ts-ignore
                      tableName: table,
                      column: c[0],
                      visible: true,
                    }),
                  )
                }
              >
                {ALL_TABLE_COLUMNS[c[0]].header(table)}
                <GetSvg svgName="remove" className="fill-black" />
              </button>
            ))}
          </div>
        )}
      </div>
      <table
        className={classNames({
          'table-auto w-full bg-common-cancel bg-opacity-50 rounded-lg my-4 text-xs overflow-x-auto block whitespace-nowrap':
            true,
          'opacity-50': events.length === 0,
        })}
      >
        <thead>
          <tr className="text-left border-b border-gray-600">
            {visibleColumns.map(([columnKey, _columnInfo], i) => (
              <th
                key={i}
                className={classNames({
                  'p-4': i == 0,
                  'p-2': i > 0,
                })}
              >
                <div className="flex gap-1">
                  {
                    //@ts-ignore
                    ALL_TABLE_COLUMNS[columnKey].header(table)
                  }
                  <button
                    type="button"
                    onClick={() =>
                      dispatch(
                        actions.setColumnVisibilityInTable({
                          tableType: currentPath === '/theta_vaults' ? 'tv' : 'vt',
                          //@ts-ignore
                          tableName: table,
                          column: columnKey,
                          visible: false,
                        }),
                      )
                    }
                  >
                    <GetSvg svgName="remove" />
                  </button>

                  <button type="button" onClick={() => onOrderBy(columnKey)}>
                    <GetSvg
                      svgName="chevron"
                      className={classNames({
                        'w-6 h-6 min-w-[24px] fill-white transition-all delay-75': true,
                        ['fill-common-turquoise']: orderBy.key === columnKey,
                        ['rotate-180']: orderBy.key === columnKey && orderBy.option === 'asc',
                      })}
                    />
                  </button>
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {events.length === 0 ? (
            <tr>
              <td className="p-4">No Data</td>
            </tr>
          ) : (
            events
              .sort((a, b) => {
                const aValue =
                  orderBy.key === 'blockNumber' || orderBy.key === 'blockTimestamp'
                    ? get(a, orderBy.key.split('.'))
                    : get(a.args, orderBy.key.split('.'))

                const bValue =
                  orderBy.key === 'blockNumber' || orderBy.key === 'blockTimestamp'
                    ? get(b, orderBy.key.split('.'))
                    : get(b.args, orderBy.key.split('.'))

                if (isNumber(aValue) && isNumber(bValue)) {
                  return orderBy.option === 'asc' ? Number(aValue) - Number(bValue) : Number(bValue) - Number(aValue)
                }
                return orderBy.option === 'asc'
                  ? String(aValue).charCodeAt(0) - String(bValue).charCodeAt(0)
                  : String(bValue).charCodeAt(0) - String(aValue).charCodeAt(0)
              })
              .map((event, i) => (
                <tr
                  key={i}
                  className={classNames({
                    'odd:bg-common-cancel hover:bg-slate-600': true,
                    'cursor-pointer': rowOnClick,
                  })}
                  onClick={() => rowOnClick && rowOnClick(event)}
                >
                  {visibleColumns.map(([columnKey, _columnInfo], i) => {
                    //@ts-ignore
                    const jiffa = ALL_TABLE_COLUMNS[columnKey].value({
                      value:
                        columnKey === 'blockNumber' ||
                        columnKey === 'blockTimestamp' ||
                        columnKey === 'transactionIndex' ||
                        columnKey === 'logIndex' ||
                        columnKey === 'transactionHash'
                          ? get(event, columnKey.split('.'))
                          : get(event.args, columnKey.split('.')),
                      event,
                      table,
                    })

                    return (
                      <td
                        key={i}
                        className={classNames({
                          'p-4': i === 0,
                          'p-2': i > 0,
                        })}
                      >
                        {jiffa}
                      </td>
                    )
                  })}
                </tr>
              ))
          )}
        </tbody>
      </table>
    </div>
  )
}
