import { useContext } from 'react'
import { walletContext } from '../context/ConnectWalletProvider/ConnectWalletProvider'

export function useWallet() {
  const context = useContext(walletContext)

  if (context === undefined) {
    throw new Error('Please, use an inversifyService hook with an inversifyServiceProvider component')
  }

  return context
}
