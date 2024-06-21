import { useLocalStorage } from 'beta-cvi-ui/src/hooks/use-local-storage-state'

import { actions, useAppSelector } from 'beta-cvi-ui/src/redux'
import React from 'react'
import { useDispatch } from 'react-redux'
import CommonModal from '../Modals/CommonModal'

const CviIntroModal = () => {
  const dispatch = useDispatch()
  const showModal = useAppSelector(state => state.state.showCviIntroModal)
  const [, setShowCviIntroModalLocal] = useLocalStorage('showCviIntroModal')

  return (
    <CommonModal
      type="cviTermModal"
      showModal={showModal}
      setShowModal={() => dispatch(actions.setShowCviIntroModal(false))}
    >
      <span className="flex flex-col gap-8">
        <span>
          By clicking on “Confirm”, you declare that you do not qualify as U.S. person and that you agree to comply with
          our{' '}
          <a
            className="underline underline-offset-4 text-common-turquoise"
            href="/terms"
            target="_blank"
            rel="noopener noreferrer"
          >
            terms and conditions
          </a>
          , which contain the details of the access restrictions to this website.
        </span>
        <button
          className=" py-2 px-8 w-fit m-auto bg-common-blueSky rounded-sm"
          onClick={async () => {
            setShowCviIntroModalLocal(false)
            dispatch(actions.setShowCviIntroModal(false))
            dispatch(actions.setConnectWalletModal({ modalIsOpen: true }))
          }}
        >
          CONFIRM
        </button>
      </span>
    </CommonModal>
  )
}

export default CviIntroModal
