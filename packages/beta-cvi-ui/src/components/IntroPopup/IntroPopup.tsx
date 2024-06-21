import type { FC } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import React from 'react'
import CommonModal from '../Modals/CommonModal'
import { useLocalStorage } from '../../hooks/use-local-storage-state'
import { GetSvg } from 'beta-cvi-ui/src/utils/GetSvg'
import { useAppSelector } from '../../redux'

type Props = {
  showModal: boolean
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
}

const IntroPopup: FC<Props> = ({ showModal, setShowModal }) => {
  const [shouldShowNextTime, setShouldShowNextTime] = useState(true)
  const [showIlIntroPopup, setShowIlIntroPopup] = useLocalStorage('showIlIntroPopup')
  const nftModal = useAppSelector(state => state.state.armadillo.nftModal)

  useEffect(() => {
    if (!nftModal.modalIsOpen && showIlIntroPopup) {
      setShowModal(true)
    }
  }, [nftModal.modalIsOpen, setShowModal, showIlIntroPopup])

  return (
    <CommonModal showModal={showModal} setShowModal={setShowModal} type="buyProtectionModal">
      <div className="w-full flex flex-col  items-center gap-10">
        <h1 className="md:text-2xl">Impermanent Loss Protection</h1>
        <GetSvg svgName="armadilloIcon" />
        <div className="flex flex-col text-base  mr-auto gap-6">
          <span>
            <span className="flex flex-row gap-2 text-sm md:text-base">
              <b className="text-common-lightOrange">Step 1</b>
              <>Choose a pair to protect</>
            </span>
            <span className="text-xs">Armadillo protects selected pairs across any chain, DEX, or platform.</span>
          </span>

          <span className="flex flex-row gap-2 text-sm md:text-base">
            <b className="text-common-lightOrange">Step 2</b>
            <>Choose the amount to protect</>
          </span>

          <span>
            <span className="flex flex-row gap-2 text-sm md:text-base">
              <b className="text-common-lightOrange">Step 3</b>
              <>Choose a protection period</>
            </span>
            <span className="text-xs">You can choose between 14, 30, or 60 days.</span>
          </span>

          <span>
            <span className="flex flex-row gap-2 text-sm md:text-base">
              <b className="text-common-lightOrange">Step 4</b>
              <>Get Paid!</>
            </span>
            <span className="text-xs ">
              Automatically receive accrued IL as a payout directly to your wallet at the expiration date.
            </span>
          </span>

          <a
            href="https://doc.armadillo.is/"
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="text-xs text-common-turquoise font-bold"
          >
            Learn more
          </a>
          <span
            onClick={() => setShouldShowNextTime(prev => !prev)}
            className="flex flex-row gap-1 text-sm items-center"
          >
            <GetSvg
              className=" text-common-turquoise cursor-pointer"
              svgName={!shouldShowNextTime ? 'selectedCheckbox' : 'checkbox'}
            />

            <label>Don't show this message again</label>
          </span>
        </div>
        <button
          onClick={() => {
            setShowIlIntroPopup(shouldShowNextTime)
            setShowModal(false)
          }}
          className="text-base uppercase bg-custom-300 rounded-lg w-full py-2 font-bold"
        >
          got it!
        </button>
      </div>
    </CommonModal>
  )
}

export default IntroPopup
