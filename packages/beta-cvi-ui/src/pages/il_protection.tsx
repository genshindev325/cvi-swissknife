import Container from '../components/Container/Container'
import ProtectionManager from '../components/ILComponents/ProtectionManager/ProtectionManager'
import SupportPairsTable from '../components/ILComponents/SupportPairs/SupportPairsTable'
import FailBuyProtection from '../components/Modals/FailSlippageNoticeModal'
import classNames from 'classnames'
import { useAppSelector } from '../redux/hooks'
import IntroPopup from '../components/IntroPopup/IntroPopup'
import { useLocalStorage } from '../hooks/use-local-storage-state'
import { useState } from 'react'
import Charts from '../components/Charts/Charts'

const IlProtectionPage = () => {
  const showSlippageNoticeModal = useAppSelector(state => state.state.showSlippageNoticeModal)
  const [showIlIntroPopup] = useLocalStorage('showIlIntroPopup')
  const [showIntroPopupModal, setShowIntroPopupModal] = useState(showIlIntroPopup)

  return (
    <>
      {<IntroPopup showModal={showIntroPopupModal} setShowModal={setShowIntroPopupModal} />}
      <div
        className={`ARMADILLO ${classNames({
          'flex xl:flex-nowrap flex-wrap gap-6 px-6 mt-6 justify-between': true,
        })}`}
      >
        <Container
          title="Supported pairs"
          className={classNames({
            'xl:w-7/12': true,
          })}
        >
          <SupportPairsTable />
        </Container>

        <div className=" justify-center lg:w-full xl:w-5/12 self-start flex bg-custom-container-bg rounded-xl flex-col gap-6 md:p-8 px-4 py-6  w-full">
          <Charts />
        </div>
      </div>

      <div className="px-6 mt-6">
        <ProtectionManager />
      </div>
      <>{showSlippageNoticeModal && <FailBuyProtection showModal={showSlippageNoticeModal} />}</>
    </>
  )
}

export default IlProtectionPage
