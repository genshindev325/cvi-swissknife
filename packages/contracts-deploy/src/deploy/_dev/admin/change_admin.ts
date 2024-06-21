import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'
import { shouldSkipDevDeploy } from '../../../skippers'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const toAdminName = 'DefaultProxyAdmin'
  const deployments = await hre.deployments.all()

  if (toAdminName in deployments) {
    const proxies = Object.keys(deployments).filter(key => deployments[key].implementation)
    const toAdminAddress = deployments[toAdminName].address

    for (const proxy of proxies) {
      const proxyAddress = deployments[proxy].address
      const platformAdminRaw = await hre.ethers.provider.getStorageAt(
        proxyAddress,
        '0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103',
      )
      const platformAdmin = hre.ethers.utils.hexStripZeros(platformAdminRaw)
      const admin = await hre.ethers.getContractAt(deployments[toAdminName].abi, platformAdmin)
      if ((await admin.getProxyAdmin(proxyAddress)) !== toAdminAddress) {
        const adminOwner = await admin.owner()
        console.log(`[${proxy}] changing from ${platformAdmin} to ${toAdminAddress}`)
        await admin.connect(await hre.ethers.getSigner(adminOwner)).changeProxyAdmin(proxyAddress, toAdminAddress)
      }
    }
  }
}

func.tags = ['change-admin']
func.skip = async (env: HardhatRuntimeEnvironment) => shouldSkipDevDeploy(env, func.tags)

export default func
