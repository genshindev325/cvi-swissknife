/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IFeesCollector,
  IFeesCollectorInterface,
} from "../../../../../../../../packages/contracts-deploy/artifacts/@coti-cvi/contracts-cvi/contracts/interfaces/IFeesCollector";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "contract IERC20",
        name: "token",
        type: "address",
      },
    ],
    name: "sendProfit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class IFeesCollector__factory {
  static readonly abi = _abi;
  static createInterface(): IFeesCollectorInterface {
    return new utils.Interface(_abi) as IFeesCollectorInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IFeesCollector {
    return new Contract(address, _abi, signerOrProvider) as IFeesCollector;
  }
}
