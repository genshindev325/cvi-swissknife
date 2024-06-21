import { CompetitionTabsPaths } from 'beta-cvi-ui/src/types/common.types'

import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Slider from '../../Slider/Slider'
import CviCurrentCompetition from './CviCurrentCompetition'
import CviHistoryTradingCompetitions from './CviHistoryTradingCompetitions'

const CompetitionManager = () => {
  const location = useLocation()
  const [competitionSliderTabKey, setCompetitionSliderTabKey] = useState<keyof typeof CompetitionTabsPaths>(
    CompetitionTabsPaths.history,
  )

  useEffect(() => {
    if (location.hash.includes(CompetitionTabsPaths.history)) {
      setCompetitionSliderTabKey(CompetitionTabsPaths.history)
    } else if (location.hash.includes(CompetitionTabsPaths.current)) {
      setCompetitionSliderTabKey(CompetitionTabsPaths.current)
    }
  }, [location.hash])
  return (
    <div className="flex flex-col gap-2 p-1 ">
      <Slider
        options={CompetitionTabsPaths}
        stateTab={competitionSliderTabKey}
        className="text-xs  w-48 h-9 p-1 border ml-auto border-3 border-dark-300 "
      />
      {competitionSliderTabKey === CompetitionTabsPaths.history ? (
        <CviHistoryTradingCompetitions />
      ) : (
        <CviCurrentCompetition />
      )}
    </div>
  )
}

export default CompetitionManager
