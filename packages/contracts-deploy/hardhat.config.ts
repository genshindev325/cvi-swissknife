import 'dotenv/config'
import '@abraham/reflection'
import '@nomiclabs/hardhat-etherscan'
import 'hardhat-deploy'
import 'hardhat-watcher'
import '@typechain/hardhat'
import 'solidity-coverage'
import '@nomiclabs/hardhat-ethers'
import 'tsconfig-paths/register'
import path from 'path'
import findUp from 'find-up'
import cloneDeep from 'lodash/cloneDeep'
import type { HardhatNetworkUserConfig, NetworkUserConfig, HardhatUserConfig } from 'hardhat/types'
import { CHAIN_IDS_INFO, NetworkName } from '../lw-sdk/src/types/config-types'
import { generateNamedAccounts, HARDHAT_TEST_CHAIN_ID } from '../lw-sdk/src/contracts-deploy-utils/constants'
import { beforeNodeStartTask, joinAbisToSingleFileTask, deployAndExportTask, deploymentHistoryTask } from './src/tasks'
import { ETHERSCAN_API_KEY, POLYGONSCAN_API_KEY, ARBISCAN_API_KEY, MNEMONIC, DEPLOYER_PRIVATE_KEY } from './src/secrets'
import {
  getChainInfo,
  getExternalArtifacts,
  checkIsStartingHardhatNode,
  checkIsTestMode,
  checkIsDeployMode,
  checkIsGeneratingTypes,
} from './src/config'

function createHardhatConfig(processEnv: NodeJS.ProcessEnv, argv: string[]): HardhatUserConfig {
  const repoPath = path.dirname(findUp.sync('yarn.lock', { cwd: __dirname })!)

  const isStartingHardhatNode = checkIsStartingHardhatNode(processEnv)
  const isTestMode = checkIsTestMode(processEnv)
  const isDeployMode = checkIsDeployMode(processEnv)
  const isGeneratingTypes = checkIsGeneratingTypes(processEnv)

  const privateKey = process.env.PRIVATE_KEY

  const compilerVersions = ['0.8.4', '0.6.6', '0.5.16']

  const hardhatConfig: HardhatUserConfig = {
    etherscan: {
      apiKey: {
        // ethereum
        mainnet: ETHERSCAN_API_KEY,
        ropsten: ETHERSCAN_API_KEY,
        rinkeby: ETHERSCAN_API_KEY,
        goerli: ETHERSCAN_API_KEY,
        kovan: ETHERSCAN_API_KEY,
        // polygon
        polygon: POLYGONSCAN_API_KEY,
        polygonMumbai: POLYGONSCAN_API_KEY,
        // arbitrum
        arbitrumOne: ARBISCAN_API_KEY,
        arbitrumTestnet: ARBISCAN_API_KEY,
      },
    },
    solidity: {
      compilers: compilerVersions.map(version => ({
        version,
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      })),
      settings: {
        outputSelection: {
          '*': {
            '*': ['storageLayout'],
          },
        },
      },
    },
    ...(isGeneratingTypes
      ? {
          typechain: {
            outDir: path.join(repoPath, 'packages', 'auto-generated-code', 'src', 'git-contract-types'),
            target: 'ethers-v5',
            externalArtifacts: getExternalArtifacts({ repoPath: repoPath, solidity: compilerVersions[0] }),
          },
        }
      : { typechain: { dontOverrideCompile: true } }),
    paths: {
      tests: path.join(repoPath, 'packages', 'contracts-deploy', 'test'),
      deploy: path.join(repoPath, 'packages', 'contracts-deploy', 'src', 'deploy'),
      deployments: path.join(repoPath, 'packages', 'lw-sdk', 'deployments'),
    },
    watcher: {
      compilation: {
        tasks: ['compile'],
        files: [
          path.join(repoPath, 'packages', 'contracts-deploy', 'contracts'),
          path.join(repoPath, 'packages', 'contracts-cvi', 'contracts'),
          path.join(repoPath, 'packages', 'contracts-il', 'contracts'),
          path.join(repoPath, 'packages', 'contracts-staking', 'contracts'),
        ],
      },
    },
    namedAccounts: generateNamedAccounts({ privateKey, deployerPrivateKey: DEPLOYER_PRIVATE_KEY }),
    networks: {
      hardhat: isStartingHardhatNode
        ? ((): HardhatNetworkUserConfig => {
            const chainInfo = getChainInfo(processEnv, argv)
            return {
              chainId: Number(chainInfo.chainId),
              forking: {
                url: chainInfo.deployAndForkRpcUrl,
                // blockNumber: 52570000,
              },
              accounts: {
                // this will create the following test-wallet-ids instead of the default hardhat test-wallet-ids:
                // https://docs.google.com/spreadsheets/d/1ldGsNwiHL6K4L8QGCv_ld-0DTVLDA4BwOVzNvpwp3lE/edit#gid=0
                mnemonic: MNEMONIC,
                count: 50,
              },
              chains: {
                137: {
                  hardforkHistory: {
                    london: 23850000,
                  },
                },
                42161: {
                  hardforkHistory: {
                    london: 13549897,
                  },
                },
              },
              // mining: chainInfo.networkName === NetworkName.Staging ? { auto: false, interval: 1 } : undefined,
            }
          })()
        : isTestMode
        ? {
            chainId: +HARDHAT_TEST_CHAIN_ID,
          }
        : undefined,
      ...Object.fromEntries(
        Object.values(CHAIN_IDS_INFO).map<[networkName: string, networkUserConfig: NetworkUserConfig]>(chainInfo => [
          chainInfo.hardhatConfigNetworkName,
          {
            url: chainInfo.deployAndForkRpcUrl,
            chainId: +chainInfo.chainId,
            live: chainInfo.networkName === NetworkName.Mainnet,
          },
        ]),
      ),
    },
  }

  if (isStartingHardhatNode) {
    beforeNodeStartTask()
    joinAbisToSingleFileTask()
  } else if (isDeployMode) {
    deployAndExportTask()
    deploymentHistoryTask()
  }

  if (!hardhatConfig.networks?.hardhat) {
    // workaround to hardhat-error
    delete hardhatConfig.networks?.hardhat
  }

  if (isStartingHardhatNode || isDeployMode) {
    const print = cloneDeep(hardhatConfig)
    if (print.typechain?.externalArtifacts) {
      print.typechain.externalArtifacts = ['...']
    }

    console.log('hardhatConfig: ', JSON.stringify(print, null, 2))
    console.log('----------------------------------------------')
    console.log('----------------------------------------------')
    console.log('----------------------------------------------')
  }

  return hardhatConfig
}

const hardhatConfig = createHardhatConfig(process.env, process.argv.slice(2))

export default hardhatConfig
