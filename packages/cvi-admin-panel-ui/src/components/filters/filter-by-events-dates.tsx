import classNames from 'classnames'
import { format } from 'date-fns'
import type { FC } from 'react'
import { useMemo } from 'react'
import { DatePicker } from 'react-widgets'
import { useEvents } from '../../hooks'
import { useDatesRange } from '../../hooks/use-dates-range'
import { actions } from '../../redux'
import { useAppDispatch, useAppSelector } from '../../redux/redux-hook'
import { DatesRangeOptions } from '../../redux/types'

type Props = { minimalUi?: boolean }

export const FilterByEventsDates: FC<Props> = ({ minimalUi }) => {
  const dispatch = useAppDispatch()
  const { allEventsAsc: allEvents } = useEvents()
  const datesRange = useDatesRange()
  const latestBlock = useAppSelector(state => state.latestBlock.data)

  const minFromSeconds = useMemo(
    () => (allEvents.length === 0 ? datesRange.fromSeconds : Math.min(...allEvents.map(e => e.blockTimestamp))),
    [datesRange.fromSeconds, allEvents],
  )

  const maxToSeconds = latestBlock?.timestamp ?? Math.floor(Date.now() / 1000)

  return (
    <div>
      {!minimalUi && (
        <div className="justify-center flex gap-6">
          <div className="flex gap-6">
            <label htmlFor="from-dp">From:</label>
            <DatePicker
              includeTime
              name="from-dp"
              valueDisplayFormat={(d: Date) => format(d, 'dd/MM/yyyy HH:mm:ss')}
              valueFormat={(d: Date) => format(d, 'dd/MM/yyyy HH:mm:ss')}
              onChange={e => {
                return (
                  e &&
                  dispatch(
                    actions.setFilterEventsDateRange({
                      option: DatesRangeOptions.Custom,
                      fromSeconds: Math.floor(e.getTime() / 1000),
                      toSeconds: datesRange.toSeconds,
                    }),
                  )
                )
              }}
              value={new Date(datesRange.fromSeconds * 1000)}
              min={new Date(minFromSeconds * 1000)}
              max={new Date(datesRange.toSeconds * 1000)}
            />
          </div>
          <div className="flex gap-6">
            <label htmlFor="to">To:</label>
            <DatePicker
              disabled
              includeTime
              name="to-dp"
              valueDisplayFormat={(d: Date) => format(d, 'dd/MM/yyyy HH:mm:ss')}
              valueFormat={(d: Date) => format(d, 'dd/MM/yyyy HH:mm:ss')}
              onChange={e =>
                e &&
                dispatch(
                  actions.setFilterEventsDateRange({
                    option: DatesRangeOptions.Custom,
                    fromSeconds: datesRange.fromSeconds,
                    toSeconds: Math.floor(e.getTime() / 1000),
                  }),
                )
              }
              value={new Date((datesRange.toSeconds < maxToSeconds ? datesRange.toSeconds : maxToSeconds) * 1000)}
              min={new Date(datesRange.fromSeconds * 1000)}
              max={new Date(maxToSeconds * 1000)}
            />
          </div>
          <button
            className="flex gap-6"
            onClick={() => {
              const from = new Date(datesRange.fromSeconds * 1000)
              from.setHours(0, 0, 0, 0)
              const to = new Date(datesRange.toSeconds * 1000)
              to.setHours(0, 0, 0, 0)
              dispatch(
                actions.setFilterEventsDateRange({
                  option: DatesRangeOptions.Custom,
                  fromSeconds: Math.floor(from.getTime() / 1000),
                  toSeconds: Math.floor(to.getTime() / 1000),
                }),
              )
            }}
          >
            Reset To MM/DD 00:00:00
          </button>
        </div>
      )}
      <div className="justify-center flex gap-6">
        {Object.values(DatesRangeOptions)
          .filter(
            option =>
              (!minimalUi || option !== DatesRangeOptions.Custom) && option !== DatesRangeOptions.TradingCompetition1,
          )
          .map(option => (
            <span
              key={option}
              className="flex gap-2"
              onClick={() => {
                if (option !== DatesRangeOptions.Custom) {
                  dispatch(
                    actions.setFilterEventsDateRange({
                      option,
                    }),
                  )
                }
              }}
            >
              <input
                type="radio"
                disabled={option === DatesRangeOptions.Custom || allEvents.length === 0}
                checked={datesRange.option === option}
                onChange={() => {
                  //
                }}
              />
              <span
                className={classNames({
                  'text-cyan-500': datesRange.option === option,
                })}
              >
                {option}
              </span>
            </span>
          ))}
      </div>
    </div>
  )
}
