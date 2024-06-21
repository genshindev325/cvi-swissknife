import React from 'react'
import { useAppSelector } from '../../../../redux'
import DisplayNumber from '../../../DisplayNumber/DisplayNumber'
import { TokenName } from '../../../../../../lw-sdk/src'
import ReactTooltip from 'react-tooltip'
import { GetSvg } from 'beta-cvi-ui/src/utils/GetSvg'

const TitleGroup = () => {
  const tvlUsdc = useAppSelector(state => state.state.cvi.tv.tvlUsdc)
  const collateralRatio = useAppSelector(state => state.state.cvi.tv.collateralRatio)
  const apr = useAppSelector(state => state.state.cvi.tv.apr)

  return (
    <div className="z-20 absolute top-2/4 md:top-0 w-full md:w-fit  md:right-0 h-2/4 md:h-full font-normal ">
      <span className="flex flex-row  w-full md:w-[22rem]  items-center h-full   md:h-full justify-between  md:justify-evenly text-sm pl-4 md:pl-0">
        <span className="flex flex-col gap-1 h-11  text-sm">
          <span className=" text-common-lightGray  ">APR</span>
          <DisplayNumber
            state={apr.data}
            tokenNumberClassName="stiny:text-lg font-bold "
            tokenNameClassName="stiny:text-lg font-normal flex items-center h-6"
            percentage
            customDecimal={2}
          />
        </span>
        <span className="flex flex-col gap-1 h-11 text-sm">
          <span className="text-common-lightGray ">TVL</span>

          <DisplayNumber
            state={tvlUsdc}
            tokenName={TokenName.USDC}
            tokenNumberClassName="stiny:text-lg font-bold "
            tokenNameClassName="stiny:text-lg font-normal flex  h-6"
            millify={{ precision: 2 }}
            type="tvl"
          />
        </span>
        <span className="flex flex-col gap-1 pr-4 md:pr-0 h-11 text-sm">
          <span className="flex flex-row gap-1 text-common-lightGray">
            Collateral ratio{' '}
            <span data-tip data-for="vaultCollateralRatioTip">
              <GetSvg svgName="tooltip" className=" cursor-pointer" />
            </span>
            <ReactTooltip
              id="vaultCollateralRatioTip"
              place="bottom"
              effect="solid"
              data-html={true}
              insecure={true}
              multiline={true}
              className="default-react-tooltip-style "
              delayHide={0}
            >
              The collateral ratio is the ratio between the potential maximum value of the volatility tokens in
              circulation(The value when the CVI index is 200) and the combined value of the volatility tokens and Theta
              vault TVL.
            </ReactTooltip>
          </span>

          <DisplayNumber
            state={collateralRatio.data}
            tokenNumberClassName="stiny:text-lg font-bold "
            tokenNameClassName="stiny:text-lg font-normal flex items-center h-6"
            percentage
            customDecimal={2}
          />
        </span>
      </span>
    </div>
  )
}

export default TitleGroup
