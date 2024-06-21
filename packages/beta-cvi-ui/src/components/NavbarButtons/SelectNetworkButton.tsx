import type { FC, PropsWithChildren } from 'react'
import { useState } from 'react'
import cn from 'classnames'
import SelectNetworkModal from '../Modals/SelectNetworkModal'
import { MODE } from '@coti-cvi/lw-sdk'
import { useAppSelector } from 'beta-cvi-ui/src/redux/hooks'
import { useLocalStorage } from '../../hooks/use-local-storage-state'
import { GetSvg } from 'beta-cvi-ui/src/utils/GetSvg'
import { useChain } from 'beta-cvi-ui/src/hooks/use-chain'

type Props = {
  navbarOpen: boolean
}

const SelectNetworkButton: FC<PropsWithChildren<Props>> = ({ navbarOpen }) => {
  const { selectedChainInfo } = useChain()
  const themeWebSite = useAppSelector(state => state.state.themeWeb)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [fullMode] = useLocalStorage('fullMode')

  return (
    <>
      <SelectNetworkModal showModal={showModal} setShowModal={setShowModal} />
      <li
        className={cn({
          'flex lg:justify-start nav-item cursor-pointer items-center h-full lg:ml-auto': true,
          'lg:py-0 w-full flex justify-center px-4 sm:px-0': navbarOpen,
        })}
      >
        <button
          type="button"
          className={`${themeWebSite} ${cn({
            'text-white  p-2 lg:w-32 h-3/6 focus:outline-none font-bold rounded text-left lg:text-xs flex lg:justify-start  items-center border border-custom-200':
              true,

            'w-full py-4 sm:h-20 lg:h-3/6 text-lg lg:text-xs xs:w-102  flex my-6 justify-center ': navbarOpen,

            'bg-common-red border-common-red flex justify-center': !selectedChainInfo.chainId,
          })}`}
          onClick={() => setShowModal(true)}
        >
          <GetSvg className="w-6 h-6" svgName={selectedChainInfo.blockchainName} />
          <p className="pl-2 capitalize truncate">
            {fullMode === MODE.ON ? selectedChainInfo.hardhatConfigNetworkName : selectedChainInfo.blockchainName}
          </p>
        </button>
      </li>
    </>
  )
}

export default SelectNetworkButton
