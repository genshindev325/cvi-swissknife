import { MODE, WebSite } from '@coti-cvi/lw-sdk'
import type { FC, PropsWithChildren } from 'react'
import CommonModal from './CommonModal'
import NetworkList from '../NetworkList/NetworkList'
import { useLocalStorage } from '../../hooks/use-local-storage-state'
import { useAppSelector } from '../../redux/hooks'
import { useChain } from 'beta-cvi-ui/src/hooks/use-chain'

type Props = {
  showModal: boolean
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
}

const SelectNetworkModal: FC<PropsWithChildren<Props>> = ({ showModal, setShowModal }) => {
  const { selectedChainInfo } = useChain()
  const [fullMode] = useLocalStorage('fullMode')
  const themeWebSite = useAppSelector(state => state.state.themeWeb)

  return (
    <CommonModal title="Select a network" showModal={showModal} setShowModal={setShowModal}>
      <p className="mt-4">
        {fullMode === MODE.ON ? (
          <>
            <span className="flex flex-row gap-1">
              You are currently browsing
              <span>{themeWebSite === WebSite.Cvi ? 'theta.cvi.finance' : 'armadillo.is'}</span> on
            </span>
            <span className="capitalize">{selectedChainInfo.blockchainName}</span> {selectedChainInfo.networkName}
          </>
        ) : (
          <>
            <span className="flex flex-row gap-1">
              You are currently browsing
              <span>{themeWebSite === WebSite.Cvi ? 'theta.cvi.finance' : 'armadillo.is'}</span> on
            </span>
            <span className="capitalize">{selectedChainInfo.blockchainName}</span>
          </>
        )}
      </p>

      <NetworkList setShowModal={setShowModal} />
    </CommonModal>
  )
}

export default SelectNetworkModal
