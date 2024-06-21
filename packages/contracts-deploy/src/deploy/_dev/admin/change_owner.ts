import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'
import { shouldSkipDevDeploy } from '../../../skippers'
import { DeployHelper } from '../../../helpers'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const helper = DeployHelper.get(hre)
  const { owner } = await helper.getNamedAccounts()
  const contractNames = ['FeesCollector', 'Treasury'] as const

  for (const contractName of contractNames) {
    const deployment = await hre.deployments.getOrNull(contractName)
    if (deployment) {
      const contract = await hre.ethers.getContractAt(deployment.abi, deployment.address)
      const currentOwner = await contract.owner()
      if (currentOwner !== owner) {
        console.log(`Transfering ownership of ${contractName} from ${currentOwner} to ${owner}...`)
        await contract.connect(await hre.ethers.getSigner(currentOwner)).transferOwnership(owner)
      }
    }
  }
}

func.tags = ['change-owner']
func.skip = async (env: HardhatRuntimeEnvironment) => shouldSkipDevDeploy(env, func.tags)

export default func
