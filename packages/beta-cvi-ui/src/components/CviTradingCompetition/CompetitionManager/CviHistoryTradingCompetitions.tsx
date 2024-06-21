import { cviTradingCompetitionDates } from '@coti-cvi/lw-sdk'
import { actions, useAppDispatch, useAppSelector } from 'beta-cvi-ui/src/redux'
import { GetSvg } from 'beta-cvi-ui/src/utils/GetSvg'
import classNames from 'classnames'
import { format } from 'date-fns'
import React, { useState } from 'react'
import InnerContainer from '../../InnerContainer/InnerContainer'
import CviTradingTable from '../CviTradingTable'
import CviCompetitionBanner from './CviCompetitionBanner'

const CviHistoryTradingCompetitions = () => {
  const dispatch = useAppDispatch()
  const [selectCompetition, setSelectCompetition] = useState<number | undefined>()
  const historyCompetition = useAppSelector(state => state.state.cvi.historyCompetition)
  const handleClick = (
    { currentTarget: { id } }: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    comp: { fromTimestamp?: number | undefined; toTimestamp?: number | undefined },
  ) => {
    let fromTS = comp.fromTimestamp
    let toTS = comp.toTimestamp
    if (Number(id) === selectCompetition) {
      setSelectCompetition(undefined)
      fromTS = 0
      toTS = 0
    } else {
      setSelectCompetition(Number(id))
    }
    dispatch(actions.setHistoryCompetition(undefined))
    if (comp) {
      dispatch(
        actions.setHistoryCompetitionChooseTimestamps({
          fromTimestamp: fromTS,
          toTimestamp: toTS,
        }),
      )
    }
  }

  return (
    <>
      {cviTradingCompetitionDates.competitions.map((comp, i) => {
        // console.log(key, '=== ', selectCompetition, '-->')
        return (
          <span className="flex flex-col gap-4" key={i}>
            <button id={i.toString()} onClick={e => handleClick(e, comp)}>
              <InnerContainer className="bg-dark-300 flex flex-row justify-between gap-4  w-full m-auto">
                <span>Competition #{i + 1}</span>
                <span className="flex flex-wrap gap-1 justify-center">
                  <b className="whitespace-nowrap hidden tiny:flex">
                    {format(new Date((comp.fromTimestamp ?? 0) * 1000), 'dd/MM/yyyy HH:mm')} -{' '}
                    {format(new Date((comp.toTimestamp ?? 0) * 1000), 'dd/MM/yyyy HH:mm')}
                  </b>
                  <GetSvg
                    svgName="chevron"
                    className={classNames({
                      'block  transition duration-200 fill-custom-300': true,
                      'rotate-180': selectCompetition === i,
                    })}
                  />
                </span>
              </InnerContainer>
            </button>
            {selectCompetition === i && (
              <span className="w-full flex flex-col gap-4">
                <CviCompetitionBanner fromTimestamp={comp.fromTimestamp} toTimestamp={comp.toTimestamp} />
                <CviTradingTable isCompetition={true} tradingData={historyCompetition} />
              </span>
            )}
          </span>
        )
      })}
    </>
  )
}

export default CviHistoryTradingCompetitions
