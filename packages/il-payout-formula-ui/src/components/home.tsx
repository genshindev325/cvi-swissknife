import type { FC } from 'react'
import React, { useContext, useEffect, useState } from 'react'
import { ChangeChainId } from './change-chain'
import { ChangeValues } from './change-values'
import { AllCharts } from './charts/all-charts'
import { PayoutFormula } from './premium-formula'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import { inversifyContext } from '../inversify-context'
import { actions, useAppDispatch, useAppSelector } from '../redux'
import { Stator } from '@coti-cvi/lw-sdk'

TimeAgo.setDefaultLocale(en.locale)
TimeAgo.addLocale(en)

const timeAgo = new TimeAgo('en-US')

type Props = {}

const gitCommitHash = process.env.GIT_COMMIT_HASH!
const gitCommitDateUtc = process.env.GIT_COMMIT_DATE_UTC!

const isDebugModeLocalStorageKey = `il-payout-formula-ui::is-debug-mode`

export const Home: FC<Props> = () => {
  const context = useContext(inversifyContext)

  const dispatch = useAppDispatch()
  const isDebugMode = useAppSelector(state => state.state.isDebugMode)
  const [, updateClearCache] = useState(0)

  useEffect(() => {
    const result = localStorage.getItem(isDebugModeLocalStorageKey)
    dispatch(actions.setDebugMode(result === 'true'))
  }, [dispatch])

  useEffect(() => {
    localStorage.setItem(isDebugModeLocalStorageKey, isDebugMode ? 'true' : 'false')
  }, [dispatch, isDebugMode])

  useEffect(() => {
    async function f() {
      const currentIlRatio = await context.iLProtectionInversifyService
        .getMaxILProtectedPercentage()
        .then(r => r.number / 100)
      dispatch(actions.setCurrentMaxIlRatio(Stator.resolve(currentIlRatio)))
    }
    f()
  }, [context.iLProtectionInversifyService, dispatch])

  if (!context) {
    return null
  }

  return (
    <div>
      <h1 className="text-3xl font-bold border-common-orange border-b-2 mb-16">IL Payout Formula</h1>
      <div>
        <ChangeChainId />
        <br />
        <PayoutFormula />
        <br />
        <ChangeValues />
        <br />
        <AllCharts />
        <div>
          <span>Debug Mode: {isDebugMode ? 'Enabled' : 'Disabled'}</span>{' '}
          <button onClick={() => dispatch(actions.setDebugMode(!isDebugMode))}>
            {isDebugMode ? 'Disable' : 'Enable'}
          </button>
        </div>
        <div>
          <span>Cache: {localStorage.length} entries</span>{' '}
          <button
            onClick={() => {
              localStorage.clear()
              updateClearCache(prev => prev + 1)
            }}
          >
            Clear Cache
          </button>
        </div>
        <div>
          <span>
            Commit: <b>{gitCommitHash.slice(0, 8)}</b> ({timeAgo.format(new Date(gitCommitDateUtc))})
          </span>
        </div>
      </div>
    </div>
  )
}
