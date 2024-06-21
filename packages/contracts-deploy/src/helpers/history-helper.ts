import fs from 'fs'
import path from 'path'
import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { JsonRpcProvider } from '@ethersproject/providers'
import type {
  HistoryHelperOptions,
  FullDeployHistoryItem,
  DeployHistoryItem,
} from '../../../lw-sdk/src/contracts-deploy-utils/types'
import { DEPLOYMENT_HISTORY_FILE_NAME } from '@coti-cvi/lw-sdk/src/contracts-deploy-utils/constants'

export class HistoryHelper {
  private static instance: HistoryHelper

  private readonly provider: JsonRpcProvider

  private readonly filePath: string

  private readonly blockchainName: string

  description: string

  constructor(hre: HardhatRuntimeEnvironment, { repoPath, blockchainName, description }: HistoryHelperOptions) {
    this.provider = hre.ethers.provider
    this.filePath = this.getDeploymentHistoryPath(repoPath, blockchainName)
    this.blockchainName = blockchainName
    this.description = description ?? ''
  }

  private getDeploymentHistoryPath(repoPath: string, blockchainName: string): string {
    return path.join(
      repoPath,
      'packages',
      'contracts-deploy',
      'src',
      'data',
      'deployment-history',
      `${blockchainName}-${DEPLOYMENT_HISTORY_FILE_NAME}`,
    )
  }

  public async getDeploymentHistory(): Promise<FullDeployHistoryItem[]> {
    if (!fs.existsSync(this.filePath)) {
      return []
    }
    return JSON.parse(await fs.promises.readFile(this.filePath, 'utf8')) as FullDeployHistoryItem[]
  }

  public async addDeploymentHistory(item: DeployHistoryItem): Promise<void> {
    const [currentHistory, blockData] = await Promise.all([this.getDeploymentHistory(), this.getBlockData(item)])
    return this.addHistoryItems(currentHistory, this.mapper(item, blockData))
  }

  public async addMultipleDeploymentHistory(items: DeployHistoryItem[]): Promise<void> {
    const [currentHistory, blockData] = await Promise.all([this.getDeploymentHistory(), this.getBlocksData(...items)])
    await this.addHistoryItems(currentHistory, ...items.map((item, i) => this.mapper(item, blockData[i])))
  }

  private async addHistoryItems(currentHistory: FullDeployHistoryItem[], ...newItems: FullDeployHistoryItem[]) {
    const newUniqueItems = newItems.filter(
      item =>
        !currentHistory.some(
          currentItem =>
            currentItem.hash === item.hash &&
            currentItem.contractAddress === item.contractAddress &&
            currentItem.topic === item.topic,
        ),
    )
    const newHistory = [...currentHistory, ...newUniqueItems].sort((a, b) => b.block - a.block)
    return fs.promises.writeFile(this.filePath, JSON.stringify(newHistory, null, 2))
  }

  private async getBlockData(item: DeployHistoryItem): Promise<{ block: number; timestamp: number }> {
    const block = item.block ?? (await this.provider.getTransaction(item.hash)).blockNumber
    if (!block) {
      throw new Error(`[HistoryHelper] Transaction ${item.hash} not found`)
    }
    const { timestamp } = await this.provider.getBlock(block)
    return { block, timestamp }
  }

  private async getBlocksData(...items: DeployHistoryItem[]): Promise<{ block: number; timestamp: number }[]> {
    return Promise.all(items.map(item => this.getBlockData(item)))
  }

  private mapper(data: DeployHistoryItem, blockData: { block: number; timestamp: number }): FullDeployHistoryItem {
    return {
      ...data,
      ...blockData,
      blockchain: this.blockchainName,
      description: this.description,
    }
  }

  public static create = (hre: HardhatRuntimeEnvironment, options: HistoryHelperOptions) => {
    return (HistoryHelper.instance = new HistoryHelper(hre, options))
  }

  public static get = (): HistoryHelper => {
    if (!HistoryHelper.instance) {
      throw new Error('HistoryHelper not initialized')
    }
    return HistoryHelper.instance
  }
}
