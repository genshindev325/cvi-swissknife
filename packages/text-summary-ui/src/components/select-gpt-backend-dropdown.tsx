import { BackendEnvironment, safeObjectEntries } from '@coti-cvi/lw-sdk'
import classNames from 'classnames'
import type { FC } from 'react'
import React, { useRef, useState } from 'react'
import useOnClickOutside from '../../../beta-cvi-ui/src/hooks/useOnClickOutside'
import { useAppDispatch, useAppSelector, actions } from '../redux'

type Props = {
  setGraphBackend: React.Dispatch<React.SetStateAction<boolean>>
  setShowNetwork: React.Dispatch<React.SetStateAction<boolean>>
}

export const SelectGraphBackendDropdown: FC<Props> = ({ setGraphBackend, setShowNetwork }) => {
  const dispatch = useAppDispatch()
  const graphBackendBaseUrl = useAppSelector(state => state.chatGptWrapperBackendEnvironment)
  const [open, setOpen] = useState<boolean>(false)
  const modalRef = useRef<HTMLDivElement>(null)

  const selectedKey = safeObjectEntries(BackendEnvironment).find(
    ([key]) => BackendEnvironment[key] === graphBackendBaseUrl,
  )![0]

  useOnClickOutside(modalRef, () => setOpen(false))

  return (
    <div className="relative max-w-[380px] mb-1" ref={modalRef}>
      <button
        type="button"
        onClick={() => {
          setOpen(!open)
          setGraphBackend(!open)
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
          {safeObjectEntries(BackendEnvironment).map(([key, value]) => (
            <li key={key} className={classNames({ 'list-item': true })}>
              <button
                className={classNames({
                  'w-full text-left p-4  rounded-lg bg-dark-200 flex items-center': true,
                  'border border-common-lightGreen bg-common-lightGreen bg-opacity-10': selectedKey === key,
                })}
                onClick={() => {
                  dispatch(actions.setChatGptBackendEnviroment(value))
                  setOpen(false)
                  setGraphBackend(false)
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
