import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import type {
  USDC,
  CVIUSDCRequestFeesCalculator,
  CVIUSDCVolatilityToken,
  CVIUSDCVolTokenRequestFulfiller,
  PlatformHelper,
} from '@coti-cvi/auto-generated-code/contracts'
import { expect } from '../utils'
import type { TestHelper } from '../utils/test-helper'
import type { BigNumber, BigNumberish, ContractTransaction } from 'ethers'
import {
  maxTimeWindow,
  tokenDecimals,
  volTokenDecimals,
  keepersFeePercent,
  keepersFeeMax,
} from '../../src/state/cvi-state'
import { fromNumber } from '../../../lw-sdk/src/util/big-number'

interface BaseSubmitData {
  amount: BigNumber
  method: string
  timeDelay: number
  isKeepers: boolean
}

interface SubmitKeepersMintData extends BaseSubmitData {
  method: 'Mint'
  isKeepers: true
  maxBuyingPremiumFeePercentage: BigNumberish
}

interface SubmitMintData extends BaseSubmitData {
  method: 'Mint'
  isKeepers: false
}

interface SubmitKeepersBurnData extends BaseSubmitData {
  method: 'Burn'
  isKeepers: true
}

interface SubmitBurnData extends BaseSubmitData {
  method: 'Burn'
  isKeepers: false
}

type SubmitData = SubmitKeepersMintData | SubmitKeepersBurnData | SubmitMintData | SubmitBurnData

type VolatilityTokenContracts = {
  usdcToken: USDC
  volToken: CVIUSDCVolatilityToken
  requestFeesCalculatorContract: CVIUSDCRequestFeesCalculator
  volTokenRequestFulfiller: CVIUSDCVolTokenRequestFulfiller
  platformHelper: PlatformHelper
}

export type VolatilityTokenActions = ReturnType<typeof volatilityTokenActions>

export const volatilityTokenActions = (
  helper: TestHelper,
  {
    usdcToken,
    volToken,
    requestFeesCalculatorContract,
    volTokenRequestFulfiller,
    platformHelper,
  }: VolatilityTokenContracts,
) => {
  const submit = async (signer: SignerWithAddress, submitData: SubmitData) => {
    let tx: ContractTransaction
    if (submitData.isKeepers) {
      if (submitData.method === 'Mint') {
        const { amount, timeDelay, maxBuyingPremiumFeePercentage } = submitData
        tx = await volToken.connect(signer).submitKeepersMintRequest(amount, timeDelay, maxBuyingPremiumFeePercentage)
      } else {
        const { amount, timeDelay } = submitData
        tx = await volToken.connect(signer).submitKeepersBurnRequest(amount, timeDelay)
      }
    } else {
      const { amount, timeDelay, method } = submitData
      tx = await volToken.connect(signer)[`submit${method}Request`](amount, timeDelay)
    }
    const block = (await tx.wait()).blockNumber

    const events = await volToken.queryFilter(volToken.filters.SubmitRequest(), block, block)
    expect(events.length).to.equal(1)
    const { targetTimestamp, requestId, requestType, tokenAmount, maxBuyingPremiumFeePercentage } = events[0].args
    return { targetTimestamp, requestId, requestType, tokenAmount, maxBuyingPremiumFeePercentage }
  }

  const submitMint = async (
    signer: SignerWithAddress,
    mintAmount: number | BigNumber,
    timeDelay = maxTimeWindow,
    isKeepers = true,
  ) => {
    const amount = typeof mintAmount === 'number' ? fromNumber(mintAmount, tokenDecimals) : mintAmount
    // const { buyingPremiumFeePercentage: maxBuyingPremiumFeePercentage } = await platformHelper.calculatePreMint(
    //   volToken.address,
    //   isKeepers,
    //   amount,
    //   timeDelay,
    // )
    await usdcToken.connect(signer).approve(volToken.address, amount)
    return submit(signer, { amount, timeDelay, method: 'Mint', isKeepers, maxBuyingPremiumFeePercentage: 1000 })
  }

  const submitBurn = async (
    signer: SignerWithAddress,
    burnAmount: number | BigNumber,
    timeDelay = maxTimeWindow,
    isKeepers = true,
  ) => {
    const amount = typeof burnAmount === 'number' ? fromNumber(burnAmount, volTokenDecimals) : burnAmount
    await volToken.connect(signer).approve(volToken.address, amount)
    return submit(signer, { amount, timeDelay, method: 'Burn', isKeepers })
  }

  const fulfillMint = async (signer: SignerWithAddress, isUpkeep: boolean, requestId: BigNumber) => {
    let tx: ContractTransaction
    if (isUpkeep) {
      const { upkeepNeeded, performData } = await volTokenRequestFulfiller.checkUpkeep([0])
      expect(upkeepNeeded).to.equal(true)
      tx = await volTokenRequestFulfiller.connect(signer).performUpkeep(performData)
    } else {
      tx = await volToken.connect(signer).fulfillMintRequest(requestId, 1000, false)
    }
    const block = (await tx.wait()).blockNumber

    const events = await volToken.queryFilter(volToken.filters.Mint(), block, block)
    expect(events.length).to.equal(1)
    const { tokenAmount, mintedTokens } = events[0].args
    return { tokenAmount, mintedTokens }
  }

  const fulfillBurn = async (signer: SignerWithAddress, isUpkeep: boolean, requestId: BigNumber) => {
    let tx: ContractTransaction
    if (isUpkeep) {
      const { upkeepNeeded, performData } = await volTokenRequestFulfiller.checkUpkeep([0])
      expect(upkeepNeeded).to.equal(true)
      tx = await volTokenRequestFulfiller.connect(signer).performUpkeep(performData)
    } else {
      tx = await volToken.connect(signer).fulfillBurnRequest(requestId, false)
    }
    const block = (await tx.wait()).blockNumber

    const events = await volToken.queryFilter(volToken.filters.Burn(), block, block)
    expect(events.length).to.equal(1)
    const { tokenAmount, burnedTokens } = events[0].args
    return { tokenAmount, burnedTokens }
  }

  const mint = async (
    signer: SignerWithAddress,
    options: {
      mintAmount: number | BigNumber
      timeDelay?: number
      isKeepers?: boolean
    },
  ) => {
    const { mintAmount, timeDelay, isKeepers } = { timeDelay: maxTimeWindow, isKeepers: true, ...options }
    const { targetTimestamp, requestId } = await submitMint(signer, mintAmount, timeDelay, isKeepers)
    await helper.setTimestamp(targetTimestamp)

    return fulfillMint(signer, isKeepers, requestId)
  }

  const burn = async (
    signer: SignerWithAddress,
    options: {
      burnAmount: number | BigNumber
      timeDelay?: number
      isKeepers?: boolean
    },
  ) => {
    const { burnAmount, timeDelay, isKeepers } = { timeDelay: maxTimeWindow, isKeepers: true, ...options }
    const { targetTimestamp, requestId } = await submitBurn(signer, burnAmount, timeDelay, isKeepers)
    await helper.setTimestamp(targetTimestamp)

    return fulfillBurn(signer, isKeepers, requestId)
  }

  const getKeepersFee = (amount: BigNumber) => {
    const keepersFee = amount.mul(keepersFeePercent).div(10000)
    return keepersFee.gt(keepersFeeMax) ? keepersFeeMax : keepersFee
  }

  return { submitMint, submitBurn, mint, burn, getKeepersFee }
}
