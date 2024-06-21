import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'
import { DeployHelper } from '../../../helpers'
import { shouldSkipDevDeploy } from '../../../skippers'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const helper = DeployHelper.get(hre)
  const { address: owner } = await helper.getOwnerSigner()
  const admins = Object.keys(await hre.deployments.all()).filter(key => key.endsWith('ProxyAdmin'))

  for (const admin of admins) {
    const adminOwner = await helper.readWithName('ProxyAdmin', admin, 'owner')
    if (adminOwner !== owner) {
      console.log(`[${admin}] changing owner from ${adminOwner} to ${owner}`)
      await helper.executeWithName('ProxyAdmin', admin, 'transferOwnership', { from: adminOwner }, owner)
    }
  }
}

func.tags = ['transfer-admin-owner']
func.skip = async (env: HardhatRuntimeEnvironment) => shouldSkipDevDeploy(env, func.tags)

export default func
