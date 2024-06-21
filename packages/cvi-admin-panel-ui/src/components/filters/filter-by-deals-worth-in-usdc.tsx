import { isNum } from '@coti-cvi/lw-sdk/src'
import type { FC } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { actions } from '../../redux'
import { useAppDispatch, useAppSelector } from '../../redux/redux-hook'

type Props = {}

export const FilterByDealsWorthInUsdc: FC<Props> = () => {
  const dispatch = useAppDispatch()
  const dealsWorthInUsdc = useAppSelector(state => state.filters.dealsWorthInUsdc)
  const [fromUsdcStr, setFromUsdcStr] = useState<string>('')
  const [toUsdcStr, setToUsdcStr] = useState<string>('')

  useEffect(() => {
    if (fromUsdcStr === '' && dealsWorthInUsdc.fromUsdc !== undefined) {
      dispatch(actions.setFilterDealsWorthInUsdc({ ...dealsWorthInUsdc, fromUsdc: undefined }))
    }
    if (isNum(fromUsdcStr) && Number(fromUsdcStr) !== dealsWorthInUsdc.fromUsdc) {
      dispatch(actions.setFilterDealsWorthInUsdc({ ...dealsWorthInUsdc, fromUsdc: Number(fromUsdcStr) }))
    }
    if (toUsdcStr === '' && dealsWorthInUsdc.toUsdc !== undefined) {
      dispatch(actions.setFilterDealsWorthInUsdc({ ...dealsWorthInUsdc, toUsdc: undefined }))
    }
    if (isNum(toUsdcStr) && Number(toUsdcStr) !== dealsWorthInUsdc.toUsdc) {
      dispatch(actions.setFilterDealsWorthInUsdc({ ...dealsWorthInUsdc, toUsdc: Number(toUsdcStr) }))
    }
  }, [dealsWorthInUsdc, dispatch, fromUsdcStr, toUsdcStr])

  useEffect(() => {
    setFromUsdcStr(prev => {
      if (isNum(prev) && Number(prev) !== dealsWorthInUsdc.fromUsdc) {
        return dealsWorthInUsdc.fromUsdc?.toString() ?? ''
      }
      return prev
    })
    setToUsdcStr(prev => {
      if (isNum(prev) && Number(prev) !== dealsWorthInUsdc.toUsdc) {
        return dealsWorthInUsdc.toUsdc?.toString() ?? ''
      }
      return prev
    })
  }, [dealsWorthInUsdc.fromUsdc, dealsWorthInUsdc.toUsdc])

  return (
    <div className="justify-center flex gap-6">
      <span>Deals Worth:</span>
      <span>From:</span>
      <div>
        <input
          type="text"
          className="text-black"
          value={dealsWorthInUsdc?.fromUsdc ?? ''}
          onChange={e => setFromUsdcStr(e.target.value)}
        />
        <span>$</span>
      </div>
      <span>To:</span>
      <div>
        <input
          type="text"
          className="text-black"
          value={dealsWorthInUsdc?.toUsdc ?? ''}
          onChange={e => setToUsdcStr(e.target.value)}
        />
        <span>$</span>
      </div>
    </div>
  )
}
