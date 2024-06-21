import type { FC } from 'react'
import { useEffect, useState } from 'react'
import { ChangeValues } from './change-values'
import { AllCharts } from './charts/all-charts'
import { ChangeChainId } from './change-chain'
import { PremiumFormula } from './premium-formula'
import { useAppSelector } from '../redux'
import { useLocalStorage } from '../hooks/use-local-storage-state'
import { ChangePairAndPeriod } from './change-pair-and-period'
import { ChangePyParabolaBaseUrls } from './change-py-parabola-url'
import { useSeriesDownloader } from '../hooks/use-series-downloader'
import { CHART_NAMES } from '../utils'
import useInversify from '../hooks/use-inversify'
import { convertPremiumValues } from '../convert-premium-values'

const gitCommitHash = process.env.GIT_COMMIT_HASH!
const gitCommitDateUtc = process.env.GIT_COMMIT_DATE_UTC!

type Props = {}

export const Main: FC<Props> = () => {
  const [isDebugMode, setIsDebugMode] = useLocalStorage('isDebugMode')
  const selectedPairAndPeriod = useAppSelector(state => state.state.selectedPairAndPeriod)
  const overridenValues = useAppSelector(state => state.state.overridenValues)
  const [, updateClearCache] = useState(0)
  const queue = useSeriesDownloader()
  const { tokenUSDC } = useInversify()

  useEffect(() => {
    console.log(`Debug Mode is ${isDebugMode ? 'Enabled' : 'Disabled'}`)
  }, [isDebugMode])

  return (
    <div>
      <div>
        <div>Pending {queue.stats.pendingCount} Series...</div>
        <div>Processing {queue.stats.processingCount} Series...</div>
        <br />
      </div>

      <ChangePyParabolaBaseUrls />
      <ChangeChainId />
      <ChangePairAndPeriod />
      {selectedPairAndPeriod &&
        (overridenValues && tokenUSDC ? (
          <>
            <br />
            <br />
            <PremiumFormula />
            <br />
            <br />
            <ChangeValues
              initialInputs={convertPremiumValues({
                from: 'number',
                to: 'string',
                tokenUSDC,
                values: overridenValues,
              })}
            />
            <br />
            <br />
            <button
              onClick={() => {
                for (const chartName of CHART_NAMES) {
                  queue.push({
                    chartName,
                    selectedPairAndPeriod,
                    premiumValues: overridenValues,
                  })
                }
              }}
            >
              re-evaluate all charts
            </button>
          </>
        ) : (
          <div>Loading...</div>
        ))}
      <AllCharts />
      <div>
        <span>Debug Mode: {isDebugMode ? 'Enabled' : 'Disabled'}</span>{' '}
        <button onClick={() => setIsDebugMode(prev => !prev)}>{isDebugMode ? 'Disable' : 'Enable'}</button>
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
          Commit: <b>{gitCommitHash.slice(0, 8)}</b> ({gitCommitDateUtc})
        </span>
      </div>
    </div>
  )
}
