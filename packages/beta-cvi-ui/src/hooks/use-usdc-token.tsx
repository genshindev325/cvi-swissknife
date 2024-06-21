import usePromise from 'react-use-promise'
import { useChain } from './use-chain'
import { useWallet } from './useWallet'

export function useUsdcToken() {
  const { selectedChainInfo } = useChain()
  const { inversifyContainer } = useWallet()
  const [tokenUSDC] = usePromise(
    async () => inversifyContainer?.getByBlockchain(selectedChainInfo.blockchainName, 'TokenUSDC'),
    [selectedChainInfo, inversifyContainer],
  )
  return tokenUSDC
}
