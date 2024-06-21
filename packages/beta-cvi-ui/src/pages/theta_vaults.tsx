import React from 'react'
import MainVault from '../components/VaultComponents/VaultMainPage/MainVault'

const ThetaVaultsPage = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-8 justify-center items-center  h-full w-full mt-4 md:mt-16">
      <MainVault vaultName="1x" />
      {/* <MainVault vaultName="1x" comingSoon /> */}
    </div>
  )
}
export default ThetaVaultsPage
