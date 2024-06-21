import { useAppSelector } from 'beta-cvi-ui/src/redux'
import React from 'react'
import CviCompetitionInfo from './CviCompetitionInfo'
import CviTradingTable from '../CviTradingTable'
import CviCompetitionBanner from './CviCompetitionBanner'
import { CommunityBanner } from './CviLiveTradingCompetition'

const CviCurrentCompetition = () => {
  const tradingCompetition = useAppSelector(state => state.state.cvi.tradingCompetition)
  return (
    <div className=" flex flex-col gap-4  text-white ">
      {tradingCompetition.chooseTimestamps.toTimestamp ? (
        <>
          <CviCompetitionBanner
            fromTimestamp={tradingCompetition.chooseTimestamps.fromTimestamp}
            toTimestamp={tradingCompetition.chooseTimestamps.toTimestamp}
          />
          <CviCompetitionInfo />
          <CviTradingTable isCompetition={true} tradingData={tradingCompetition} />
        </>
      ) : (
        <CommunityBanner />
      )}
    </div>
  )
}

export default CviCurrentCompetition
