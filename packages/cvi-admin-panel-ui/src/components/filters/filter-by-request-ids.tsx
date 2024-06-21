import type { FC } from 'react'
import { actions } from '../../redux'
import { useAppDispatch, useAppSelector } from '../../redux/redux-hook'
import { Multiselect } from 'react-widgets'
import { isNumber } from 'lodash'
import { useEvents } from '../../hooks'

type Props = {}

export const FilterByRequestIds: FC<Props> = () => {
  const dispatch = useAppDispatch()
  const { tvEventsAsc: tvEvents, vtEventsWithoutTransferAndSwapAsc: vtEventsWithoutTransferAndSwap } = useEvents()
  const requestIds = useAppSelector(state => state.filters.requestIds)

  return (
    <div className="flex flex-col gap-4">
      <div className="justify-center flex gap-6">
        <span>Tv Request IDs:</span>
        <Multiselect
          className="w-5/12"
          data={Array.from(new Set(tvEvents.map(e => e.args.requestId))).sort((a, b) => a - b)}
          value={requestIds.tv}
          onChange={newSelected =>
            dispatch(actions.setFilterTvRequestIds(newSelected.flatMap(r => (isNumber(r) ? [Number(r)] : []))))
          }
        />
      </div>
      <div className="justify-center flex gap-6">
        <span>Vt Request IDs:</span>
        <Multiselect
          className="w-5/12"
          data={Array.from(new Set(vtEventsWithoutTransferAndSwap.map(e => e.args.requestId))).sort((a, b) => a - b)}
          value={requestIds.vt}
          onChange={newSelected =>
            dispatch(actions.setFilterVtRequestIds(newSelected.flatMap(r => (isNumber(r) ? [Number(r)] : []))))
          }
        />
      </div>
    </div>
  )
}
