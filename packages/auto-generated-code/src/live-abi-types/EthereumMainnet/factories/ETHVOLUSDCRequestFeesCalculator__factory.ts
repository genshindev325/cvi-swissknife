/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type {
  ETHVOLUSDCRequestFeesCalculator,
  ETHVOLUSDCRequestFeesCalculatorInterface,
} from "../ETHVOLUSDCRequestFeesCalculator";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [],
    name: "MAX_FEE_PERCENTAGE",
    outputs: [
      {
        internalType: "uint168",
        name: "",
        type: "uint168",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "afterTargetMaxTime",
    outputs: [
      {
        internalType: "uint32",
        name: "",
        type: "uint32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "afterTargetMaxTimePenaltyFeePercent",
    outputs: [
      {
        internalType: "uint16",
        name: "",
        type: "uint16",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "afterTargetMidTime",
    outputs: [
      {
        internalType: "uint32",
        name: "",
        type: "uint32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "afterTargetMidTimePenaltyFeePercent",
    outputs: [
      {
        internalType: "uint16",
        name: "",
        type: "uint16",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "beforeTargetTimeMaxPenaltyFeePercent",
    outputs: [
      {
        internalType: "uint16",
        name: "",
        type: "uint16",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokensLeftAmount",
        type: "uint256",
      },
    ],
    name: "calculateFindersFee",
    outputs: [
      {
        internalType: "uint256",
        name: "findersFeeAmount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_timeDelay",
        type: "uint256",
      },
    ],
    name: "calculateTimeDelayFee",
    outputs: [
      {
        internalType: "uint16",
        name: "feePercentage",
        type: "uint16",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint8",
            name: "requestType",
            type: "uint8",
          },
          {
            internalType: "uint168",
            name: "tokenAmount",
            type: "uint168",
          },
          {
            internalType: "uint16",
            name: "timeDelayRequestFeesPercent",
            type: "uint16",
          },
          {
            internalType: "uint16",
            name: "maxRequestFeesPercent",
            type: "uint16",
          },
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "requestTimestamp",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "targetTimestamp",
            type: "uint32",
          },
        ],
        internalType: "struct IVolatilityToken.Request",
        name: "_request",
        type: "tuple",
      },
    ],
    name: "calculateTimePenaltyFee",
    outputs: [
      {
        internalType: "uint16",
        name: "feePercentage",
        type: "uint16",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "findersFeePercent",
    outputs: [
      {
        internalType: "uint16",
        name: "",
        type: "uint16",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getMaxFees",
    outputs: [
      {
        internalType: "uint16",
        name: "maxFeesPercent",
        type: "uint16",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint8",
            name: "requestType",
            type: "uint8",
          },
          {
            internalType: "uint168",
            name: "tokenAmount",
            type: "uint168",
          },
          {
            internalType: "uint16",
            name: "timeDelayRequestFeesPercent",
            type: "uint16",
          },
          {
            internalType: "uint16",
            name: "maxRequestFeesPercent",
            type: "uint16",
          },
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "requestTimestamp",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "targetTimestamp",
            type: "uint32",
          },
        ],
        internalType: "struct IVolatilityToken.Request",
        name: "_request",
        type: "tuple",
      },
    ],
    name: "isLiquidable",
    outputs: [
      {
        internalType: "bool",
        name: "liquidable",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "maxTimeDelayFeePercent",
    outputs: [
      {
        internalType: "uint16",
        name: "",
        type: "uint16",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "maxTimeWindow",
    outputs: [
      {
        internalType: "uint32",
        name: "",
        type: "uint32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "minTimeDelayFeePercent",
    outputs: [
      {
        internalType: "uint16",
        name: "",
        type: "uint16",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "minTimeWindow",
    outputs: [
      {
        internalType: "uint32",
        name: "",
        type: "uint32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "minWaitTime",
    outputs: [
      {
        internalType: "uint32",
        name: "",
        type: "uint32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
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
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint16",
        name: "_findersFeePercent",
        type: "uint16",
      },
    ],
    name: "setFindersFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "_minWaitTime",
        type: "uint32",
      },
    ],
    name: "setMinWaitTime",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint16",
        name: "_minTimeDelayFeePercent",
        type: "uint16",
      },
      {
        internalType: "uint16",
        name: "_maxTimeDelayFeePercent",
        type: "uint16",
      },
    ],
    name: "setTimeDelayFeesParameters",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint16",
        name: "_beforeTargetTimeMaxPenaltyFeePercent",
        type: "uint16",
      },
      {
        internalType: "uint32",
        name: "_afterTargetMidTime",
        type: "uint32",
      },
      {
        internalType: "uint16",
        name: "_afterTargetMidTimePenaltyFeePercent",
        type: "uint16",
      },
      {
        internalType: "uint32",
        name: "_afterTargetMaxTime",
        type: "uint32",
      },
      {
        internalType: "uint16",
        name: "_afterTargetMaxTimePenaltyFeePercent",
        type: "uint16",
      },
    ],
    name: "setTimePenaltyFeeParameters",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "_minTimeWindow",
        type: "uint32",
      },
      {
        internalType: "uint32",
        name: "_maxTimeWindow",
        type: "uint32",
      },
    ],
    name: "setTimeWindow",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class ETHVOLUSDCRequestFeesCalculator__factory {
  static readonly abi = _abi;
  static createInterface(): ETHVOLUSDCRequestFeesCalculatorInterface {
    return new utils.Interface(
      _abi
    ) as ETHVOLUSDCRequestFeesCalculatorInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ETHVOLUSDCRequestFeesCalculator {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as ETHVOLUSDCRequestFeesCalculator;
  }
}
