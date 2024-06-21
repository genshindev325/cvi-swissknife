import type { FC, PropsWithChildren } from 'react'
import React from 'react'
import CommonModal from './CommonModal'
import notice from '../../assets/icons/notice.svg'
import classNames from 'classnames'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { actions } from '../../redux/store'
type Props = {
  className?: string
  showModal: boolean
}
const FailSlippageNoticeModal: FC<PropsWithChildren<Props>> = ({ className, showModal }) => {
  const dispatch = useAppDispatch()
  const showSlippageNoticeModal = useAppSelector(state => state.state.showSlippageNoticeModal)

  return (
    <CommonModal
      showModal={showModal}
      setShowModal={show =>
        dispatch(actions.setShowSlipageNoticeModal(typeof show === 'function' ? show(showSlippageNoticeModal) : show))
      }
    >
      <div
        className={classNames({
          'flex flex-col justify-center text-center items-center gap-8': true,
          [className ?? '']: !!className,
        })}
      >
        <img src={notice} alt="notice icon" className="w-16 h-16 " />
        <span>
          This transaction failed due to the change in the purchase fee premium. Try increasing your slippage tolerance.
        </span>
        <span className=" w-40 h-12 outline-none">
          <button
            className="bg-modal-closeBtn w-full   h-full rounded-lg"
            onClick={() => dispatch(actions.setShowSlipageNoticeModal(false))}
          >
            close
          </button>
        </span>
      </div>
    </CommonModal>
  )
}

export default FailSlippageNoticeModal
