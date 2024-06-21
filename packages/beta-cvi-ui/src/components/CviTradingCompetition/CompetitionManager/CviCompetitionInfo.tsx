import { useAppSelector } from 'beta-cvi-ui/src/redux'
import { GetSvg } from 'beta-cvi-ui/src/utils/GetSvg'
import React from 'react'
import ReactTooltip from 'react-tooltip'
import DisplayNumber from '../../DisplayNumber/DisplayNumber'
import InnerContainer from '../../InnerContainer/InnerContainer'
const BonuswMultiplierTable = {
  0: 1,
  30: 1.2,
  100: 1.5,
  250: 2,
  500: 2.5,
}
export const calculateBonusMultiplierByUsers = (numbersOfUsers: number) => {
  if (numbersOfUsers < 30) {
    return {
      multiplier: BonuswMultiplierTable[0],
      nextMultiplier: BonuswMultiplierTable[30],
      numberUsersToNextMul: 30 - numbersOfUsers,
    }
  } else if (numbersOfUsers < 100) {
    return {
      multiplier: BonuswMultiplierTable[30],
      nextMultiplier: BonuswMultiplierTable[100],
      numberUsersToNextMul: 100 - numbersOfUsers,
    }
  } else if (numbersOfUsers < 250) {
    return {
      multiplier: BonuswMultiplierTable[100],
      nextMultiplier: BonuswMultiplierTable[250],
      numberUsersToNextMul: 250 - numbersOfUsers,
    }
  } else if (numbersOfUsers < 500) {
    return {
      multiplier: BonuswMultiplierTable[250],
      nextMultiplier: BonuswMultiplierTable[500],
      numberUsersToNextMul: 500 - numbersOfUsers,
    }
  }
  return { multiplier: BonuswMultiplierTable[500], nextMultiplier: -1, numberUsersToNextMul: -1 }
}
const CviCompetitionInfo = () => {
  const leaderBoardData = useAppSelector(state => state.state.cvi.tradingCompetition.leaderBoardData)
  const multiplier = leaderBoardData ? calculateBonusMultiplierByUsers(leaderBoardData.length).multiplier : undefined
  const nextMultiplier = leaderBoardData
    ? calculateBonusMultiplierByUsers(leaderBoardData.length).nextMultiplier
    : undefined
  const NumUsersToNextMultiplier = leaderBoardData
    ? calculateBonusMultiplierByUsers(leaderBoardData.length).numberUsersToNextMul
    : undefined

  return (
    <>
      <InnerContainer className="bg-dark-300 flex flex-col  sm:flex-row justify-around gap-3">
        <div className="flex flex-col sm:w-2/4 gap-4">
          <span className="flex flex-row justify-between items-center">
            <span className="flex flex-row items-center gap-1">
              # Of Traders:
              <span data-tip data-for="NumberOfTraders">
                <GetSvg svgName="tooltip" className=" cursor-pointer" />
              </span>
              <ReactTooltip
                id="NumberOfTraders"
                place="bottom"
                effect="solid"
                data-html={true}
                insecure={true}
                multiline={true}
                className="default-react-tooltip-style "
                delayHide={0}
              >
                The number of traders that joined the competition
              </ReactTooltip>
            </span>
            <b className="text-center">
              <DisplayNumber state={leaderBoardData?.length} />
            </b>
          </span>
          <span className="flex flex-row justify-between items-center ">
            <span className="flex flex-wrap items-center gap-1 ">
              # Of traders for the next span multiplier:
              <span data-tip data-for="NumberOfTradersNextMultiplier">
                <GetSvg svgName="tooltip" className="mr-auto cursor-pointer" />
              </span>
              <ReactTooltip
                id="NumberOfTradersNextMultiplier"
                place="bottom"
                effect="solid"
                data-html={true}
                insecure={true}
                multiline={true}
                className="default-react-tooltip-style "
                delayHide={0}
              >
                The number of traders that need to join the competition in order to get to the next rewards multiplier.
              </ReactTooltip>
            </span>
            <b className="mt-auto stiny:mt-0  text-center">
              <DisplayNumber state={NumUsersToNextMultiplier} />
            </b>
          </span>
        </div>
        <div className="flex flex-col sm:w-2/4 gap-4">
          <span className="flex flex-row justify-between">
            <span className="flex flex-wrap items-center gap-1">
              Current rewards multiplier:
              <span data-tip data-for="CurrentRewards">
                <GetSvg svgName="tooltip" className=" cursor-pointer" />
              </span>
              <ReactTooltip
                id="CurrentRewards"
                place="bottom"
                effect="solid"
                data-html={true}
                insecure={true}
                multiline={true}
                className="default-react-tooltip-style default-react-small-tooltip-style"
                delayHide={0}
              >
                rewards multiplier.
              </ReactTooltip>
            </span>
            <b className="mt-auto flex text-center">
              x
              <DisplayNumber state={multiplier} />
            </b>
          </span>
          <span className="flex flex-row justify-between">
            <span>Next rewards multiplier: </span>
            <b className="mt-auto flex  text-center">
              x
              <DisplayNumber state={nextMultiplier} />
            </b>
          </span>
        </div>
      </InnerContainer>
    </>
  )
}

export default CviCompetitionInfo
