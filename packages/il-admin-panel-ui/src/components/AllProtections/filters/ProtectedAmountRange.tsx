import { useEffect, useState } from 'react'
import { isNumeric } from '@coti-cvi/lw-sdk'
import { actions, useAppDispatch, useAppSelector } from '../../../redux'

type Props = {}

export const ProtectedAmountRange = ({}: Props) => {
  const dispatch = useAppDispatch()
  const startProtectionAmountRange = useAppSelector(state => state.selected.protectedAmountMin)
  const endProtectionAmountRange = useAppSelector(state => state.selected.protectedAmountMax)

  const [start, setStart] = useState(startProtectionAmountRange.toString())
  const [end, setEnd] = useState(endProtectionAmountRange.toString())

  useEffect(() => {
    if (isNumeric(start)) {
      dispatch(actions.setMinimumProtectedAmountSelectedRange(Number(start)))
    }
  }, [dispatch, start])

  useEffect(() => {
    if (isNumeric(end)) {
      dispatch(actions.setMaximumProtectedAmountSelectedRange(Number(end)))
    }
  }, [dispatch, end])

  return (
    <div>
      <div className="justify-center flex items-center my-1 gap-4 flex-wrap">
        <div>
          Filter by Protected Amount range: from{' '}
          <input
            className="text-black w-20 text-center"
            type={'number'}
            value={start}
            onChange={e => setStart(e.target.value)}
          />{' '}
          to{' '}
          <input
            className="text-black w-30 text-center"
            type={'text'}
            value={end}
            onChange={e => setEnd(e.target.value)}
          />{' '}
          USDC
        </div>
      </div>
    </div>
  )
}
