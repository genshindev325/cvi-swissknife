/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Signer,
  utils,
  Contract,
  ContractFactory,
  BigNumberish,
  Overrides,
} from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  CVIFakeFeedOracle,
  CVIFakeFeedOracleInterface,
} from "../../../../../../../packages/contracts-deploy/artifacts/contracts/oracle/CVIFeedOracleContracts.sol/CVIFakeFeedOracle";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_decimals",
        type: "uint8",
      },
      {
        internalType: "int256",
        name: "_initialAnswer",
        type: "int256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "int256",
        name: "current",
        type: "int256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "roundId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "updatedAt",
        type: "uint256",
      },
    ],
    name: "AnswerUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "roundId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "startedBy",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "startedAt",
        type: "uint256",
      },
    ],
    name: "NewRound",
    type: "event",
  },
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
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "description",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "pure",
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
    name: "getAnswer",
    outputs: [
      {
        internalType: "int256",
        name: "",
        type: "int256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint80",
        name: "_roundId",
        type: "uint80",
      },
    ],
    name: "getRoundData",
    outputs: [
      {
        internalType: "uint80",
        name: "roundId",
        type: "uint80",
      },
      {
        internalType: "int256",
        name: "answer",
        type: "int256",
      },
      {
        internalType: "uint256",
        name: "startedAt",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "updatedAt",
        type: "uint256",
      },
      {
        internalType: "uint80",
        name: "answeredInRound",
        type: "uint80",
      },
    ],
    stateMutability: "view",
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
    name: "getTimestamp",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "latestAnswer",
    outputs: [
      {
        internalType: "int256",
        name: "",
        type: "int256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "latestRound",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "latestRoundData",
    outputs: [
      {
        internalType: "uint80",
        name: "roundId",
        type: "uint80",
      },
      {
        internalType: "int256",
        name: "answer",
        type: "int256",
      },
      {
        internalType: "uint256",
        name: "startedAt",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "updatedAt",
        type: "uint256",
      },
      {
        internalType: "uint80",
        name: "answeredInRound",
        type: "uint80",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "latestTimestamp",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
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
        internalType: "uint256",
        name: "_latestRound",
        type: "uint256",
      },
    ],
    name: "setLatestRound",
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
    inputs: [
      {
        internalType: "int256",
        name: "_answer",
        type: "int256",
      },
    ],
    name: "updateAnswer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint80",
        name: "_roundId",
        type: "uint80",
      },
      {
        internalType: "int256",
        name: "_answer",
        type: "int256",
      },
      {
        internalType: "uint256",
        name: "_timestamp",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_startedAt",
        type: "uint256",
      },
    ],
    name: "updateRoundData",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "version",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b5060405161091438038061091483398101604081905261002f9161019e565b818161003a33610064565b6000805460ff60a01b1916600160a01b60ff85160217905561005b816100b4565b505050506101f7565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6000546001600160a01b031633146101125760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015260640160405180910390fd5b6001819055426002556003805490600061012b836101d0565b9091555050600380546000908152600460209081526040808320859055835483526005825280832042908190558454845260068352928190208390559254925191825283917f0559884fd3a460db3073b7fc896cc77986f16e378210ded43186175bf646fc5f910160405180910390a350565b600080604083850312156101b0578182fd5b825160ff811681146101c0578283fd5b6020939093015192949293505050565b60006000198214156101f057634e487b7160e01b81526011600452602481fd5b5060010190565b61070e806102066000396000f3fe608060405234801561001057600080fd5b50600436106101005760003560e01c80638da5cb5b11610097578063b633620c11610066578063b633620c1461027b578063df61c3e21461029b578063f2fde38b146102ae578063feaf968c146102c157600080fd5b80638da5cb5b146101af5780639a6fc8f5146101ca578063a87a20ce14610248578063b5ab58dc1461025b57600080fd5b8063668a0f02116100d3578063668a0f0214610164578063715018a61461016d5780637284e416146101755780638205bf6a146101a657600080fd5b8063313ce567146101055780634aa2011f1461013057806350d25bcd1461014557806354fd4d501461015c575b600080fd5b60005461011990600160a01b900460ff1681565b60405160ff90911681526020015b60405180910390f35b61014361013e3660046105f1565b6102ec565b005b61014e60015481565b604051908152602001610127565b61014e600081565b61014e60035481565b61014361036c565b604080518082018252600f81526e4356492046656564204f7261636c6560881b602082015290516101279190610629565b61014e60025481565b6000546040516001600160a01b039091168152602001610127565b6102116101d83660046105d7565b69ffffffffffffffffffff8116600090815260046020908152604080832054600683528184205460059093529220549293919290918490565b6040805169ffffffffffffffffffff968716815260208101959095528401929092526060830152909116608082015260a001610127565b6101436102563660046105bf565b6103a2565b61014e6102693660046105bf565b60046020526000908152604090205481565b61014e6102893660046105bf565b60056020526000908152604090205481565b6101436102a93660046105bf565b610458565b6101436102bc366004610591565b610487565b6003546000818152600460209081526040808320546006835281842054600590935292205483610211565b6000546001600160a01b0316331461031f5760405162461bcd60e51b81526004016103169061067c565b60405180910390fd5b69ffffffffffffffffffff90931660038181556001849055600283905560009182526004602090815260408084209590955581548352600581528483209390935554815260069091522055565b6000546001600160a01b031633146103965760405162461bcd60e51b81526004016103169061067c565b6103a06000610522565b565b6000546001600160a01b031633146103cc5760405162461bcd60e51b81526004016103169061067c565b600181905542600255600380549060006103e5836106b1565b9091555050600380546000908152600460209081526040808320859055835483526005825280832042908190558454845260068352928190208390559254925191825283917f0559884fd3a460db3073b7fc896cc77986f16e378210ded43186175bf646fc5f910160405180910390a350565b6000546001600160a01b031633146104825760405162461bcd60e51b81526004016103169061067c565b600355565b6000546001600160a01b031633146104b15760405162461bcd60e51b81526004016103169061067c565b6001600160a01b0381166105165760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b6064820152608401610316565b61051f81610522565b50565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b803569ffffffffffffffffffff8116811461058c57600080fd5b919050565b6000602082840312156105a2578081fd5b81356001600160a01b03811681146105b8578182fd5b9392505050565b6000602082840312156105d0578081fd5b5035919050565b6000602082840312156105e8578081fd5b6105b882610572565b60008060008060808587031215610606578283fd5b61060f85610572565b966020860135965060408601359560600135945092505050565b6000602080835283518082850152825b8181101561065557858101830151858201604001528201610639565b818111156106665783604083870101525b50601f01601f1916929092016040019392505050565b6020808252818101527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604082015260600190565b60006000198214156106d157634e487b7160e01b81526011600452602481fd5b506001019056fea264697066735822122054b69c1fc424388007adf242783283e16b46554844f0b2c76b82af56216f191d64736f6c63430008040033";

type CVIFakeFeedOracleConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: CVIFakeFeedOracleConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class CVIFakeFeedOracle__factory extends ContractFactory {
  constructor(...args: CVIFakeFeedOracleConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _decimals: BigNumberish,
    _initialAnswer: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<CVIFakeFeedOracle> {
    return super.deploy(
      _decimals,
      _initialAnswer,
      overrides || {}
    ) as Promise<CVIFakeFeedOracle>;
  }
  override getDeployTransaction(
    _decimals: BigNumberish,
    _initialAnswer: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      _decimals,
      _initialAnswer,
      overrides || {}
    );
  }
  override attach(address: string): CVIFakeFeedOracle {
    return super.attach(address) as CVIFakeFeedOracle;
  }
  override connect(signer: Signer): CVIFakeFeedOracle__factory {
    return super.connect(signer) as CVIFakeFeedOracle__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): CVIFakeFeedOracleInterface {
    return new utils.Interface(_abi) as CVIFakeFeedOracleInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): CVIFakeFeedOracle {
    return new Contract(address, _abi, signerOrProvider) as CVIFakeFeedOracle;
  }
}
