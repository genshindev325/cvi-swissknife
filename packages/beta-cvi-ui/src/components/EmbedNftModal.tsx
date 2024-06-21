import React from 'react'
import { actions, useAppDispatch, useAppSelector } from '../redux'
import Button from './Button/Button'
import CommonModal from './Modals/CommonModal'
import goldNft from '../assets/images/gold_protector_nft.png'
import diamondNft from '../assets/images/diamond_protector_nft.png'
import classNames from 'classnames'
import { EmbedDiscountName } from '@coti-cvi/lw-sdk'
const EmbedNftModal = () => {
  const dispatch = useAppDispatch()
  const nftModal = useAppSelector(state => state.state.armadillo.nftModal)
  const embedDiscountInfo = useAppSelector(state => state.state.armadillo.embedDiscountInfo)

  return (
    <CommonModal
      showModal={nftModal.modalIsOpen}
      setShowModal={() => dispatch(actions.setNftModal({ modalIsOpen: false }))}
      type="embedNft"
    >
      <div className="flex flex-col gap-8">
        <h1 className="capitalize text-xl">{embedDiscountInfo?.discountTypeName} NFT</h1>
        <div
          className={classNames({
            ' nft-card  h-[312px] md:w-[448px] md:h-[448px]': true,
            'background-gold-nft': embedDiscountInfo?.discountTypeName === EmbedDiscountName.GOLD,
            'background-diamond-nft': embedDiscountInfo?.discountTypeName === EmbedDiscountName.DIAMON,
          })}
        >
          <div className="nft-container  nftAnimation">
            <div className="img-wrapper-front w-56 sm:w-72 ">
              {embedDiscountInfo?.discountTypeName === EmbedDiscountName.GOLD ? (
                <img src={goldNft} alt="gold-nft" className="w-56 sm:w-72  " />
              ) : (
                <img src={diamondNft} alt="diamond-nft" className="w-56 sm:w-72 " />
              )}
            </div>
            <div className="img-wrapper-back w-56 sm:w-72 ">
              {embedDiscountInfo?.discountTypeName === EmbedDiscountName.GOLD ? (
                <img src={goldNft} alt="gold-nft" className="w-56 sm:w-72 " />
              ) : (
                <img src={diamondNft} alt="diamond-nft" className="w-56 sm:w-72" />
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 ">
          <p> Yay! Embed X Armadillo special NFT has been detected!</p>
          <p className="text-xs">*Find out how much you saved by checking out the tooltip on the purchasing page.</p>
        </div>
        <Button type="common" title="close" onClick={() => dispatch(actions.setNftModal({ modalIsOpen: false }))} />
      </div>
    </CommonModal>
  )
}

export default EmbedNftModal
