import React from 'react'
import VaultContainer from '../VaultContainer'

import { Stator, TokenName } from '@coti-cvi/lw-sdk'

import DisplayNumber from '../../DisplayNumber/DisplayNumber'
import InnerContainer from '../../InnerContainer/InnerContainer'
import { useAppSelector } from '../../../redux'
import { GetSvg } from 'beta-cvi-ui/src/utils/GetSvg'
import classNames from 'classnames'
import { useAddress } from '../../../hooks/use-address'

const PositionStakingDetails = () => {
  const positionOfAddress = useAppSelector(state => state.state.cvi.tv.positionOfAddress)
  const pnl = useAppSelector(state => state.state.cvi.tv.pnl)
  const pnlUsdc = Stator.map(pnl, data => data.pnl)
  const pnlPercent = Stator.map(pnl, data => data.percent)
  const pnlPercentGrtrOrEqlThanZero = pnlPercent.data !== undefined && pnlPercent.data >= 0
  const pnlUsdcGrtrOrEqlThanZero = pnlUsdc.data !== undefined && pnlUsdc.data >= 0

  const { address } = useAddress()

  return (
    <VaultContainer className="p-6" vaultName="">
      <div className="flex flex-col gap-4 h-full  text-sm ">
        <InnerContainer className="bg-dark-300">
          <span className="flex flex-col justify-between gap-4">
            <span className="flex flex-col gap-1">
              <span className="flex flex-row justify-between text-common-lightGray">Your position</span>
              {address ? (
                <DisplayNumber
                  state={Stator.map(
                    positionOfAddress,
                    (data: { positionBalanceUsdc: number }) => data.positionBalanceUsdc,
                  )}
                  tokenNameClassName="font-normal text-lg text-common-lightGray"
                  tokenNumberClassName="font-bold text-lg"
                  tokenName={TokenName.USDC}
                  useNumberGrouping
                />
              ) : (
                '--'
              )}
            </span>
            <span className="flex flex-col gap-1">
              <span className="flex flex-row justify-between text-common-lightGray">P&L</span>
              {address ? (
                <span className="flex flex-row justify-between items-center">
                  <span
                    className={classNames({
                      'flex flex-row items-center': true,
                      'text-common-turquoise': pnlUsdcGrtrOrEqlThanZero,
                      'text-common-lightRed': !pnlUsdcGrtrOrEqlThanZero,
                    })}
                  >
                    {pnlUsdc.data !== undefined && pnlUsdc.data >= 0 && '+'}
                    <DisplayNumber
                      state={pnlUsdc}
                      tokenNameClassName={`font-normal text-lg  ${
                        pnlUsdc.status === 'pending'
                          ? 'text-common-lightGray'
                          : pnlUsdcGrtrOrEqlThanZero
                          ? 'text-common-turquoise'
                          : 'text-common-lightRed'
                      }`}
                      tokenNumberClassName={`font-bold text-lg ${
                        pnlUsdcGrtrOrEqlThanZero ? 'text-common-turquoise' : 'text-common-lightRed'
                      }`}
                      tokenName={TokenName.USDC}
                      useNumberGrouping
                    />
                  </span>
                  <span
                    className={classNames({
                      'flex flex-row ': true,
                      'text-common-lightGray': pnlPercent.status === 'pending',
                      'text-common-turquoise': pnlPercentGrtrOrEqlThanZero && pnlPercent.status !== 'pending',
                      'text-common-lightRed': !pnlPercentGrtrOrEqlThanZero && pnlPercent.status !== 'pending',
                    })}
                  >
                    ({pnlPercentGrtrOrEqlThanZero && '+'}
                    <DisplayNumber
                      state={pnlPercent}
                      tokenNameClassName={`font-normal text-sm ${
                        pnlPercentGrtrOrEqlThanZero ? 'text-common-turquoise' : 'text-common-lightRed'
                      }`}
                      tokenNumberClassName={`font-normal text-sm ${
                        pnlPercentGrtrOrEqlThanZero ? 'text-common-turquoise' : 'text-common-lightRed'
                      }`}
                      percentage
                      customDecimal={2}
                    />
                    )
                    {pnlPercent.status === 'pending' ? (
                      <span className="w-4"></span>
                    ) : pnlPercentGrtrOrEqlThanZero ? (
                      <GetSvg svgName={'upArrow'} className="" />
                    ) : (
                      <GetSvg svgName={'downArrow'} className="w-4" />
                    )}
                  </span>
                </span>
              ) : (
                '--'
              )}
            </span>
          </span>
        </InnerContainer>

        <InnerContainer className=" bg-dark-700 md:h-[21rem]  flex flex-col justify-center">
          {/* <p className="absolute z-10 top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 w-10/12 "> */}
          <span>
            <p className=" h-full text-center ">
              We will be distributing retroactive rewards for everyone who deposits to the Theta vault
            </p>
          </span>
          {/* <span className="flex flex-col gap-4 opacity-20 ">
            <span className="flex flex-col justify-between gap-2 text-common-lightGray">
              Staking amount
                <span>--</span>
            </span>
            <span className="flex flex-col justify-between  gap-2 text-common-lightGray">
              Available to staking
                <span>--</span>
            </span>
            <span className="flex flex-col justify-between gap-2 text-common-lightGray">
              Total staking rewards
                
                <span className="text-common-turquoise">--</span>
            </span>
            <span className="ml-auto text-common-orange leading-6">Manage staking</span>s
          </span> */}
        </InnerContainer>
      </div>
    </VaultContainer>
  )
}

export default PositionStakingDetails
