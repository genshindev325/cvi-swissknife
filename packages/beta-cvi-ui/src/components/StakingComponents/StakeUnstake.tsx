import type { FC } from 'react'
import React, { useState } from 'react'
import InputAmount from '../InputAmount/InputAmount'
import type { RequestStatus } from '@coti-cvi/lw-sdk/src'
import { Stator } from '@coti-cvi/lw-sdk/src'
import { TokenName } from '@coti-cvi/lw-sdk/src'
import Button from '../Button/Button'
import { useAppSelector, useAppDispatch, actions } from '../../redux'
import { useTvInversifyServices } from 'beta-cvi-ui/src/hooks/useTvInversifyServices'
import { useWallet } from '../../hooks/useWallet'
import { displayNotification } from 'beta-cvi-ui/src/utils/utilities'
import CustomNotification from '../CustomNotification'
import { useAddress } from '../../hooks/use-address'
type Props = {
  setShowStakeUnstakeModal: React.Dispatch<React.SetStateAction<boolean>>
  type: 'stake' | 'unstake' | 'unstakeAll' | 'stakeAll'
}

const StakeUnstake: FC<Props> = ({ setShowStakeUnstakeModal, type }) => {
  const [amount, setAmount] = useState<number | undefined>()
  const [isLoading, setIsLoading] = useState(false)
  const { address } = useAddress()
  const { globalEventsInversifyService } = useWallet()
  const staking = useAppSelector(state => state.state.cvi.stack.staking)
  const { stakingInversifyService } = useTvInversifyServices()
  const [submitStatus, setSubmitStatus] = useState<RequestStatus>('resolved')
  const [isMaxClicked, setIsMaxClicked] = useState(false)
  const dispatch = useAppDispatch()

  const submitIsDisable =
    amount === undefined ||
    amount === 0 ||
    (type === 'stake' && staking.data
      ? staking.data.availableToStake.data !== undefined && amount > staking.data.availableToStake.data
      : staking.data && staking.data.currentStake.data !== undefined && amount > staking.data.currentStake.data)

  const maxBalance =
    type === 'stake' && staking.data
      ? staking.data.availableToStake.data !== undefined
        ? staking.data.availableToStake.data
        : undefined
      : staking.data && staking.data.currentStake.data !== undefined
      ? staking.data.currentStake.data
      : undefined

  const onSubmit = async () => {
    if (window.gtag) {
      window.gtag('event', `${type}_started`, {
        page_title: `${type}_started`,
        ...(type === 'stake'
          ? { stake_title: `${type} started` }
          : type === 'unstake'
          ? { unstake_title: `${type} started` }
          : type === 'stakeAll'
          ? { stakeAll_title: `${type} started` }
          : { unstakeAll_title: `${type} started` }),
        description: `User click on ${type} button`,
        page_path: window.location.pathname,
      })
    }
    try {
      setIsLoading(true)
      if (stakingInversifyService && amount !== undefined) {
        let tx
        setSubmitStatus('pending')

        if (isMaxClicked) {
          tx = await stakingInversifyService[type === 'stake' ? (type = 'stakeAll') : (type = 'unstakeAll')]()
        } else {
          tx = await stakingInversifyService[type](amount)
        }
        if (amount !== undefined) {
          displayNotification({
            id: `${tx !== undefined ? `pending-${tx?.transactionHash}` : 'pending'}`,
            title: 'pending',
            type: 'info',
            message: `${type === 'stake' || type === 'stakeAll' ? 'Staking' : 'Unstaking'} ${amount} GOVI`,
            content: CustomNotification,
          })
        }

        if (tx !== undefined && address && (type === 'stake' || type === 'stakeAll')) {
          dispatch(actions.setUnstakeLock(Stator.resolve({ isLocked: true, lockEndTimestamp: 0, timeLeftSeconds: 0 })))
          await stakingInversifyService.emitLockUstakeEvents(address)
          await stakingInversifyService.emitUserStakingEvents(address)
        }
        if (tx !== undefined && address && amount !== undefined) {
          displayNotification({
            id: `${tx?.transactionHash}`,
            title: 'completed',
            type: 'success',
            message: `Successfully ${type === 'stake' || type === 'stakeAll' ? 'staked' : 'unstaked'} ${amount} GOVI`,
            content: CustomNotification,
          })
        }
      }
      if (window.gtag) {
        window.gtag('event', `${type}_successed`, {
          page_title: `${type}_successed`,
          ...(type === 'stake'
            ? { stake_title: `Successful - ${type} successed` }
            : type === 'unstake'
            ? { unstake_title: `Successful - ${type} successed` }
            : type === 'stakeAll'
            ? { stakeAll_title: `Successful - ${type} successed` }
            : { unstakeAll_title: `Successful - ${type} successed` }),
          description: `The ${type} successed`,
          page_path: window.location.pathname,
        })
      }

      setSubmitStatus('resolved')
    } catch (error) {
      if (error.message.includes('User denied transaction signature')) {
        if (window.gtag) {
          window.gtag('event', `${type}_transaction_denied`, {
            page_title: `${type}_transaction_denied`,
            ...(type === 'stake'
              ? { stake_denied_title: `Fail - Denied to ${type} ` }
              : type === 'unstake'
              ? { unstake_denied_title: `Fail - Denied to ${type} ` }
              : type === 'stakeAll'
              ? { stakeAll_denied_title: `Fail - Denied to ${type} ` }
              : { unstakeAll_denied_title: `Fail - Denied to ${type} ` }),
            description: 'User denied the transaction on the wallet',
            page_path: window.location.pathname,
          })
        }
        displayNotification({
          id: `${type}Cancelled`,
          title: 'failed',
          type: 'danger',
          message: `Transaction was cancelled`,
          content: CustomNotification,
        })
      } else {
        if (window.gtag) {
          window.gtag('event', `${type}_transaction_fail`, {
            page_title: `${type}_transaction_fail`,
            ...(type === 'stake'
              ? { stake_fail_title: `Fail - Failed to ${type} ` }
              : type === 'unstake'
              ? { unstake_fail_title: `Fail - Failed to ${type} ` }
              : type === 'stakeAll'
              ? { stakeAll_fail_title: `Fail - Failed to ${type} ` }
              : { unstakeAll_fail_title: `Fail - Failed to ${type} ` }),
            description: 'The transaction failed',
            page_path: window.location.pathname,
          })
        }
        if (amount !== undefined) {
          displayNotification({
            id: `${type}Failed`,
            title: 'failed',
            type: 'danger',
            message: `Failed to ${type} ${amount} GOVI`,
            content: CustomNotification,
          })
        }
      }
      globalEventsInversifyService?.eventEmitter.emit('errors', error)
    } finally {
      setAmount(undefined)
      setIsLoading(false)
      setShowStakeUnstakeModal(false)
    }
  }

  const onCancel = () => {
    setShowStakeUnstakeModal(false)
  }

  return (
    <>
      <h1 className="mb-12 text-2xl capitalize">{type}</h1>
      <div className="text-white flex flex-col gap-8">
        <InputAmount
          userBalanceText={`Avaliable to ${type}`}
          typeOfBalance={TokenName.GOVI}
          userBalance={
            type === 'stake' && staking.data !== undefined
              ? staking.data.availableToStake
              : staking.data
              ? staking.data.currentStake
              : Stator.resolve(0)
          }
          customDecimalUserBalance={6}
          fromWhereThisPageInput={`${type !== 'stake' && type !== 'unstake' ? type : ''}`}
          customTitle="Amount"
          setIsMaxClicked={setIsMaxClicked}
          value={amount}
          setValue={setAmount}
          fractionDigits={20}
          maxBalance={maxBalance}
          maxBalanceTitle="Max"
          custompPaceholder={`Enter ${type} amount`}
          type={TokenName.GOVI}
          // maxValues={[
          //   {
          //     value:
          //       type === 'stake' && staking.data !== undefined
          //         ? staking.data.availableToStake.data
          //         : staking.data
          //         ? staking.data.currentStake.data
          //         : 0,
          //     errorMessage: <span className="text-common-lightRed text-xs">Not enough balance</span>,
          //   },
          // ]}
        />
        {/* <span className="text-xs mr-1 mb-8 flex flex-row gap-1">
          Avaliable to {type}:
          {!address ? (
            '0'
          ) : (
            <DisplayNumber
              state={
                type === 'stake' && staking.data !== undefined
                  ? staking.data.availableToStake
                  : staking.data
                  ? staking.data.currentStake
                  : 0
              }
              tokenName={TokenName.GOVI}
              className="font-bold text-xs"
              tokenNameClassName="font-normal"
            />
          )}
        </span> */}

        <div className="flex flex-col gap-4">
          <Button type="submit" title="confirm" onClick={onSubmit} disabled={submitIsDisable} status={submitStatus} />
          <Button type="common" title="cancel" onClick={onCancel} />
        </div>
      </div>
    </>
  )
}

export default StakeUnstake
