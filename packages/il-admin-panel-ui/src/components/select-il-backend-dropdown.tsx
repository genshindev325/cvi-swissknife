import { safeObjectEntries } from '@coti-cvi/lw-sdk'
import classNames from 'classnames'
import { actions, IlBackendBaseUrls, useAppDispatch, useAppSelector } from 'il-admin-panel-ui/src/redux'
import type { FC } from 'react'
import React, { useRef, useState } from 'react'
import useOnClickOutside from '../../../beta-cvi-ui/src/hooks/useOnClickOutside'

type Props = {
  setIlBackend: React.Dispatch<React.SetStateAction<boolean>>
  setShowNetwork: React.Dispatch<React.SetStateAction<boolean>>
}

export const SelectIlBackendDropdown: FC<Props> = ({ setIlBackend, setShowNetwork }) => {
  const dispatch = useAppDispatch()
  const ilBackendBaseUrl = useAppSelector(state => state.ilBackendBaseUrl)
  const [open, setOpen] = useState<boolean>(false)
  const modalRef = useRef<HTMLDivElement>(null)

  const selectedKey = safeObjectEntries(IlBackendBaseUrls).find(
    ([key]) => IlBackendBaseUrls[key] === ilBackendBaseUrl,
  )![0]

  useOnClickOutside(modalRef, () => setOpen(false))

  return (
    <div className="relative max-w-[380px] mb-1" ref={modalRef}>
      <button
        type="button"
        onClick={() => {
          setOpen(!open)
          setIlBackend(!open)
          setShowNetwork(false)
        }}
        className={classNames({
          'flex items-center  rounded-lg  cursor-pointer w-fit justify-center m-auto': true,
        })}
      >
        <span className="capitalize">{selectedKey}</span>
      </button>
      {open && (
        <ul
          className={classNames({
            'mt-1 max-h-96 overflow-y-auto scroll-m-0 overflow-x-hidden flex flex-col gap-2 absolute z-20 bg-dark-300 py-2 px-1 w-20 rounded-b-lg -left-[0.1rem]':
              true,
            'border-2 border-x-common-lightGreen border-b-common-lightGreen border-t-dark-300 ': open,
          })}
        >
          {safeObjectEntries(IlBackendBaseUrls).map(([key, value]) => (
            <li key={key} className={classNames({ 'list-item': true })}>
              <button
                className={classNames({
                  'w-full text-left p-4  rounded-lg bg-dark-200 flex items-center': true,
                  'border border-common-lightGreen bg-common-lightGreen bg-opacity-10': selectedKey === key,
                })}
                onClick={() => {
                  dispatch(actions.setIlBackendBaseUrl(value))
                  setOpen(false)
                  setIlBackend(false)
                }}
              >
                <span className="capitalize">{key}</span>&nbsp;
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
