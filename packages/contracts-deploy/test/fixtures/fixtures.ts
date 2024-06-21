import { runFixture, TestHelper } from '../utils'

//Roles
export const adminRole = '0x0000000000000000000000000000000000000000000000000000000000000000'

export const secondsPerDay = 24 * 60 * 60
export const secondsPerYear = 365 * secondsPerDay

export const getAccessControlRevertStr = (account: string, role: string) =>
  `AccessControl: account ${account} is missing role ${role}`

export async function getContractsAndConfigure() {
  await runFixture([
    'deploy-cvi-usdc-theta-vault',
    'set-cvi-usdc-theta-vault-state',
    'set-cvi-usdc-initial-liquidity',
    'cvi-usdc-rebase',
    'cvi-usdc-transfer-ownership',
  ])

  const helper = TestHelper.get()
  return {
    goviToken: await helper.connect('GOVI'),
    usdcToken: await helper.connect('USDC'),
    wethToken: await helper.connect('WETH'),
    cviFeedOracle: await helper.connect('CVIFeedOracle'),
    platformHelper: await helper.connect('PlatformHelper'),
    platform: await helper.connect('CVIUSDCPlatform'),
    thetaVault: await helper.connect('CVIUSDCThetaVault'),
    vaultRequestFulfiller: await helper.connect('CVIUSDCThetaVaultRequestFulfiller'),
    volToken: await helper.connect('CVIUSDCVolatilityToken'),
    requestFeesCalculatorContract: await helper.connect('CVIUSDCRequestFeesCalculator'),
    volTokenRequestFulfiller: await helper.connect('CVIUSDCVolTokenRequestFulfiller'),
    rebaser: await helper.connect('CVIUSDCRebaser'),
    uniswapRouter: await helper.connect('UniswapV2Router02'),
    uniswapFactory: await helper.connect('UniswapV2Factory'),
  }
}
