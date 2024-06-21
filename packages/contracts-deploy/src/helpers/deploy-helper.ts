import type { Network } from 'defender-base-client'
import { fromChainId, isValidNetwork } from 'defender-base-client'
import { AdminClient } from 'defender-admin-client'
import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { BigNumber } from 'ethers'
import type { Provider } from '@ethersproject/providers'
import type { Contract, ContractFactory, Signer } from 'ethers'
import type { CallOptions, Deployment, DeployOptions, ProxyOptions, TxOptions } from 'hardhat-deploy/types'
import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import omit from 'lodash/omit'
import type {
  HardhatDeployFunctionOverloads,
  HardhatUpgradeProxyFunctionOverloads,
  HardhatDeployProxyFunctionOverloads,
  Head,
  HardhatConnectOverloads,
  HardhatExecuteOverloads,
  HardhatExecuteWithNameOverloads,
  HardhatReadOverloads,
  HardhatReadWithNameOverloads,
  HardhatContractsOverloads,
  HardhatGrantRoleIfNotSetOverloads,
} from '@coti-cvi/auto-generated-code'
import type { TransparentUpgradeableProxy } from '@coti-cvi/auto-generated-code/contracts'
import { GasHelper } from '../../../lw-sdk/src/gas-helper'
import type { ProposalFunctionInputType } from 'defender-admin-client/lib/models/proposal'
import type { ParamType } from 'ethers/lib/utils'
import { DEFENDER_API_KEY, DEFENDER_API_SECRET } from '../secrets'
import { HistoryHelper } from './history-helper'
import type { DeployHelperOptions, NamedAccount, DeployHistoryItem } from '../../../lw-sdk/src/contracts-deploy-utils'
import { getChainId, chainIdToBlockchainName } from '../../../lw-sdk/src/util/chain'
import { toHex } from '../../../lw-sdk/src/util/big-number'
import { BlockchainName } from '../../../lw-sdk/src/types/config-types'

export class DeployHelper {
  private static instance: DeployHelper

  isLive: boolean

  toVerify = Boolean(process.env.VERIFY) || false

  chainId: string

  blockchainName: BlockchainName

  gasHelper: GasHelper

  constructor(private readonly hre: HardhatRuntimeEnvironment, options?: DeployHelperOptions) {
    if (!hre.network.config.chainId) {
      throw new Error('ChainId is not set; Please set chainId in your hardhat config')
    }
    this.chainId = hre.network.config.chainId.toString()
    const chainId = getChainId(this.chainId)
    this.blockchainName = chainId ? chainIdToBlockchainName(chainId) : BlockchainName.POLYGON
    this.isLive = hre.network.config.live
    this.gasHelper = new GasHelper(this.chainId, hre.ethers.provider, options)
  }

  private isContract = async (address: string) => {
    if (!this.isLive) {
      return false
    }
    const res = await this.hre.ethers.provider.getCode(address)
    return res !== '0x'
  }

  private isUpgradable = async (contractName: string): Promise<boolean> => {
    const deployment = await this.hre.deployments.getOrNull(contractName)
    if (!deployment) {
      return false
    }
    return true
  }

  public getNamedSigner = async (name: NamedAccount, from?: string | Promise<string>) => {
    const account = !from ? (await this.getNamedAccounts())[name] : typeof from === 'string' ? from : await from
    return this.hre.ethers.getSigner(account)
  }

  public getNamedSigners = async (): Promise<Record<NamedAccount, SignerWithAddress>> => {
    return this.hre.ethers.getNamedSigners()
  }

  public getDeployerSigner = async (from?: string | Promise<string>) => {
    return this.getNamedSigner('deployer', from)
  }

  public getOwnerSigner = async (from?: string | Promise<string>) => {
    return this.getNamedSigner('owner', from)
  }

  public getNamedAccounts = async (): Promise<{ [name in NamedAccount]: string }> => {
    return (await this.hre.getNamedAccounts()) as { [name in NamedAccount]: string }
  }

  public get = async (contractName: HardhatContractsOverloads): Promise<Deployment> => {
    return this.hre.deployments.get(contractName)
  }

  public getAll = async (): Promise<{ [name in HardhatContractsOverloads]?: Deployment }> => {
    return this.hre.deployments.all()
  }

  public getOrNull = async (contractName: string): Promise<Deployment | null> => {
    return this.hre.deployments.getOrNull(contractName)
  }

  public async saveToHistory({
    topic,
    contractName,
    contractAddress,
    contractABI,
    hash,
  }: {
    topic: string
    contractName: string
    contractAddress: string
    contractABI: unknown[]
    hash?: string
  }) {
    if (!this.isLive) {
      return
    }
    if (!hash) {
      console.log('Skipping saving to history because hash is not provided')
      return
    }
    const data: DeployHistoryItem = { topic, contractName, contractAddress, contractABI, hash }
    return HistoryHelper.get().addDeploymentHistory(data)
  }

  public deploy: HardhatDeployFunctionOverloads = async <F extends ContractFactory>(
    contract: string,
    options: Omit<DeployOptions, 'args' | 'contract' | 'from'> & {
      args: Head<F['deploy']>
      from?: string
      contractName?: string
    },
  ): Promise<ReturnType<F['deploy']>> => {
    const signer = await this.getDeployerSigner(options.from)

    const contractName = options.contractName || contract
    const deployed = await this.hre.deployments.deploy(contractName, {
      from: signer.address,
      contract,
      log: true,
      ...(await this.gasHelper.getGas()),
      ...options,
    })
    if (deployed.newlyDeployed) {
      await this.saveToHistory({
        topic: 'Deploy',
        contractName,
        contractAddress: deployed.address,
        contractABI: deployed.abi,
        hash: deployed.transactionHash,
      })
    }
    await this.verify(deployed.address, options.args)

    const contractInterface = new this.hre.ethers.utils.Interface(JSON.stringify(deployed.abi))
    // @ts-ignore
    return new this.hre.ethers.Contract(deployed.address, contractInterface, signer)
  }

  public deployProxy: HardhatDeployProxyFunctionOverloads = async <C extends Contract>(
    contract: string,
    options: Omit<DeployOptions, 'args' | 'contract' | 'from'> & {
      args: Head<C['initialize']>
      from?: string
      adminOwner?: string
      contractName?: string
    },
  ): Promise<C> => {
    const signer = await this.getDeployerSigner(options.from)
    const owner = await this.getOwnerSigner(options.adminOwner)
    const contractName = options.contractName || contract
    const proxy: string | boolean | ProxyOptions | undefined = {
      proxyContract: 'OpenZeppelinTransparentProxy',
      implementationName: `${contractName}_Implementation`,
      execute: { init: { methodName: 'initialize', args: options.args } },
      owner: owner.address,
      ...(typeof options.proxy === 'object' ? options.proxy : {}),
    }
    const currentImpl = await this.hre.deployments.getOrNull(`${contractName}_Implementation`)
    const currentProposal = await this.hre.deployments.getOrNull(`${contractName}_Proposal`)
    if (currentProposal && this.isLive) {
      console.log(`${contractName}_Proposal already deployed. skipping...`)
      return this.attachTo(contract, { overrideSignerAddress: signer.address })
    }
    try {
      const deployed = await this.hre.deployments.deploy(contractName, {
        from: signer.address,
        contract,
        log: true,
        ...(await this.gasHelper.getGas()),
        ...options,
        args: [],
        proxy,
      })
      if (deployed.implementation) {
        await this.verify(deployed.implementation)

        if (deployed.newlyDeployed) {
          await this.saveToHistory({
            topic: 'Deploy proxy',
            contractName,
            contractAddress: deployed.address,
            contractABI: deployed.abi,
            hash: deployed.transactionHash,
          })
        }
      }

      const contractInterface = new this.hre.ethers.utils.Interface(JSON.stringify(deployed.abi))
      return new this.hre.ethers.Contract(deployed.address, contractInterface, signer) as C
    } catch (error) {
      if (
        // error.message.startsWith(`Unknown Signer for account: ${owner.address}`) &&
        (await this.isUpgradable(contractName)) &&
        (await this.isContract(owner.address))
      ) {
        const newImpl = await this.hre.deployments.getOrNull(`${contractName}_Implementation`)
        if (newImpl) {
          await this.hre.deployments.save(`${contractName}_Proposal`, newImpl)
          if (currentImpl && newImpl.address !== currentImpl.address) {
            await this.hre.deployments.save(`${contractName}_Implementation`, currentImpl)
          }
          await this.verify(newImpl.address)
        }
        return this.proposeUpgrade(contractName, omit(options, ['args']))
      }
      throw error
    }
  }

  public upgradeProxy: HardhatUpgradeProxyFunctionOverloads = async <C extends Contract>(
    contract: string,
    options: Omit<DeployOptions, 'args' | 'contract' | 'from'> & {
      from?: string
      adminOwner?: string
      contractName?: string
    },
  ): Promise<C> => {
    const owner = await this.getOwnerSigner(options.adminOwner)
    const contractName = options.contractName || contract
    if ((await this.isUpgradable(contractName)) && (await this.isContract(owner.address))) {
      return this.proposeUpgrade(contractName, options)
    }
    const signer = await this.getDeployerSigner(options.from)
    const proxy: string | boolean | ProxyOptions | undefined = {
      proxyContract: 'OpenZeppelinTransparentProxy',
      implementationName: `${contractName}_Implementation`,
      owner: owner.address,
      ...(typeof options.proxy === 'object' ? options.proxy : {}),
    }
    const deployed = await this.hre.deployments.deploy(contractName, {
      from: signer.address,
      contract,
      log: true,
      ...(await this.gasHelper.getGas()),
      ...options,
      args: [],
      proxy,
    })

    const contractInterface = new this.hre.ethers.utils.Interface(JSON.stringify(deployed.abi))
    return new this.hre.ethers.Contract(deployed.address, contractInterface, signer) as C
  }

  public proposeUpgrade = async <C extends Contract>(
    contract: string,
    options: Omit<DeployOptions, 'args' | 'contract' | 'from'> & {
      from?: string
      adminOwner?: string
      contractName?: string
    },
  ): Promise<C> => {
    const contractName = options.contractName || contract
    if (!this.isUpgradable(contractName)) {
      throw new Error(`Contract ${contractName} doesn't need upgrade. propose should not have been called...`)
    }
    // propose upgrade
    // 1. check if the currect implementation is upgradable (verify abis and storage) TODO: copy from hardhat-deploy or openzeppelin
    const signer = await this.getDeployerSigner(options.from)

    // 2. if it is, deploy the implementation as a proposal using the deployer
    const deployed = await this.hre.deployments.deploy(`${contractName}_Proposal`, {
      from: signer.address,
      contract,
      log: true,
      ...(await this.gasHelper.getGas()),
      ...options,
    })

    const defender = await this.initDefender()
    if (defender) {
      const description = `Upgrade contract implementation to ${deployed.address}\n${HistoryHelper.get().description}`
      // 3. propose the upgrade to the openzeppelin defender
      const proxy = await this.hre.deployments.get(contractName)
      const admin = await this.hre.deployments.get('DefaultProxyAdmin')
      try {
        await defender.client.proposeUpgrade(
          { newImplementation: deployed.address, proxyAdmin: admin.address, description },
          { network: defender.network, address: proxy.address, abi: proxy.abi.toString() },
        )
      } catch (error) {
        console.error(`proposeUpgrade error ${JSON.stringify(error)}`)
        throw error
      }
    } else {
      throw new Error('Defender is not initialized')
    }
    console.log(`Proposal ${contractName} is submitted to defender - new implementation: ${deployed.address}`)

    await this.verify(deployed.address)

    const contractInterface = new this.hre.ethers.utils.Interface(JSON.stringify(deployed.abi))
    return new this.hre.ethers.Contract(deployed.address, contractInterface, signer) as C
  }

  public applyUpgrade = async <C extends Contract>(contractName: string): Promise<C> => {
    const deployed = await this.hre.deployments.get(contractName)
    const proposal = await this.hre.deployments.get(`${contractName}_Proposal`)
    // check if the proposal is accepted (check if the proxy's implementation address is the proposal's address)
    const currentImpl = await this.hre.deployments.read(
      'DefaultProxyAdmin',
      {},
      'getProxyImplementation',
      deployed.address,
    )
    if (currentImpl !== proposal.address) {
      throw new Error(`Proposal ${contractName} is not accepted yet - current: ${currentImpl} != ${proposal.address}`)
    }

    const proxy = await this.hre.deployments.get(`${contractName}_Proxy`)

    // save new implementation
    await this.hre.deployments.save(`${contractName}_Implementation`, proposal)

    // update proxy deployment
    await this.hre.deployments.save(contractName, {
      ...deployed,
      implementation: proposal.address,
      abi: [...proxy.abi.filter(a => a.type !== 'constructor'), ...proposal.abi.filter(a => a.type !== 'constructor')],
    })

    // delete proposal
    await this.hre.deployments.delete(`${contractName}_Proposal`)

    console.log(`Proposal ${contractName} is accepted - new implementation: ${proposal.address}`)

    const proxyContract = (await this.attachTo(contractName)) as TransparentUpgradeableProxy
    const upgradeEvents = await proxyContract.queryFilter(proxyContract.filters.Upgraded())
    const upgradeEvent = upgradeEvents.find(e => e.args.implementation === proposal.address)
    if (upgradeEvent) {
      await this.saveToHistory({
        topic: 'Upgrade',
        contractName,
        contractAddress: proposal.address,
        contractABI: proposal.abi,
        hash: proposal.transactionHash,
      })
    }

    const owner = await this.getOwnerSigner()
    const contractInterface = new this.hre.ethers.utils.Interface(JSON.stringify(deployed.abi))
    return new this.hre.ethers.Contract(deployed.address, contractInterface, owner) as C
  }

  public execute: HardhatExecuteOverloads = async (
    contract: string,
    method: string,
    options: Omit<TxOptions, 'from'> & { from?: string },
    ...args: unknown[]
  ) => {
    return this._execute(contract, method, options, ...args)
  }

  public executeWithName: HardhatExecuteWithNameOverloads = async (
    contract: string,
    contractName: string,
    method: string,
    options: Omit<TxOptions, 'from'> & { from?: string },
    ...args: unknown[]
  ) => {
    const signer = await this.getOwnerSigner(options?.from)
    if (await this.isContract(signer.address)) {
      return this.proposeExecute(contractName, method, { viaSafe: options.from }, ...args)
    }
    return this.hre.deployments.execute(
      contractName,
      { from: signer.address, ...(await this.gasHelper.getGas()), ...options, log: true },
      method,
      ...args,
    )
  }

  private proposeExecute = async (
    contractName: string,
    methodName: string,
    options: { viaSafe?: string },
    ...args: unknown[]
  ) => {
    const viaSafe = options?.viaSafe || (await this.getNamedAccounts()).owner
    const deployment = await this.hre.deployments.get(contractName)
    const artifact = await this.hre.deployments.getArtifact(contractName)
    const contractInterface = new this.hre.ethers.utils.Interface(JSON.stringify(artifact.abi))

    const proposalString = `Propose execute ${contractName}.${methodName}`
    const method = contractInterface.fragments.find(f => f.name === methodName)
    if (!method) {
      throw new Error(`Method ${contractName}.${methodName} not found`)
    }
    const paramTypeConverter = ({ name, type, components, baseType }: ParamType): ProposalFunctionInputType => ({
      name,
      type,
      internalType: baseType,
      components: components?.map(paramTypeConverter),
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const paramConverter = (arg: unknown): any => {
      if (typeof arg === 'string' || typeof arg === 'boolean') {
        return arg
      }
      if (typeof arg === 'number') {
        return arg.toString()
      }
      if (Array.isArray(arg)) {
        return arg.map(paramConverter)
      }
      if (arg instanceof BigNumber) {
        return arg.toString()
      }
      if (typeof arg === 'object' && arg !== null) {
        return Object.values(arg).map(paramConverter)
      }
    }
    const functionInputs = args.map(paramConverter)
    console.log(`${proposalString}(${JSON.stringify(functionInputs)})`)
    const inputs: ProposalFunctionInputType[] = method.inputs.map(paramTypeConverter)
    const defender = await this.initDefender()
    if (defender) {
      try {
        await defender.client.createProposal({
          contract: {
            network: defender.network,
            address: deployment.address,
            name: contractName,
            abi: JSON.stringify(artifact.abi),
          },
          title: proposalString,
          description: `${proposalString}(${JSON.stringify(functionInputs)})`,
          type: 'custom',
          via: viaSafe,
          viaType: 'Gnosis Safe',
          functionInputs,
          functionInterface: {
            name: methodName,
            inputs,
          },
        })
      } catch (error) {
        console.error(error)
        throw new Error("Can't propose execute")
      }
    } else {
      throw new Error('Defender is not initialized')
    }
  }

  public read: HardhatReadOverloads = async (
    contract: string,
    method: string,
    options?: CallOptions,
    ...args: unknown[]
  ) => {
    return this._read(contract, method, options, ...args)
  }

  public readWithName: HardhatReadWithNameOverloads = async (
    contract: string,
    contractName: string,
    method: string,
    options?: CallOptions,
    ...args: unknown[]
  ) => {
    if (options) {
      return this.hre.deployments.read(contractName, options, method, ...args)
    }
    return this.hre.deployments.read(contractName, method, ...args)
  }

  public attach: HardhatConnectOverloads = async <C extends Contract>(
    contractName: string,
    options?: { overrideSignerAddress?: string; overrideContractAddress?: string },
  ): Promise<C> => {
    return this.attachTo(contractName, options)
  }

  public attachTo = async <C extends Contract>(
    contractName: string,
    options?: { overrideSignerAddress?: string; overrideContractAddress?: string },
  ): Promise<C> => {
    const signer = await this.getOwnerSigner(options?.overrideSignerAddress)
    const { abi } = options?.overrideContractAddress
      ? await this.hre.deployments.getArtifact(contractName)
      : await this.hre.deployments.get(contractName)
    const contractAddress = options?.overrideContractAddress || (await this.hre.deployments.get(contractName)).address
    const contractInterface = new this.hre.ethers.utils.Interface(JSON.stringify(abi))
    return new this.hre.ethers.Contract(contractAddress, contractInterface, signer) as C
  }

  public connect = <C extends Contract>(
    address: string,
    abi: unknown[],
    signerOrProvider: Signer | Provider = this.hre.ethers.provider,
  ): C => {
    const contractInterface = new this.hre.ethers.utils.Interface(JSON.stringify(abi))
    return new this.hre.ethers.Contract(address, contractInterface, signerOrProvider) as C
  }

  public set = async (setter: {
    condition: () => Promise<boolean> | boolean
    execute: () => Promise<void> | void
    options?: { throwOnExeption?: boolean }
  }) => {
    let toSet = true
    try {
      toSet = await setter.condition()
    } catch (error) {
      if (setter.options?.throwOnExeption) {
        throw error
      }
    }
    if (toSet) {
      await setter.execute()
    }
  }

  public grantRoleIfNotSet: HardhatGrantRoleIfNotSetOverloads = async (
    contract: string,
    roleAddress: string,
    role: string,
  ) => {
    if (!(await this._read(contract, 'hasRole', {}, role, roleAddress))) {
      await this._execute(contract, 'grantRole', {}, role, roleAddress)
    }
  }

  public verifyContract = async (contractName: HardhatContractsOverloads, contractPath?: string) => {
    const { address, args, implementation } = await this.get(contractName)
    return implementation
      ? this.verify(implementation, undefined, contractPath)
      : this.verify(address, args, contractPath)
  }

  public advanceTime = async (seconds: number): Promise<number> => {
    if (this.hre.network.live) {
      return 0
    }
    const { timestamp: beforeTimestamp } = await this.hre.ethers.provider.getBlock('latest')
    await this.hre.ethers.provider.send('hardhat_mine', [toHex(2, 0), toHex(seconds, 0)])
    const { timestamp: afterTimestamp } = await this.hre.ethers.provider.getBlock('latest')
    return afterTimestamp - beforeTimestamp
  }

  private _execute = async (
    contract: string,
    method: string,
    options: Omit<TxOptions, 'from'> & { from?: string },
    ...args: unknown[]
  ) => {
    let from = options?.from
    if (!from) {
      try {
        from = (await this.attachTo(contract)).owner()
      } catch (error) {}
    }
    const signer = await this.getOwnerSigner(from)
    if (await this.isContract(signer.address)) {
      return this.proposeExecute(contract, method, { viaSafe: options.from }, ...args)
    }
    return this.hre.deployments.execute(
      contract,
      { from: signer.address, ...(await this.gasHelper.getGas()), ...options, log: true },
      method,
      ...args,
    )
  }

  private _read = async (contract: string, method: string, options?: CallOptions, ...args: unknown[]) => {
    if (options) {
      return this.hre.deployments.read(contract, options, method, ...args)
    }

    return this.hre.deployments.read(contract, method, ...args)
  }

  private initDefender = async (): Promise<{ client: AdminClient; network: Network } | undefined> => {
    const network = fromChainId(+this.chainId)
    if (!network || !isValidNetwork(network)) {
      return undefined
    }

    if (!DEFENDER_API_KEY || !DEFENDER_API_SECRET) {
      return undefined
    }

    const client = new AdminClient({ apiKey: DEFENDER_API_KEY, apiSecret: DEFENDER_API_SECRET })
    return { client, network }
  }

  private verify = async (contractAddress: string, args?: unknown[], contract?: string) => {
    try {
      if (this.isLive && this.toVerify) {
        await this.hre.run('verify:verify', { address: contractAddress, constructorArguments: args, contract })
      }
    } catch (error) {
      console.error(`verify failed: ${error}`)
    }
  }

  public static get = (hre?: HardhatRuntimeEnvironment, options?: DeployHelperOptions): DeployHelper => {
    if (!DeployHelper.instance) {
      if (!hre) {
        throw new Error('DeployHelper requires an hre (HardhatRuntimeEnvironment) instance')
      }
      return (DeployHelper.instance = new DeployHelper(hre, options))
    }
    return DeployHelper.instance
  }
}
