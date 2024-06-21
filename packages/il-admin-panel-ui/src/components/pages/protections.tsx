import type { FC } from 'react'
import React from 'react'
import { AllProtectionsTable } from '../AllProtections/AllProtectionsTable'
import { Filters } from '../AllProtections/filters/filters'

type Props = {
  showFilters: boolean
}

export const Protections: FC<Props> = ({ showFilters }) => {
  return (
    <div className="flex flex-col items-center px-4">
      {showFilters && <Filters />}
      <div className="w-full flex flex-col items-center p-4">
        <AllProtectionsTable />
      </div>
    </div>
  )
}
