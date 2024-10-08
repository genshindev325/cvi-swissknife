/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  Treasury,
  TreasuryInterface,
} from "../../../../../../../../packages/contracts-deploy/artifacts/@coti-cvi/contracts-cvi/contracts/staking/Treasury";

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
    name: "extract",
    outputs: [],
    stateMutability: "nonpayable",
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
  {
    stateMutability: "payable",
    type: "receive",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b5061001a3361001f565b61006f565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6102dc8061007e6000396000f3fe6080604052600436106100435760003560e01c80631e83cdab1461004f578063715018a6146100665780638da5cb5b1461007b578063f2fde38b146100a757600080fd5b3661004a57005b600080fd5b34801561005b57600080fd5b506100646100c7565b005b34801561007257600080fd5b50610064610129565b34801561008757600080fd5b50600054604080516001600160a01b039092168252519081900360200190f35b3480156100b357600080fd5b506100646100c2366004610243565b61015f565b6000546001600160a01b031633146100fa5760405162461bcd60e51b81526004016100f190610271565b60405180910390fd5b60405133904780156108fc02916000818181858888f19350505050158015610126573d6000803e3d6000fd5b50565b6000546001600160a01b031633146101535760405162461bcd60e51b81526004016100f190610271565b61015d60006101f3565b565b6000546001600160a01b031633146101895760405162461bcd60e51b81526004016100f190610271565b6001600160a01b0381166101ee5760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b60648201526084016100f1565b610126815b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b600060208284031215610254578081fd5b81356001600160a01b038116811461026a578182fd5b9392505050565b6020808252818101527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260408201526060019056fea2646970667358221220d3f57d863ef5805ab3abf6dcb5df601ec94fa0968883dc116c036f386e747ae864736f6c63430008040033";

type TreasuryConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: TreasuryConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Treasury__factory extends ContractFactory {
  constructor(...args: TreasuryConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<Treasury> {
    return super.deploy(overrides || {}) as Promise<Treasury>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): Treasury {
    return super.attach(address) as Treasury;
  }
  override connect(signer: Signer): Treasury__factory {
    return super.connect(signer) as Treasury__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): TreasuryInterface {
    return new utils.Interface(_abi) as TreasuryInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Treasury {
    return new Contract(address, _abi, signerOrProvider) as Treasury;
  }
}
