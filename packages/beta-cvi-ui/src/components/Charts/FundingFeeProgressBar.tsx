import type { FC } from 'react'
import { useState } from 'react'
import React from 'react'
import DisplayNumber from '../DisplayNumber/DisplayNumber'
import { useAppSelector } from 'beta-cvi-ui/src/redux'

type Props = {
  setOnProgressBarFocus: React.Dispatch<React.SetStateAction<boolean>>
  percentageState: number
  setPercentageState: React.Dispatch<React.SetStateAction<number>>
  disabledScroll: boolean
}

const FundingFeeProgressBar: FC<Props> = ({
  setOnProgressBarFocus,
  percentageState,
  setPercentageState,
  disabledScroll,
}) => {
  const [isSlideMove, setIsSlideMove] = useState(false)
  const dailyFundingFee = useAppSelector(state => state.state.cvi.volatilityToken.dailyFundingFee)
  const collateralRatio = useAppSelector(state => state.state.cvi.volatilityToken.collateralRatio)

  //// progeress bar

  const MAX = 10
  const getBackgroundSize = () => {
    return {
      backgroundSize: `${(percentageState * 100) / MAX}% 100%`,
    }
  }
  const handlePercentageChange = (event: { target: { value: string } }) => {
    setPercentageState(Number(event.target.value))
    if (isSlideMove === false) {
      setIsSlideMove(true)
    }
  }

  return (
    <div className="border border-[#282828] 2xl:w-[49%] h-fit flex flex-col justify-start gap-4 text-white sm:p-10 ">
      <h1 className="flex gap-2">
        Current Collateral Ratio:{' '}
        <DisplayNumber
          state={collateralRatio}
          percentage={true}
          tokenNumberClassName="font-bold text-white"
          tokenNameClassName="font-normal"
          customDecimal={2}
        />
      </h1>
      <span className="flex flex-row justify-between items-center">
        <h1 className="text-common-lightGray">Collateral Ratio: {percentageState}%</h1>
        {isSlideMove && (
          <button
            disabled={disabledScroll}
            onClick={() => {
              if (window.gtag) {
                window.gtag('event', `reset_progress_bar_funding_fee`, {
                  page_title: `reset_progress_bar_funding_fee`,
                  reset_progress_bar_title: `User clicked on reset`,
                  description: `User clicked on reset to reset the progress bar`,
                  page_path: window.location.pathname,
                })
              }
              setPercentageState(prev => (collateralRatio.data !== undefined ? Math.trunc(collateralRatio.data) : prev))
              setIsSlideMove(false)
            }}
            className="text-custom-300 text-sm hover:text-custom-textlink-hover active:text-custom-300-opacity-70 cursor-pointer"
          >
            Reset
          </button>
        )}
      </span>
      <span className="flex flex-row  w-full">
        <span className="text-common-lightGray">0%</span>
        <input
          disabled={disabledScroll}
          className="m-auto w-full bg-custom-600 outline-none"
          type="range"
          min="0"
          max="100"
          step="1"
          value={percentageState}
          onChange={handlePercentageChange}
          style={getBackgroundSize()}
          onMouseDown={() => {
            if (window.gtag) {
              window.gtag('event', `progress_bar_funding_fee_started`, {
                page_title: `progress_bar_funding_fee_started`,
                progress_bar_title: `User move the progress bar`,
                description: `User move the progress bar on funding fee chart`,
                page_path: window.location.pathname,
              })
            }
            setOnProgressBarFocus(true)
          }}
          onMouseUp={() => {
            if (window.gtag) {
              window.gtag('event', `progress_bar_funding_fee_stoped`, {
                page_title: `progress_bar_funding_fee_stoped`,
                progress_bar_title: `User stoped the moving the progress bar`,
                description: `User stoped the moving the progress bar on funding fee chart`,
                page_path: window.location.pathname,
              })
            }
            setOnProgressBarFocus(false)
          }}
        />
        <span className="text-common-lightGray">100%</span>
      </span>
      <b className="flex gap-2 text-common-lightGray">
        1 hour funding fee:{' '}
        <DisplayNumber
          state={dailyFundingFee}
          percentage={true}
          tokenNumberClassName="font-bold text-white"
          tokenNameClassName="font-normal"
        />
      </b>
    </div>
  )
}

export default FundingFeeProgressBar
