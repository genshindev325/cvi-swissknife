import { safeObjectEntries } from '@coti-cvi/lw-sdk/src'
import classNames from 'classnames'
import type { FC } from 'react'
import { useEvents } from '../../hooks'
import { actions } from '../../redux'
import { useAppDispatch, useAppSelector } from '../../redux/redux-hook'
import { FilterNewAccountsFromSpecificDateRange } from '../../redux/types'

type Props = {}

export const FilterAccountsFromSpecificDateRange: FC<Props> = () => {
  const dispatch = useAppDispatch()
  const {} = useEvents()
  const onlyNewAccountsFromDateRange = useAppSelector(state => state.filters.onlyNewAccountsFromDateRange)

  return (
    <div className="justify-center flex gap-6">
      <span>Only New Accounts From:</span>
      <span className="justify-center flex gap-6">
        {safeObjectEntries(FilterNewAccountsFromSpecificDateRange).map(([eventName, eventDates]) => {
          const isChecked =
            eventDates.fromSeconds === onlyNewAccountsFromDateRange?.fromSeconds &&
            eventDates.toSeconds === onlyNewAccountsFromDateRange?.toSeconds
          return (
            <span
              key={eventName}
              className="flex gap-2"
              onClick={() => {
                dispatch(actions.setOnlyNewAccountsFromDateRange(eventDates))
              }}
            >
              <input
                type="radio"
                checked={isChecked}
                onChange={() => {
                  //
                }}
              />
              <span
                className={classNames({
                  'text-cyan-500': isChecked,
                })}
              >
                {eventName}
              </span>
            </span>
          )
        })}
        <span
          className="flex gap-2"
          onClick={() => {
            dispatch(actions.setOnlyNewAccountsFromDateRange(undefined))
          }}
        >
          <input
            type="radio"
            checked={!onlyNewAccountsFromDateRange}
            onChange={() => {
              //
            }}
          />
          <span
            className={classNames({
              'text-cyan-500': !onlyNewAccountsFromDateRange,
            })}
          >
            None
          </span>
        </span>
      </span>
    </div>
  )
}
