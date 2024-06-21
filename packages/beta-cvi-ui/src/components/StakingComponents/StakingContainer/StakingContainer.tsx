import classNames from 'classnames'
import type { FC, PropsWithChildren } from 'react'
import React from 'react'
import { useAddress } from '../../../hooks/use-address'

import { actions } from '../../../redux'

import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import Button from '../../Button/Button'
import ConnectButton from '../../NavbarButtons/ConnectButton'
import StakingHeader from './StakingHeader'

type Props = {
  className?: string
  stakingName: '1x' | '2x' | 'govi'
}

const StakingContainer: FC<PropsWithChildren<Props>> = ({ children, className, stakingName }) => {
  const dispatch = useAppDispatch()
  const { address } = useAddress()

  const unstakeLock = useAppSelector(state => state.state.cvi.stack.unstakeLock)

  const isComingSoon = stakingName === '1x' || stakingName === '2x' /* remove after release of x1 and x2 */

  const onStakeOrUnstake = (title: 'stake' | 'unstake') => {
    dispatch(
      actions.setStakeUnstakeModal({
        modalIsOpen: true,
        title: title,
      }),
    )
  }

  const approve = true
  function ShowSumbitButton() {
    if (!address && stakingName !== '1x' && stakingName !== '2x') {
      return <ConnectButton type="form" className="w-56" />
    }
    return (
      <>
        <Button
          type="common"
          title="stake"
          onClick={() => {
            onStakeOrUnstake('stake')
          }}
          className="w-56"
        />

        <Button
          type="common"
          title={'unstake'}
          onClick={() => {
            onStakeOrUnstake('unstake')
          }}
          className="w-56"
          disabled={unstakeLock.data?.isLocked}
        />

        {
          <a
            href="https://www.sushi.com/swap?token0=0x07e49d5de43dda6162fa28d24d5935c151875283&token1=0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8&chainId=42161"
            className="w-56 bg-common-cancel font-bold flex justify-center items-center  active:text-common-lightGray  hover:border border-common-cancel  hover:shadow-2xl rounded-lg  uppercase text-base  cursor-pointer hover:bg-opacity-50 h-14 "
            target="_blank"
            onClick={() => {
              if (window.gtag) {
                window.gtag('event', 'get_govi', {
                  page_title: 'get_govi',
                  get_govi_title: 'Click on get govi link',
                  description: 'The user clicked on "Get govi" link',
                  page_path: window.location.pathname,
                })
              }
            }}
          >
            get govi
          </a>
        }
      </>
    )
  }
  return (
    <div
      className={classNames({
        'rounded-xl md:w-198 bg-dark-600 text-white flex flex-col ': true,
      })}
    >
      <div
        className={classNames({
          'bg-dark-600 opacity-30': isComingSoon,
        })}
      >
        <StakingHeader stakingName={stakingName} />
      </div>
      <div className={classNames({ [className ?? '']: !!className })}>{children}</div>
      <div
        className={classNames({
          'flex flex-wrap justify-center gap-6 pt-6 pb-8 py-4 m-auto px-6': true,
          'bg-dark-600 opacity-30 pointer-events-none': isComingSoon,
        })}
      >
        {ShowSumbitButton()}
      </div>
    </div>
  )
}

export default StakingContainer
