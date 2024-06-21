import type { FC } from 'react'
import React from 'react'
import { actions, useAppDispatch, useAppSelector } from '../redux'
import { format } from 'date-fns'
import { diffTimeFromNow } from '../utils'

const gitCommitHash = process.env.GIT_COMMIT_HASH!
const gitCommitDateUtc = process.env.GIT_COMMIT_DATE_UTC!

type Props = {}

export const Footer: FC<Props> = () => {
  const dispatch = useAppDispatch()
  const isDebugMode = useAppSelector(state => state.isDebugMode)
  const latestBlock = useAppSelector(state => state.latestBlock)

  return (
    <div className="flex flex-col items-center p-4">
      <div>
        <span>Debug Mode: {isDebugMode ? 'Enabled' : 'Disabled'}</span>{' '}
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
          onClick={() => dispatch(actions.setIsDebugMode(!isDebugMode))}
        >
          {isDebugMode ? 'Disable' : 'Enable'}
        </button>
      </div>
      <br />
      <br />
      <div>
        <div>
          Commit: <b>{gitCommitHash.slice(0, 8)}</b> (
          {diffTimeFromNow({ dateMs: new Date(gitCommitDateUtc).getTime(), nowMs: Date.now() })})
        </div>
        <div>
          {latestBlock.status === 'resolved' ? (
            <>
              <p>Latest block time: {format(latestBlock.data.timestamp * 1000, 'dd/MM/yy HH:mm:ss')}</p>
              <p>Latest block number: {latestBlock.data.number}</p>
            </>
          ) : (
            '-'
          )}
        </div>
      </div>
    </div>
  )
}
