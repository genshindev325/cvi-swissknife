import { CHAIN_IDS_INFO, IL_SUPPORTED_CHAIN_IDS } from '@coti-cvi/lw-sdk'
import { GetSvg } from 'beta-cvi-ui/src/utils/GetSvg'
import classNames from 'classnames'
import { actions, useAppDispatch, useAppSelector } from 'il-admin-panel-ui/src/redux'
import type { FC } from 'react'
import React, { useRef, useState } from 'react'
import useOnClickOutside from '../../../beta-cvi-ui/src/hooks/useOnClickOutside'

type Props = {
  setShowNetwork: React.Dispatch<React.SetStateAction<boolean>>
  setIlBackend: React.Dispatch<React.SetStateAction<boolean>>
}

export const SelectNetworkDropdown: FC<Props> = ({ setShowNetwork, setIlBackend }) => {
  const dispatch = useAppDispatch()
  const chainId = useAppSelector(state => state.chainId)
  const [open, setOpen] = useState<boolean>(false)
  const modalRef = useRef<HTMLDivElement>(null)

  useOnClickOutside(modalRef, () => setOpen(false))

  const selectedChain = CHAIN_IDS_INFO[chainId]

  return (
    <div className="relative max-w-[380px] pl-2 mb-1" ref={modalRef}>
      <button
        type="button"
        onClick={() => {
          setOpen(!open)
          setShowNetwork(!open)
          setIlBackend(false)
        }}
        className="flex items-center  rounded-lg  cursor-pointer w-fit justify-center m-auto pr-1"
      >
        <div className="rounded-full w-5 mr-1 ">
          <GetSvg svgName={selectedChain.blockchainName} className="w-8 h-8" />
        </div>
        <span className="capitalize">{selectedChain.blockchainName}</span>&nbsp;
        <span className="capitalize">{selectedChain.networkName}</span>&nbsp;
        {/* <span className="capitalize">{selectedChain.chainId}</span>&nbsp; */}
      </button>
      {open && (
        <ul
          className={classNames({
            'mt-1 max-h-96 overflow-y-auto scroll-m-0 overflow-x-hidden absolute z-20 bg-dark-300 p-1 rounded-lg w-fit -left-[0.1rem]':
              true,

            'border-2 border-x-common-lightGreen border-b-common-lightGreen border-t-transparent rounded-t': open,
          })}
        >
          {IL_SUPPORTED_CHAIN_IDS.map(c => CHAIN_IDS_INFO[c])
            .filter(chain => chain.backendUrls.ilBackend)
            .map(chain => (
              <li key={chain.chainId} className="list-item">
                <button
                  className={classNames({
                    ' text-left  w-[11rem] py-4  mb-4 rounded-lg bg-dark-200 flex items-center': true,
                    'border border-common-lightGreen bg-common-lightGreen bg-opacity-10': chainId === chain.chainId,
                  })}
                  onClick={() => {
                    dispatch(actions.setChainId(chain.chainId))
                    setOpen(false)
                    setShowNetwork(false)
                  }}
                >
                  <div className="rounded-full h-8 w-8 mr-1">
                    <GetSvg svgName={chain.blockchainName} className="w-8 h-8" />
                  </div>
                  <span className="capitalize">{chain.blockchainName}</span>&nbsp;
                  <span className="capitalize">{chain.networkName}</span>&nbsp;
                  {/* <span className="capitalize">{chain.chainId}</span>&nbsp; */}
                </button>
              </li>
            ))}
        </ul>
      )}
    </div>
  )
}
