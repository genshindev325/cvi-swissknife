import type { BigNumber } from 'ethers'
import { inject, injectable, postConstruct } from 'inversify'
import type { CVIFakeFeedOracle } from '@coti-cvi/auto-generated-code/contracts'
import type { GetContractInversifyService } from './get-contract.inversify.service'
import type { CVISupportedChainIds } from './types'
import { CHAIN_IDS_INFO, NetworkName } from './types'
import { fromNumber, getContractFromAddressAndAbi, toNumber } from './util'
import type { CviOracle } from '@coti-cvi/auto-generated-code/src'
import CviOracleJson from './common-abis/CviOracle.json'
import type { AsyncQueueInversifyService } from './async-queue.inversify.service'
import type { CacheInversifyService } from './cache.inversify.service'

type CviIndex = {
  // do not return cvi as bigNumber because the decimals in il
  // contracts are 18 and in the oracal it's 2. so we force the
  // developer to convert to BN in the context he works
  cviNumber: number
  cviRoundId: BigNumber
  cviRoundTimestamp: number
  decimals: number
}

@injectable()
export class CVIOracleInversifyService {
  public readonly mainnetFeedOracle: CviOracle

  public readonly hardhatFeedOracle?: CVIFakeFeedOracle

  public readonly oracleDecimals = 18

  public readonly hardhatFeedOracleDeployedBlockNumber?: number

  public mainnetLastAggregator?: CviOracle

  constructor(
    @inject('ChainId') public readonly chainId: CVISupportedChainIds,
    @inject('CacheInversifyService') private readonly cacheInversifyService: CacheInversifyService,
    @inject('GetContractInversifyService') public readonly getContractInversifyService: GetContractInversifyService,
    @inject('AsyncQueueInversifyService') private readonly asyncQueueInversifyService: AsyncQueueInversifyService,
  ) {
    const cviFeedOracle = getContractInversifyService.getContractFromDeploymentsFile(
      CHAIN_IDS_INFO[chainId].blockchainName,
      'CVIFeedOracle',
    )
    this.mainnetFeedOracle = getContractFromAddressAndAbi<CviOracle>(
      cviFeedOracle.address,
      CviOracleJson,
      this.getContractInversifyService.provider,
    )
    try {
      if ([NetworkName.Local, NetworkName.Staging].includes(CHAIN_IDS_INFO[chainId].networkName)) {
        this.hardhatFeedOracle = this.getContractInversifyService.getContractFromDeploymentsFile(
          CHAIN_IDS_INFO[chainId].blockchainName,
          'CVIFakeFeedOracle',
        )
        this.hardhatFeedOracleDeployedBlockNumber = this.getContractInversifyService.getContractData(
          this.hardhatFeedOracle,
        ).creationBlock
      }
    } catch (error) {
      if (error.message !== 'CVIFakeFeedOracle missing from contracts file') {
        throw error
      }
    }
  }

  @postConstruct()
  async init() {
    const aggregatorAddress = await this.mainnetFeedOracle.aggregator()
    this.mainnetLastAggregator = getContractFromAddressAndAbi<CviOracle>(
      aggregatorAddress,
      CviOracleJson,
      this.getContractInversifyService.provider,
    )
  }

  public getFeed(blockNumber?: number) {
    if (CHAIN_IDS_INFO[this.chainId].networkName === NetworkName.Mainnet) {
      return this.mainnetFeedOracle
    }
    if (
      this.hardhatFeedOracle &&
      this.hardhatFeedOracleDeployedBlockNumber &&
      (blockNumber === undefined || blockNumber >= this.hardhatFeedOracleDeployedBlockNumber)
    ) {
      return this.hardhatFeedOracle
    }
    return this.mainnetFeedOracle
  }

  public getAggregator(blockNumber?: number) {
    if (this.getFeed(blockNumber) === this.mainnetFeedOracle) {
      if (!this.mainnetLastAggregator) {
        throw new Error(`can't be here`)
      }
      return this.mainnetLastAggregator
    }
    if (!this.hardhatFeedOracle) {
      throw new Error(`can't be here`)
    }
    return this.hardhatFeedOracle
  }

  public async getCviIndex(blockNumber?: number): Promise<CviIndex> {
    return this.cacheInversifyService.get({
      key: 'cvi-index',
      blockTag: blockNumber,
      invalidationKey: '1',
      getFromBlockchain: async () => {
        const result = await this.getFeed(blockNumber).latestRoundData({ blockTag: blockNumber })
        const cviNumber = toNumber(result.answer, this.oracleDecimals)

        return {
          cviNumber,
          cviRoundId: result.roundId,
          cviRoundTimestamp: result.updatedAt.toNumber(),
          decimals: this.oracleDecimals,
        }
      },
    })
  }

  public async getMaxCVIIndex(): Promise<Pick<CviIndex, 'cviNumber' | 'decimals'>> {
    return {
      cviNumber: 200,
      decimals: this.oracleDecimals,
    }
  }

  public async setHardhatCVIIndex(index: number) {
    if (!this.hardhatFeedOracle) {
      throw new Error('setting cvi index is only supported on local or staging (missing fake feed oracle)')
    }
    const owner = this.getContractInversifyService.provider.getSigner(await this.hardhatFeedOracle.owner())
    return this.hardhatFeedOracle.connect(owner).updateAnswer(fromNumber(index, this.oracleDecimals))
  }
}
