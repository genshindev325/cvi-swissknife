import { ChainId, IL_SUPPORTED_CHAIN_IDS, TV_SUPPORTED_CHAIN_IDS, VESTING_SUPPORTED_CHAIN_IDS } from '@coti-cvi/lw-sdk'
import type { MenuItem } from '../types'
import type { InverifyContext } from '../context/inversify-context'
import { CLI_CLOSED_ERROR_MESSAGE } from './constants'
import { Wrappers } from './wrappers'
import { Utils } from './utils'
import { Il } from './il'
import { Oracle } from './oracle'
import { Price } from './price'
import { Platform } from './platform'
import { Token } from './token'
import { ThetaVault } from './theta-vault'
import { Staking } from './staking'
import { Uniswap } from './uniswap'
import { VolatilityToken } from './volatility-token'
import { RewardRouter } from './reward-router'
import { Vesting } from './vesting'
import { GMX } from './gmx'
import { ContractInteraction } from './contract-interaction'

export class Cli {
  private readonly wrappers = new Wrappers(
    this.inverifyContext,
    this.shouldClose,
    this.writeOutput,
    this.askQuestion,
    this.clearOutput,
  )

  private readonly il = new Il(this.inverifyContext, this.wrappers)

  private readonly oracle = new Oracle(this.inverifyContext, this.wrappers)

  private readonly price = new Price(this.inverifyContext, this.wrappers)

  private readonly utils = new Utils(this.inverifyContext, this.wrappers)

  private readonly platform = new Platform(this.inverifyContext, this.wrappers)

  private readonly token = new Token(this.inverifyContext, this.wrappers)

  private readonly staking = new Staking(this.inverifyContext, this.wrappers)

  private readonly thetaVault = new ThetaVault(this.inverifyContext, this.wrappers)

  private readonly uniswap = new Uniswap(this.inverifyContext, this.wrappers)

  private readonly vol = new VolatilityToken(this.inverifyContext, this.wrappers)

  private readonly rewardRouter = new RewardRouter(this.inverifyContext, this.wrappers)

  private readonly vesting = new Vesting(this.inverifyContext, this.wrappers)

  private readonly gmx = new GMX(this.inverifyContext, this.wrappers)

  private readonly contractInteraction = new ContractInteraction(this.inverifyContext, this.wrappers)

  private readonly menuItems: Record<string, MenuItem> = {
    u: { description: 'utils', action: () => this.wrappers.selectMenu(this.utils.utilMenu) },
    i: {
      description: 'impermanent loss protection',
      action: () => this.wrappers.selectMenu(this.il.ilMenu),
      condition: () => IL_SUPPORTED_CHAIN_IDS.map(c => c as string).includes(this.inverifyContext.chainId),
    },
    c: { description: 'cvi oracle', action: () => this.wrappers.selectMenu(this.oracle.cviOracleMenu) },
    p: {
      description: 'eth price oracle',
      action: () => this.wrappers.selectMenu(this.price.priceOracleMenu),
      condition: () => IL_SUPPORTED_CHAIN_IDS.map(c => c as string).includes(this.inverifyContext.chainId),
    },
    l: { description: 'platform', action: () => this.wrappers.selectMenu(this.platform.PlatformMenu) },
    t: {
      description: 'theta vault',
      action: () => this.wrappers.selectMenu(this.thetaVault.ThetaVaultMenu),
      condition: () => TV_SUPPORTED_CHAIN_IDS.map(c => c as string).includes(this.inverifyContext.chainId),
    },
    n: { description: 'token', action: () => this.wrappers.selectMenu(this.token.TokenMenu) },
    s: {
      description: 'staking',
      action: () => this.wrappers.selectMenu(this.staking.StakingMenu),
      condition: () => TV_SUPPORTED_CHAIN_IDS.map(c => c as string).includes(this.inverifyContext.chainId),
    },
    q: { description: 'uniswap', action: () => this.wrappers.selectMenu(this.uniswap.uniswapMenu) },
    v: {
      description: 'volatility token',
      action: () => this.wrappers.selectMenu(this.vol.volatilityTokenMenu),
      condition: () => TV_SUPPORTED_CHAIN_IDS.map(c => c as string).includes(this.inverifyContext.chainId),
    },
    r: {
      description: 'staking - reward router',
      action: () => this.wrappers.selectMenu(this.rewardRouter.RewardRouterMenu),
      condition: () => VESTING_SUPPORTED_CHAIN_IDS.map(c => c as string).includes(this.inverifyContext.chainId),
    },
    e: {
      description: 'vesting',
      action: () => this.wrappers.selectMenu(this.vesting.VestingMenu),
      condition: () => VESTING_SUPPORTED_CHAIN_IDS.map(c => c as string).includes(this.inverifyContext.chainId),
    },
    g: {
      description: 'gmx',
      action: () => this.wrappers.selectMenu(this.gmx.gmxMenu),
      condition: () =>
        [ChainId.ArbitrumLocal, ChainId.ArbitrumStaging, ChainId.ArbitrumMainnet].includes(
          this.inverifyContext.chainId,
        ),
    },
    x: {
      description: 'generic contract interaction',
      action: () => this.wrappers.selectMenu(this.contractInteraction.ContractInteractionMenu),
    },
  }

  constructor(
    private readonly inverifyContext: Required<InverifyContext>,
    public readonly shouldClose: () => boolean,
    private readonly writeOutput: (value: string) => void,
    private readonly askQuestion: (question: string) => Promise<string>,
    private readonly clearOutput: () => void,
  ) {}

  public async runMainMenu() {
    while (!this.shouldClose()) {
      try {
        await this.wrappers.selectMenu(this.menuItems, [])
      } catch (e) {
        if (e.message.includes(CLI_CLOSED_ERROR_MESSAGE)) {
          return
        }
        this.writeOutput(e.message)
      }
    }
  }
}
