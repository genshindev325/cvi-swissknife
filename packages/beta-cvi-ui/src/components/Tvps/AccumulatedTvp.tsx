// import Tooltip from './Tooltip/Tooltip'
import DisplayNumber from '../DisplayNumber/DisplayNumber'

import classNames from 'classnames'
import ReactTooltip from 'react-tooltip'
import { useAppSelector } from 'beta-cvi-ui/src/redux'
import { GetSvg } from 'beta-cvi-ui/src/utils/GetSvg'

const Tvps = () => {
  const accumulatedTvpUsdc = useAppSelector(state => state.state.accumulatedTvpUsdc)

  return (
    <li
      className={classNames({
        'flex sm:flex-col justify-center items-center text-sm sm:text-xs border-b border-b-custom-600 xl:border-none text-white leading-tight w-full  sm:w-fit py-5.5 sm:py-0':
          true,
      })}
    >
      <span className="flex sm:flex-col justify-between  w-full px-10 sm:px-0  sm:w-fit ">
        <span className="flex flex-row gap-1 items-center xl:mr-auto whitespace-nowrap">
          <>Accumulated TVP</>
          <span data-tip data-for="AccumulatedTvpTip">
            <GetSvg svgName="tooltipArmadillo" className=" cursor-pointer" />
          </span>
          <ReactTooltip
            id="AccumulatedTvpTip"
            place="bottom"
            effect="solid"
            data-html={true}
            insecure={true}
            multiline={true}
            className="default-react-tooltip-style "
            delayHide={0}
          >
            Accumulated total value protected up to date
          </ReactTooltip>
        </span>
        <DisplayNumber
          state={accumulatedTvpUsdc}
          dollar={true}
          millify={true}
          tokenNameClassName={classNames({
            'sm:text-2xl sm:text-lg text-common-turquoise': true,
          })}
          tokenNumberClassName={classNames({
            'sm:text-2xl sm:text-lg text-common-turquoise': true,
          })}
          className={classNames({ 'xl:mr-auto text-lg': true })}
          type="tvl"
        />
      </span>
    </li>
  )
}
export default Tvps
