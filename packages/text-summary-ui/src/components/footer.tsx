import type { FC } from 'react'
import React, { useState } from 'react'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import { actions, useAppDispatch, useAppSelector } from '../redux'

TimeAgo.setDefaultLocale(en.locale)
TimeAgo.addLocale(en)

const timeAgo = new TimeAgo('en-US')

const gitCommitHash = process.env.GIT_COMMIT_HASH!
const gitCommitDateUtc = process.env.GIT_COMMIT_DATE_UTC!

type Props = {}

export const Footer: FC<Props> = () => {
  const dispatch = useAppDispatch()
  const isDebugMode = useAppSelector(state => state.isDebugMode)

  const [, updateClearCache] = useState(0)

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
      <div>
        <span>Cache: {localStorage.length} entries</span>{' '}
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
          onClick={() => {
            localStorage.clear()
            updateClearCache(prev => prev + 1)
          }}
        >
          Clear Cache
        </button>
      </div>
      <br />
      <div>
        <span>
          Commit: <b>{gitCommitHash.slice(0, 8)}</b> ({timeAgo.format(new Date(gitCommitDateUtc))})
        </span>
      </div>
    </div>
  )
}
