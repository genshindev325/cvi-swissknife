import type { FC } from 'react'
import { format } from 'date-fns'
import type { Block } from '@coti-cvi/lw-sdk'
import { useAppSelector } from 'beta-cvi-ui/src/redux/hooks'

type Props = {
  timestamp: number
  useTooltip?: boolean
}

const DisplayDate: FC<Props> = ({ useTooltip, timestamp }) => {
  const latestBlock = useAppSelector(state => state.state.latestBlock)

  function timeDiffCalc(block: Block) {
    const startDate = new Date(block.timestamp * 1000)
    const endDate = new Date(timestamp * 1000)
    let diffInMilliSeconds: number = Math.abs(endDate.getTime() - startDate.getTime()) / 1000

    // calculate days
    const days = Math.floor(diffInMilliSeconds / 86400)
    diffInMilliSeconds -= days * 86400

    // calculate hours
    const hours = Math.floor(diffInMilliSeconds / 3600) % 24
    diffInMilliSeconds -= hours * 3600

    // calculate minutes
    const minutes = Math.floor(diffInMilliSeconds / 60) % 60
    diffInMilliSeconds -= minutes * 60

    let difference = ''

    difference +=
      days > 0
        ? `Ends in ${days} days`
        : `${
            hours && hours <= 9
              ? `0${hours}:${minutes <= 9 ? `0${minutes}` : minutes}`
              : `${hours}:${minutes <= 9 ? `0${minutes}` : minutes}`
          }`

    if (endDate < startDate) {
      difference = '00:00'
    }
    return difference
  }

  return (
    <div data-tooltip={useTooltip ? (latestBlock.data ? timeDiffCalc(latestBlock.data) : 'Loading...') : null}>
      {format(new Date(timestamp * 1000), 'dd/MM/yyyy HH:mm:ss')}
    </div>
  )
}

export default DisplayDate
