import { actions, useAppSelector } from 'beta-cvi-ui/src/redux'

import React from 'react'
import { useDispatch } from 'react-redux'
import CommonModal from '../Modals/CommonModal'

const RestrictionModal = () => {
  const showRestrictModal = useAppSelector(state => state.state.showRestrictModal)
  const dispath = useDispatch()

  return (
    <CommonModal
      type="restrict"
      showModal={showRestrictModal}
      setShowModal={() => dispath(actions.setShowRestrictModal(false))}
    >
      <span>This service is not applicable in your jurisdiction.</span>
    </CommonModal>
  )
}

export default RestrictionModal
