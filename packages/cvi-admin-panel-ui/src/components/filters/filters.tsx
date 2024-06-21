import type { FC } from 'react'
import { actions, useAppDispatch } from '../../redux'
import { FilterByAddresses } from './filter-by-addresses'
import { FilterByAddressTypes } from './filter-by-address-groups'
import { FilterByEventsDates } from './filter-by-events-dates'
import { FilterByRequestIds } from './filter-by-request-ids'
import { FilterByEventTypes } from './filter-by-event-types'
import { FilterByDealsWorthInUsdc } from './filter-by-deals-worth-in-usdc'
import { FilterAccountsFromSpecificDateRange } from './filter-new-accounts-from-date-range'

type Props = {
  showOnlyDates?: boolean
}

export const Filters: FC<Props> = ({ showOnlyDates }) => {
  const dispatch = useAppDispatch()

  if (showOnlyDates) {
    return (
      <div className="flex flex-col gap-4">
        <FilterByEventsDates minimalUi />
        <FilterAccountsFromSpecificDateRange />
        <br />
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-4">
      <FilterByDealsWorthInUsdc />
      <FilterByEventTypes />
      <FilterByAddressTypes />
      <FilterByEventsDates />
      <FilterByAddresses />
      <FilterAccountsFromSpecificDateRange />
      <FilterByRequestIds />
      <div className="justify-center flex gap-6">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
          onClick={() => dispatch(actions.resetFilters())}
        >
          Reset Filters
        </button>
      </div>
    </div>
  )
}
