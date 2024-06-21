import { useEffect, useState } from 'react'
import type { Block } from '@coti-cvi/lw-sdk'
import { isNumeric } from '@coti-cvi/lw-sdk'
import type { InitInversifyReturnType } from '../init-inversify'
import usePromise from 'react-use-promise'
import { format } from 'date-fns'

export function AdvanceTime({
  container,
  latestBlock,
  isLoadingAdvanceTime,
  setIsLoadingAdvanceTime,
}: {
  isLoadingAdvanceTime: boolean
  setIsLoadingAdvanceTime: (IsLoadingAdvanceTime: boolean) => void
  container?: InitInversifyReturnType
  latestBlock?: Block
}) {
  const [hoursToAdvanceTerm, setHoursToAdvanceTerm] = useState<string>('0')

  const isHoursToAdvanceValid = isNumeric(hoursToAdvanceTerm) && Number(hoursToAdvanceTerm) > 0

  const canAdvanceTime = latestBlock && isHoursToAdvanceValid && container && !isLoadingAdvanceTime

  useEffect(() => {
    if (!container) {
      setIsLoadingAdvanceTime(false)
      setHoursToAdvanceTerm('0')
    }
  }, [container, setIsLoadingAdvanceTime])

  const [hardhatAdvanceTimeInversifyService] = usePromise(
    async () => container?.getAsync('HardhatAdvanceTimeInversifyService'),
    [container],
  )

  function getHoursToAdvanceLine() {
    if (isHoursToAdvanceValid) {
      if (latestBlock) {
        return (
          <span>
            &nbsp;New Timestamp:{' '}
            <span style={{ color: 'green' }}>
              {format(
                new Date(latestBlock.timestamp * 1000 + Number(hoursToAdvanceTerm) * 60 * 60 * 1000),
                'dd/MM/yyyy HH:mm:ss',
              )}{' '}
              (Local Time)
            </span>
          </span>
        )
      } else {
        return <></>
      }
    } else {
      if (hoursToAdvanceTerm === '0') {
        return <></>
      } else {
        return <span>&nbsp; (Invalid Value)</span>
      }
    }
  }

  return (
    <div>
      <div>
        Move Hours Ahead&nbsp;
        <input
          style={{ width: '60px' }}
          disabled={isLoadingAdvanceTime}
          value={hoursToAdvanceTerm}
          onChange={e => setHoursToAdvanceTerm(e.target.value)}
        />
        {getHoursToAdvanceLine()}
      </div>
      <div style={{ fontSize: '12px' }}>
        * Use this to expedite tasks that take time to happen by moving the blockchain time ahead
      </div>
      <br />

      {isLoadingAdvanceTime && (
        <div>
          <br />
          Changing Time...
        </div>
      )}
      <button
        disabled={!canAdvanceTime}
        onClick={async () => {
          if (hardhatAdvanceTimeInversifyService) {
            setIsLoadingAdvanceTime(true)
            try {
              await hardhatAdvanceTimeInversifyService
                .simpleAdvanceTime(Number(hoursToAdvanceTerm) * 60 * 60)
                .finally(() => {
                  setHoursToAdvanceTerm('0')
                  setIsLoadingAdvanceTime(false)
                })
            } catch (error) {
              console.error(error)
            }
          }
        }}
      >
        Advance Time
      </button>
    </div>
  )
}
