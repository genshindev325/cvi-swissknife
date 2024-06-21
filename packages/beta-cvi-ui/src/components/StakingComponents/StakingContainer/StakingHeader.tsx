import { catDecimalsNoRoundUp } from '@coti-cvi/lw-sdk/src'
import { useAppSelector } from 'beta-cvi-ui/src/redux'
import { GetSvg } from 'beta-cvi-ui/src/utils/GetSvg'
import classNames from 'classnames'
import type { FC } from 'react'
import React from 'react'
import { useAddress } from '../../../hooks/use-address'
import Spinner from '../../Spinner/Spinner'

type Props = {
  stakingName: '1x' | '2x' | 'govi'
}
const StakingHeader: FC<Props> = ({ stakingName }) => {
  const { address } = useAddress()
  const staking = useAppSelector(state => state.state.cvi.stack.staking)
  const PlatformStaking = useAppSelector(state => state.state.cvi.stack.platformStaking)

  const chooseIcon = (icon: string) => {
    switch (icon) {
      case 'theta':
        if (stakingName === '1x') {
          return <GetSvg svgName="thetax1" className="float-right flex mb-auto h-10 w-6 m-2" />
        } else if (stakingName === '2x') {
          return <GetSvg svgName="thetax2" className="float-right flex mb-auto h-10 w-6 m-2" />
        }
      case '1x':
        return <GetSvg svgName="cvi" className="sm:w-fit w-10" />
      case '2x':
        return <GetSvg svgName="cvi2x" className="sm:w-fit w-10" />
      default:
        return <GetSvg svgName="govi" className="sm:w-fit w-10" />
    }
  }

  const displayAutoCompounding = () => <b className="text-common-turquoise ">AUTO-COMPOUNDING</b>

  return (
    <div
      className={classNames({
        'text-white w-full h-28 rounded-xl bg-dark-600': true,
      })}
    >
      {stakingName !== 'govi' && chooseIcon('theta')}

      <div className="flex flex-row justify-between pt-4 items-start h-32 sm:h-28  w-full z-20 px-6 absolute  ">
        <span className="flex flex-row items-center gap-4 ">
          {chooseIcon(stakingName)}
          {stakingName !== 'govi' ? (
            <b>
              THETA CVI<b className="text-common-turquoise">{stakingName.toUpperCase()}</b>-USDC
            </b>
          ) : (
            <span className="flex flex-row items-center gap-2 ">
              <b>GOVI</b>
              <GetSvg svgName="v2" />
            </span>
          )}
        </span>
        {stakingName === 'govi' ? (
          <span className="flex flex-col justify-end sm:gap-2 leading-tight sm:leading-6 text-sm w-full sm:w-fit pt-3 sm:pt-0">
            <span className={classNames({ 'flex flex-row gap-14': true })}>
              <span className="sm:flex hidden">{displayAutoCompounding()}</span>
              <span className="ml-auto text-common-lightGray">APY</span>
            </span>
            <b className="ml-auto text-lg text-end flex flex-row">
              {PlatformStaking.data !== undefined && PlatformStaking.data.apy.data === undefined ? (
                PlatformStaking.data.apy.status === 'pending' ? (
                  <Spinner className="w-4 h-4 border-2" />
                ) : PlatformStaking.data.apy.status === 'rejected' ? (
                  'N/A'
                ) : null
              ) : (
                <>{`${
                  PlatformStaking.data !== undefined && PlatformStaking.data.apy.data !== undefined
                    ? catDecimalsNoRoundUp(PlatformStaking.data.apy.data, 2)
                    : 0
                }%`}</>
              )}
            </b>
          </span>
        ) : (
          <span className="text-sm flex flex-col gap-2  justify-start w-full sm:w-fit">
            <span className=" text-common-lightGray">APY</span>
            <b className="text-lg">
              {address ? (
                PlatformStaking.data !== undefined && PlatformStaking.data.apy.data === undefined ? (
                  PlatformStaking.data.apy.status === 'pending' ? (
                    <Spinner className="w-4 h-4 border-2" />
                  ) : PlatformStaking.data.apy.status === 'rejected' ? (
                    'N/A'
                  ) : null
                ) : (
                  <>{`${
                    PlatformStaking.data !== undefined && PlatformStaking.data.apy.data !== undefined
                      ? catDecimalsNoRoundUp(PlatformStaking.data.apy.data, 2)
                      : 0
                  }%`}</>
                )
              ) : (
                '--'
              )}
            </b>
          </span>
        )}
      </div>
      <div
        className={classNames({
          'text-white  h-3/5  rounded-xl ': true,
          'bg-gradient-to-b from-common-blueSky opacity-20 via-common-blueSky': stakingName === '2x',
          'bg-gradient-to-b from-common-lightPink opacity-20 via-common-lightPink':
            stakingName === '1x' || stakingName === 'govi',
        })}
      ></div>
      {stakingName === 'govi' && <span className="flex sm:hidden pl-6 pt-5 text-sm">{displayAutoCompounding()}</span>}
    </div>
  )
}

export default StakingHeader
