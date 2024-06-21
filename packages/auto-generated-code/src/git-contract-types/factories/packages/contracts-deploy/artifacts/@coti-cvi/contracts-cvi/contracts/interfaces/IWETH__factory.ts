/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IWETH,
  IWETHInterface,
} from "../../../../../../../../packages/contracts-deploy/artifacts/@coti-cvi/contracts-cvi/contracts/interfaces/IWETH";

const _abi = [
  {
    inputs: [],
    name: "deposit",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class IWETH__factory {
  static readonly abi = _abi;
  static createInterface(): IWETHInterface {
    return new utils.Interface(_abi) as IWETHInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): IWETH {
    return new Contract(address, _abi, signerOrProvider) as IWETH;
  }
}
