import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import type {
  USDC,
  CVIUSDCThetaVault,
  CVIUSDCThetaVaultRequestFulfiller,
} from '@coti-cvi/auto-generated-code/contracts'
import type { BigNumber, ContractTransaction } from 'ethers'
import { expect } from '../utils'
import type { TestHelper } from '../utils'
import { thetaTokenDecimals, tokenDecimals } from '../../src/state/cvi-state'
import { fromNumber, toNumber } from '../../../lw-sdk/src/util/big-number'

type ThetaContracts = {
  usdcToken: USDC
  thetaVault: CVIUSDCThetaVault
  vaultRequestFulfiller: CVIUSDCThetaVaultRequestFulfiller
}

export type ThetaVaultActions = ReturnType<typeof thetaVaultActions>

export const thetaVaultActions = (
  helper: TestHelper,
  { usdcToken, thetaVault, vaultRequestFulfiller }: ThetaContracts,
) => {
  const getIntrinsicValue = async () => {
    const [{ balance }, totalSupply] = await Promise.all([thetaVault.totalBalance(), thetaVault.totalSupply()])
    return toNumber(balance, tokenDecimals) / toNumber(totalSupply, thetaTokenDecimals)
  }

  const checkWithdrawLock = async (account: string): Promise<{ isLocked: boolean; lockEndTimestamp: number }> => {
    const [lockupPeriod, lastDeposit, { timestamp }] = await Promise.all([
      thetaVault.lockupPeriod(),
      thetaVault.lastDepositTimestamp(account),
      helper.latestBlock(),
    ])
    const noDeposits = lastDeposit.isZero()
    if (noDeposits) {
      return { isLocked: false, lockEndTimestamp: 0 }
    }
    const lockEnd = lastDeposit.add(lockupPeriod).toNumber()
    return { isLocked: lockEnd > timestamp, lockEndTimestamp: lockEnd }
  }

  const advanceTimeToEndOfLock = async (account: string): Promise<void> => {
    const { lockEndTimestamp } = await checkWithdrawLock(account)
    await helper.setTimestamp(lockEndTimestamp)
  }

  const submit = async (
    signer: SignerWithAddress,
    amount: BigNumber,
    method: 'Deposit' | 'Withdraw',
    shouldStake = false,
  ) => {
    const res =
      method === 'Deposit'
        ? await thetaVault.connect(signer).submitDepositRequest(amount /* , shouldStake */)
        : await thetaVault.connect(signer).submitWithdrawRequest(amount)
    const block = (await res.wait()).blockNumber

    const events = await thetaVault.queryFilter(thetaVault.filters.SubmitRequest(), block, block)
    expect(events.length).to.equal(1)
    const { targetTimestamp, requestId, requestType, tokenAmount } = events[0].args
    return { targetTimestamp, requestId, requestType, tokenAmount }
  }

  const submitDeposit = async (signer: SignerWithAddress, depositAmount: number | BigNumber, shouldStake = false) => {
    const amount = typeof depositAmount === 'number' ? fromNumber(depositAmount, tokenDecimals) : depositAmount
    await usdcToken.connect(signer).approve(thetaVault.address, amount)
    return submit(signer, amount, 'Deposit', shouldStake)
  }

  const submitWithdraw = async (signer: SignerWithAddress, withdrawAmount?: number | BigNumber) => {
    const amount = withdrawAmount
      ? typeof withdrawAmount === 'number'
        ? fromNumber(withdrawAmount, thetaTokenDecimals)
        : withdrawAmount
      : await thetaVault.balanceOf(signer.address)
    await thetaVault.connect(signer).approve(thetaVault.address, amount)
    return submit(signer, amount, 'Withdraw')
  }

  const deposit = async (
    signer: SignerWithAddress,
    depositAmount: number | BigNumber,
    shouldStake = false,
    isKeepers = true,
  ) => {
    const { targetTimestamp, requestId } = await submitDeposit(signer, depositAmount, shouldStake)
    await helper.setTimestamp(targetTimestamp)

    let tx: ContractTransaction
    if (isKeepers) {
      const { upkeepNeeded, performData } = await vaultRequestFulfiller.checkUpkeep([0])
      expect(upkeepNeeded).to.equal(true)
      tx = await vaultRequestFulfiller.connect(signer).performUpkeep(performData)
    } else {
      tx = await thetaVault.connect(signer).fulfillDepositRequest(requestId)
    }
    const block = (await tx.wait()).blockNumber

    const events = await thetaVault.queryFilter(thetaVault.filters.FulfillDeposit(), block, block)
    expect(events.length).to.equal(1)
    const { mintedThetaTokens, totalUSDCAmount } = events[0].args
    return { mintedThetaTokens, totalUSDCAmount }
  }

  const withdraw = async (signer: SignerWithAddress, withdrawAmount?: number | BigNumber, isKeepers = true) => {
    const { targetTimestamp, requestId } = await submitWithdraw(signer, withdrawAmount)
    await helper.setTimestamp(targetTimestamp)

    let tx: ContractTransaction
    if (isKeepers) {
      const { upkeepNeeded, performData } = await vaultRequestFulfiller.checkUpkeep([0])
      expect(upkeepNeeded).to.equal(true)
      tx = await vaultRequestFulfiller.connect(signer).performUpkeep(performData)
    } else {
      tx = await thetaVault.connect(signer).fulfillWithdrawRequest(requestId)
    }
    const block = (await tx.wait()).blockNumber

    const events = await thetaVault.queryFilter(thetaVault.filters.FulfillWithdraw(), block, block)
    expect(events.length).to.equal(1)
    const { burnedThetaTokens, totalUSDCAmount } = events[0].args
    return { burnedThetaTokens, totalUSDCAmount }
  }
  return {
    getIntrinsicValue,
    checkWithdrawLock,
    advanceTimeToEndOfLock,
    submitDeposit,
    submitWithdraw,
    deposit,
    withdraw,
  }
}
