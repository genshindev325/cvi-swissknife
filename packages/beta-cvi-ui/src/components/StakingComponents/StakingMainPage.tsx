import React from 'react'
import StakingBox from './StakingBox'

const StakingMainPage = () => {
  return (
    <div className="flex flex-row flex-wrap gap-8 justify-center items-center  ">
      <StakingBox stakingName="govi" />

      {/* <StakingBox stakingName="1x" />

      <StakingBox stakingName="2x" /> */}
    </div>
  )
}

export default StakingMainPage
