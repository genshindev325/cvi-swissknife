/* eslint-disable @typescript-eslint/no-explicit-any */
import { fromBN } from '@coti-cvi/cvi-sdk'
import { ACTIVE_PLATFORMS } from '../utils/secrets'
import { Fetcher } from './fetcher'

// const COTI_BRIDGE_ADDRESS = '0xE0E42c70880D57230FB843DB5eba6800533E91Ae'
// const OLYMPUS_PRO_ARBITRUM_ADDRESS = '0x3669CE3DAfff6E8bea9AD83A0dD9435c588a0DE0'
// const OLYMPUS_PRO_POLYGON_ADDRESS = '0xAF19a3f7Ca4052D6381Ab2CE4Ee0528b3C1C8800'
const ETH_PROXY_MAINTAINER_ADDRESS = '0xD7F5313E8A9F78F790C7cf66d5071ECaAB36BBaa'
const ORACLE_UPDATER_ADDRESS = '0xc72498b74cd25c7c71bfe6095e79eef844c3a377'
const KEEPER_REGISTERY_ADDRESS = '0x7b3EC232b08BD7b4b3305BE0C044D907B2DF960B'
const KEEPER_REGISTERY_ABI = [
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
    ],
    name: 'getMinBalanceForUpkeep',
    outputs: [
      {
        internalType: 'uint96',
        name: 'minBalance',
        type: 'uint96',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
    ],
    name: 'getUpkeep',
    outputs: [
      {
        internalType: 'address',
        name: 'target',
        type: 'address',
      },
      {
        internalType: 'uint32',
        name: 'executeGas',
        type: 'uint32',
      },
      {
        internalType: 'bytes',
        name: 'checkData',
        type: 'bytes',
      },
      {
        internalType: 'uint96',
        name: 'balance',
        type: 'uint96',
      },
      {
        internalType: 'address',
        name: 'lastKeeper',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'admin',
        type: 'address',
      },
      {
        internalType: 'uint64',
        name: 'maxValidBlocknumber',
        type: 'uint64',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]
// const KEEPER_ID = 55
const KEEPER_MIN_ADDITION = 5
const GOVI_THRESHOLD = 1000
const STAKING_VAULT_GOVI_THRESHOLD = 10000
const OLYMPUS_GOVI_THRESHOLD = 16000
const BALANCE_FOR_GAS_THRESHOLD = 0.1

export class BalanceFetcher extends Fetcher {
  async fetch(): Promise<any> {
    const platforms = Object.values(this.w3.platforms).filter(p => ACTIVE_PLATFORMS.includes(p.id))
    const rewards = platforms.map(p => p.rewards)
    const positionRewardsBalances = await this.asyncCall(rewards, r =>
      this.getBalanceInfo(r.id, r.address, GOVI_THRESHOLD, r.rewardToken.id),
    )

    let promises: Promise<any>[] = []
    if (this.chain === 'Polygon') {
      promises = [
        this.getBalanceInfo('OracleUpdater', ORACLE_UPDATER_ADDRESS, BALANCE_FOR_GAS_THRESHOLD),
        this.contractBalanceInfo('StakingVault', STAKING_VAULT_GOVI_THRESHOLD, 'GOVI'),
      ]
    } else if (this.chain === 'Ethereum') {
      promises = [this.getBalanceInfo('ETHStakingProxy', ETH_PROXY_MAINTAINER_ADDRESS, BALANCE_FOR_GAS_THRESHOLD)]
    } else if (this.chain === 'Arbitrum') {
      promises = [this.contractBalanceInfo('StakingVault', STAKING_VAULT_GOVI_THRESHOLD, 'GOVI')]
    }

    return [...positionRewardsBalances, ...(await Promise.all(promises))]
  }

  async contractBalanceInfo(contractId: string, thresholdAmount: number, tokenSymbol?: string, address?: string) {
    const token = tokenSymbol ? this.w3.getToken(tokenSymbol) : this.w3.getNativeToken()
    address = address || this.w3.getContract(contractId).options.address
    const balance = token.fromAmount(await token.balanceOf(address))
    return { id: contractId, balance, min: thresholdAmount, symbol: token.id, decimals: token.decimals }
  }

  async keepersBalanceInfo(id: string, keeperId: number) {
    const contract = this.w3.getContractWithABI(KEEPER_REGISTERY_ABI, KEEPER_REGISTERY_ADDRESS)
    const [minBalance, { balance }] = await Promise.all([
      this.w3.call(contract, 'getMinBalanceForUpkeep', [keeperId]),
      this.w3.call(contract, 'getUpkeep', [keeperId]),
    ])
    return {
      id: `${id}-${keeperId}`,
      balance: fromBN(balance, 18),
      min: fromBN(minBalance, 18) + KEEPER_MIN_ADDITION,
      symbol: 'LINK',
      decimals: 18,
    }
  }

  async getBalanceInfo(id: string, address: string, min: number, symbol?: string) {
    const token = symbol ? this.w3.getToken(symbol) : this.w3.getNativeToken()
    const balance = token.fromAmount(await token.balanceOf(address))
    return { id, balance, min, symbol: token.id, decimals: token.decimals }
  }
}
