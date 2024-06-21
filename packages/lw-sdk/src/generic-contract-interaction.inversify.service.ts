import { inject, injectable, optional } from 'inversify'
import type { JsonRpcProvider } from '@ethersproject/providers'
import type { SignerInversifyService } from './signer.inversify.service'
import type { Contracts } from './types'
import { BlockchainName, type ChainId, CHAIN_IDS_INFO } from './types'
import { Contract, utils } from 'ethers'

const multicallAddresses: { [chain in BlockchainName]: string } = {
  [BlockchainName.ARBITRUM]: '0x842eC2c7D803033Edf55E478F461FC547Bc54EB2',
  [BlockchainName.POLYGON]: '0x275617327c958bD06b5D6b871E7f491D76113dd8',
  [BlockchainName.ETHEREUM]: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
}

const multicallABI = [
  {
    inputs: [
      { internalType: 'bool', name: 'requireSuccess', type: 'bool' },
      {
        components: [
          { internalType: 'address', name: 'target', type: 'address' },
          { internalType: 'bytes', name: 'callData', type: 'bytes' },
        ],
        internalType: 'struct Multicall2.Call[]',
        name: 'calls',
        type: 'tuple[]',
      },
    ],
    name: 'tryAggregate',
    outputs: [
      {
        components: [
          { internalType: 'bool', name: 'success', type: 'bool' },
          { internalType: 'bytes', name: 'returnData', type: 'bytes' },
        ],
        internalType: 'struct Multicall2.Result[]',
        name: 'returnData',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]

type MulticallData = [contract: Contract, method: string, params: unknown[]]
type Call = { target: string; callData: string }
type Result = { success: boolean; returnData: string }

@injectable()
export class GenericContractInteractionInversifyService {
  readonly multicall: Contract

  constructor(
    @inject('ChainId') public readonly chainId: ChainId,
    @inject('EthersJsonRpcBatchProvider') public readonly provider: JsonRpcProvider,
    @inject('SingleDeploymentsFile') private readonly singleDeploymentsFile: Contracts,
    @inject('SignerInversifyService') @optional() public readonly signerService?: SignerInversifyService,
  ) {
    const multicallAddress = multicallAddresses[CHAIN_IDS_INFO[this.chainId].blockchainName]
    this.multicall = this.getContract(multicallAddress, multicallABI)
  }

  private signerOrProvider() {
    return this.signerService ? this.signerService.signer : this.provider
  }

  public getContract(address: string, abi: unknown[] | string) {
    const contractInterface = new utils.Interface(typeof abi === 'string' ? abi : JSON.stringify(abi))
    return new Contract(address, contractInterface, this.signerOrProvider())
  }

  public test = () => {
    const { address, abi } = this.singleDeploymentsFile.CVIUSDCPlatform
    const contract = this.getContract(address, abi)
    const functions = Object.entries(contract.interface.functions).filter(
      ([name, f]) => f.stateMutability === 'view' && f.inputs.length === 0,
    )
    return this.multiCall(functions.map(([method, f]) => [contract, method, []]))
  }

  public async multiCall(contracts: MulticallData[]) {
    const calls: Call[] = contracts.map(this.toCall)
    const results: Result[] = await this.multicall.callStatic.tryAggregate(false, calls)
    return results.map((r, i) => this.toResult(contracts[i], r))
  }

  private toCall([contract, method, params]: MulticallData): Call {
    return { target: contract.address, callData: contract.interface.encodeFunctionData(method, params) }
  }

  private toResult([contract, method, _]: MulticallData, result: Result): utils.Result {
    return contract.interface.decodeFunctionResult(method, result.returnData)
  }

  public getFunctions = (iface: utils.Interface, ...mutability: ('pure' | 'view' | 'payable' | 'nonpayable')[]) => {
    return Object.entries(iface.functions).filter(([name, f]) => (mutability as string[]).includes(f.stateMutability))
  }

  public getContracts = () => {
    return Object.entries(this.singleDeploymentsFile).map(([name, { address, abi }]): [string, Contract] => [
      name,
      this.getContract(address, abi),
    ])
  }
}
