import type { FC } from 'react'
import { actions } from '../../redux'
import { useAppDispatch, useAppSelector } from '../../redux/redux-hook'
import { Multiselect } from 'react-widgets'
import { AddressGroup } from '@coti-cvi/lw-sdk/src'

type Props = {}

export const FilterByAddressTypes: FC<Props> = () => {
  const dispatch = useAppDispatch()
  const accountGroups = useAppSelector(state => state.filters.addressGroups)

  return (
    <div className="justify-center flex gap-6">
      <span>Address Groups:</span>
      <Multiselect
        className="w-10/12"
        data={Object.values(AddressGroup)}
        value={accountGroups}
        onChange={newSelected => dispatch(actions.setFilteredAddressGroups(newSelected))}
      />
    </div>
  )
}
