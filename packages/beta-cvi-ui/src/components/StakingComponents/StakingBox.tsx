import { Stator, TokenName } from '@coti-cvi/lw-sdk/src'
import classNames from 'classnames'
import type { FC } from 'react'
import React from 'react'
import { useAddress } from '../../hooks/use-address'
import { useAppSelector } from '../../redux'
import DisplayNumber from '../DisplayNumber/DisplayNumber'
import InnerContainer from '../InnerContainer/InnerContainer'
import Spinner from '../Spinner/Spinner'
import StakingContainer from './StakingContainer/StakingContainer'

type Props = {
  stakingName: '1x' | '2x' | 'govi'
}

const StakingBox: FC<Props> = ({ stakingName }) => {
  const { address } = useAddress()
  const staking = useAppSelector(state => state.state.cvi.stack.staking)
  const PlatformStaking = useAppSelector(state => state.state.cvi.stack.platformStaking)

  return (
    <div className={classNames({ 'relative ': true /* remove after release of x1 and x2*/ })}>
      <StakingContainer
        stakingName={stakingName}
        className={classNames({ 'flex flex-col gap-4 h-full px-6 pt-5 sm:pt-0': true })}
      >
        {(stakingName === '1x' || stakingName === '2x') && (
          <p className="absolute z-10 bottom-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-lg text-white">
            COMING SOON
          </p>
        )}
        <div
          className={classNames({
            'flex flex-col sm:flex-row w-full gap-4 ': true,
            'pointer-events-none relative  bg-dark-600 opacity-30': stakingName === '1x' || stakingName === '2x',
          })}
        >
          <div className=" flex flex-col gap-4 sm:w-2/4 w-full">
            <InnerContainer className="bg-dark-300 ">
              <span className="flex flex-col gap-2 text-sm">
                <span className="text-common-lightGray leading-6">Total Staked</span>
                {stakingName === 'govi' && PlatformStaking.data ? (
                  PlatformStaking.data.totalValueLocked.data === undefined &&
                  PlatformStaking.data.totalValueLocked.status === 'pending' ? (
                    <Spinner className="h-4 w-4 border-2" />
                  ) : PlatformStaking.data.totalValueLocked.status === 'rejected' ? (
                    'N/A'
                  ) : (
                    <DisplayNumber
                      state={Stator.resolve(PlatformStaking.data.totalValueLocked.data)}
                      className="font-bold "
                      millify={{ precision: 3, units: ['', 'K', 'M', 'B', 'T', 'P', 'E'], space: false }}
                      tokenName={TokenName.GOVI}
                      tokenNameClassName="font-normal text-tiny "
                      tokenNumberClassName="text-lg leading-6"
                    />
                  )
                ) : (
                  <span className="leading-6">--</span>
                )}
              </span>
            </InnerContainer>
            <InnerContainer className="bg-dark-300 flex flex-col gap-4 ">
              <span className="flex flex-col gap-2 text-sm">
                <span className="text-common-lightGray leading-6">Your current stake</span>
                {address && staking.data && stakingName === 'govi' ? (
                  staking.data.currentStake?.data === undefined && staking.data.currentStake.status === 'pending' ? (
                    <Spinner className="h-4 w-4 border-2" />
                  ) : staking.data.currentStake.status === 'rejected' ? (
                    'N/A'
                  ) : (
                    <DisplayNumber
                      state={Stator.resolve(staking.data.currentStake.data)}
                      className="font-bold "
                      millify={{ precision: 3, units: ['', 'K', 'M', 'B', 'T', 'P', 'E'], space: false }}
                      tokenName={TokenName.GOVI}
                      tokenNameClassName="font-normal text-tiny "
                      tokenNumberClassName="text-lg leading-6"
                    />
                  )
                ) : (
                  <span className="leading-6">--</span>
                )}
              </span>
              <span className="flex flex-col gap-2 text-sm">
                <span className="text-common-lightGray leading-6  ">Available to stake</span>

                {address && staking.data && stakingName === 'govi' ? (
                  staking.data.availableToStake.data === undefined &&
                  staking.data.availableToStake.status === 'pending' ? (
                    <Spinner className="h-4 w-4 border-2" />
                  ) : staking.data.availableToStake.status === 'rejected' ? (
                    'N/A'
                  ) : (
                    <DisplayNumber
                      state={Stator.resolve(staking.data.availableToStake.data)}
                      className="font-bold"
                      millify={{ precision: 3, units: ['', 'K', 'M', 'B', 'T', 'P', 'E'], space: false }}
                      tokenName={TokenName.GOVI}
                      tokenNameClassName="font-normal text-tiny"
                      tokenNumberClassName="text-lg leading-6 font-bold"
                    />
                  )
                ) : (
                  <span className="leading-6">--</span>
                )}
              </span>
            </InnerContainer>
          </div>

          <InnerContainer className="bg-dark-300 sm:w-2/4 w-full flex items-center ">
            {stakingName === 'govi' ? (
              <span className="text-common-lightGray text-sm ">
                Your staking rewards are automatically collected and re-invested into your staked GOVI tokens.
                <p className="font-bold text-white">
                  * Unstaking will be available 1 hour after the staking was placed.
                </p>
              </span>
            ) : (
              <span className="flex flex-col  gap-2 text-sm text-center m-auto">
                <span className="text-common-lightGray">Your total GOVI rewards</span>
                <b className="text-lg text-common-turquoise leading-6">--</b>
              </span>
            )}
          </InnerContainer>
        </div>
      </StakingContainer>
    </div>
  )
}

export default StakingBox
