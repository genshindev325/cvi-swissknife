import { VolatilityTokensTabsPaths } from 'beta-cvi-ui/src/types/common.types'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import InnerContainer from '../InnerContainer/InnerContainer'
import Slider from '../Slider/Slider'
import SelectToken from './SelectToken'
import Mint from './Mint'
import Burn from './Burn'
import { useAppSelector } from 'beta-cvi-ui/src/redux'
import DisplayNumber from '../DisplayNumber/DisplayNumber'
import { TokenName } from '@coti-cvi/lw-sdk'
import { GetSvg } from 'beta-cvi-ui/src/utils/GetSvg'
import ReactTooltip from 'react-tooltip'
const MintContainer = () => {
  const [volatilitySliderTabKey, setVolatilitySliderTabKey] = useState<keyof typeof VolatilityTokensTabsPaths>('mint')
  const [amount, setAmount] = useState<number | undefined>()
  const platformUsdc = useAppSelector(state => state.state.cvi.volatilityToken.platformUsdc)
  const dexPrice = useAppSelector(state => state.state.cvi.volatilityToken.dexPrice)
  const dailyFundingFee = useAppSelector(state => state.state.cvi.volatilityToken.dailyFundingFee)
  const collateralRatio = useAppSelector(state => state.state.cvi.volatilityToken.collateralRatio)
  const location = useLocation()

  useEffect(() => {
    if (location.hash.includes(VolatilityTokensTabsPaths.mint)) {
      setVolatilitySliderTabKey('mint')
      setAmount(undefined)
    } else if (location.hash.includes(VolatilityTokensTabsPaths.burn)) {
      setVolatilitySliderTabKey('burn')
      setAmount(undefined)
    }
  }, [location.hash])

  return (
    <div className="justify-center w-full lg:w-110 text-white  self-start flex bg-custom-container-bg rounded-xl flex-col gap-6 p-4 md:p-6 sm:p-10">
      <Slider options={VolatilityTokensTabsPaths} stateTab={volatilitySliderTabKey} />
      <span>
        <SelectToken />
        <InnerContainer className="text-white gap-4 flex justify-between lg:justify-start  flex-col md:flex-row lg:flex-col lg:gap-2 rounded-tl-none rounded-tr-none  bg-dark-700">
          <span className="flex justify-between  lg:justify-start  md:w-2/4 lg:w-full">
            <span className="flex flex-col w-38    xm:w-2/4 text-xs whitespace-nowrap text-common-lightGray">
              <>Platform price</>
              <span className="text-white">
                <DisplayNumber
                  state={platformUsdc}
                  tokenName={TokenName.USDC}
                  tokenNumberClassName="font-bold"
                  tokenNameClassName="font-normal"
                  customDecimal={2}
                />
              </span>
            </span>
            <span className="flex flex-col w-2/4 text-xs  whitespace-nowrap text-common-lightGray">
              <span className="flex flex-row gap-1">
                SushiSwap price
                <a
                  href="https://www.sushi.com/swap?token0=0x8096aD3107715747361acefE685943bFB427C722&token1=0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8&chainId=42161"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => {
                    if (window.gtag) {
                      window.gtag('event', 'sushiswap_price_link', {
                        page_title: 'sushiswap_price_link',
                        sushiswap_price_link_title: 'Click on sushiswap price link',
                        description: 'The user clicked on "Sushiswap price" link',
                        page_path: window.location.pathname,
                      })
                    }
                  }}
                >
                  <GetSvg svgName={'popLink'} className="cursor-pointer" />
                </a>
              </span>
              <span className="text-white">
                <DisplayNumber
                  state={dexPrice}
                  tokenName={TokenName.USDC}
                  tokenNumberClassName="font-bold"
                  tokenNameClassName="font-normal"
                  customDecimal={2}
                />
              </span>
            </span>
          </span>

          <span className=" flex justify-between  lg:justify-start  md:w-2/4 lg:w-full  ">
            <span className="flex flex-col w-38  xm:w-2/4 text-xs whitespace-nowrap text-common-lightGray">
              <span className="flex flex-row  gap-1">
                1 hour funding fee{' '}
                <span data-tip data-for="hourFundingFeeTip">
                  <GetSvg svgName="tooltip" className=" cursor-pointer" />
                </span>
                <ReactTooltip
                  id="hourFundingFeeTip"
                  place="bottom"
                  effect="solid"
                  data-html={true}
                  insecure={true}
                  multiline={true}
                  className="default-react-tooltip-style "
                  delayHide={0}
                >
                  A funding fee is the amount you pay hourly until your volatility tokens are sold or burned. The
                  funding fee is not constant and may change based on the CVI value and the collateral ratio of the
                  corresponding volatility token.
                </ReactTooltip>
              </span>
              <DisplayNumber
                state={dailyFundingFee}
                percentage={true}
                tokenNumberClassName="font-bold text-white"
                tokenNameClassName="font-normal"
              />
            </span>
            <span className="flex flex-col w-2/4  text-xs whitespace-nowrap item text-common-lightGray ">
              <span className="flex flex-row  gap-1">
                Collateral ratio{' '}
                <span data-tip data-for="CollateralRatioTip">
                  <GetSvg svgName="tooltip" className=" cursor-pointer" />
                </span>
                <ReactTooltip
                  id="CollateralRatioTip"
                  place="bottom"
                  effect="solid"
                  data-html={true}
                  insecure={true}
                  multiline={true}
                  className="default-react-tooltip-style "
                  delayHide={0}
                >
                  The collateral ratio is the ratio between the potential maximum value of the volatility tokens in
                  circulation(The value when the CVI is 200) and the combined value of the volatility tokens and Theta
                  vault liquidity.
                </ReactTooltip>
              </span>
              <DisplayNumber
                state={collateralRatio}
                percentage={true}
                tokenNumberClassName="font-bold text-white"
                tokenNameClassName="font-normal"
                customDecimal={2}
              />
            </span>
          </span>
        </InnerContainer>
      </span>

      {volatilitySliderTabKey === VolatilityTokensTabsPaths.mint ? (
        <Mint amount={amount} setAmount={setAmount} />
      ) : (
        <Burn amount={amount} setAmount={setAmount} />
      )}
    </div>
  )
}

export default MintContainer
