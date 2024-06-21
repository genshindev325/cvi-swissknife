import { actions, useAppSelector } from 'beta-cvi-ui/src/redux'
import React, { useCallback } from 'react'
import CommonModal from './CommonModal'
import { useAccount, useConnect } from 'wagmi'
import { useDispatch } from 'react-redux'
import { GetSvg } from 'beta-cvi-ui/src/utils/GetSvg'
import { useChain } from 'beta-cvi-ui/src/hooks/use-chain'
import { CHAIN_IDS_INFO } from '@coti-cvi/lw-sdk'
import { displayNotification } from 'beta-cvi-ui/src/utils/utilities'
import CustomNotification from '../CustomNotification'

const ConnectWalletModal = () => {
  const themeWeb = useAppSelector(({ state }) => state.themeWeb)
  const dispatch = useDispatch()
  const connectWalletModal = useAppSelector(state => state.state.connectWalletModal)
  const { selectedChainInfo, setDefaultChainInfo } = useChain()
  const { connect, connectAsync, connectors } = useConnect()
  const { address } = useAccount()
  // If the error code (error.code) is 4902, then the requested chain has not been added by the injected wallet,
  // and you have to request to add it via wallet_addEthereumChain.
  const ERROR_CODE_addEthereumChain = 4902 as const

  const getConnectorName = (providerName: string) => {
    switch (providerName) {
      case 'MetaMask':
        return 'metamask'
      case 'Coinbase Wallet':
        return 'coinbase'
      case 'WalletConnect':
        return 'walletconnect'
      default:
        return 'metamask'
    }
  }
  const displayInstallProviderNotifications = useCallback((providerName: string) => {
    displayNotification({
      id: `installProvider`,
      title: `${providerName}`,
      type: 'info',
      message: `${providerName} not detected.`,
      content: CustomNotification,
    })
  }, [])

  const onConnect = (connector: typeof connectors[0]) => {
    connectAsync({ connector, chainId: Number('0x' + Number(selectedChainInfo.chainId).toString(16)) })
      .then(() => {
        if (window.gtag && connector.name) {
          window.gtag('event', `connected_${connector.name}`, {
            page_title: `connected_${connector.name}`,
            connected_title: `Successful - connect to ${connector.name}`,
            page_path: window.location.pathname,
          })
        }
        return setDefaultChainInfo(CHAIN_IDS_INFO[selectedChainInfo.chainId])
      })
      .catch(error => {
        if (error.message.includes('Connector not found')) {
          const providerName = getConnectorName(connector.name)
          displayInstallProviderNotifications(providerName)
        } else if (error.code === ERROR_CODE_addEthereumChain) {
          // this is an edge case for Coinbase wallet.
          // when Coinbase try to connect to chain that is not recognise, he try to add in the wallet and connect the user,
          // but this function throw an error--> mutation.ts:250 Error: Unrecognized chain ID. Try adding the chain using addEthereumChain first.
          // in the mean time Coinbase resolved this problem so the use need to refresh or we need to connect one more time.
          // ------------- IF YOU CAN FIX THAT WITHOUT THIS SOLUTINE SO DO IT ----------------
          connect({ connector, chainId: Number('0x' + Number(selectedChainInfo.chainId).toString(16)) })
          if (window.gtag && connector.name) {
            window.gtag('event', `connected_${connector.name}`, {
              page_title: `connected_${connector.name}`,
              connected_title: `Successful - connect to ${connector.name}`,
              page_path: window.location.pathname,
            })
          }
          setDefaultChainInfo(CHAIN_IDS_INFO[selectedChainInfo.chainId])
        } else {
          throw new Error(error)
        }
      })

    dispatch(actions.setConnectWalletModal({ modalIsOpen: false }))
  }

  return (
    <>
      <CommonModal
        type="connectWalletModal"
        showModal={connectWalletModal.modalIsOpen}
        setShowModal={() => dispatch(actions.setConnectWalletModal({ modalIsOpen: false }))}
      >
        {connectors.map(connector => {
          return (
            <div key={connector.id} className="flex flex-col gap-6 text-black p-2">
              <button
                className="flex flex-row gap-2 items-center hover:shadow-[0_5px_15px_rgba(0,0,0,0.35)]    py-2 px-6 border rounded-lg "
                key={connector.id}
                onClick={() => onConnect(connector)}
              >
                <GetSvg svgName={getConnectorName(connector.name)} className="w-8 h-8" />
                <span>{connector.name}</span>
              </button>
            </div>
          )
        })}
      </CommonModal>
    </>
  )
}

export default ConnectWalletModal
