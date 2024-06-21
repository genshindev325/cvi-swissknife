import type { FC } from 'react'
import { useState } from 'react'
import { useCallback } from 'react'
import { useEffect } from 'react'
import { useAppSelector } from '../redux'

type Props = {
  targetTimestamp: number
}
const CountDownTimer: FC<Props> = ({ targetTimestamp }) => {
  const latestBlock = useAppSelector(state => state.state.latestBlock)
  const [timer, setTimer] = useState<string | undefined>(undefined)
  const timeDiffCalc = useCallback(() => {
    if (latestBlock.data?.timestamp !== undefined) {
      const diffInMilliSeconds: number = Math.abs(latestBlock.data?.timestamp - targetTimestamp)

      // calculate hours
      const hours = Math.floor(diffInMilliSeconds / 3600) % 24
      //   diffInMilliSeconds -= hours * 3600

      // calculate minutes
      const minutes = Math.floor(diffInMilliSeconds / 60) % 60
      //   diffInMilliSeconds -= minutes * 60
      const seconds = Math.floor(diffInMilliSeconds % 60)

      let difference = ''

      difference +=
        hours === 0 && minutes === 0
          ? `Less than a minute`
          : `${`0${hours}:${minutes <= 9 ? `0${minutes}` : minutes}`} HH:MM`

      if (targetTimestamp < latestBlock.data?.timestamp) {
        difference = 'Processing'
      }
      return difference
    }
  }, [latestBlock.data?.timestamp, targetTimestamp])

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(timeDiffCalc())
    }, 1000)

    return () => clearInterval(interval)
  }, [timeDiffCalc])

  return <div>{timer}</div>
}

export default CountDownTimer
