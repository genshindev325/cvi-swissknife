import { cviTradingCompetitionDates } from '@coti-cvi/lw-sdk/src'
import { safeObjectEntries } from '@coti-cvi/lw-sdk'
import { format } from 'date-fns'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { actions, timeRanges, useAppSelector } from '../redux'
import InnerContainer from './InnerContainer/InnerContainer'

const TimeAndDateToFetchData = () => {
  const dispatch = useDispatch()
  const liveTrading = useAppSelector(state => state.state.cvi.liveTrading)
  const [select, setSelect] = useState('')
  const {
    range,
    chooseTimestamps: { fromTimestamp, toTimestamp },
  } = liveTrading

  const onSelectCompetition = (val: number) => {
    if (!isNaN(val)) {
      dispatch(actions.setLiveTrading(undefined))
      dispatch(actions.setCviTradingCompetitionRanegs(undefined))
      dispatch(actions.setCviTradingCompetitionChooseTimestamps(cviTradingCompetitionDates.competitions[val]))
    }
  }
  const onChangeRadio = (range: '24h' | '2d' | '1w' | 'all') => {
    setSelect('')
    dispatch(actions.setCviTradingCompetitionRanegs(range))
  }
  return (
    <InnerContainer className="bg-dark-300 flex flex-col  gap-4 w-full m-auto">
      <div className="flex flex-row items-center gap-2 m-auto">
        <label>from: </label>
        <input
          onFocus={() => dispatch(actions.setCviTradingCompetitionRanegs(undefined))}
          type="datetime-local"
          value={fromTimestamp ? format(new Date(fromTimestamp * 1000), 'yyyy-MM-dd HH:mm') : ''}
          onChange={event => {
            dispatch(actions.setLiveTrading(undefined))
            dispatch(
              actions.setCviTradingCompetitionChooseTimestamps({
                fromTimestamp: Math.floor(Date.parse(event.target.value) / 1000),
                toTimestamp,
              }),
            )
          }}
          className="text-black    px-1 rounded-lg h-8 text-center focus:outline-none"
        />
      </div>
      <div className="w-full m-auto flex stiny:flex-row   md:justify-start ">
        <span className=" mb-auto lg:ml-12 mr-2">Last:</span>
        <span className=" w-full  md:w-full  flex  justify-between flex-col stiny:flex-row ">
          {safeObjectEntries(timeRanges).map(([key, value]) => {
            return 'Milisecond' in value ? (
              <label key={key} className="sm:w-2/4  ">
                <input
                  className="mr-1"
                  type="radio"
                  value={value.name}
                  checked={select === '' && range === value.name}
                  onChange={() => onChangeRadio(value.name)}
                />
                {value.name}
              </label>
            ) : (
              <select
                key={'select_Competition'}
                onChange={event => {
                  const val = event.currentTarget.value
                  setSelect(val)
                  onSelectCompetition(Number(val))
                }}
                className="text-black h-fit mr-2 focus:outline-none rounded"
                name="competitions"
                value={select}
              >
                <option key={'title'} value="">
                  Competitions
                </option>
                {cviTradingCompetitionDates.competitions.map((comp, i) => {
                  return (
                    <option key={i.toString()} value={i}>
                      {comp.name}
                    </option>
                  )
                })}
              </select>
            )
          })}
        </span>
      </div>
    </InnerContainer>
  )
}

export default TimeAndDateToFetchData
