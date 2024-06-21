import { MODE } from '@coti-cvi/lw-sdk/src'
import { useState } from 'react'

import ImpersonationModal from '../Modals/CommonModal'
import Impersonation from '../Impersonation/Impersonation'
import { format } from 'date-fns'

import { useLocalStorage } from '../../hooks/use-local-storage-state'

import { useAppSelector } from 'beta-cvi-ui/src/redux/hooks'
import { useChain } from 'beta-cvi-ui/src/hooks/use-chain'
import React from 'react'
import { useAddress } from '../../hooks/use-address'

const LatestBlock = () => {
  const { selectedChainInfo } = useChain()
  const providerAddress = useAppSelector(state => state.state.providerAddress)
  const { address } = useAddress()
  const [showImpersonationModal, setShowImpersonationModal] = useState<boolean>(false)
  const [fullMode] = useLocalStorage('fullMode')
  const latestBlock = useAppSelector(state => state.state.latestBlock)
  const [displaySettings] = useLocalStorage('displaySettings')

  return (
    <>
      <ImpersonationModal showModal={showImpersonationModal} setShowModal={setShowImpersonationModal} title="Settings">
        <Impersonation setShowImpersonationModal={setShowImpersonationModal} />
      </ImpersonationModal>
      {displaySettings === MODE.ON ? (
        <div className="fixed left-6 bottom-4 text-white text-xs">
          {fullMode === MODE.ON && latestBlock.data && (
            <>
              <p className="first-letter:uppercase">
                {selectedChainInfo.blockchainName} {selectedChainInfo.networkName}
              </p>
              <p>{latestBlock.data.number}</p>

              <p>{format(new Date(latestBlock.data.timestamp * 1000), 'dd/MM/yyyy HH:mm:ss')}</p>
            </>
          )}
          <p>
            Version: {process.env.PUBLIC_GIT_COMMIT_HASH!.slice(0, 8)}{' '}
            {fullMode === MODE.ON && format(new Date(process.env.PUBLIC_GIT_COMMIT_DATE_UTC!), 'dd/MM/yyyy HH:mm:ss')}
          </p>
          {fullMode === MODE.ON && (
            <button className=" underline text-common-orange" onClick={() => setShowImpersonationModal(true)}>
              Settings
            </button>
          )}
          {address && providerAddress !== address && (
            <p
              className=" text-red-400 font-bold"
              title={`custom address: ${address} \n provider address: ${providerAddress} \n`}
            >
              Impersonation mode is active
            </p>
          )}
        </div>
      ) : null}
    </>
  )
}

export default LatestBlock
