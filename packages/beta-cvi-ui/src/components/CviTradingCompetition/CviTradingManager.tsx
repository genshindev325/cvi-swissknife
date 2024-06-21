import { GetSvg } from 'beta-cvi-ui/src/utils/GetSvg'
import React from 'react'
import '@leenguyen/react-flip-clock-countdown/dist/index.css'
import Tabs from '../Tabs/Tabs'
import { LeaderboardTabsPaths, CompetitionTabsPaths } from 'beta-cvi-ui/src/types/common.types'
import { useLocation } from 'react-router-dom'
import CviLiveTradingCompetition from './CompetitionManager/CviLiveTradingCompetition'
import CompetitionManager from './CompetitionManager/CompetitionManager'
import CviTopTradingCometions from './CompetitionManager/CviTopTradingCometions'

const CviTradingManager = () => {
  const location = useLocation()

  let chartsActiveTab = LeaderboardTabsPaths['Top-trades']
  chartsActiveTab = location.hash.includes(LeaderboardTabsPaths['Top-trades'])
    ? LeaderboardTabsPaths['Top-trades']
    : !location.hash.includes(CompetitionTabsPaths.current) &&
      !location.hash.includes(CompetitionTabsPaths.history) &&
      !location.hash.includes(LeaderboardTabsPaths.competition)
    ? location.hash.includes(LeaderboardTabsPaths.live)
      ? LeaderboardTabsPaths.live
      : LeaderboardTabsPaths['Top-trades']
    : LeaderboardTabsPaths.competition

  return (
    <div className="m-auto px-6 flex flex-col gap-4  text-white w-full md:w-[48rem] lg:w-[52rem] ">
      <span className="flex gap-2 flex-wrap justify-between">
        <span className="text-xl">Leaderboard</span>
        <a
          className="flex flex-row items-center gap-1 text-custom-300 text-xs"
          href="https://cviofficial.medium.com/cvi-v3-trading-competition-62c1be542446"
          target="_blank"
          rel="noreferrer"
        >
          Competition rules <GetSvg svgName={'popLink'} className="cursor-pointer fill-custom-300" />
        </a>
      </span>
      <span className="flex flex-col gap-3 w-full">
        <Tabs
          tabs={[
            { name: 'Leaders', path: LeaderboardTabsPaths['Top-trades'] },
            { name: 'Live', path: LeaderboardTabsPaths.live },
            { name: 'Competitions', path: LeaderboardTabsPaths.competition },
          ]}
          activeTab={chartsActiveTab}
          type={'funding_fee'}
        />
        {chartsActiveTab === LeaderboardTabsPaths['Top-trades'] ? (
          <CviTopTradingCometions />
        ) : chartsActiveTab === LeaderboardTabsPaths.live ? (
          <CviLiveTradingCompetition />
        ) : (
          <CompetitionManager />
        )}
      </span>
    </div>
  )
}

export default CviTradingManager
