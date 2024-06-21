import { inject, injectable } from 'inversify'
import type { JsonRpcProvider } from '@ethersproject/providers'
import type * as GitContractTypes from '@coti-cvi/auto-generated-code/contracts'
import type { CallOverrides, Contract, Signer } from 'ethers'
import type { Contracts } from './types'
import type { BlockchainName, IERC20 } from './types'
import { TokenName } from './types'
import { Token, UntypedToken } from './token'
import { interactableTokens } from './data'
import type { InteractableTokenName } from './data'
import {
  getContractFromAddressAndAbi,
  getContractFromDeploymentsFolder as getContractFromDeploymentsFile,
} from './util'
import type { EmbedPolygonMainnet } from '@coti-cvi/auto-generated-code/src/common-abi-types/EmbedPolygonMainnet'

interface GetContractsOverloads {
  (blockchainName: BlockchainName.POLYGON, contract: 'ILProtectionDiscountNFT', signer?: Signer): EmbedPolygonMainnet
  (
    blockchainName: BlockchainName.POLYGON | BlockchainName.ARBITRUM,
    contract: 'ILProtectionConfig',
    signer?: Signer,
  ): GitContractTypes.ILProtectionConfig
  (
    blockchainName: BlockchainName.POLYGON | BlockchainName.ARBITRUM,
    contract: 'ILProtectionDiscountNFTController',
    signer?: Signer,
  ): GitContractTypes.ILProtectionDiscountNFTController
  (
    blockchainName: BlockchainName.POLYGON | BlockchainName.ARBITRUM,
    contract: 'LiquidityController',
    signer?: Signer,
  ): GitContractTypes.LiquidityController
  (
    blockchainName: BlockchainName.POLYGON | BlockchainName.ARBITRUM,
    contract: 'ILiquidityController',
    signer?: Signer,
  ): GitContractTypes.ILiquidityController
  (
    blockchainName: BlockchainName.POLYGON | BlockchainName.ARBITRUM,
    contract: 'TokenPairRepository',
    signer?: Signer,
  ): GitContractTypes.TokenPairRepository
  (
    blockchainName: BlockchainName.POLYGON | BlockchainName.ARBITRUM,
    contract: 'ILProtectionNFT',
    signer?: Signer,
  ): GitContractTypes.ILProtectionNFT
  (
    blockchainName: BlockchainName.POLYGON | BlockchainName.ARBITRUM,
    contract: 'CVIFeedOracle',
    signer?: Signer,
  ): GitContractTypes.CVIFeedOracle
  (
    blockchainName: BlockchainName.POLYGON | BlockchainName.ARBITRUM,
    contract: 'CVIFakeFeedOracle',
    signer?: Signer,
  ): GitContractTypes.CVIFakeFeedOracle
  (
    blockchainName: BlockchainName.POLYGON | BlockchainName.ARBITRUM,
    contract: 'ETHUSDOracle',
    signer?: Signer,
  ): GitContractTypes.ETHUSDOracle
  (
    blockchainName: BlockchainName.POLYGON,
    contract: 'CVIUSDCLPStakingRewards',
    signer?: Signer,
  ): GitContractTypes.StakingRewards
  (
    blockchainName: BlockchainName.POLYGON | BlockchainName.ARBITRUM,
    contract: 'CVIUSDCPlatform',
    signer?: Signer,
  ): GitContractTypes.CVIUSDCPlatform
  (
    blockchainName: BlockchainName.POLYGON | BlockchainName.ARBITRUM,
    contract: 'ILProtectionController',
    signer?: Signer,
  ): GitContractTypes.ILProtectionController
  (
    blockchainName: BlockchainName.ARBITRUM,
    contract: 'CVIUSDCRequestFeesCalculator',
    signer?: Signer,
  ): GitContractTypes.CVIUSDCRequestFeesCalculator
  (
    blockchainName: BlockchainName.ARBITRUM,
    contract: 'CVIUSDCVolTokenRequestFulfiller',
    signer?: Signer,
  ): GitContractTypes.CVIUSDCVolTokenRequestFulfiller
  (
    blockchainName: BlockchainName.ARBITRUM,
    contract: 'CVIUSDCVolatilityToken',
    signer?: Signer,
  ): GitContractTypes.CVIUSDCVolatilityToken
  (
    blockchainName: BlockchainName.ARBITRUM,
    contract: 'CVIUSDCFeesCalculator',
    signer?: Signer,
  ): GitContractTypes.CVIUSDCFeesCalculator
  (
    blockchainName: BlockchainName.ARBITRUM,
    contract: 'CVIUSDCRebaser',
    signer?: Signer,
  ): GitContractTypes.CVIUSDCRebaser
  (
    blockchainName: BlockchainName.ARBITRUM,
    contract: 'CVIUSDCThetaVault',
    signer?: Signer,
  ): GitContractTypes.CVIUSDCThetaVault
  (
    blockchainName: BlockchainName.ARBITRUM,
    contract: 'CVIUSDCThetaVaultRequestFulfiller',
    signer?: Signer,
  ): GitContractTypes.CVIUSDCThetaVaultRequestFulfiller
  (blockchainName: BlockchainName.ARBITRUM, contract: 'StakingV2', signer?: Signer): GitContractTypes.StakingV2
  (blockchainName: BlockchainName.ARBITRUM, contract: 'StakingVault', signer?: Signer): GitContractTypes.StakingVault
  (
    blockchainName: BlockchainName.ARBITRUM,
    contract: 'PlatformHelper',
    signer?: Signer,
  ): GitContractTypes.PlatformHelper
  (
    blockchainName: BlockchainName.ARBITRUM,
    contract: 'EsGOVIRewardTrackerDistributor',
    signer?: Signer,
  ): GitContractTypes.EsGOVIRewardTrackerDistributor
  (
    blockchainName: BlockchainName.ARBITRUM,
    contract: 'EsGOVIRewardTracker',
    signer?: Signer,
  ): GitContractTypes.EsGOVIRewardTracker
  (
    blockchainName: BlockchainName.ARBITRUM,
    contract: 'GOVIRewardTrackerDistributor',
    signer?: Signer,
  ): GitContractTypes.GOVIRewardTrackerDistributor
  (
    blockchainName: BlockchainName.ARBITRUM,
    contract: 'GOVIRewardTracker',
    signer?: Signer,
  ): GitContractTypes.GOVIRewardTracker
  (blockchainName: BlockchainName.ARBITRUM, contract: 'GOVIVester', signer?: Signer): GitContractTypes.GOVIVester
  (
    blockchainName: BlockchainName.ARBITRUM,
    contract: 'ThetaVaultRewardTrackerDistributor',
    signer?: Signer,
  ): GitContractTypes.ThetaVaultRewardTrackerDistributor
  (
    blockchainName: BlockchainName.ARBITRUM,
    contract: 'ThetaVaultRewardTracker',
    signer?: Signer,
  ): GitContractTypes.ThetaVaultRewardTracker
  (
    blockchainName: BlockchainName.ARBITRUM,
    contract: 'ThetaVaultVester',
    signer?: Signer,
  ): GitContractTypes.ThetaVaultVester
  (blockchainName: BlockchainName.ARBITRUM, contract: 'RewardRouter', signer?: Signer): GitContractTypes.RewardRouter
  (
    blockchainName: BlockchainName.ARBITRUM | BlockchainName.POLYGON,
    contract: 'UniswapV2Router02',
    signer?: Signer,
  ): GitContractTypes.UniswapV2Router02
  (
    blockchainName: BlockchainName.ARBITRUM | BlockchainName.POLYGON,
    contract: 'UniswapV2Factory',
    signer?: Signer,
  ): GitContractTypes.UniswapV2Factory
}

interface GetTokensOverloads {
  (blockchainName: BlockchainName.ARBITRUM | BlockchainName.POLYGON, contract: TokenName.USDC, signer?: Signer): Token<
    IERC20,
    TokenName.USDC
  >
  (blockchainName: BlockchainName.ARBITRUM | BlockchainName.POLYGON, contract: TokenName.GOVI, signer?: Signer): Token<
    IERC20,
    TokenName.GOVI
  >
  (blockchainName: BlockchainName.ARBITRUM | BlockchainName.POLYGON, contract: TokenName.CVI, signer?: Signer): Token<
    IERC20,
    TokenName.CVI
  >
  (blockchainName: BlockchainName.ARBITRUM | BlockchainName.POLYGON, contract: TokenName.LINK, signer?: Signer): Token<
    IERC20,
    TokenName.LINK
  >
}

@injectable()
export class GetContractInversifyService {
  constructor(
    @inject('EthersJsonRpcBatchProvider') public readonly provider: JsonRpcProvider,
    @inject('SingleDeploymentsFile') private readonly singleDeploymentsFile: Contracts,
  ) {}

  public getContractFromDeploymentsFile: GetContractsOverloads = <B extends BlockchainName, T extends Contract>(
    _blockchainName: B,
    contractName: string,
    signer?: Signer,
  ) => {
    return getContractFromDeploymentsFile<T>({
      contracts: this.singleDeploymentsFile,
      signerOrProvider: signer ?? this.provider,
      contractName: contractName,
    })
  }

  public getFromAndToBlock = <C extends Contract>(
    contract: C,
    options?: { startBlock?: number | 'latest'; endBlock?: number | 'latest' },
  ): { fromBlock: number | 'latest'; toBlock: number | 'latest' } => {
    const { creationBlock } = this.getContractData(contract)
    const fromBlock = options !== undefined && options.startBlock !== undefined ? options.startBlock : creationBlock
    if (options !== undefined && options.endBlock !== undefined) {
      return {
        fromBlock,
        toBlock: options.endBlock,
      }
    } else {
      return {
        fromBlock,
        toBlock: 'latest',
      }
    }
  }

  public getContractData = (contract: Contract) => {
    const contractData = Object.entries(this.singleDeploymentsFile).find(
      ([name, c]) => !name.includes('Proxy') && c.address === contract.address,
    )
    if (!contractData) {
      throw Error(`${contract.address} missing from contracts file`)
    }
    return contractData[1]
  }

  public getHistoryContract = <C extends Contract>(contract: C, overrides: CallOverrides): C => {
    return typeof overrides.blockTag === 'number'
      ? this.getHistoryContractFromBlockNumber(contract, overrides.blockTag)
      : contract
  }

  public getHistoryContractFromBlockNumber = <C extends Contract>(contract: C, blockNumber: number): C => {
    const contractData = this.getContractData(contract)
    const { history } = contractData
    if (!history || history.length === 0) {
      return contract
    }
    if (blockNumber < contractData.creationBlock) {
      const index = history.findIndex(n => n.blockNumber < blockNumber)
      return contract.attach(history[index].address) as C
    }
    return contract
  }

  public getAddressOfDeployment = (contractName: string): string => {
    if (!this.singleDeploymentsFile[contractName]) {
      throw Error(`${contractName} missing from contracts file`)
    }
    return this.singleDeploymentsFile[contractName].address
  }

  public getAddressOfDeploymentOrUndefined = (contractName: string): string | undefined => {
    if (this.singleDeploymentsFile[contractName]) {
      return this.singleDeploymentsFile[contractName].address
    }
  }

  public getGenericErc20TokenByAddress(addressOfErc20Token: string, signer?: Signer): IERC20 {
    return getContractFromAddressAndAbi(
      addressOfErc20Token,
      this.singleDeploymentsFile[TokenName.USDC].abi,
      signer ?? this.provider,
      TokenName.USDC,
    )
  }

  public getToken: GetTokensOverloads = <B extends BlockchainName>(
    _blockchainName: B,
    token: InteractableTokenName,
    signer?: Signer,
  ) => {
    const contract = getContractFromDeploymentsFile<IERC20>({
      contracts: this.singleDeploymentsFile,
      signerOrProvider: signer ?? this.provider,
      contractName: token,
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return Token.fromTokenData(interactableTokens[token], contract) as any
  }

  public getTokenFromContract = (contractName: string, signer?: Signer) => {
    const contract = getContractFromDeploymentsFile<IERC20>({
      contracts: this.singleDeploymentsFile,
      signerOrProvider: this.provider,
      contractName,
    })
    return UntypedToken.fromAddress(contract.address, signer ?? this.provider)
  }
}
