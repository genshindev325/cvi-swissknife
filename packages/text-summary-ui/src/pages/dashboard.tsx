import { CustomError, ErrorKind } from '@coti-cvi/lw-sdk'
import type { FC } from 'react'
import { actions, useAppDispatch, useAppSelector } from '../redux'

type Props = {}

export const Dashboard: FC<Props> = () => {
  const dispatch = useAppDispatch()
  const fullMode = useAppSelector(state => state.fullMode)

  return (
    <div>
      <div>
        <span>
          Full Mode: <b>{fullMode ? 'ON' : 'OFF'}</b>
        </span>
        {' -> '}
        <button onClick={() => dispatch(actions.setFullMode(!fullMode))}>{fullMode ? 'Turn Off' : 'Turn On'}</button>
      </div>
      <div>
        <span>Test sentry:</span>
        {' -> '}
        <button
          onClick={() => {
            throw new CustomError({
              name: 'Custom Error',
              message: 'This is a custom error',
              errorKind: ErrorKind.SystemError,
              extras: {},
            })
          }}
        >
          TEST
        </button>{' '}
      </div>
    </div>
  )
}
