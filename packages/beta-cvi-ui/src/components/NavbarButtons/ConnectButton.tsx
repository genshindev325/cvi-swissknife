import type { FC, PropsWithChildren, ReactElement } from 'react'
import { useState } from 'react'
import cn from 'classnames'
import { ellipseAddress } from '../../utils/utilities'
import CommonModal from '../Modals/CommonModal'
import Button from '../Button/Button'
import { useWallet } from '../../hooks/useWallet'
import { WebSite } from 'beta-cvi-ui/src/context/ConnectWalletProvider/ConnectWalletProvider'
import { useAppSelector } from 'beta-cvi-ui/src/redux/hooks'
import { actions } from '../../redux'
import classNames from 'classnames'
import { useDispatch } from 'react-redux'
import { useLocalStorage } from 'beta-cvi-ui/src/hooks/use-local-storage-state'
import { useDisconnect, useConnect } from 'wagmi'
import { useShowRestrictRegionModal } from 'beta-cvi-ui/src/hooks/use-show-restrict-region-modal'
import { useAddress } from '../../hooks/use-address'
import { useImpersonation } from 'beta-cvi-ui/src/hooks/useImpersonation'
import { useSearchParams } from 'react-router-dom'

type Props = {
  type: 'mobile' | 'navbar' | 'table' | 'form'
  className?: string
  navbarOpen?: boolean
}

const ConnectButton: FC<PropsWithChildren<Props>> = ({ type, className, navbarOpen }) => {
  const { globalEventsInversifyService } = useWallet()
  const dispatch = useDispatch()
  const connectifNotRestrict = useShowRestrictRegionModal()
  const themeWebSite = useAppSelector(state => state.state.themeWeb)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [showCviIntroModal] = useLocalStorage('showCviIntroModal')
  const { address, impersonatedMode } = useAddress()
  const { disconnect } = useDisconnect()
  const { onExitImpersonation } = useImpersonation()
  const [searchParams, setSearchParams] = useSearchParams()
  const { connectors } = useConnect()
  const onDisconnect = () => {
    if (impersonatedMode) {
      onExitImpersonation()
      const param = searchParams.get('impersonate')

      if (param) {
        // 👇️ delete each query param
        searchParams.delete('impersonate')

        // 👇️ update state after
        setSearchParams(searchParams)
      }
    }
    const walletBeforeDisconnect = connectors.find(c => c.ready === true)?.name

    disconnect()
    if (window.gtag && walletBeforeDisconnect) {
      window.gtag('event', `diconnected_${walletBeforeDisconnect}`, {
        page_title: `diconnected_${walletBeforeDisconnect}`,
        diconnected_title: `User diconnected to ${walletBeforeDisconnect}`,
        page_path: window.location.pathname,
      })
    }
    setShowModal(false)
  }

  const openModal = () => {
    if (connectifNotRestrict) {
      dispatch(actions.setShowRestrictModal(true))
      if (window.gtag) {
        window.gtag('event', 'restricted_modal_opened', {
          page_title: 'restricted_modal_opened',
          restricted_modal_title: 'Restricted modal opened',
          description: 'The restricted modal opened because the user in a restricted area.',
          page_path: window.location.pathname,
        })
      }
      return
    }

    if (showCviIntroModal && !impersonatedMode) {
      dispatch(actions.setShowCviIntroModal(true))
      return
    }

    if (address) {
      setShowModal(true)
    } else {
      dispatch(actions.setConnectWalletModal({ modalIsOpen: true }))
    }
  }

  const renderContainer = (children: ReactElement) => {
    switch (type) {
      case 'navbar': {
        return (
          <li
            className={cn({
              'flex lg:justify-start nav-item cursor-pointer  items-center h-full': true,
              '  lg:py-0 flex justify-center w-full mb-20 px-4 sm:px-0 lg:mb-0': navbarOpen,
            })}
          >
            {children}
          </li>
        )
      }

      default: {
        return (
          <div
            className={cn({
              'flex lg:justify-start nav-item cursor-pointer  items-center h-full': true,
              'lg:ml-0 ': type === 'table',
              'w-full': type === 'form',
            })}
          >
            {children}
          </div>
        )
      }
    }
  }

  const isButtonDisabled = !globalEventsInversifyService

  return (
    <>
      <CommonModal showModal={showModal} setShowModal={setShowModal} title="Account">
        <p className="text-white p-4 w-full  break-words ">{address}</p>
        <Button type="common" title="disconnect" onClick={() => onDisconnect()} />
      </CommonModal>
      {renderContainer(
        <>
          <button
            disabled={isButtonDisabled}
            onClick={openModal}
            type="button"
            className={`${themeWebSite}  ${classNames({
              'text-white font-bold rounded whitespace-nowrap': true,
              'lg:w-28 h-3/6': type === 'navbar' && !navbarOpen,
              ' py-4 sm:py-0  sm:h-20 lg:h-3/6 lg:w-28  xs:w-102 flex  justify-center items-center':
                type === 'navbar' && navbarOpen,
              'font-bold w-fit flex items-center justify-end  lg:w-20 pr-2 border-none active:border-none text-custom-connect-bg':
                type === 'table',
              ' border border-custom-connect-bg bg-custom-connect-bg hover:bg-custom-connect-bg-opacity-20  active:border-custom-connect-bg active:bg-transparent active:text-custom-connect-bg':
                !address && (type === 'navbar' || type === 'mobile'),
              'border border-custom-network-border hover:bg-custom-network-border-opacity-20 hover:text-white ':
                address,
              'bg-dark-100 w-full h-14 border-transparent text-common-orange hover:border hover:border-common-orange hover:bg-custom-connect-bg-opacity-20 active:border-custom-connect-bg active:bg-transparent active:text-custom-connect-bg':
                type === 'form',
              uppercase: type !== 'table' && !address && themeWebSite === WebSite.Cvi,
              [className ?? '']: !!className,
            })}`}
          >
            {address ? (
              <div className="flex justify-center  items-center w-full font-sans">
                <div
                  className={`${themeWebSite} ${classNames({
                    'max-w-[0.50rem] max-h-[0.50rem] w-[0.50rem] h-[0.50rem] bg-custom-network-border  rounded-full mr-1':
                      true,
                  })}`}
                ></div>
                <p className=" text-lg lg:text-xs font-thin truncate">{ellipseAddress(address, 5)}</p>
              </div>
            ) : themeWebSite === WebSite.Cvi || (themeWebSite === WebSite.Armadillo && type === 'table') ? (
              'Connect'
            ) : (
              'Connect wallet'
            )}
          </button>
        </>,
      )}
    </>
  )
}

export default ConnectButton
