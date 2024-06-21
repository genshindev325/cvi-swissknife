// import Tooltip from './Tooltip/Tooltip'
import DisplayNumber from '../DisplayNumber/DisplayNumber'

import classNames from 'classnames'
import ReactTooltip from 'react-tooltip'
import { useAppSelector } from 'beta-cvi-ui/src/redux'
import { GetSvg } from 'beta-cvi-ui/src/utils/GetSvg'

const Tvps = () => {
  const tvpUsdc = useAppSelector(state => state.state.tvpUsdc)

  return (
    <li
      className={classNames({
        'flex sm:flex-col justify-center items-center text-sm sm:text-xs border-b border-b-custom-600 xl:border-none text-white leading-tight w-full  sm:w-fit py-5.5 sm:py-0':
          true,
      })}
    >
      <span className="flex sm:flex-col justify-between  w-full px-10 sm:px-0  sm:w-fit ">
        <span className="flex flex-row gap-1  xl:mr-auto whitespace-nowrap">
          TVP
          <span data-tip data-for="tvpTip">
            <GetSvg svgName="tooltipArmadillo" className=" cursor-pointer" />
          </span>
          <ReactTooltip
            id="tvpTip"
            place="bottom"
            effect="solid"
            data-html={true}
            insecure={true}
            multiline={true}
            className="default-react-tooltip-style default-react-small-tooltip-style "
            delayHide={0}
          >
            Total value protected
          </ReactTooltip>
        </span>
        <DisplayNumber
          state={tvpUsdc}
          dollar={true}
          millify={true}
          tokenNameClassName={classNames({
            'sm:text-2xl sm:text-lg text-white': true,
          })}
          tokenNumberClassName={classNames({
            'sm:text-2xl sm:text-lg text-white': true,
          })}
          className={classNames({ 'xl:mr-auto text-lg': true })}
          type="tvl"
        />
      </span>
    </li>
  )
}
export default Tvps
