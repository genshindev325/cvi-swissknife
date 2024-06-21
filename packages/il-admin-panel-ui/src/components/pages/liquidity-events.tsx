import { Stator } from '@coti-cvi/lw-sdk'
import sum from 'lodash/sum'
import type { FC } from 'react'
import { format } from 'date-fns'
import React from 'react'
import DisplayNumber from '../../../../beta-cvi-ui/src/components/DisplayNumber/DisplayNumber'
import { useAppSelector } from '../../redux'
import TimeAgo from 'javascript-time-ago'

const timeAgo = new TimeAgo('en-US')

type Props = {}

export const LiquidityEvents: FC<Props> = () => {
  const liquidityEvents = useAppSelector(state => {
    const protectionsBoughtExpiredBlocks = new Set(
      state.walletsProtections.flatMap(r =>
        r.protections.flatMap(p =>
          [
            p.protectionInfo.boughtEvent.transactionHash +
              '-' +
              p.protectionInfo.boughtEvent.transactionIndex +
              '-' +
              p.protectionInfo.boughtEvent.logIndex,
            p.protectionInfo.expiredEvent
              ? p.protectionInfo.expiredEvent.transactionHash +
                '-' +
                p.protectionInfo.expiredEvent.transactionIndex +
                '-' +
                p.protectionInfo.expiredEvent.logIndex
              : undefined,
          ].filter((b): b is string => b !== undefined),
        ),
      ),
    )

    return state.liquidityEvents
      .slice()
      .sort((e1, e2) => e2.blockNumber - e1.blockNumber)
      .filter(r => !protectionsBoughtExpiredBlocks.has(r.transactionHash + '-' + r.transactionIndex + '-' + r.logIndex))
      .map(event => {
        const timestamp = state.blocksToTimestamp[event.blockNumber]
        const Time = timestamp
          ? `${timeAgo.format(new Date(timestamp * 1000))} (${format(
              new Date(timestamp * 1000),
              'EEEE, dd-MM-yyyy HH:mm:ss',
            )})`
          : 'Loading...'

        if (event.type === 'LiquidityWithdrawn') {
          return {
            'Event Type': 'Withdrawn',
            'From / To Address': event.args.to,
            '$ Amount': event.args.amount,
            Time,
          }
        } else {
          return {
            'Event Type': 'Added',
            'From / To Address': event.args.from,
            '$ Amount': event.args.amount,
            Time,
          }
        }
      })
  })

  return (
    <div className="flex flex-col items-center px-4">
      {/* <div className="pb-4 bg-white dark:bg-gray-900">
        <label className="sr-only">Search</label>
        <div className="relative mt-1">
          <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </div>
          <input
            type="text"
            id="table-search"
            className="block p-2 pl-10 w-80 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search for items"
          />
        </div>
      </div> */}
      <div className="overflow-x-auto relative">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="py-3 px-6 text-left">
                Event Type ({liquidityEvents.length})
              </th>
              <th scope="col" className="py-3 px-6 text-left">
                From / To Address
              </th>
              <th scope="col" className="py-3 px-6 text-left">
                <div className="flex">
                  Amount (
                  <DisplayNumber
                    dollar
                    millify
                    withTooltip
                    state={Stator.resolve(sum(liquidityEvents.map(l => l['$ Amount'])))}
                  />
                  )
                </div>
              </th>
              <th scope="col" className="py-3 px-6 text-left">
                Time
              </th>
            </tr>
          </thead>
          <tbody>
            {liquidityEvents.map((event, index) => (
              <tr
                key={index}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-600"
              >
                <th scope="row" className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {event['Event Type']}
                </th>
                <td className="py-4 px-6">{event['From / To Address']}</td>
                <td className="py-4 px-6">
                  <DisplayNumber dollar millify withTooltip state={Stator.resolve(event['$ Amount'])} />
                </td>
                <td className="py-4 px-6">{event.Time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
