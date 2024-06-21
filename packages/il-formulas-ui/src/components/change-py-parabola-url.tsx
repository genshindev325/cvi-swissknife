import type { FC } from 'react'
import { Combobox } from 'react-widgets'
import { safeObjectEntries } from '../../../lw-sdk/src'
import { actions, useAppDispatch, useAppSelector } from '../redux'
import { PyParabolaBaseUrls } from '../types'

type Props = {}

export const ChangePyParabolaBaseUrls: FC<Props> = () => {
  const dispatch = useAppDispatch()
  const pyParabolaBaseUrls = useAppSelector(state => state.state.pyParabolaBaseUrls)

  const data = safeObjectEntries(PyParabolaBaseUrls).map(([source, baseUrl]) => ({ source, baseUrl }))

  return (
    <div>
      Choose environment:
      <Combobox
        style={{
          width: '300px',
        }}
        data={data}
        value={data.find(d => d.baseUrl === pyParabolaBaseUrls)}
        onChange={value => {
          if (typeof value !== 'string') {
            dispatch(actions.setPyParabolaBaseUrls(value.baseUrl))
          }
        }}
        textField={'source'}
      />
    </div>
  )
}
