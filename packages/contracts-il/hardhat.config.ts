import '@abraham/reflection'
import 'hardhat-deploy'
import 'solidity-coverage'
import '@nomiclabs/hardhat-ethers'
import 'tsconfig-paths/register'
import path from 'path'
import findUp from 'find-up'
import type { HardhatUserConfig } from 'hardhat/config'
import { generateNamedAccounts, HARDHAT_TEST_CHAIN_ID } from '../lw-sdk/src/contracts-deploy-utils/constants'

function createHardhatConfig(): HardhatUserConfig {
  const repoPath = path.dirname(findUp.sync('yarn.lock', { cwd: __dirname })!)

  const compilerVersions = ['0.8.4']

  return {
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
    paths: {
      deploy: path.join(repoPath, 'packages', 'contracts-deploy', 'src', 'deploy'),
    },
    namedAccounts: generateNamedAccounts({}),
    networks: {
      hardhat: {
        chainId: +HARDHAT_TEST_CHAIN_ID,
      },
    },
  }
}

const hardhatConfig = createHardhatConfig()

export default hardhatConfig
