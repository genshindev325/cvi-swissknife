// import { AddressZero } from '@ethersproject/constants'
import { ethers } from 'hardhat'
import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import type {
  CVIFeedOracle,
  USDC,
  CVIUSDCPlatform,
  CVIUSDCThetaVault,
  CVIUSDCThetaVaultRequestFulfiller,
  CVIUSDCVolatilityToken,
  CVIUSDCVolTokenRequestFulfiller,
  PlatformHelper,
  CVIUSDCRebaser,
  UniswapV2Router02,
} from '@coti-cvi/auto-generated-code/contracts'
import { expect, TestHelper, InitialState, getContractsAndConfigure } from '../utils'
import {
  minDepositAmount,
  minWithdrawAmount,
  tokenDecimals,
  thetaTokenDecimals,
  lockupPeriod,
  liquidationPeriod,
  minDexPercentageAllowed,
} from '../../src/state/cvi-state'
import type {
  ThetaVaultActions,
  VolatilityTokenActions,
  UniswapActions,
  PlatformHelperActions,
  ArbitrageActions,
} from '../tools'
import {
  thetaVaultActions,
  volatilityTokenActions,
  uniswapActions,
  platformHelperActions,
  arbitrageActions,
} from '../tools'
import { fromNumber, toNumber } from '../../../lw-sdk/src/util/big-number'

const { cviInitialIndex, initialTokenAmount } = InitialState

const CVIIndexesToTest = [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160] as const

describe('Theta vault full flows', () => {
  let helper: TestHelper

  let deposit: ThetaVaultActions['deposit']
  let withdraw: ThetaVaultActions['withdraw']
  let advanceTimeToEndOfLock: ThetaVaultActions['advanceTimeToEndOfLock']
  let submitDeposit: ThetaVaultActions['submitDeposit']
  let submitWithdraw: ThetaVaultActions['submitWithdraw']
  let getIntrinsicValue: ThetaVaultActions['getIntrinsicValue']
  let mint: VolatilityTokenActions['mint']
  let burn: VolatilityTokenActions['burn']
  let swapExactTokensForTokens: UniswapActions['swapExactTokensForTokens']
  let volTokenIntrinsicPrice: PlatformHelperActions['volTokenIntrinsicPrice']
  let dailyFundingFee: PlatformHelperActions['dailyFundingFee']
  let volTokenPrice: PlatformHelperActions['volTokenPrice']
  let collateralRatio: PlatformHelperActions['collateralRatio']
  let arbitrage: ArbitrageActions['arbitrage']

  let usdcToken: USDC
  let cviFeedOracle: CVIFeedOracle
  let platform: CVIUSDCPlatform
  let thetaVault: CVIUSDCThetaVault
  let vaultRequestFulfiller: CVIUSDCThetaVaultRequestFulfiller
  let volToken: CVIUSDCVolatilityToken
  let volTokenRequestFulfiller: CVIUSDCVolTokenRequestFulfiller
  let platformHelper: PlatformHelper
  let rebaser: CVIUSDCRebaser
  let uniswapRouter: UniswapV2Router02

  let owner: SignerWithAddress
  let liquidityProvider: SignerWithAddress
  let alice: SignerWithAddress
  let bob: SignerWithAddress

  beforeEach(async () => {
    helper = TestHelper.get(ethers)
    ;({ owner, liquidityProvider, alice, bob } = await helper.getNamedSigners())

    const contracts = await getContractsAndConfigure()
    ;({
      usdcToken,
      cviFeedOracle,
      platform,
      thetaVault,
      volToken,
      vaultRequestFulfiller,
      volTokenRequestFulfiller,
      platformHelper,
      rebaser,
      uniswapRouter,
    } = contracts)
    ;({ deposit, withdraw, advanceTimeToEndOfLock, submitDeposit, submitWithdraw, getIntrinsicValue } =
      thetaVaultActions(helper, contracts))
    ;({ mint, burn } = volatilityTokenActions(helper, contracts))
    ;({ swapExactTokensForTokens } = uniswapActions(helper, contracts))
    ;({ volTokenIntrinsicPrice, dailyFundingFee, volTokenPrice, collateralRatio } = platformHelperActions(
      helper,
      contracts,
    ))
    ;({ arbitrage } = arbitrageActions(helper, contracts, { mint, burn }, { swapExactTokensForTokens }))

    await thetaVault.connect(owner).setDepositCap(fromNumber(10_000_000, tokenDecimals))

    expect(await usdcToken.balanceOf(alice.address)).is.equal(fromNumber(initialTokenAmount, tokenDecimals))
    expect(await usdcToken.balanceOf(bob.address)).is.equal(fromNumber(initialTokenAmount, tokenDecimals))
  })

  it('Simple deposit flow - submit deposit request, wait, perform upkeep', async () => {
    await deposit(alice, 1_000)
  })

  it('Minimal deposit flow - submit minimal amount deposit request, wait, perform upkeep', async () => {
    await deposit(alice, minDepositAmount)
  })

  it('Should revert on too small deposit - submit deposit with 0.001 USDC', async () => {
    const amount = fromNumber(0.001, tokenDecimals)
    await usdcToken.connect(alice).approve(thetaVault.address, amount)

    await expect(submitDeposit(alice, amount)).to.be.revertedWith('Too small')
  })

  // it('Should revert on submit deposit with should stake when reward router is not set', async () => {
  //   await thetaVault.connect(owner).setRewardRouter(AddressZero)
  //   const amount = fromNumber(100, tokenDecimals)
  //   await usdcToken.connect(alice).approve(thetaVault.address, amount)

  //   await expect(deposit(alice, amount, true)).to.be.revertedWith('Router not set')
  // })

  it('Minimal withdraw flow - deposit, wait and withdraw with a minimum amount', async () => {
    await deposit(alice, 1_000)

    await helper.advanceTime(lockupPeriod)
    await helper.setCVI(cviFeedOracle, cviInitialIndex)

    await withdraw(alice, minWithdrawAmount)
  })

  it('Should revert on too small withdraw - deposit and submit withdraw with 0.001 CVOL', async () => {
    const amount = fromNumber(0.001, thetaTokenDecimals)

    await deposit(alice, 1_000)

    await helper.advanceTime(lockupPeriod)
    await helper.setCVI(cviFeedOracle, cviInitialIndex)

    await thetaVault.connect(alice).approve(thetaVault.address, amount)

    await expect(thetaVault.connect(alice).submitWithdrawRequest(amount)).to.be.revertedWith('Too small')
  })

  it('Deposit flow with cvi change - change cvi, submit deposit request, wait, perform upkeep', async () => {
    await helper.setCVI(cviFeedOracle, cviInitialIndex)

    await deposit(alice, 1_000)
  })

  it('Deposit flow with some time delay - advance 10 days, submit deposit request, wait, perform upkeep', async () => {
    await helper.advanceTime(60 * 60 * 24 * 10)
    await helper.setCVI(cviFeedOracle, cviInitialIndex)

    await deposit(alice, 1_000)
  })

  it('Deposit and withdraw all flow - deposit, wait, withdraw all', async () => {
    await deposit(alice, 1_000)

    await advanceTimeToEndOfLock(alice.address)
    await helper.setCVI(cviFeedOracle, cviInitialIndex)

    await withdraw(alice)
  })

  it('Deposit and withdraw all flow with constant index 80 - deposit $1000, wait 2 days, withdraw all', async () => {
    await helper.setCVI(cviFeedOracle, 80)

    await deposit(alice, 1_000)

    await helper.advanceTime(2 * 24 * 60 * 60)
    await helper.setCVI(cviFeedOracle, 80)

    await withdraw(alice)
  })

  describe('Deposit flows with different indexes, amounts and days between deposit and withdraw', () => {
    const indexes = CVIIndexesToTest
    const amounts = [100, 1_000, 10_000, 100_000, 1_000_000 /* , 5_000_000 */]
    const days = [2 /* , 4, 8 */]

    for (const index of indexes) {
      for (const amount of amounts) {
        for (const day of days) {
          it(`Deposit and withdraw all flow with constant index ${index} and amount ${amount} - deposit, wait ${day} days, withdraw all (Keepers)`, async () => {
            await helper.setCVI(cviFeedOracle, index)

            await deposit(bob, amount)

            await helper.advanceTime(day * 24 * 60 * 60)
            await helper.setCVI(cviFeedOracle, index)

            await withdraw(bob)
          })

          it(`Deposit and withdraw all flow with constant index ${index} and amount ${amount} - deposit, wait ${day} days, withdraw all`, async () => {
            await helper.setCVI(cviFeedOracle, index)

            await deposit(bob, amount)

            await helper.advanceTime(day * 24 * 60 * 60)
            await helper.setCVI(cviFeedOracle, index)

            await withdraw(bob, undefined, false)
          })
        }
      }
    }
  })

  it(`Small deposit and withdraw all flow (disable latest round too long ago) - deposit, wait 10 days, withdraw all (Keepers)`, async () => {
    await platform.connect(owner).setMaxTimeAllowedAfterLatestRound(365 * 24 * 60 * 60)

    await deposit(bob, 1_000)

    await helper.advanceTime(10 * 24 * 60 * 60)

    await withdraw(bob)
  })

  it(`Small deposit and withdraw all flow (disable latest round too long ago) - deposit, wait 10 days, withdraw all`, async () => {
    await platform.connect(owner).setMaxTimeAllowedAfterLatestRound(365 * 24 * 60 * 60)

    await deposit(bob, 1_000)

    await helper.advanceTime(10 * 24 * 60 * 60)

    await withdraw(bob, undefined, false)
  })

  it(`Big deposit and withdraw all flow (disable latest round too long ago) - deposit, wait 10 days, withdraw all (Keepers)`, async () => {
    await platform.connect(owner).setMaxTimeAllowedAfterLatestRound(365 * 24 * 60 * 60)

    await deposit(bob, 100_000)

    await helper.advanceTime(10 * 24 * 60 * 60)

    await withdraw(bob)
  })

  it(`Big deposit and withdraw all flow (disable latest round too long ago) - deposit, wait 10 days, withdraw all`, async () => {
    await platform.connect(owner).setMaxTimeAllowedAfterLatestRound(365 * 24 * 60 * 60)

    await deposit(bob, 100_000)

    await helper.advanceTime(10 * 24 * 60 * 60)

    await withdraw(bob, undefined, false)
  })

  it(`Big arbitrage test - deposit, swap to make big skew on dex then withdraw`, async () => {
    await platform.connect(owner).setMaxTimeAllowedAfterLatestRound(365 * 24 * 60 * 60)

    await deposit(bob, 20_000)
    await deposit(alice, 10_000)

    await swapExactTokensForTokens(bob, fromNumber(1_000, tokenDecimals), usdcToken, volToken)

    await advanceTimeToEndOfLock(alice.address)

    await withdraw(alice)
  })

  it(`Should make deposit when other withdraw request is failing - withdraw and deposit at the same time flow`, async () => {
    await platform.connect(owner).setMaxTimeAllowedAfterLatestRound(365 * 24 * 60 * 60)

    await deposit(bob, 10_000)

    await deposit(alice, 10_000)

    await helper.advanceTime(10 * 24 * 60 * 60)

    await mint(liquidityProvider, { mintAmount: 1000 })

    await submitWithdraw(alice)

    const { targetTimestamp } = await submitDeposit(bob, 10_000)

    await helper.setTimestamp(targetTimestamp)

    await vaultRequestFulfiller.connect(owner).performUpkeep([0])
  })

  describe('Rebalance', () => {
    it('Deposit $1000, wait 10 days then rebalance', async () => {
      await deposit(alice, 1_000)

      await helper.advanceTime(10 * 24 * 60 * 60)
      await helper.setCVI(cviFeedOracle, cviInitialIndex)

      await thetaVault.connect(owner).rebalance()
    })

    it('Deposit $100,000, wait 30 days then rebalance', async () => {
      await deposit(alice, 100_000)

      await helper.advanceTime(30 * 24 * 60 * 60)
      await helper.setCVI(cviFeedOracle, cviInitialIndex)

      await thetaVault.connect(owner).rebalance()
    })

    it('Repeated rebalance - mint and rebalance many times (expect mint to revert at the end)', async () => {
      await platform.connect(owner).setMaxTimeAllowedAfterLatestRound(365 * 24 * 60 * 60)

      await deposit(alice, 20_000)

      // const printCollateralRatio = async (prefix: string) => {
      //   const { CR, UR } = await collateralRatio()
      //   console.log(`${prefix} CR: ${CR.toFixed(5)}% UR: ${UR.toFixed(5)}%`)
      // }

      for (let i = 0; i < 5; i++) {
        // await printCollateralRatio(`[${i}] before mint`)
        await mint(liquidityProvider, { mintAmount: 1_000, isKeepers: false })
        // await printCollateralRatio(`[${i}] after mint`)

        await helper.advanceTime(10 * 24 * 60 * 60)

        // await printCollateralRatio(`[${i}] before rebalance`)
        await thetaVault.connect(owner).rebalance()
        // await printCollateralRatio(`[${i}] after rebalance`)
      }

      await expect(mint(liquidityProvider, { mintAmount: 1_000, isKeepers: false })).to.be.revertedWith(
        'Not enough liquidity',
      )
    })

    it('Repeated rebalance - mint and rebalance many times (deposit should fix failed mint)', async () => {
      await platform.connect(owner).setMaxTimeAllowedAfterLatestRound(365 * 24 * 60 * 60)

      await deposit(alice, 20_000)

      for (let i = 0; i < 5; i++) {
        await mint(liquidityProvider, { mintAmount: 1_000, isKeepers: false })

        await helper.advanceTime(10 * 24 * 60 * 60)

        await thetaVault.connect(owner).rebalance()
      }

      await expect(mint(liquidityProvider, { mintAmount: 1_000, isKeepers: false })).to.be.revertedWith(
        'Not enough liquidity',
      )

      await deposit(alice, 10_000)

      await mint(liquidityProvider, { mintAmount: 1_000, isKeepers: false })
    })
  })

  describe('Skew', () => {
    const indexes = CVIIndexesToTest
    const amounts = [100, 1_000, 10_000, 100_000]

    for (const index of indexes) {
      for (const amount of amounts) {
        it(`Should submit deposit with index ${index} and amount ${amount}`, async () => {
          await helper.setCVI(cviFeedOracle, index)

          await submitDeposit(alice, amount)
        })
      }
    }
  })

  describe('Insufficient liquidity', () => {
    it(`Should liquidate withdraw request after insufficient liquidity for 24 hours - using upkeep`, async () => {
      await helper.setCVI(cviFeedOracle, cviInitialIndex)

      await deposit(alice, 20_000)

      await helper.advanceTime(lockupPeriod)

      await submitWithdraw(alice)

      await helper.setCVI(cviFeedOracle, cviInitialIndex)
      await mint(bob, { mintAmount: 1000 })

      await helper.advanceTime(liquidationPeriod)
      await helper.setCVI(cviFeedOracle, cviInitialIndex)

      const { upkeepNeeded, performData } = await vaultRequestFulfiller.checkUpkeep([0])
      expect(upkeepNeeded).to.equal(true)
      const tx = await vaultRequestFulfiller.connect(alice).performUpkeep(performData)
      const { blockNumber } = await tx.wait()
      const events = await thetaVault.queryFilter(thetaVault.filters.LiquidateRequest(), blockNumber, blockNumber)
      expect(events.length).to.equal(1)
    })

    it(`Should liquidate withdraw request after insufficient liquidity for 24 hours - using direct method`, async () => {
      await helper.setCVI(cviFeedOracle, cviInitialIndex)

      await deposit(alice, 20_000)

      await helper.advanceTime(lockupPeriod)

      const { requestId } = await submitWithdraw(alice)

      await helper.setCVI(cviFeedOracle, cviInitialIndex)
      await mint(bob, { mintAmount: 1000 })

      await helper.advanceTime(liquidationPeriod)
      await helper.setCVI(cviFeedOracle, cviInitialIndex)

      const tx = await thetaVault.connect(alice).fulfillWithdrawRequest(requestId)
      const { blockNumber } = await tx.wait()
      const events = await thetaVault.queryFilter(thetaVault.filters.LiquidateRequest(), blockNumber, blockNumber)
      expect(events.length).to.equal(1)
    })
  })

  describe('Collateral ratio', () => {
    const indexes = CVIIndexesToTest
    const extraLiquidityValues = [10, 15, 20, 25, 30]

    for (const index of indexes) {
      for (const extraLiquidity of extraLiquidityValues) {
        const expectedCR = (100 / (100 + extraLiquidity)) * 100
        const cr = expectedCR.toFixed(2)
        it(`Deposit 5m USDC [${index} CVI] with extraLiqidityPercentage = ${extraLiquidity}, CR should be close to ${cr}%`, async () => {
          await thetaVault.connect(owner).setLiquidityPercentages(extraLiquidity * 100, minDexPercentageAllowed)

          await helper.setCVI(cviFeedOracle, index)

          await deposit(alice, 5_000_000)

          const cr = await platformHelper.collateralRatio(platform.address)
          expect(toNumber(cr, 8)).to.be.closeTo(expectedCR, 0.1)
        })
      }
    }
  })

  describe('Business tests', () => {
    const eps = 0.002

    beforeEach(async () => {
      await platform.connect(owner).setMaxTimeAllowedAfterLatestRound(365 * 24 * 60 * 60)
    })

    type CVIIndexChange = [cviStart: number, cviEnd: number]

    describe('CVI index increases', () => {
      const testCases: CVIIndexChange[] = [
        [60, 75],
        [80, 120],
        [100, 130],
        [50, 150],
      ]

      testCases.forEach(([cviStart, cviEnd]) => {
        const percentage = (cviEnd / cviStart) * 100
        const percentageString = percentage.toFixed(2)
        it(`Increase index from ${cviStart} to ${cviEnd} (${percentageString}%), intrinsic value should increase to leverage * ${percentageString}%`, async () => {
          await helper.setCVI(cviFeedOracle, cviStart)
          const { priceNumber: priceBefore } = await volTokenIntrinsicPrice()

          await helper.setCVI(cviFeedOracle, cviEnd)

          const { priceNumber: priceAfter } = await volTokenIntrinsicPrice()
          expect(priceAfter).to.be.closeTo((priceBefore * percentage) / 100, eps)
        })
      })
    })

    describe('CVI index decreases', () => {
      const testCases: CVIIndexChange[] = [
        [75, 60],
        [120, 80],
        [130, 100],
        [150, 50],
      ]

      testCases.forEach(([cviStart, cviEnd]) => {
        const percentage = (cviEnd / cviStart) * 100
        const percentageString = percentage.toFixed(2)
        it(`Decrease index from ${cviStart} to ${cviEnd} (${percentageString}%), intrinsic value should decrease to leverage * ${percentageString}%`, async () => {
          await helper.setCVI(cviFeedOracle, cviStart)
          const { priceNumber: priceBefore } = await volTokenIntrinsicPrice()

          await helper.setCVI(cviFeedOracle, cviEnd)

          const { priceNumber: priceAfter } = await volTokenIntrinsicPrice()
          expect(priceAfter).to.be.closeTo((priceBefore * percentage) / 100, eps)
        })
      })
    })

    describe('Funding fees', () => {
      const indexes = [60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160] as const

      for (const index of indexes) {
        it(`Move time forward 1 month, intrinsic value should decrease by daily funding fee * 30 - CVI index ${index}`, async () => {
          await helper.setCVI(cviFeedOracle, index)

          const { priceNumber: priceBefore } = await volTokenIntrinsicPrice()
          const { fundingFeeNumber } = await dailyFundingFee()

          await helper.advanceTime(30 * 24 * 60 * 60)

          const { priceNumber: priceAfter } = await volTokenIntrinsicPrice()
          expect(priceAfter).to.be.closeTo(priceBefore - priceBefore * (fundingFeeNumber * 30), eps)
        })
      }
    })

    describe('Rebase', () => {
      const indexes = [60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160] as const

      beforeEach(async () => {
        await volToken.connect(owner).setCappedRebase(false)
      })

      for (const index of indexes) {
        it(`Rebase should restore the vol token intrinsic value to peg - CVI index ${index}`, async () => {
          await helper.setCVI(cviFeedOracle, index)

          const { priceNumber: priceBefore } = await volTokenIntrinsicPrice()
          const { fundingFeeNumber } = await dailyFundingFee()

          await helper.advanceTime(30 * 24 * 60 * 60)

          const { priceNumber: priceAfter } = await volTokenIntrinsicPrice()
          expect(priceAfter).to.be.closeTo(priceBefore - priceBefore * (fundingFeeNumber * 30), eps)

          await rebaser.connect(alice).performUpkeep([0])

          const { priceNumber: priceRebase } = await volTokenIntrinsicPrice()
          expect(priceRebase).to.be.equal(index)
        })
      }
    })

    describe('Internal theta vault arbitrage', () => {
      const testCases: CVIIndexChange[] = [
        [80, 90],
        [80, 100],
        [100, 120],
        [90, 80],
        [100, 80],
        [120, 100],
        [80, 150],
        [150, 80],
      ]

      testCases.forEach(([cviStart, cviEnd]) => {
        const percentage = ((cviEnd - cviStart) / cviStart) * 100
        const percentageString = percentage.toFixed(2)

        it(`Internal arbitrage - ${cviStart} => ${cviEnd} (${percentageString}% change)`, async () => {
          await helper.setCVI(cviFeedOracle, cviStart)
          await deposit(alice, 100_000)
          await helper.setCVI(cviFeedOracle, cviEnd)

          await submitDeposit(bob, 100_000)
        })
      })
    })

    describe('Arbitrageurs profit - Arbitrageurs don’t win over the vault more than pennies on the dollar when no activity', () => {
      const testCases: CVIIndexChange[] = [
        [80, 90],
        [80, 100],
        [100, 120],
        [90, 80],
        [100, 80],
        [120, 100],
      ]

      const maxPercentLoss = 0.5

      testCases.forEach(([cviStart, cviEnd]) => {
        const percentage = ((cviEnd - cviStart) / cviStart) * 100
        const percentageString = percentage.toFixed(2)
        it(`External arbitrage - ${cviStart} => ${cviEnd} (${percentageString}% change)`, async () => {
          // Check the Theta vault intrinsic value (balance/supply)
          // Increase the CVI oracle by X%
          // Perform arbitrage (as an external account)
          // Decrease the CVI oracle by X%
          // Perform arbitrage
          // Repeat 1-4 ten times
          // The theta vault intrinsic value is not down by more than 0.5%

          await helper.setCVI(cviFeedOracle, cviStart)

          await deposit(alice, 100_000)

          const intrinsicValueStart = await getIntrinsicValue()

          await helper.setCVI(cviFeedOracle, cviEnd)

          const { isBurn, optimal, profit, actualProfit, reserves, reservesAfter, prices, pricesAfter } =
            await arbitrage(bob)

          const action = `[${isBurn ? 'BURN' : 'MINT'}]`
          const f = (n: number) => n.toFixed(2)
          console.log(`${action} optimal: ${f(optimal)} profit - potential: ${f(profit)}, actual: ${f(actualProfit)}`)
          const reservesToString = ({ reserveUSDC, reserveCVOL }: { reserveUSDC: number; reserveCVOL: number }) =>
            `reserveUSDC: ${f(reserveUSDC)} reserveCVOL: ${f(reserveCVOL)}`
          const pricesToString = ({ dexPrice, intrinsicPrice }: { dexPrice: number; intrinsicPrice: number }) =>
            `dexPrice: ${f(dexPrice)} intrinsicPrice: ${f(intrinsicPrice)}`
          console.log(`Reserves - before: ${reservesToString(reserves)}, after: ${reservesToString(reservesAfter)}`)
          console.log(`Prices - before: ${pricesToString(prices)}, after: ${pricesToString(pricesAfter)}`)

          await helper.setCVI(cviFeedOracle, cviStart)

          const intrinsicValueEnd = await getIntrinsicValue()
          const changePercent = ((intrinsicValueEnd - intrinsicValueStart) / intrinsicValueStart) * 100
          expect(changePercent).to.be.above(-maxPercentLoss)
        })
      })
    })
  })
})
