import { AddressGroup, getAddressGroupAndName, isNumeric, TokenName } from '@coti-cvi/lw-sdk/src'
import _ from 'lodash'
import { useMemo, useState } from 'react'
import DisplayNumber from '../../../beta-cvi-ui/src/components/DisplayNumber/DisplayNumber'
import { useFilteredEvents } from '../hooks'
import useInversify from '../hooks/use-inversify'
import { useAppSelector } from '../redux'

export const ExternalHedging = () => {
  const currentHourlyFundingFee = useAppSelector(state => state.currentHourlyFundingFee)
  const currentThetaVaultUsdcBalance = useAppSelector(
    state => state.updateGeneralInfoOfEventAndAddresses?.generalInfoOfEvent.tvInfo.currentThetaVaultUsdcBalance,
  )
  const generalInfoOfEvent = useAppSelector(state => state.updateGeneralInfoOfEventAndAddresses?.generalInfoOfEvent)
  const { updatedGeneralInfoOfEventByAddressMap } = useFilteredEvents()
  const { cviContractsInversifyService } = useInversify()
  const cviBalanceOfAllWithoutCvisInDex = useMemo(
    () =>
      cviContractsInversifyService
        ? Array.from(updatedGeneralInfoOfEventByAddressMap.entries()).filter(
            ([address]) =>
              getAddressGroupAndName(address, cviContractsInversifyService).addressGroup === AddressGroup.USERS ||
              getAddressGroupAndName(address, cviContractsInversifyService).addressGroup === AddressGroup.COMMUNITY ||
              getAddressGroupAndName(address, cviContractsInversifyService).addressGroup === AddressGroup.GNOSIS_SAFE,
          )
        : [],
    [cviContractsInversifyService, updatedGeneralInfoOfEventByAddressMap],
  )
  const [userTotalDepositsUsdcAsStr, setUserTotalDepositsUsdcAsStr] = useState('0')

  const currentCviIndex = generalInfoOfEvent?.cviIndex
  const userTotalDepositsUsdc = isNumeric(userTotalDepositsUsdcAsStr) ? Number(userTotalDepositsUsdcAsStr) : undefined

  const totalOpenPositionsUsdc = _.sum(
    cviBalanceOfAllWithoutCvisInDex.map(
      ([_address, generalInfoOfEventByAddress]) => generalInfoOfEventByAddress.vtCvix1BalanceInUsdc,
    ),
  )

  const amountToHedgeUsdc = useMemo(() => {
    if (
      currentCviIndex === undefined ||
      currentThetaVaultUsdcBalance === undefined ||
      userTotalDepositsUsdc === undefined
    ) {
      return undefined
    }
    try {
      return (
        (userTotalDepositsUsdc / (currentThetaVaultUsdcBalance + userTotalDepositsUsdc)) *
        ((200 / currentCviIndex - 1) * totalOpenPositionsUsdc)
      )
    } catch {
      return undefined
    }
  }, [currentCviIndex, currentThetaVaultUsdcBalance, totalOpenPositionsUsdc, userTotalDepositsUsdc])

  return (
    <div>
      <div className="flex gap-1">
        <span>Daily Funding Fee:</span>
        <DisplayNumber
          state={currentHourlyFundingFee === undefined ? undefined : currentHourlyFundingFee * 24}
          percentage
        />
      </div>
      <div className="flex gap-1">
        <span>Theta Vault Balance:</span>
        <DisplayNumber state={currentThetaVaultUsdcBalance} dollar />
      </div>
      <div className="flex gap-1">
        <span>Current CVI:</span>
        <DisplayNumber state={currentCviIndex} />
      </div>
      <div className="flex gap-1">
        <span>Open Positions:</span>
        <DisplayNumber
          state={totalOpenPositionsUsdc}
          dollar
          moreInfoInBrackets={
            <DisplayNumber
              state={_.sum(
                cviBalanceOfAllWithoutCvisInDex.map(
                  ([_address, generalInfoOfEventByAddress]) => generalInfoOfEventByAddress.vtCviBalance,
                ),
              )}
              tokenName={TokenName.CVI}
            />
          }
        />
      </div>
      <br />
      <div className="flex gap-1">
        <span>User Deposit:</span>

        <span>$</span>
        <input
          type={'text'}
          className="text-black"
          value={userTotalDepositsUsdcAsStr}
          onChange={e => setUserTotalDepositsUsdcAsStr(e.target.value)}
        />
      </div>
      <div>-----------------</div>
      <div className="flex gap-1">
        {/* This is the max usdc the tv depositor will lose if the cvi goes to 200 */}
        <span>Amount to Hedge:</span>
        <DisplayNumber state={amountToHedgeUsdc} dollar />
      </div>
    </div>
  )
}
