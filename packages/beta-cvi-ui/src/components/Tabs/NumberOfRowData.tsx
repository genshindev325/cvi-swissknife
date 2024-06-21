import type { FC } from 'react'

import { useState } from 'react'
import React from 'react'

import { useAppSelector } from '../../redux'

import classNames from 'classnames'
import { useAddress } from '../../hooks/use-address'
// import { useLocation } from 'react-router-dom'
type Props = {
  name: string
  activeTab: string
}

export enum ColumnName {
  'balances' = 'Balances',
  'pending-requests' = 'Pending Requests',
  'history' = 'History',
}

const NumberOfRowData: FC<Props> = ({ name, activeTab }) => {
  const PendingRequestInfo = useAppSelector(state => state.state.cvi.volatilityToken.PendingRequestTable)
  const balancesTableLength = useAppSelector(state => state.state.cvi.volatilityToken.balancesTableLength)
  const newHistoryRowCounter = useAppSelector(state => state.state.cvi.volatilityToken.newHistoryRowCounter)
  const { address } = useAddress()

  // const dispatch = useAppDispatch()
  const [isHistoryActive, setIsHistoryActive] = useState(true)
  // const location = useLocation()

  // useEffect(() => {
  //   if (location.hash.includes(ColumnName.history.toLowerCase())) {
  //     setIsHistoryActive(true)
  //   } else {
  //     setIsHistoryActive(false)
  //   }
  // }, [location.hash])

  // useEffect(() => {
  //   if (PendingRequestInfo.data !== undefined) {
  //     dispatch(actions.setNewHistoryRowCounter((counter += 1)))
  //   }
  // }, [PendingRequestInfo.data, dispatch])

  const chooseDataSet = (name: string) => {
    switch (name) {
      case ColumnName.balances:
        return balancesTableLength.data
      case ColumnName['pending-requests']:
        return PendingRequestInfo.data?.tableRowEvents.length
      case ColumnName.history:
        return newHistoryRowCounter

      default:
        break
    }
  }

  return (
    <div className="flex flex-row gap-1 w-fit items-center ">
      <span className="text-md sm:text-lg">
        {name}
        {address &&
          Object.values(ColumnName).map((cn, i) => {
            if (cn === name) {
              return cn === ColumnName.history ? (
                <span
                  key={i}
                  className={classNames({
                    'rounded-[100%] bg-custom-len-data-history-bg border border-custom-network-border text-11 w-4 h-4 flex justify-center items-center':
                      true,
                    hidden: isHistoryActive || newHistoryRowCounter === 0,
                  })}
                >
                  {chooseDataSet(name)}
                </span>
              ) : (
                <span key={i}> ({chooseDataSet(name) ?? 0})</span>
              )
            } else {
              return ''
            }
          })}
      </span>
    </div>
  )
}

export default NumberOfRowData
