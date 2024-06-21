import type { Contract, ContractFactory, ethers } from 'ethers'
import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import type { HardhatEthersHelpers } from '@nomiclabs/hardhat-ethers/types'
import type {
  HardhatDeploySimplifiedFunctionOverloads,
  HardhatDeployProxySimplifiedFunctionOverloads,
  Head,
  HardhatConnectOverloads,
} from '@coti-cvi/auto-generated-code'
import type { Libraries } from 'hardhat-deploy/types'
import type { NamedAccount } from '../../../lw-sdk/src/contracts-deploy-utils/types'
import { toHex, fromNumber, toNumber } from '../../../lw-sdk/src/util/big-number'
import { InitialState } from '.'

export class TestHelper {
  private static instance: TestHelper

  constructor(public readonly eth: typeof ethers & HardhatEthersHelpers) {}

  public getNamedSigner = async (name: NamedAccount) => {
    return this.eth.getNamedSigner(name)
  }

  public getNamedSigners = async (): Promise<Record<NamedAccount, SignerWithAddress>> => {
    return this.eth.getNamedSigners()
  }

  public getAccountSigner = async (account: string | Promise<string>) => {
    const address = typeof account === 'string' ? account : await account
    return this.eth.getSigner(address)
  }

  public getOwnerSigner = async () => {
    return this.getNamedSigner('owner')
  }

  public getDeployerSigner = async () => {
    return this.getNamedSigner('deployer')
  }

  public deploy: HardhatDeploySimplifiedFunctionOverloads = async <F extends ContractFactory>(
    contractName: string,
    ...args: Head<F['deploy']>
  ): Promise<ReturnType<F['deploy']>> => {
    const signer = await this.getDeployerSigner()
    const factory = await this.eth.getContractFactory(contractName, signer)
    // @ts-ignore
    return (await factory.deploy(...args)).deployed()
  }

  public deployProxy: HardhatDeployProxySimplifiedFunctionOverloads = async <C extends Contract>(
    contractName: string,
    libraries: Libraries,
    ...args: Head<C['initialize']>
  ): Promise<C> => {
    const signer = await this.getDeployerSigner()
    const factory = await this.eth.getContractFactory(contractName, { signer, libraries })
    const contract = await (await factory.deploy()).deployed()

    await contract.initialize(...args)
    return contract as C
  }

  public connect: HardhatConnectOverloads = async <C extends Contract>(
    contractName: string,
    options?: { overrideSignerAddress?: string; overrideContractAddress?: string },
  ): Promise<C> => {
    const signer = options?.overrideSignerAddress
      ? await this.getAccountSigner(options?.overrideSignerAddress)
      : undefined

    const contract = await this.eth.getContract(contractName, signer)
    return (options?.overrideContractAddress ? contract.attach(options.overrideContractAddress) : contract) as C
  }

  public attach = async <C extends Contract>(abi: unknown[], address: string): Promise<C> => {
    return this.eth.getContractAt(abi, address)
  }

  public latestBlock = async () => {
    return this.eth.provider.getBlock('latest')
  }

  public advanceTime = async (seconds: number) => {
    await this.eth.provider.send('hardhat_mine', [toHex(2, 0), toHex(seconds, 0)])
  }

  public setTimestamp = async (timestamp: number) => {
    await this.eth.provider.send('evm_setNextBlockTimestamp', [timestamp])
    await this.eth.provider.send('evm_mine', [])
  }

  public getCVI = async (oracle: Contract) => {
    return toNumber(await oracle.latestAnswer(), InitialState.cviDecimals)
  }

  public setCVI = async (oracle: Contract, cvi: number) => {
    return (await oracle.updateAnswer(fromNumber(cvi, InitialState.cviDecimals))).wait()
  }

  public static get = (eth?: typeof ethers & HardhatEthersHelpers): TestHelper => {
    if (!TestHelper.instance) {
      if (!eth) {
        throw new Error('TestHelper requires an ethers instance')
      }
      TestHelper.instance = new TestHelper(eth)
    }
    return TestHelper.instance
  }
}
