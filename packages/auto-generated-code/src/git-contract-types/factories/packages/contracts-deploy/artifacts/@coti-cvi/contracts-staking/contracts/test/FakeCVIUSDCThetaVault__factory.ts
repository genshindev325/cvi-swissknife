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
  FakeCVIUSDCThetaVault,
  FakeCVIUSDCThetaVaultInterface,
} from "../../../../../../../../packages/contracts-deploy/artifacts/@coti-cvi/contracts-staking/contracts/test/FakeCVIUSDCThetaVault";

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
    name: "rewardRouter",
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
        internalType: "address",
        name: "_rewardRouter",
        type: "address",
      },
    ],
    name: "setRewardRouter",
    outputs: [],
    stateMutability: "nonpayable",
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
  "0x60806040523480156200001157600080fd5b5060405162000e1438038062000e148339810160408190526200003491620002d5565b8383838383838160039080519060200190620000529291906200017c565b508051620000689060049060208401906200017c565b50506005805460ff191660ff84161790555062000086338362000094565b5050505050505050620003d6565b6001600160a01b038216620000ef5760405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f206164647265737300604482015260640160405180910390fd5b80600260008282546200010391906200035e565b90915550506001600160a01b03821660009081526020819052604081208054839290620001329084906200035e565b90915550506040518181526001600160a01b038316906000907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200160405180910390a35050565b8280546200018a9062000383565b90600052602060002090601f016020900481019282620001ae5760008555620001f9565b82601f10620001c957805160ff1916838001178555620001f9565b82800160010185558215620001f9579182015b82811115620001f9578251825591602001919060010190620001dc565b50620002079291506200020b565b5090565b5b808211156200020757600081556001016200020c565b600082601f83011262000233578081fd5b81516001600160401b0380821115620002505762000250620003c0565b604051601f8301601f19908116603f011681019082821181831017156200027b576200027b620003c0565b8160405283815260209250868385880101111562000297578485fd5b8491505b83821015620002ba57858201830151818301840152908201906200029b565b83821115620002cb57848385830101525b9695505050505050565b60008060008060808587031215620002eb578384fd5b84516001600160401b038082111562000302578586fd5b620003108883890162000222565b9550602087015191508082111562000326578485fd5b50620003358782880162000222565b93505060408501519150606085015160ff8116811462000353578182fd5b939692955090935050565b600082198211156200037e57634e487b7160e01b81526011600452602481fd5b500190565b600181811c908216806200039857607f821691505b60208210811415620003ba57634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052604160045260246000fd5b610a2e80620003e66000396000f3fe608060405234801561001057600080fd5b50600436106100ea5760003560e01c80635a3bb9891161008c578063977b91d711610066578063977b91d7146101f3578063a457c2d714610229578063a9059cbb1461023c578063dd62ed3e1461024f57600080fd5b80635a3bb9891461019257806370a08231146101c257806395d89b41146101eb57600080fd5b806323b872dd116100c857806323b872dd14610142578063313ce56714610155578063395093511461016a57806340c10f191461017d57600080fd5b806306fdde03146100ef578063095ea7b31461010d57806318160ddd14610130575b600080fd5b6100f7610262565b6040516101049190610946565b60405180910390f35b61012061011b36600461091d565b6102f4565b6040519015158152602001610104565b6002545b604051908152602001610104565b6101206101503660046108e2565b61030c565b60055460405160ff9091168152602001610104565b61012061017836600461091d565b610330565b61019061018b36600461091d565b610352565b005b6005546101aa9061010090046001600160a01b031681565b6040516001600160a01b039091168152602001610104565b6101346101d036600461088f565b6001600160a01b031660009081526020819052604090205490565b6100f7610360565b61019061020136600461088f565b600580546001600160a01b0390921661010002610100600160a81b0319909216919091179055565b61012061023736600461091d565b61036f565b61012061024a36600461091d565b6103ef565b61013461025d3660046108b0565b6103fd565b606060038054610271906109bd565b80601f016020809104026020016040519081016040528092919081815260200182805461029d906109bd565b80156102ea5780601f106102bf576101008083540402835291602001916102ea565b820191906000526020600020905b8154815290600101906020018083116102cd57829003601f168201915b5050505050905090565b600033610302818585610428565b5060019392505050565b60003361031a85828561054c565b6103258585856105c6565b506001949350505050565b60003361030281858561034383836103fd565b61034d9190610999565b610428565b61035c8282610794565b5050565b606060048054610271906109bd565b6000338161037d82866103fd565b9050838110156103e25760405162461bcd60e51b815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f77604482015264207a65726f60d81b60648201526084015b60405180910390fd5b6103258286868403610428565b6000336103028185856105c6565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205490565b6001600160a01b03831661048a5760405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b60648201526084016103d9565b6001600160a01b0382166104eb5760405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360f01b60648201526084016103d9565b6001600160a01b0383811660008181526001602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925910160405180910390a3505050565b600061055884846103fd565b905060001981146105c057818110156105b35760405162461bcd60e51b815260206004820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e636500000060448201526064016103d9565b6105c08484848403610428565b50505050565b6001600160a01b03831661062a5760405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f206164604482015264647265737360d81b60648201526084016103d9565b6001600160a01b03821661068c5760405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201526265737360e81b60648201526084016103d9565b6001600160a01b038316600090815260208190526040902054818110156107045760405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e7420657863656564732062604482015265616c616e636560d01b60648201526084016103d9565b6001600160a01b0380851660009081526020819052604080822085850390559185168152908120805484929061073b908490610999565b92505081905550826001600160a01b0316846001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8460405161078791815260200190565b60405180910390a36105c0565b6001600160a01b0382166107ea5760405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f20616464726573730060448201526064016103d9565b80600260008282546107fc9190610999565b90915550506001600160a01b03821660009081526020819052604081208054839290610829908490610999565b90915550506040518181526001600160a01b038316906000907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200160405180910390a35050565b80356001600160a01b038116811461088a57600080fd5b919050565b6000602082840312156108a0578081fd5b6108a982610873565b9392505050565b600080604083850312156108c2578081fd5b6108cb83610873565b91506108d960208401610873565b90509250929050565b6000806000606084860312156108f6578081fd5b6108ff84610873565b925061090d60208501610873565b9150604084013590509250925092565b6000806040838503121561092f578182fd5b61093883610873565b946020939093013593505050565b6000602080835283518082850152825b8181101561097257858101830151858201604001528201610956565b818111156109835783604083870101525b50601f01601f1916929092016040019392505050565b600082198211156109b857634e487b7160e01b81526011600452602481fd5b500190565b600181811c908216806109d157607f821691505b602082108114156109f257634e487b7160e01b600052602260045260246000fd5b5091905056fea2646970667358221220c820a33b25e89ab7848d2f5a687778da07a411bf42c30bbbc13028498f5c522964736f6c63430008040033";

type FakeCVIUSDCThetaVaultConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: FakeCVIUSDCThetaVaultConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class FakeCVIUSDCThetaVault__factory extends ContractFactory {
  constructor(...args: FakeCVIUSDCThetaVaultConstructorParams) {
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
  ): Promise<FakeCVIUSDCThetaVault> {
    return super.deploy(
      _name,
      _symbol,
      _supply,
      _decimals,
      overrides || {}
    ) as Promise<FakeCVIUSDCThetaVault>;
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
  override attach(address: string): FakeCVIUSDCThetaVault {
    return super.attach(address) as FakeCVIUSDCThetaVault;
  }
  override connect(signer: Signer): FakeCVIUSDCThetaVault__factory {
    return super.connect(signer) as FakeCVIUSDCThetaVault__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): FakeCVIUSDCThetaVaultInterface {
    return new utils.Interface(_abi) as FakeCVIUSDCThetaVaultInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): FakeCVIUSDCThetaVault {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as FakeCVIUSDCThetaVault;
  }
}
