/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable promise/catch-or-return */
/* eslint-disable no-return-assign */

import type { Token, BN } from '@coti-cvi/cvi-sdk'
import { logger, LongToken, toTimeString, delay, fromBN, ZERO } from '@coti-cvi/cvi-sdk'
import { MIN_PROFIT, MIN_SWAP_PERCENT, DRY_RUN, OPTIMAL_PERCENT } from './util/constants'

export async function arbitrage(token: LongToken) {
  const requests = await token.getUnfulfilledRequests({ days: 1 })
  if (requests.length > 0) {
    const request = requests.reduce(
      (min, item) => (min = min.targetTimestamp > item.targetTimestamp ? min : item),
      requests[0],
    )
    await fulfill(token, LongToken.RequestEvent.from(request))
  } else {
    const uniswapPrice = await token.getUSDPrice()
    const intrinsicPrice = await token.getIntrinsicPrice()
    const isBurn = uniswapPrice < intrinsicPrice
    const { optimal, potentialProfit } = optimalWrapper(await token.calculateOptimal(isBurn))
    if (await preSubmitCheck(token, optimal, potentialProfit, isBurn)) {
      logger.info(
        `${token} choosing to ${isBurn ? 'burn' : 'mint'} - ${optimalString(
          optimal,
          potentialProfit,
        )} [${token.priceString()}]`,
      )
      if (DRY_RUN) {
        logger.info(`${token} dry run mode - exiting`)
      } else {
        if (isBurn) {
          const { receivedAmount, sentAmount } = await token.swapTo(optimal, undefined, MIN_SWAP_PERCENT)
          token.w3.txCostCheck = true
          const submitResponse = await token.submitBurn(receivedAmount)
          token.w3.txCostCheck = false
          await fulfill(token, submitResponse, { startAmount: sentAmount })
        } else {
          token.w3.txCostCheck = true
          const submitResponse = await token.submitMint(optimal)
          token.w3.txCostCheck = false
          await fulfill(token, submitResponse, { startAmount: submitResponse.tokenAmount })
        }
      }
    } else {
      logger.debug(`${token} choosing to do nothing - ${optimalString(optimal, potentialProfit)}`)
    }
  }
}

function optimalString(optimal: number, potentialProfit: number) {
  return `optimal $${optimal.toFixed(2)} potentialProfit $${potentialProfit.toFixed(2)} (using ${OPTIMAL_PERCENT}%)`
}

function optimalWrapper(res: { optimal: number; potentialProfit: number }) {
  return {
    optimal: (res.optimal * OPTIMAL_PERCENT) / 100,
    potentialProfit: (res.potentialProfit * OPTIMAL_PERCENT) / 100,
  }
}

async function preSubmitCheck(token: LongToken, optimal: number, potentialProfit: number, isBurn: boolean) {
  const balance = await token.baseToken.balanceOf()
  if (token.baseToken.fromAmount(balance) < optimal) {
    logger.info(
      `${token} not enough balance for full arbitrage (has: ${token.baseToken.toAmountString(
        balance,
      )} need: ${optimal.toFixed(6)})`,
    )
  }
  return potentialProfit > MIN_PROFIT && token.baseToken.fromAmount(balance) >= optimal
}

async function preFulfillCheck(token: LongToken, request: LongToken.RequestEvent) {
  return true
}

async function waitToTarget(token: LongToken, submitResponse: LongToken.RequestEvent) {
  const seconds = token.w3.block.timestampDiff(submitResponse.targetTimestamp)
  logger.info(`${token} handling submitted request ${submitResponse.requestId} waiting ${toTimeString(seconds)}`)
  if (seconds > 0) {
    if (token.w3.env === 'live') {
      await delay(seconds * 1000)
    } else {
      await token.w3.advanceTime(seconds)
    }
  }
}

async function fulfill(token: LongToken, request: LongToken.RequestEvent, options?: { startAmount: BN }) {
  logger.info(`${token} fulfilling request ${request.requestId} from ${request.account}`)

  await waitToTarget(token, request)
  await token.refresh()

  if (request.requestType === LongToken.RequestType.burn) {
    // const { closeFee, penaltyFee } = await token.preFulfillBurn(request);

    const res = await token.fulfillBurn(request.event)
    if (res.type === 'Liquidate') {
      handleLiquidate(res)
    } else {
      handleBurn(token, res, options?.startAmount || ZERO)
    }
  } else {
    const crAmount = await token.platform.calculateCollateralRatioWithAddition(request.tokenAmount)
    const cr = fromBN(crAmount, token.platform.precisionDecimals.toString().length - 3)
    const thresholdAmount = await token.platform.feesCalculator.getBuyingPremiumThreshold()
    const threshold = fromBN(thresholdAmount, token.platform.maxFeePercentage.toString().length - 3)
    let res: LongToken.LiquidatedResult | LongToken.MintResult | LongToken.CollateralizedMintResult
    // use collateralized mint in case cr is above threshold
    if (cr > threshold) {
      // const { openFee, penaltyFee } = await token.preFulfillCollateralizedMint(request);

      res = await token.fulfillCollateralizedMint(request.event)
    } else {
      // const { openFee, penaltyFee } = await token.preFulfillMint(request);

      res = await token.fulfillMint(request.event)
    }
    if (res.type === 'Liquidate') {
      handleLiquidate(res)
    } else {
      const { receivedAmount } = await token.swapFrom(res.mintedTokens, undefined, MIN_SWAP_PERCENT)
      handleMint(token, res, receivedAmount)
    }
  }

  await printBalance(token)
}

async function printBalance(token: LongToken) {
  const nativeToken = await tokenBalance('native token', token.w3.nativeToken)
  const longToken = await tokenBalance('long token', token)
  const shortToken = await tokenBalance('short token', token.platform.lpToken)
  const baseToken = await tokenBalance('base token', token.baseToken)
  logger.info(`${token} balances: [${longToken}] [${shortToken}] [${baseToken}] [${nativeToken}]`)
}

async function tokenBalance(prefix: string, token: Token) {
  const balance = await token.balanceOf()
  return `${prefix} ${token.toAmountString(balance)} ($${token.toUSD(balance)})`
}

function handleLiquidate(res: LongToken.LiquidatedResult) {
  logger.info(`${res.requestId} request liquidated...`)
}

function handleMint(token: LongToken, res: LongToken.CollateralizedMintResult | LongToken.MintResult, endAmount: BN) {
  const input = token.baseToken.toAmountString(res.tokenAmount)
  const output = token.baseToken.toAmountString(endAmount)
  const profit = token.baseToken.toAmountString(endAmount.sub(res.tokenAmount))
  logger.info(`${token} Mint finished - input: ${input} output: ${output} profit: ${profit} [${token.priceString()}]`)
}

function handleBurn(token: LongToken, res: LongToken.BurnResult, startAmount: BN) {
  const input = token.baseToken.toAmountString(startAmount)
  const output = token.baseToken.toAmountString(res.tokenAmount)
  const profit = token.baseToken.toAmountString(startAmount.sub(res.tokenAmount))
  logger.info(`${token} Burn finished - input: ${input} output: ${output} profit: ${profit} [${token.priceString()}]`)
}
