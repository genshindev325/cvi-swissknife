import { useAccount } from 'wagmi'
import { useAppSelector } from '../redux'

export function useAddress() {
  const { address } = useAccount()
  const impersolatedAddress = useAppSelector(state => state.state.impersolatedAddress)

  return {
    address: impersolatedAddress || address,
    impersonatedMode: Boolean(impersolatedAddress),
  }
}
