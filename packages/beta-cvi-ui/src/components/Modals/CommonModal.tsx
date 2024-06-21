import type { FC, PropsWithChildren } from 'react'
import { useEffect, useRef } from 'react'
import classNames from 'classnames'
import useOnClickOutside from 'beta-cvi-ui/src/hooks/useOnClickOutside'
import { useAppSelector } from 'beta-cvi-ui/src/redux/hooks'
import { useSearchParams } from 'react-router-dom'

type Props = {
  title?: string | JSX.Element
  showModal: boolean
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
  type?:
    | 'buyProtectionModal'
    | 'stakeUnstakeModal'
    | 'embedNft'
    | 'restrict'
    | 'cviTermModal'
    | 'connectWalletModal'
    | 'impersonate'
}

const CommonModal: FC<PropsWithChildren<Props>> = ({ title, showModal, setShowModal, children, type }) => {
  const themeWebSite = useAppSelector(state => state.state.themeWeb)
  const [searchParams, setSearchParams] = useSearchParams()
  const modalRef = useRef<HTMLDivElement>(null)

  const removeImpersonateParams = () => {
    if (type === 'impersonate') {
      const param = searchParams.get('impersonate')

      if (param) {
        // 👇️ delete each query param
        searchParams.delete('impersonate')

        // 👇️ update state after
        setSearchParams(searchParams)
      }
    }
  }

  const handleOutsideModal = () => {
    //👇 if the user click outside witout submit
    removeImpersonateParams()
    setShowModal(false)
  }
  useOnClickOutside(modalRef, handleOutsideModal)

  useEffect(() => {
    if (showModal) {
      document.body.style.overflowY = 'hidden'
    }
    return () => {
      document.body.style.overflowY = 'auto'
    }
  }, [showModal])
  return showModal ? (
    <>
      <div
        className={classNames({
          'z-[8999] fixed left-0 top-0 outline-none focus:outline-none  flex flex-col justify-center  text-white max-w-full w-full h-full overflow-auto p-4 lg:pt-16':
            true,
          'bg-dark-700 bg-opacity-75': type !== 'restrict',
          'bg-dark-800 bg-opacity-100': type === 'restrict',
          'z-[9001]': type === 'embedNft',
          'z-[9999]': type === 'restrict',
        })}
      >
        <div
          ref={modalRef}
          className={`${themeWebSite} ${classNames({
            ' border border-1 border-custom-500 rounded-lg shadow-lg flex flex-col justify-center  outline-none focus:outline-none w-fit p-6 sm:p-11 max-w-full mx-auto relative':
              true,
            'bg-dark-600': type !== 'connectWalletModal',
            'bg-white': type === 'connectWalletModal',
            'w-118':
              type === 'buyProtectionModal' ||
              type === 'stakeUnstakeModal' ||
              type === 'embedNft' ||
              type === 'impersonate',
            'w-124': type === 'cviTermModal',
          })}`}
        >
          <h3
            className={classNames({
              'text-2xl': true,
            })}
          >
            {title}
          </h3>
          <button
            className={classNames({
              'p-1  flex justify-center absolute top-2 right-2 bg-transparent  text-black text-3xl leading-none font-semibold outline-none focus:outline-none':
                true,
            })}
            onClick={e => {
              //👇 if the user click outside witout submit
              removeImpersonateParams()
              setShowModal(false)
            }}
          >
            <span
              className={classNames({
                'bg-transparent  h-6 w-6 text-2xl block outline-none focus:outline-none': true,
                'text-white': type !== 'connectWalletModal',
                'text-black': type === 'connectWalletModal',
              })}
            >
              ×
            </span>
          </button>
          {children}
        </div>
      </div>
    </>
  ) : null
}

export default CommonModal
