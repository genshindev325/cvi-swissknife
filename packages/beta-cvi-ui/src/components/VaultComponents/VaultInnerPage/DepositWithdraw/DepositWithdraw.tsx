import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useAddress } from '../../../../hooks/use-address'
import { useTvInversifyServices } from '../../../../hooks/useTvInversifyServices'
import { useAppSelector } from '../../../../redux/hooks'
import { VaultsTabsPaths } from '../../../../types/common.types'
import Slider from '../../../Slider/Slider'
import VaultContainer from '../../VaultContainer'
import Deposit from './Deposit'
import Withdraw from './Withdraw'

const DepositWithdraw = () => {
  const { address } = useAddress()
  const location = useLocation()
  const [activeTabKey, setActiveTabKey] = useState<keyof typeof VaultsTabsPaths>('deposit')
  const { thetaVaultInversifyService, tvContractsEventsInversifyService } = useTvInversifyServices()
  // const [startCountingTime, setStartCountingTime] = useState<boolean>(false)
  const latestBlock = useAppSelector(state => state.state.latestBlock)
  const withdrawLock = useAppSelector(state => state.state.cvi.tv.withdrawLock)
  const [isUpdateOnce, setIsUpdateOnce] = useState(true)
  const [amount, setAmount] = useState<number | undefined>()

  useEffect(() => {
    if (location.hash.includes(VaultsTabsPaths.deposit)) {
      setActiveTabKey('deposit')
      setAmount(undefined)
    } else if (location.hash.includes(VaultsTabsPaths.withdraw)) {
      setActiveTabKey('withdraw')
      setAmount(undefined)
    }
  }, [location.hash])

  // useEffect(() => {
  //   const updateVaultTable = () => {
  //     if (!tvContractsEventsInversifyService || !address) {
  //       return
  //     }
  //     if (startCountingTime) {
  //       console.log(':')
  //       const r = setTimeout(() => {
  //         tvContractsEventsInversifyService.emitTransactionsOfAddressEvent(address)
  //       }, 1800000)
  //       console.log(r)
  //     }
  //   }
  // }, [address, startCountingTime, tvContractsEventsInversifyService])

  useEffect(() => {
    if (!isUpdateOnce && latestBlock.data && withdrawLock.data && withdrawLock.data.isLocked) {
      const secondsLeft = withdrawLock.data.lockEndTimestamp - latestBlock.data.timestamp
      if (secondsLeft > 0 && !isUpdateOnce) {
        setIsUpdateOnce(true)
      }
    }
  }, [isUpdateOnce, latestBlock.data, withdrawLock.data])

  useEffect(() => {
    if (
      address &&
      latestBlock.data &&
      withdrawLock.data &&
      withdrawLock.data?.isLocked &&
      thetaVaultInversifyService &&
      tvContractsEventsInversifyService
    ) {
      // we dont use withdrawLock.data.timeLeftSeconds  because we want to be able to manipulate the time using hardhat for tests
      const secondsLeft = withdrawLock.data.lockEndTimestamp - latestBlock.data.timestamp

      if (secondsLeft <= 0 && isUpdateOnce) {
        thetaVaultInversifyService.emitLockWithdrawEvents(address)
        tvContractsEventsInversifyService.emitTransactionsOfAddressEvent(address)
        setIsUpdateOnce(false)
      }
    }
  }, [
    address,
    isUpdateOnce,
    latestBlock.data,
    thetaVaultInversifyService,
    tvContractsEventsInversifyService,
    withdrawLock.data,
  ])

  return (
    <VaultContainer className="p-6" vaultName="">
      <Slider options={VaultsTabsPaths} stateTab={activeTabKey} className="mb-14 h-12 stiny:h-17 p-1 stiny:p-2" />
      {activeTabKey === VaultsTabsPaths.deposit ? (
        <Deposit amount={amount} setAmount={setAmount} />
      ) : (
        <Withdraw amount={amount} setAmount={setAmount} />
      )}
    </VaultContainer>
  )
}

export default DepositWithdraw
