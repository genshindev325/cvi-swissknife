import type { FC } from 'react'
import { actions } from '../../redux'
import { useAppDispatch, useAppSelector } from '../../redux/redux-hook'
import { Multiselect } from 'react-widgets'
import { ToAddress } from '../to-address'
import { useEvents } from '../../hooks'

type Props = {}

export const FilterByAddresses: FC<Props> = () => {
  const dispatch = useAppDispatch()

  const { allEventsAsc, addressToGroupMap } = useEvents()
  const filteredAddresses = useAppSelector(state => state.filters.addresses)
  const excludingAddresses = useAppSelector(state => state.filters.excluding.addresses)

  return (
    <div className="justify-center flex gap-10">
      <div className="justify-center flex w-8/12">
        <span>Only Accounts:</span>
        <div className="w-8/12">
          {filteredAddresses.length > 10 ? (
            `${filteredAddresses.length} accounts`
          ) : (
            <Multiselect
              className="w-8/12"
              data={Array.from(
                new Set(
                  allEventsAsc.flatMap(e =>
                    e.type === 'VtCviTransferEvent' ? [e.args.fromAccount, e.args.toAccount] : [e.args.account],
                  ),
                ),
              )}
              value={filteredAddresses}
              groupBy={a => addressToGroupMap.get(a)}
              renderListItem={item => <ToAddress address={item.item} disableLink minimize />}
              renderTagValue={tag => <ToAddress address={tag.item} disableLink minimize />}
              onChange={newSelected => dispatch(actions.setFilteredAddresses(newSelected))}
            />
          )}
        </div>
      </div>
      <div className="justify-center flex gap-2 w-6/12">
        <span>Exclude Accounts:</span>
        <Multiselect
          className="w-6/12"
          data={Array.from(
            new Set(
              allEventsAsc.flatMap(e =>
                e.type === 'VtCviTransferEvent' ? [e.args.fromAccount, e.args.toAccount] : [e.args.account],
              ),
            ),
          )}
          value={excludingAddresses}
          groupBy={a => addressToGroupMap.get(a)}
          renderListItem={item => <ToAddress address={item.item} disableLink minimize />}
          renderTagValue={tag => <ToAddress address={tag.item} disableLink minimize />}
          onChange={newSelected => dispatch(actions.setFilteredExcludingAddresses(newSelected))}
        />
      </div>
    </div>
  )
}
