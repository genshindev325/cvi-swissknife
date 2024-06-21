import classNames from 'classnames'
import type { FC } from 'react'
import React from 'react'

import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import ReactTooltip from 'react-tooltip'
import { GetSvg } from 'beta-cvi-ui/src/utils/GetSvg'
type Props = {
  selectedMinute: number
  setSelectedMinute: React.Dispatch<React.SetStateAction<number>>
  setOnProgressBarFocus: React.Dispatch<React.SetStateAction<boolean>>
}

const TimeToFulfillmentProgressBar: FC<Props> = ({ selectedMinute, setSelectedMinute, setOnProgressBarFocus }) => {
  const handleMinutesChange = (value: number | number[]) => {
    setOnProgressBarFocus(false)
    setSelectedMinute(Number(value))
  }

  return (
    <div className={`flex flex-col w-full text-white gap-4 relative text-lg`}>
      <span className="flex flex-row justify-between">
        <span className="flex flex-row  gap-1 sm:whitespace-nowrap  sm:flex items-center">
          Receive in{' '}
          <span data-tip data-for="receiveInTip">
            <GetSvg svgName="tooltip" className=" cursor-pointer" />
          </span>
          <ReactTooltip
            id="receiveInTip"
            place="bottom"
            effect="solid"
            data-html={true}
            insecure={true}
            multiline={true}
            className="default-react-tooltip-style "
            delayHide={0}
          >
            Your request will be automatically fulfilled in the selected target time.
          </ReactTooltip>
        </span>
        <span className="text-sm">{selectedMinute} Min</span>
      </span>
      <span className="test flex flex-col gap-1  w-full relative">
        <span className="">
          <Slider
            min={20}
            max={60}
            defaultValue={60}
            value={selectedMinute}
            onChange={handleMinutesChange}
            railStyle={{
              height: 1,
              background: '#2f3250',
            }}
            handleStyle={{
              height: 16,
              width: 16,
              borderRadius: '100%',
              zIndex: 10,
              marginTop: -7,
              backgroundColor: '#007acb',
              border: 0,
            }}
            trackStyle={{
              background: '#007acb',
              height: 1,
            }}
            onFocus={() => setOnProgressBarFocus(false)}
            onBlur={() => setOnProgressBarFocus(true)}
          />
        </span>
        <span className="flex justify-between">
          <span className="relative leading-tight">
            <span
              className={classNames({
                'h-2 w-[2px] left-0.5 rounded-[1px] bg-custom-500 absolute -top-[1.01rem] ': true,
                'z-0': selectedMinute === 20,
                'z-20': selectedMinute > 20,
              })}
            ></span>

            <span className="text-common-lightGray text-sm">20</span>
          </span>
          <span className="relative leading-tight">
            <span
              className={classNames({
                'h-2 w-[2px] left-1/2 rounded-[1px] bg-custom-500 absolute -top-[1.01rem] ': true,
                'z-0': selectedMinute === 40,
                'z-20': selectedMinute < 40 || selectedMinute > 40,
              })}
            ></span>
            <span className="text-common-lightGray text-sm">40</span>
          </span>
          <span className="relative leading-tight">
            <span
              className={classNames({
                'h-2 w-[2px] left-2.5  rounded-[1px] bg-custom-500 absolute -top-[1.01rem] ': true,
                'z-0': selectedMinute === 60,
                'z-20': selectedMinute < 60,
              })}
            ></span>
            <span className="text-common-lightGray text-sm">60</span>
          </span>
        </span>
      </span>
    </div>
  )
}

export default TimeToFulfillmentProgressBar
