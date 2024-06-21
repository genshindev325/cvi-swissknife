import { useContext } from 'react'
import { cviInversifyServicesContext } from '../context/ConnectWalletProvider/TvInversifyServicesProvider'

export function useTvInversifyServices() {
  return useContext(cviInversifyServicesContext)
}
