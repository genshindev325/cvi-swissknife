import { ethers } from 'hardhat'
import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import type {
  PlatformHelper,
  CVIUSDCVolatilityToken,
  CVIUSDCPlatform,
  CVIUSDCThetaVault,
  CVIFeedOracle,
} from '@coti-cvi/auto-generated-code/contracts'
import { expect, TestHelper } from '../utils'
import { tokenDecimals, volTokenDecimals, maxTimeWindow, lockupPeriod } from '../../src/state/cvi-state'
import { getContractsAndConfigure } from '../utils'
import { fromNumber, toNumber } from '../../../lw-sdk/src/util/big-number'
import type { ThetaVaultActions, VolatilityTokenActions, PlatformHelperActions } from '../tools'
import { thetaVaultActions, volatilityTokenActions, platformHelperActions } from '../tools'

const CVIIndexesToTest = [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160] as const

describe('Platform helper full flows', () => {
  let helper: TestHelper

  let deposit: ThetaVaultActions['deposit']
  let withdraw: ThetaVaultActions['withdraw']
  let checkWithdrawLock: ThetaVaultActions['checkWithdrawLock']

  let mint: VolatilityTokenActions['mint']
  let submitMint: VolatilityTokenActions['submitMint']

  let dailyFundingFee: PlatformHelperActions['dailyFundingFee']
  let fundingFeeValues: PlatformHelperActions['fundingFeeValues']
  let collateralRatio: PlatformHelperActions['collateralRatio']
  let willWithdrawSucceed: PlatformHelperActions['willWithdrawSucceed']

  let cviFeedOracle: CVIFeedOracle
  let platformHelper: PlatformHelper
  let platform: CVIUSDCPlatform
  let volToken: CVIUSDCVolatilityToken
  let thetaVault: CVIUSDCThetaVault

  let alice: SignerWithAddress
  let bob: SignerWithAddress
  let owner: SignerWithAddress

  beforeEach(async () => {
    helper = TestHelper.get(ethers)
    ;({ alice, bob, owner } = await helper.getNamedSigners())
    const contracts = await getContractsAndConfigure()
    ;({ cviFeedOracle, platformHelper, platform, volToken, thetaVault } = contracts)
    ;({ deposit, withdraw, checkWithdrawLock } = thetaVaultActions(helper, contracts))
    ;({ mint, submitMint } = volatilityTokenActions(helper, contracts))
    ;({ dailyFundingFee, fundingFeeValues, collateralRatio, willWithdrawSucceed } = platformHelperActions(
      helper,
      contracts,
    ))
  })

  describe('Funding fee - dailyFundingFee should equal fundingFeeValues at the same value', () => {
    const indexes = CVIIndexesToTest
    const amounts = [1, 1_000, 5_000]

    for (const index of indexes) {
      for (const mintAmount of amounts) {
        it(`index ${index} and mint amount of ${mintAmount}`, async () => {
          await helper.setCVI(cviFeedOracle, index)

          await deposit(alice, 100_000)
          await mint(bob, { mintAmount })

          const { CR } = await collateralRatio()

          const { fundingFeeNumber } = await dailyFundingFee()
          const { value } = await fundingFeeValues(index, CR)

          expect(fundingFeeNumber).to.eq(value)
        })
      }
    }
  })

  it('Should return expectedVolTokensAmount from calculatePreMint that is close to the actual amount received', async () => {
    const mintAmount = fromNumber(10, tokenDecimals)
    const { expectedVolTokensAmount } = await platformHelper.calculatePreMint(
      volToken.address,
      true,
      mintAmount,
      maxTimeWindow,
    )

    const { mintedTokens } = await mint(alice, { mintAmount })

    const minted = toNumber(mintedTokens, volTokenDecimals)
    const expectedMinted = toNumber(expectedVolTokensAmount, volTokenDecimals)
    expect(minted).to.be.closeTo(expectedMinted, 0.1)
  })

  describe('Predict actions', () => {
    beforeEach(async () => {
      await platform.connect(owner).setMaxTimeAllowedAfterLatestRound(365 * 24 * 60 * 60)
      await deposit(bob, 1_000_000)
      await deposit(alice, 150_000)
      await helper.setCVI(cviFeedOracle, 50)
      console.log(`Ratios ${JSON.stringify(await collateralRatio())}`)
      await mint(bob, { mintAmount: 10_000 })
      await helper.advanceTime(lockupPeriod)
      console.log(`Ratios ${JSON.stringify(await collateralRatio())}`)
      await deposit(bob, 1)
      console.log(`Ratios ${JSON.stringify(await collateralRatio())}`)
    })

    it('Should predict that a withdraw will success or not', async () => {
      const { CR } = await collateralRatio()
      console.log(`CR ${CR}`)

      const withdrawAmount = 10_000
      const willWithdraw = await willWithdrawSucceed(withdrawAmount)
      console.log(`willWithdraw ${willWithdraw}`)
      const { totalUSDCAmount } = await withdraw(alice, withdrawAmount)
      console.log(`withdrawn ${toNumber(totalUSDCAmount, 6)}`)
    })
  })
})
