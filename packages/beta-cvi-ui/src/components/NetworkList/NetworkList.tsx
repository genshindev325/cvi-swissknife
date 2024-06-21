import type { FC, PropsWithChildren } from 'react'
import classNames from 'classnames'
import type { IlSupportedChainIds, TvSupportedChainIds } from '@coti-cvi/lw-sdk'
import { NetworkName } from '@coti-cvi/lw-sdk'
import { TV_SUPPORTED_CHAIN_IDS } from '@coti-cvi/lw-sdk'
import { WebSite } from '@coti-cvi/lw-sdk'
import { CHAIN_IDS_INFO, IL_SUPPORTED_CHAIN_IDS, MODE } from '@coti-cvi/lw-sdk'
import { useWallet } from '../../hooks/useWallet'
import { useLocalStorage } from '../../hooks/use-local-storage-state'
import { GetSvg } from 'beta-cvi-ui/src/utils/GetSvg'
import { useChain } from 'beta-cvi-ui/src/hooks/use-chain'

import { useSwitchNetwork } from 'wagmi'
import { useAppSelector } from 'beta-cvi-ui/src/redux'
import { useAddress } from '../../hooks/use-address'

type Props = {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
  type?: 'wrongNetwork'
}

const NetworkList: FC<PropsWithChildren<Props>> = ({ type = undefined, setShowModal }) => {
  const { address } = useAddress()
  const { switchNetworkAsync } = useSwitchNetwork()
  const { selectedChainInfo, setDefaultChainInfo } = useChain()

  const { globalEventsInversifyService } = useWallet()
  const [fullMode] = useLocalStorage('fullMode')
  const themeWebSite = useAppSelector(state => state.state.themeWeb)
  const visibleNetworks =
    themeWebSite === WebSite.Cvi
      ? TV_SUPPORTED_CHAIN_IDS.filter(id =>
          fullMode === MODE.OFF ? CHAIN_IDS_INFO[id].networkName === NetworkName.Mainnet : true,
        )
      : IL_SUPPORTED_CHAIN_IDS.filter(id =>
          fullMode === MODE.OFF ? CHAIN_IDS_INFO[id].networkName === NetworkName.Mainnet : true,
        )

  const onChangeNetwork = (_chainId: IlSupportedChainIds | TvSupportedChainIds) => {
    if (address) {
      if (switchNetworkAsync) {
        switchNetworkAsync(Number(_chainId))
          .then(() => {
            setShowModal(false)
            setDefaultChainInfo(CHAIN_IDS_INFO[_chainId])
          })
          .catch(error => {
            throw new Error(error)
          })
      }
    } else {
      setDefaultChainInfo(CHAIN_IDS_INFO[_chainId])
      setShowModal(false)
    }
  }

  return (
    <ul className="mt-4 max-h-96 overflow-y-auto scroll-m-0 overflow-x-hidden w-full ">
      {visibleNetworks
        .map(c => CHAIN_IDS_INFO[c])
        .map(chain => (
          <li key={chain.chainId} className="list-item">
            <button
              className={classNames({
                'w-full text-left p-4 mb-4 rounded-lg bg-dark-200 flex items-center': true,
                'border border-common-lightGreen bg-common-lightGreen bg-opacity-10':
                  selectedChainInfo.chainId === chain.chainId,
              })}
              disabled={!globalEventsInversifyService}
              onClick={() => onChangeNetwork(chain.chainId)}
            >
              <GetSvg svgName={chain.blockchainName} className="rounded-full h-8 w-8 mr-4" />
              <span className="capitalize">{chain.blockchainName}</span>&nbsp;
              {fullMode === MODE.ON && <span>{chain.networkName}</span>}
            </button>
          </li>
        ))}
    </ul>
  )
}

export default NetworkList
