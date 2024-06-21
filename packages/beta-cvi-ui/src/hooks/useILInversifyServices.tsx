import { useContext } from 'react'
import { ilInversifyServicesContext } from '../context/ConnectWalletProvider/ILInversifyServicesProvider'

export function useILInversifyServices() {
  return useContext(ilInversifyServicesContext)
}
