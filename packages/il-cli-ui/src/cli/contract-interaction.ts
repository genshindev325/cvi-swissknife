import type { FunctionFragment, ParamType } from '@ethersproject/abi'
import type { Contract } from 'ethers'
import type { InverifyContext } from '../context/inversify-context'
import type { MenuItem } from '../types'
import type { Wrappers } from './wrappers'

export class ContractInteraction {
  loadedContracts: Record<string, Contract> = {}

  workingContract: Contract | undefined = undefined

  public readonly ContractInteractionMenu: { [key: string]: MenuItem } = {
    t: { description: 'test', action: () => this.test() },
    u: { description: 'use contract', action: () => this.use() },
    l: { description: 'load contract', action: () => this.load() },
    r: { description: `read functions`, action: () => this.read() },
    w: { description: `write functions`, action: () => this.write() },
    c: { description: `call static functions`, action: () => this.static() },
  }

  constructor(private readonly inverifyContext: Required<InverifyContext>, private readonly wrappers: Wrappers) {
    const contracts = this.inverifyContext.genericContractInteractionInversifyService.getContracts()
    contracts.map(([name, contract]) => Object.assign(this.loadedContracts, { [name]: contract }))
    const contractName = localStorage.getItem('workingContract')
    if (contractName && contractName in this.loadedContracts) {
      this.workingContract = this.loadedContracts[contractName]
    }
  }

  public async test() {
    const functions = await this.inverifyContext.genericContractInteractionInversifyService.test()
    this.wrappers.writeOutput(`function results: ${functions.map(f => JSON.stringify(f)).join('\n')}`)
  }

  public async load() {
    const service = this.inverifyContext.genericContractInteractionInversifyService
    const name = await this.wrappers.question('enter name of a contract')
    const address = await this.wrappers.question('enter address of a contract')
    const abi = await this.wrappers.question('enter abi of a contract')
    this.workingContract = service.getContract(address, abi)
    Object.assign(this.loadedContracts, { [name]: this.workingContract })
  }

  public async use() {
    const printer = ([name, { address }]: [string, { address: string }]) => `${name} - ${address}`
    const [name, contract] = await this.wrappers.selectItem('contract', Object.entries(this.loadedContracts), printer)
    localStorage.setItem('workingContract', name)
    return (this.workingContract = contract)
  }

  public async write() {
    const service = this.inverifyContext.genericContractInteractionInversifyService
    const { signer } = this.inverifyContext.signerInversifyService
    const contract = this.workingContract || (await this.use())
    const functions = service.getFunctions(contract.interface, 'nonpayable')
    const [name, func] = await this.wrappers.selectItem(`function [${contract.address}]`, functions, ([n, _]) => n)
    this.wrappers.writeOutput(`selected function: ${name}`)
    const params = await this.inputParams(func)
    this.wrappers.writeOutput(`params: ${JSON.stringify(params)}`)
    const res = await contract.connect(signer).functions[func.name](...params)
    this.wrappers.writeOutput(`function output: ${this.outputParams(func, res)}`)
  }

  public async static() {
    const service = this.inverifyContext.genericContractInteractionInversifyService
    const contract = this.workingContract || (await this.use())
    const functions = service.getFunctions(contract.interface, 'nonpayable')
    const [name, func] = await this.wrappers.selectItem(`function [${contract.address}]`, functions, ([n, _]) => n)
    this.wrappers.writeOutput(`selected function: ${name}`)
    const params = await this.inputParams(func)
    this.wrappers.writeOutput(`params: ${JSON.stringify(params)}`)
    const res = await contract.callStatic[func.name](...params)
    this.wrappers.writeOutput(`function output: ${this.outputParams(func, res)}`)
  }

  public async read() {
    const service = this.inverifyContext.genericContractInteractionInversifyService
    const contract = this.workingContract || (await this.use())
    const functions = service.getFunctions(contract.interface, 'view', 'pure')
    const [name, func] = await this.wrappers.selectItem(`function [${contract.address}]`, functions, ([n, _]) => n)
    this.wrappers.writeOutput(`selected function: ${name}`)
    const params = await this.inputParams(func)
    this.wrappers.writeOutput(`params: ${JSON.stringify(params)}`)
    const res = await contract.functions[func.name](...params)
    this.wrappers.writeOutput(`function output: ${this.outputParams(func, res)}`)
  }

  private async inputParams(func: FunctionFragment) {
    const params: (string | string[])[] = []
    for await (const [i, f] of func.inputs.entries()) {
      const res = await this.input(f, i + 1, func.inputs.length)
      const input = f.baseType === 'array' ? res.split(',') : res
      params.push(input)
    }
    return params
  }

  private async input(paramType: ParamType, index: number, length: number): Promise<string> {
    if (paramType.baseType === 'address') {
      return this.wrappers.selectAccount(`${paramType.name}`)
    }
    return this.wrappers.question(`[${index}/${length}] ${paramType.format('sighash')}`)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private outputParams(func: FunctionFragment, res: any[]) {
    return func.outputs?.map((p, i) => this.output(p, res[i]))
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private output(paramType: ParamType, res: any): string {
    const name = paramType.name === null ? '' : `${paramType.name} `
    const str = paramType.baseType.includes('int') ? res.toString() : JSON.stringify(res)
    return `${name}${str}`
  }
}
