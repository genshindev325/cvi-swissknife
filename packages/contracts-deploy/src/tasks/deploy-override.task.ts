import { task, types } from 'hardhat/config'
import { TASK_DEPLOY } from 'hardhat-deploy'
import path from 'path'
import os from 'os'
import type { ChainId } from '../../../lw-sdk/src/types/config-types'
import { CHAIN_IDS_INFO, NetworkName } from '../../../lw-sdk/src/types/config-types'
import { toNumber } from '../../../lw-sdk/src/util/big-number'
import { getEnvConfig } from '../config'
import { DeployHelper, HistoryHelper } from '../helpers'
import { extendSingleDeploymentFile } from './join-deployments-to-single-file.task'
import { MIN_DEPLOYER_BALANCE } from '@coti-cvi/lw-sdk/src/contracts-deploy-utils/constants'

function getSingleDeploymentFilePath({ repoPath, chainId }: { repoPath: string; chainId: ChainId }) {
  const chainInfo = CHAIN_IDS_INFO[chainId]
  const fileName = `chain_id_${chainId}__blockchain_${chainInfo.blockchainName}__network_${chainInfo.networkName}${
    chainInfo.networkName === NetworkName.Mainnet ? '' : `__epoch_${Date.now()}`
  }.json`

  return chainInfo.networkName === NetworkName.Mainnet
    ? path.join(repoPath, 'packages', 'auto-generated-code', 'src', 'single-live-deployment-files', fileName)
    : path.join(os.tmpdir(), fileName)
}

export const deployAndExportTask = () => {
  const envConfig = getEnvConfig()

  const singleDeploymentsFilePath = getSingleDeploymentFilePath({
    repoPath: envConfig.repoPath,
    chainId: envConfig.chainId,
  })

  return task(TASK_DEPLOY, 'deploy task - added export to single file after deployment and handle proposals')
    .addOptionalParam('description', 'description of the deployment - for deployment history', undefined, types.string)
    .setAction(async (args, hre, runSuper) => {
      const description: string = args.description
      if (!description && hre.network.config.live) {
        throw new Error('description is required when deploying to mainnet. please add --description')
      }

      const { blockchainName } = CHAIN_IDS_INFO[envConfig.chainId]
      const historyHelper = HistoryHelper.create(hre, { repoPath: envConfig.repoPath, blockchainName, description })
      const helper = DeployHelper.get(hre)

      const deployer = await helper.getDeployerSigner()
      const balance = await hre.ethers.provider.getBalance(deployer.address)
      if (toNumber(balance, 18) < MIN_DEPLOYER_BALANCE) {
        console.warn(`deployer balance is ${toNumber(balance, 18)} - please top up`)
      }

      const allDeployments = await hre.deployments.all()
      const proposals = Object.keys(allDeployments)
        .filter(key => key.endsWith('_Proposal'))
        .map(key => key.replace('_Proposal', ''))
      console.log(`Found ${proposals.length} proposals ${proposals.join(', ')}`)

      for (const proposal of proposals) {
        try {
          await helper.applyUpgrade(proposal)
        } catch (e) {
          console.log(e.message)
        }
      }

      await runSuper(args)

      const deploymentHistory = await historyHelper.getDeploymentHistory()

      await hre.run('export', { export: singleDeploymentsFilePath })
      await extendSingleDeploymentFile(hre, {
        repoPath: envConfig.repoPath,
        chainId: envConfig.chainId,
        singleDeploymentsFilePath,
        deploymentHistory,
      })

      console.log(`created deployments file on disk: "${singleDeploymentsFilePath}"`)
    })
}
