import { useMemo } from 'react'
import React from 'react'
import { GetSvg } from 'beta-cvi-ui/src/utils/GetSvg'
import classNames from 'classnames'
import { Stator } from '@coti-cvi/lw-sdk'
import DisplayNumber from './DisplayNumber/DisplayNumber'

import { useAppSelector } from '../redux'
import Spinner from './Spinner/Spinner'

const CviTitleInfo = () => {
  const currentCvi = useAppSelector(state => state.state.currentCvi)

  const cviDataLastWeek = useAppSelector(state => state.state.cviDataLastWeek)
  const cviDataLast24h = useAppSelector(state => state.state.cviDataLast24h)

  const lastWeekCvi = useMemo(() => {
    const allWeekData = cviDataLastWeek.events

    if (allWeekData !== undefined) {
      let newMin = 201
      let newMax = 0
      for (let i = 0; i < allWeekData.length; i++) {
        newMin = allWeekData[i].value < newMin ? allWeekData[i].value : newMin
        newMax = allWeekData[i].value > newMax ? allWeekData[i].value : newMax
      }

      return { min: newMin, max: newMax }
    }
    return { min: 201, max: 0 }
  }, [cviDataLastWeek.events])

  // last twentyfour  hours
  const twentyFourHourChangesCvi = useMemo(() => {
    const allTwentyFour = cviDataLast24h.events

    if (allTwentyFour === undefined || allTwentyFour.length === 0 || currentCvi.data === undefined) {
      return { value: 0, percentage: 0 }
    }

    const changes = allTwentyFour[0]
    const val = currentCvi.data.cviIndex - changes.value
    const percentage = (val / changes.value) * 100
    return { value: val, percentage: percentage }
  }, [cviDataLast24h.events, currentCvi.data])

  return (
    <div className="text-white flex flex-row gap-10 items-center flex-wrap xl:flex-nowrap ml-4">
      <span className="flex flex-row gap-1 flex-nowrap md:text-3xl items-center lg:text-2xl 3xl:text-3xl whitespace-nowrap ">
        CVI{' '}
        <>
          {currentCvi.data ? (
            <DisplayNumber
              state={currentCvi.data.cviIndex}
              tokenNumberClassName="md:text-3xl lg:text-2xl 3xl:text-3xl"
            />
          ) : (
            <Spinner className="w-4 h-4 md:w-6 md:h-6 border-2 border-solid" />
          )}
        </>
      </span>
      <span className="text-xs h-full  flex flex-col   whitespace-nowrap">
        24h change{' '}
        <span
          className={classNames({
            '2xl:text-lg lg:text-sm flex flex-row mt-auto mb-auto': true,
            'text-common-turquoise': twentyFourHourChangesCvi.value >= 0,
            'text-common-lightRed': twentyFourHourChangesCvi.value < 0,
          })}
        >
          {twentyFourHourChangesCvi.value === 0 ? (
            <Spinner className="w-3 h-3 border-2 border-solid " />
          ) : (
            <span className="flex flex-row gap-1">
              <DisplayNumber
                state={twentyFourHourChangesCvi.value}
                tokenNumberClassName="2xl:text-lg lg:text-sm"
                customDecimal={2}
              />
              <span className="flex flex-row ">
                {`(${twentyFourHourChangesCvi.value > 0 ? '+' : ''}`}
                <DisplayNumber
                  state={twentyFourHourChangesCvi.percentage}
                  tokenNumberClassName="2xl:text-lg lg:text-sm"
                  customDecimal={2}
                  percentage
                />
                {`)`}
                {twentyFourHourChangesCvi.value >= 0 ? (
                  <GetSvg className="w-3 lg:w-5  h-fit " svgName="upArrow" />
                ) : (
                  <GetSvg className="w-3  lg:w-5  h-fit" svgName="downArrow" />
                )}
              </span>
            </span>
          )}
        </span>
      </span>
      <span className=" text-xs flex flex-col whitespace-nowrap ">
        Last week high{' '}
        <span className="2xl:text-lg lg:text-sm text-common-turquoise">
          {lastWeekCvi.max === 0 ? (
            <Spinner className="w-3 h-3 border-2 border-solid " />
          ) : (
            <DisplayNumber state={Stator.resolve(lastWeekCvi.max)} tokenNumberClassName="2xl:text-lg lg:text-sm" />
          )}
        </span>
      </span>
      <span className=" text-xs flex flex-col whitespace-nowrap">
        Last week low{' '}
        <span className="2xl:text-lg lg:text-sm text-common-lightRed">
          {lastWeekCvi.min === 201 ? (
            <Spinner className="w-3 h-3 border-2 border-solid " />
          ) : (
            <DisplayNumber state={Stator.resolve(lastWeekCvi.min)} tokenNumberClassName="2xl:text-lg lg:text-sm" />
          )}
        </span>
      </span>
    </div>
  )
}

export default CviTitleInfo
