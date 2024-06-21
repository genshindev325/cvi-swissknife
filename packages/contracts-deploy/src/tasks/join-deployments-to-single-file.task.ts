import path from 'path'
import fs from 'fs'
import os from 'os'
import { task } from 'hardhat/config'
import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import { TASK_DEPLOY_RUN_DEPLOY } from 'hardhat-deploy'
import type { Deployment } from 'hardhat-deploy/types'
import { getEnvConfig } from '../config'
import type { ServerParams } from '../api-server'
import { runServer } from '../api-server'
import { DeployHelper, HistoryHelper } from '../helpers'
import type { ChainId } from '../../../lw-sdk/src/types/config-types'
import { CHAIN_IDS_INFO, NetworkName } from '../../../lw-sdk/src/types/config-types'
import type { ContractData } from '../../../lw-sdk/src/types/common-types'
import type { FullDeployHistoryItem } from 'lw-sdk/src/contracts-deploy-utils/types'

async function copyDeployments(liveDeploymentsPath: string, hre: HardhatRuntimeEnvironment) {
  const files = await fs.promises.readdir(liveDeploymentsPath).then(r => r.filter(f => f.endsWith('.json')))
  await Promise.all(
    files.map(async file => {
      const dep = JSON.parse(await fs.promises.readFile(path.join(liveDeploymentsPath, file), 'utf8'))
      await hre.deployments.save(path.parse(file).name, dep)
    }),
  )
}

function getSingleDeploymentFilePath({ repoPath, chainId }: { repoPath: string; chainId: ChainId }) {
  const chainInfo = CHAIN_IDS_INFO[chainId]
  const fileName = `chain_id_${chainId}__blockchain_${chainInfo.blockchainName}__network_${chainInfo.networkName}${
    chainInfo.networkName === NetworkName.Mainnet ? '' : `__epoch_${Date.now()}`
  }.json`

  return chainInfo.networkName === NetworkName.Mainnet
    ? path.join(repoPath, 'packages', 'auto-generated-code', 'src', 'single-live-deployment-files', fileName)
    : path.join(os.tmpdir(), fileName)
}

async function getCreationBlock(name: string, hre: HardhatRuntimeEnvironment, deployment: Deployment): Promise<number> {
  try {
    if (deployment.receipt) {
      return deployment.receipt.blockNumber
    } else if (deployment.transactionHash) {
      const { blockNumber } = await hre.ethers.provider.getTransactionReceipt(deployment.transactionHash)
      return blockNumber
    }
  } catch (error) {
    console.error(`${name} ${error}`)
  }
  return 0
}

export async function extendSingleDeploymentFile(
  hre: HardhatRuntimeEnvironment,
  {
    repoPath,
    chainId,
    singleDeploymentsFilePath,
    deploymentHistory,
  }: {
    repoPath: string
    chainId: ChainId
    singleDeploymentsFilePath: string
    deploymentHistory: FullDeployHistoryItem[]
  },
): Promise<void> {
  type MinimalSingleDeploymentFile = {
    name: string
    chainId: string
    contracts: {
      [contractName: string]: Pick<ContractData, 'abi' | 'address'>
    }
  }
  const minimalSingleDeploymentFileJson: MinimalSingleDeploymentFile = JSON.parse(
    await fs.promises.readFile(singleDeploymentsFilePath, 'utf-8'),
  )
  type FullSingleDeploymentFile = {
    name: string
    chainId: string
    contracts: {
      [contractName: string]: ContractData
    }
  }
  const deployments = await hre.deployments.all()
  const fullSingleDeploymentFileJson: FullSingleDeploymentFile = {
    ...minimalSingleDeploymentFileJson,
    contracts: Object.fromEntries(
      await Promise.all(
        Object.keys(minimalSingleDeploymentFileJson.contracts).map<Promise<[string, ContractData]>>(
          async contractName => {
            const deployment: Deployment = deployments[contractName]
            const creationBlock = await getCreationBlock(contractName, hre, deployment)
            const transactionHash = deployment.transactionHash || ''
            const deploymentWithoutTransactionHash: Omit<Deployment, 'transactionHash'> = deployment
            const fullContractData: ContractData = {
              ...deploymentWithoutTransactionHash,
              creationBlock,
              transactionHash,
            } as ContractData
            const fullContractDataWithHistory: ContractData = {
              ...fullContractData,
              history: deploymentHistory
                .filter(
                  d =>
                    d.contractName === contractName &&
                    (d.topic === 'Deploy' || d.topic === 'DeployProxy') &&
                    d.contractAddress.toLowerCase() !== fullContractData.address.toLowerCase(),
                )
                .sort((a, b) => b.block - a.block)
                .map(d => ({ blockNumber: d.block, address: d.contractAddress, abi: d.contractABI })),
            }
            return [contractName, { ...fullContractDataWithHistory, creationBlock }]
          },
        ),
      ),
    ),
  }
  await fs.promises.writeFile(singleDeploymentsFilePath, JSON.stringify(fullSingleDeploymentFileJson, null, 2), 'utf-8')
}

export const joinAbisToSingleFileTask = () => {
  const envConfig = getEnvConfig()

  const singleDeploymentsFilePath = getSingleDeploymentFilePath({
    repoPath: envConfig.repoPath,
    chainId: envConfig.chainId,
  })

  return task(
    TASK_DEPLOY_RUN_DEPLOY,
    'join abis to single file on disk after hardhat-deploy deploys the contracts and generate multiple abi files (Overridden)',
    async (args, hre, runSuper) => {
      const { forkContractsNetworkName, networkName, blockchainName } = CHAIN_IDS_INFO[envConfig.chainId]
      if (forkContractsNetworkName) {
        const deploymentsPath = path.join(hre.config.paths.deployments, forkContractsNetworkName)
        await copyDeployments(deploymentsPath, hre)
      }
      const { number: forkBlockNumber, timestamp } = await hre.ethers.provider.getBlock('latest')
      const forkTimestampUtc = new Date(timestamp).toISOString()
      DeployHelper.get(hre)
      await runSuper(args)

      const historyHelper = HistoryHelper.create(hre, { repoPath: envConfig.repoPath, blockchainName })
      const deploymentHistory = await historyHelper.getDeploymentHistory()

      await hre.run('export', { export: singleDeploymentsFilePath })
      await extendSingleDeploymentFile(hre, {
        repoPath: envConfig.repoPath,
        chainId: envConfig.chainId,
        singleDeploymentsFilePath,
        deploymentHistory,
      })

      console.log(`created deployments file on disk: "${singleDeploymentsFilePath}"`)

      if (networkName === NetworkName.Staging || networkName === NetworkName.Local) {
        const payload: ServerParams = {
          blockchainName,
          forkBlockNumber,
          forkTimestampUtc,
          hardhatPreparationTimeSeconds: process.uptime(),
          singleDeploymentsFilePath,
          port: envConfig.deploymentsFileServerPort,
          appEnv: envConfig.appEnv,
        }
        runServer(hre, payload)
      }
    },
  )
}
