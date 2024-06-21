import FlipClockCountdown from '@leenguyen/react-flip-clock-countdown'
import { format } from 'date-fns'
import type { FC } from 'react'
import React from 'react'
import InnerContainer from '../../InnerContainer/InnerContainer'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import { cviTradingCompetitionDates } from '@coti-cvi/lw-sdk'
TimeAgo.setDefaultLocale(en.locale)
TimeAgo.addLocale(en)

const timeAgo = new TimeAgo('en-US')
export function diffTimeFromNow({ dateMs, nowMs }: { dateMs: number; nowMs: number }) {
  return timeAgo.format(new Date(dateMs), undefined, {
    now: nowMs,
  })
}

type Props = {
  fromTimestamp: number | undefined
  toTimestamp: number | undefined
}
const CviCompetitionBanner: FC<Props> = ({ fromTimestamp, toTimestamp }) => {
  const isTimeZero = '00/00/00 00:00 - 00/00/00 00:00'
  return (
    <InnerContainer className="bg-dark-300 flex flex-row gap-4  w-full m-auto">
      <span className="flex flex-col gap-4 items-center  w-full">
        Competition dates
        <span className="flex flex-wrap gap-1 justify-center">
          {toTimestamp ? (
            <>
              <b className="whitespace-nowrap">{format(new Date((fromTimestamp ?? 0) * 1000), 'dd/MM/yyyy HH:mm')}</b>
              <b>-</b>
              <b className="whitespace-nowrap">{format(new Date((toTimestamp ?? 0) * 1000), 'dd/MM/yyyy HH:mm')}</b>
            </>
          ) : (
            isTimeZero
          )}
        </span>
        <span>
          <span className="flex">
            {toTimestamp ? (
              <FlipClockCountdown className="flip-clock" to={toTimestamp * 1000 ?? 0} dividerStyle={{ height: 0 }}>
                <span>NOTE: The competition had finished ✨</span>
              </FlipClockCountdown>
            ) : cviTradingCompetitionDates.currentCompetition.toTimestamp ? (
              diffTimeFromNow({
                dateMs: cviTradingCompetitionDates.currentCompetition.toTimestamp * 1000,
                nowMs: Date.now(),
              })
            ) : (
              ''
            )}
          </span>
          {/* <span className="flex sm:hidden gap-1">
        <span>Ends</span>
        {diffTimeFromNow({
          dateMs: cviTradingCompetitionDates.current.toTimestamp * 1000,
          nowMs: Date.now(),
        })}
      </span> */}
        </span>
      </span>
    </InnerContainer>
  )
}

export default CviCompetitionBanner
