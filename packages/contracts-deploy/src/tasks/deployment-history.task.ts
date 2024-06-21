import { task } from 'hardhat/config'
import { getEnvConfig } from '../config'
import { DeployHelper } from '../helpers'
import { CHAIN_IDS_INFO, NetworkName } from '@coti-cvi/lw-sdk/src/types/config-types'
import { HistoryHelper } from '../helpers/history-helper'
import type { TransparentUpgradeableProxy } from '@coti-cvi/auto-generated-code/contracts'
import type { DeployHistoryItem } from '../../../lw-sdk/src/contracts-deploy-utils/types'

export const DEPLOYMENT_HISTORY_TASK = 'deployment-history'

async function saveData(items: DeployHistoryItem[]) {
  console.log(`saving ${items.length} items`)
  return HistoryHelper.get().addMultipleDeploymentHistory(items)
}

async function getProxyHistory(name: string, proxy: TransparentUpgradeableProxy): Promise<DeployHistoryItem[]> {
  const upgradedEvents = await proxy.queryFilter(proxy.filters.Upgraded())
  return upgradedEvents.map(event => ({
    topic: 'Upgrade',
    contractName: name,
    contractAddress: event.address,
    hash: event.transactionHash,
    block: event.blockNumber,
  }))
}

async function getSetPairHistoryData(): Promise<Required<DeployHistoryItem[]>> {
  const helper = DeployHelper.get()
  const pairRepo = await helper.attach('TokenPairRepository')
  const pairSetEvents = await pairRepo.queryFilter(pairRepo.filters.PairSet())
  return pairSetEvents.map(event => ({
    topic: `PairSet: ${event.args.newValue.token1Symbol}-${event.args.newValue.token2Symbol}`,
    contractName: 'TokenPairRepository',
    contractAddress: event.address,
    hash: event.transactionHash,
    block: event.blockNumber,
  }))
}

async function getUpgradeHistoryData(): Promise<DeployHistoryItem[]> {
  const helper = DeployHelper.get()
  const deployments = await helper.getAll()
  const proxies = Object.entries(deployments)
    .filter(([_, value]) => value.implementation)
    .map(([key, _]) => key)
  const upgrades = await Promise.all(
    proxies.map(async name => getProxyHistory(name, await helper.attachTo<TransparentUpgradeableProxy>(name))),
  )
  return upgrades.flat()
}

export const deploymentHistoryTask = () => {
  const envConfig = getEnvConfig()

  return task(DEPLOYMENT_HISTORY_TASK, 'get deployment history and export to json file', async (args, hre) => {
    const { networkName, blockchainName } = CHAIN_IDS_INFO[envConfig.chainId]
    HistoryHelper.create(hre, { repoPath: envConfig.repoPath, blockchainName })
    DeployHelper.get(hre)

    if (networkName !== NetworkName.Mainnet) {
      console.log(`${DEPLOYMENT_HISTORY_TASK} is only supported for mainnet`)
      return
    }
    const data = await Promise.all([getUpgradeHistoryData(), getSetPairHistoryData()])
    await saveData(data.flat())
  })
}
