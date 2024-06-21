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
  FakeGOVI,
  FakeGOVIInterface,
} from "../../../../../../../../packages/contracts-deploy/artifacts/@coti-cvi/contracts-staking/contracts/test/FakeGOVI";

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "string",
        name: "_symbol",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_supply",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "_decimals",
        type: "uint8",
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
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
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
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
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
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
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
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
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
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b5060405162000d7838038062000d788339810160408190526200003491620002d5565b8383838383838160039080519060200190620000529291906200017c565b508051620000689060049060208401906200017c565b50506005805460ff191660ff84161790555062000086338362000094565b5050505050505050620003d6565b6001600160a01b038216620000ef5760405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f206164647265737300604482015260640160405180910390fd5b80600260008282546200010391906200035e565b90915550506001600160a01b03821660009081526020819052604081208054839290620001329084906200035e565b90915550506040518181526001600160a01b038316906000907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200160405180910390a35050565b8280546200018a9062000383565b90600052602060002090601f016020900481019282620001ae5760008555620001f9565b82601f10620001c957805160ff1916838001178555620001f9565b82800160010185558215620001f9579182015b82811115620001f9578251825591602001919060010190620001dc565b50620002079291506200020b565b5090565b5b808211156200020757600081556001016200020c565b600082601f83011262000233578081fd5b81516001600160401b0380821115620002505762000250620003c0565b604051601f8301601f19908116603f011681019082821181831017156200027b576200027b620003c0565b8160405283815260209250868385880101111562000297578485fd5b8491505b83821015620002ba57858201830151818301840152908201906200029b565b83821115620002cb57848385830101525b9695505050505050565b60008060008060808587031215620002eb578384fd5b84516001600160401b038082111562000302578586fd5b620003108883890162000222565b9550602087015191508082111562000326578485fd5b50620003358782880162000222565b93505060408501519150606085015160ff8116811462000353578182fd5b939692955090935050565b600082198211156200037e57634e487b7160e01b81526011600452602481fd5b500190565b600181811c908216806200039857607f821691505b60208210811415620003ba57634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052604160045260246000fd5b61099280620003e66000396000f3fe608060405234801561001057600080fd5b50600436106100b45760003560e01c806340c10f191161007157806340c10f191461014757806370a082311461015c57806395d89b4114610185578063a457c2d71461018d578063a9059cbb146101a0578063dd62ed3e146101b357600080fd5b806306fdde03146100b9578063095ea7b3146100d757806318160ddd146100fa57806323b872dd1461010c578063313ce5671461011f5780633950935114610134575b600080fd5b6100c16101c6565b6040516100ce91906108aa565b60405180910390f35b6100ea6100e5366004610881565b610258565b60405190151581526020016100ce565b6002545b6040519081526020016100ce565b6100ea61011a366004610846565b610270565b60055460405160ff90911681526020016100ce565b6100ea610142366004610881565b610294565b61015a610155366004610881565b6102b6565b005b6100fe61016a3660046107f3565b6001600160a01b031660009081526020819052604090205490565b6100c16102c4565b6100ea61019b366004610881565b6102d3565b6100ea6101ae366004610881565b610353565b6100fe6101c1366004610814565b610361565b6060600380546101d590610921565b80601f016020809104026020016040519081016040528092919081815260200182805461020190610921565b801561024e5780601f106102235761010080835404028352916020019161024e565b820191906000526020600020905b81548152906001019060200180831161023157829003601f168201915b5050505050905090565b60003361026681858561038c565b5060019392505050565b60003361027e8582856104b0565b61028985858561052a565b506001949350505050565b6000336102668185856102a78383610361565b6102b191906108fd565b61038c565b6102c082826106f8565b5050565b6060600480546101d590610921565b600033816102e18286610361565b9050838110156103465760405162461bcd60e51b815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f77604482015264207a65726f60d81b60648201526084015b60405180910390fd5b610289828686840361038c565b60003361026681858561052a565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205490565b6001600160a01b0383166103ee5760405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b606482015260840161033d565b6001600160a01b03821661044f5760405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360f01b606482015260840161033d565b6001600160a01b0383811660008181526001602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925910160405180910390a3505050565b60006104bc8484610361565b9050600019811461052457818110156105175760405162461bcd60e51b815260206004820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e6365000000604482015260640161033d565b610524848484840361038c565b50505050565b6001600160a01b03831661058e5760405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f206164604482015264647265737360d81b606482015260840161033d565b6001600160a01b0382166105f05760405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201526265737360e81b606482015260840161033d565b6001600160a01b038316600090815260208190526040902054818110156106685760405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e7420657863656564732062604482015265616c616e636560d01b606482015260840161033d565b6001600160a01b0380851660009081526020819052604080822085850390559185168152908120805484929061069f9084906108fd565b92505081905550826001600160a01b0316846001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040516106eb91815260200190565b60405180910390a3610524565b6001600160a01b03821661074e5760405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f206164647265737300604482015260640161033d565b806002600082825461076091906108fd565b90915550506001600160a01b0382166000908152602081905260408120805483929061078d9084906108fd565b90915550506040518181526001600160a01b038316906000907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200160405180910390a35050565b80356001600160a01b03811681146107ee57600080fd5b919050565b600060208284031215610804578081fd5b61080d826107d7565b9392505050565b60008060408385031215610826578081fd5b61082f836107d7565b915061083d602084016107d7565b90509250929050565b60008060006060848603121561085a578081fd5b610863846107d7565b9250610871602085016107d7565b9150604084013590509250925092565b60008060408385031215610893578182fd5b61089c836107d7565b946020939093013593505050565b6000602080835283518082850152825b818110156108d6578581018301518582016040015282016108ba565b818111156108e75783604083870101525b50601f01601f1916929092016040019392505050565b6000821982111561091c57634e487b7160e01b81526011600452602481fd5b500190565b600181811c9082168061093557607f821691505b6020821081141561095657634e487b7160e01b600052602260045260246000fd5b5091905056fea2646970667358221220085170c5ece06c28b840555cf5b74d0603f4384bd83220aa00fd1a82320d212464736f6c63430008040033";

type FakeGOVIConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: FakeGOVIConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class FakeGOVI__factory extends ContractFactory {
  constructor(...args: FakeGOVIConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _name: string,
    _symbol: string,
    _supply: BigNumberish,
    _decimals: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<FakeGOVI> {
    return super.deploy(
      _name,
      _symbol,
      _supply,
      _decimals,
      overrides || {}
    ) as Promise<FakeGOVI>;
  }
  override getDeployTransaction(
    _name: string,
    _symbol: string,
    _supply: BigNumberish,
    _decimals: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      _name,
      _symbol,
      _supply,
      _decimals,
      overrides || {}
    );
  }
  override attach(address: string): FakeGOVI {
    return super.attach(address) as FakeGOVI;
  }
  override connect(signer: Signer): FakeGOVI__factory {
    return super.connect(signer) as FakeGOVI__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): FakeGOVIInterface {
    return new utils.Interface(_abi) as FakeGOVIInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): FakeGOVI {
    return new Contract(address, _abi, signerOrProvider) as FakeGOVI;
  }
}
