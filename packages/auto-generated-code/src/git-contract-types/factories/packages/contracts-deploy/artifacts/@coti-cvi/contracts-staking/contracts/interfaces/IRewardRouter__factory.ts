/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IRewardRouter,
  IRewardRouterInterface,
} from "../../../../../../../../packages/contracts-deploy/artifacts/@coti-cvi/contracts-staking/contracts/interfaces/IRewardRouter";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "tokenName",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "StakeToken",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "tokenName",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "UnstakeToken",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "_accounts",
        type: "address[]",
      },
      {
        internalType: "enum StakedTokenName",
        name: "_tokenName",
        type: "uint8",
      },
    ],
    name: "batchCompoundForAccounts",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum StakedTokenName",
        name: "_tokenName",
        type: "uint8",
      },
      {
        internalType: "address[]",
        name: "_accounts",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "_amounts",
        type: "uint256[]",
      },
    ],
    name: "batchStakeForAccount",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum StakedTokenName",
        name: "_token",
        type: "uint8",
      },
    ],
    name: "claim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum StakedTokenName",
        name: "_tokenName",
        type: "uint8",
      },
    ],
    name: "compound",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_account",
        type: "address",
      },
      {
        internalType: "enum StakedTokenName",
        name: "_tokenName",
        type: "uint8",
      },
    ],
    name: "compoundForAccount",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum StakedTokenName",
        name: "_token",
        type: "uint8",
      },
    ],
    name: "rewardTrackers",
    outputs: [
      {
        internalType: "contract IRewardTracker",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum StakedTokenName[]",
        name: "_tokenNames",
        type: "uint8[]",
      },
      {
        internalType: "contract IRewardTracker[]",
        name: "_rewardTrackers",
        type: "address[]",
      },
    ],
    name: "setRewardTrackers",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum StakedTokenName[]",
        name: "_tokenNames",
        type: "uint8[]",
      },
      {
        internalType: "address[]",
        name: "_tokens",
        type: "address[]",
      },
    ],
    name: "setTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum StakedTokenName[]",
        name: "_tokenNames",
        type: "uint8[]",
      },
      {
        internalType: "contract IVester[]",
        name: "_vesters",
        type: "address[]",
      },
    ],
    name: "setVesters",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum StakedTokenName",
        name: "_token",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "stake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum StakedTokenName",
        name: "_token",
        type: "uint8",
      },
      {
        internalType: "address",
        name: "_account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "stakeForAccount",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum StakedTokenName",
        name: "_token",
        type: "uint8",
      },
    ],
    name: "tokens",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum StakedTokenName",
        name: "_token",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "unstake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum StakedTokenName",
        name: "_token",
        type: "uint8",
      },
    ],
    name: "vesters",
    outputs: [
      {
        internalType: "contract IVester",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export class IRewardRouter__factory {
  static readonly abi = _abi;
  static createInterface(): IRewardRouterInterface {
    return new utils.Interface(_abi) as IRewardRouterInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IRewardRouter {
    return new Contract(address, _abi, signerOrProvider) as IRewardRouter;
  }
}
