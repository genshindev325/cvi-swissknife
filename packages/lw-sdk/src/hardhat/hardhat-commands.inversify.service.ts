import { inject, injectable } from 'inversify'
import type { JsonRpcProvider } from '@ethersproject/providers'
import type { BigNumber } from 'ethers'
import { toHex } from '../util'
import type { ChainId } from '../types'
import { CHAIN_IDS_INFO } from '../types'

@injectable()
export class HardhatCommandsInversifyService {
  constructor(@inject('EthersJsonRpcBatchProvider') private readonly ethersJsonRpcBatchProvider: JsonRpcProvider) {}

  public setTimestampCommand(newEpochSeconds: number): Promise<boolean> {
    return this.ethersJsonRpcBatchProvider.send('evm_mine', [newEpochSeconds])
  }

  public resetForkCommand(chainId: ChainId, blockNumber?: number): Promise<boolean> {
    const chainInfo = CHAIN_IDS_INFO[chainId]
    const data = { forking: { jsonRpcUrl: chainInfo.deployAndForkRpcUrl, blockNumber } }
    return this.ethersJsonRpcBatchProvider.send('hardhat_reset', [data])
  }

  public mineCommand(intervalBetweenBlocks: number, blocksToMine = 2): Promise<boolean> {
    return this.ethersJsonRpcBatchProvider.send('hardhat_mine', [
      toHex(blocksToMine, 0),
      toHex(intervalBetweenBlocks, 0),
    ])
  }

  public setLoggingCommand(enable: boolean): Promise<boolean> {
    return this.ethersJsonRpcBatchProvider.send('hardhat_setLoggingEnabled', [enable])
  }

  public setMinGasPriceCommand(minGas: BigNumber): Promise<boolean> {
    return this.ethersJsonRpcBatchProvider.send('hardhat_setMinGasPrice', [minGas])
  }

  public setAutomineCommand(enabled: boolean): Promise<boolean> {
    return this.ethersJsonRpcBatchProvider.send('evm_setAutomine', [enabled])
  }

  public setIntervalMiningCommand(msInterval: number): Promise<boolean> {
    return this.ethersJsonRpcBatchProvider.send('evm_setIntervalMining', [msInterval])
  }

  public getAutomineCommand(): Promise<boolean> {
    return this.ethersJsonRpcBatchProvider.send('hardhat_getAutomine', [])
  }

  public setBalance(account: string, amount: number): Promise<boolean> {
    return this.ethersJsonRpcBatchProvider.send('hardhat_setBalance', [account, toHex(amount, 18)])
  }

  public setNonceCommand(account: string, newNonce: number): Promise<boolean> {
    return this.ethersJsonRpcBatchProvider.send('hardhat_setNonce', [account, toHex(newNonce, 0)])
  }

  public impersonateAccountCommand(account: string): Promise<boolean> {
    return this.ethersJsonRpcBatchProvider.send('hardhat_impersonateAccount', [account])
  }

  public stopImpersonatingAccountCommand(account: string): Promise<boolean> {
    return this.ethersJsonRpcBatchProvider.send('hardhat_stopImpersonatingAccount', [account])
  }

  public createSnapshot(): Promise<string> {
    return this.ethersJsonRpcBatchProvider.send('evm_snapshot', [])
  }

  public revertToSnapshot(snapshotId: string): Promise<boolean> {
    return this.ethersJsonRpcBatchProvider.send('evm_revert', [snapshotId])
  }
}
