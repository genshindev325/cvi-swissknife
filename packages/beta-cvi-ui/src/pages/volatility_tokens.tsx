import React from 'react'

// import InnerContainer from '../components/InnerContainer/InnerContainer'
import Charts from '../components/Charts/Charts'
import MintBurnModal from '../components/VolatilityTokensComponents/MintBurnModal'
import MintContainer from '../components/VolatilityTokensComponents/MintContainer'
import PendingReqManager from '../components/VolatilityTokensComponents/PendingReqManager/PendingReqManager'

const VolatilityTokensPage = () => {
  return (
    <>
      <MintBurnModal />
      <div className="flex flex-col lg:flex-row gap-6 mt-4 md:mt-16 pb-6 px-6">
        <MintContainer />
        <div className="flex flex-col gap-6 lg:w-3/4">
          <div
            id="cvi-chart"
            className=" justify-center w-full self-start flex bg-custom-container-bg rounded-xl flex-col gap-6 p-6 sm:p-10"
          >
            <Charts />
          </div>
          <PendingReqManager />
        </div>
      </div>
    </>
  )
}

export default VolatilityTokensPage
