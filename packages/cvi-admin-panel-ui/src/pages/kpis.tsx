import classNames from 'classnames'
import { useMemo } from 'react'
import { ActiveUsersPerDay } from '../components/common-charts/active-users-per-day'
import { NewUsersEachDay } from '../components/common-charts/new-users-each-day'
import { RepeatingUsersEachDay } from '../components/common-charts/repeating-users-each-day'
import { RepeatingUsersByDealsInUsdc } from '../components/common-charts/repeating-vt-and-tv-traders-by-deals-in-usdc'
import { TvDepositorsPerDay } from '../components/common-charts/tv-depositors-per-day'
import { TvMonthlyAprPerDay } from '../components/common-charts/tv-monthly-apr-per-day'
import { VolumePerDay } from '../components/common-charts/volume-per-day'
import { VtTradersPerDay } from '../components/common-charts/vt-traders-per-day'
import { usdcToString } from '../utils'

export const Kpis = () => {
  const kpis = useMemo(
    () => [
      <ActiveUsersPerDay />,
      <RepeatingUsersEachDay />,
      <NewUsersEachDay />,
      <VolumePerDay />,
      <VtTradersPerDay />,
      <TvDepositorsPerDay />,
    ],
    [],
  )

  const usersTradingTrends = useMemo(() => {
    const X_CATEGORIES = [101, 1_001, 5_001, 10_001, 50_001, 100_001, 200_001, 300_001, 400_001, 500_001]

    return X_CATEGORIES.map((toUsdc, i) => {
      const fromUsdc = i === 0 ? 0 : X_CATEGORIES[i - 1] + 1
      return (
        <RepeatingUsersByDealsInUsdc
          key={i}
          chartTitle={`$${usdcToString(fromUsdc)}-$${usdcToString(toUsdc)}`}
          dealsWorthInUsdc={{ fromUsdc, toUsdc }}
        />
      )
    })
  }, [])

  return (
    <div>
      <div className="flex flex-wrap w-full">
        {kpis.map((apexchart, i) => (
          <div
            key={i}
            className={classNames({
              'h-80': true,
              'w-4/12': true,
            })}
          >
            {apexchart}
          </div>
        ))}
        <div
          className={classNames({
            'h-80': true,
            'w-full': true,
          })}
        >
          <TvMonthlyAprPerDay />
        </div>
        <div>Traders/LPs Deals Trends By Buckets Of Deals In $</div>
        <div className="flex flex-wrap w-full">
          {usersTradingTrends.map((apexchart, i) => (
            <div
              key={i}
              className={classNames({
                'h-80': true,
                'w-4/12': true,
              })}
            >
              {apexchart}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
