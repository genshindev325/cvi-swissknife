/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  ICVIOracle,
  ICVIOracleInterface,
} from "../../../../../../../../packages/contracts-deploy/artifacts/@coti-cvi/contracts-cvi/contracts/interfaces/ICVIOracle";

const _abi = [
  {
    inputs: [],
    name: "getCVILatestRoundData",
    outputs: [
      {
        internalType: "uint32",
        name: "cviValue",
        type: "uint32",
      },
      {
        internalType: "uint80",
        name: "cviRoundId",
        type: "uint80",
      },
      {
        internalType: "uint256",
        name: "cviTimestamp",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint80",
        name: "roundId",
        type: "uint80",
      },
    ],
    name: "getCVIRoundData",
    outputs: [
      {
        internalType: "uint32",
        name: "cviValue",
        type: "uint32",
      },
      {
        internalType: "uint256",
        name: "cviTimestamp",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "newDeviationCheck",
        type: "bool",
      },
    ],
    name: "setDeviationCheck",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint16",
        name: "newMaxDeviation",
        type: "uint16",
      },
    ],
    name: "setMaxDeviation",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class ICVIOracle__factory {
  static readonly abi = _abi;
  static createInterface(): ICVIOracleInterface {
    return new utils.Interface(_abi) as ICVIOracleInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ICVIOracle {
    return new Contract(address, _abi, signerOrProvider) as ICVIOracle;
  }
}
