import { useEffect, useState } from 'react'
import { isNumeric } from '@coti-cvi/lw-sdk'
import { actions, useAppDispatch, useAppSelector } from '../../../redux'
import { format } from 'date-fns'

type Props = {}

export const ProtectionsDateRange = ({}: Props) => {
  const dispatch = useAppDispatch()
  const startProtectionsDateRange = useAppSelector(state => state.selected.startProtectionsDateRange)
  const endProtectionsDateRange = useAppSelector(state => state.selected.endProtectionsDateRange)

  const [start, setStart] = useState(startProtectionsDateRange.xDaysAgo.toString())
  const [end, setEnd] = useState(endProtectionsDateRange.nextXDays.toString())

  useEffect(() => {
    if (isNumeric(start)) {
      dispatch(actions.setStartProtectionsSelectedDateRange({ xDaysAgo: Number(start) }))
    }
  }, [dispatch, start])

  useEffect(() => {
    if (isNumeric(end)) {
      dispatch(actions.setEndProtectionsSelectedDateRange({ nextXDays: Number(end) }))
    }
  }, [dispatch, end])

  const toDateString = (dateMs: number): string => format(new Date(dateMs), 'dd-MM-yyyy (HH:mm:ss)')

  return (
    <div>
      <div className="justify-center flex items-center my-1 gap-4 flex-wrap">
        <div>
          Show protections by range: bought{' '}
          <input
            className="text-black w-10 text-center"
            type={'number'}
            value={start}
            onChange={e => setStart(e.target.value)}
          />{' '}
          days ago and will expired in the next{' '}
          <input
            className="text-black w-10 text-center"
            type={'text'}
            value={end}
            onChange={e => setEnd(e.target.value)}
          />{' '}
          days
        </div>
      </div>
      <div className="justify-center flex items-center my-1 gap-4 flex-wrap">
        Using selected Range:
        <span className="text-common-orange">
          {toDateString(Date.now() - startProtectionsDateRange.xDaysAgo * 1000 * 60 * 60 * 24)}
        </span>{' '}
        -{' '}
        <span className="text-common-orange">
          {' '}
          {toDateString(Date.now() + endProtectionsDateRange.nextXDays * 1000 * 60 * 60 * 24)}
        </span>
      </div>
    </div>
  )
}
