import type { FC } from 'react'
import { useMemo } from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import History from './History'
import { useLocation } from 'react-router-dom'
import { PendingRequestsTabsPaths } from '../../../types/common.types'
import PendingRequest from './PendingRequest'
import Container from '../../Container/Container'
import classNames from 'classnames'
import { actions, useAppDispatch, useAppSelector } from '../../../redux'
import Balances from './Balances'
import { Stator } from '@coti-cvi/lw-sdk/src'
import { useAddress } from '../../../hooks/use-address'

type PendingReqOption = [
  { name: 'balance'; path: string },
  { name: 'pending request'; path: string },
  { name: 'history'; path: string },
]

const PendingReqManager: FC = () => {
  const { address } = useAddress()
  const PendingRequestInfo = useAppSelector(state => state.state.cvi.volatilityToken.PendingRequestTable)
  const addressCurrentBalance = useAppSelector(state => state.state.cvi.volatilityToken.burnBalance)
  const platformUsdc = useAppSelector(state => state.state.cvi.volatilityToken.platformUsdc)
  const [showNoteStar, setShowNoteStar] = useState(false)
  const [PendingReqTableTab, setPendingReqTableTab] = useState('')
  const location = useLocation()
  const dispatch = useAppDispatch()

  const newBalancState = useMemo(
    () =>
      Stator.resolve(
        addressCurrentBalance.data
          ? [
              {
                amount: addressCurrentBalance,
                platform_price: platformUsdc,
              },
            ]
          : [],
      ),
    [addressCurrentBalance, platformUsdc],
  )

  useEffect(() => {
    dispatch(actions.setBalancesTableLength(Stator.resolve(newBalancState.data.length)))
  }, [dispatch, newBalancState])

  useEffect(() => {
    if (location.hash.includes(PendingRequestsTabsPaths.balance)) {
      setPendingReqTableTab(PendingRequestsTabsPaths.balance)
    } else if (location.hash.includes(PendingRequestsTabsPaths.history)) {
      setPendingReqTableTab(PendingRequestsTabsPaths.history)
    } else {
      setPendingReqTableTab(PendingRequestsTabsPaths['pending-request'])
    }
  }, [location.hash])

  useEffect(() => {
    if (PendingReqTableTab === PendingRequestsTabsPaths['pending-request']) {
      if (PendingRequestInfo.data !== undefined && PendingRequestInfo.data.tableRowEvents.length > 0) {
        setShowNoteStar(true)
      } else {
        setShowNoteStar(false)
      }
    } else {
      setShowNoteStar(false)
    }
  }, [PendingReqTableTab, PendingRequestInfo.data])

  return (
    <Container
      className={classNames({ 'flex-auto min-h-[16rem]': true })}
      title={[
        { name: 'Balances', path: PendingRequestsTabsPaths.balance },
        { name: 'Pending Requests', path: PendingRequestsTabsPaths['pending-request'] },
        { name: 'History', path: PendingRequestsTabsPaths.history },
      ]}
      activeTab={PendingReqTableTab}
    >
      {PendingReqTableTab === PendingRequestsTabsPaths.balance ? (
        <Balances newBalancState={newBalancState} />
      ) : PendingReqTableTab === PendingRequestsTabsPaths['pending-request'] ? (
        <PendingRequest />
      ) : (
        <History />
      )}
      {address && showNoteStar && (
        <span className="text-xs flex flex-col gap-2 mt-6">
          <p>
            *You can choose to manually fulfill your request 15 minutes after submission and prior to the specified
            target time. Please note that this will incur an early fulfillment fee.
          </p>
          <p>
            **In the event that the system fails to fulfill your request within the specified “receive in“ time, it will
            continue to attempt to fulfill your request within an hour from your specified “receive in“ time. If it is
            unsuccessful, a full refund will be issued to your wallet address.
          </p>
        </span>
      )}
    </Container>
  )
}

export default PendingReqManager
