/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  TreasuryController,
  TreasuryControllerInterface,
} from "../../../../../../../packages/contracts-deploy/artifacts/@coti-cvi/contracts-il/contracts/TreasuryController";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "protectionId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "fee",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint16",
        name: "feeComponent",
        type: "uint16",
      },
      {
        indexed: true,
        internalType: "address",
        name: "treasury",
        type: "address",
      },
      {
        indexed: false,
        internalType: "contract IERC20",
        name: "treasuryToken",
        type: "address",
      },
    ],
    name: "DepositFee",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
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
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "previousAdminRole",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "newAdminRole",
        type: "bytes32",
      },
    ],
    name: "RoleAdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleGranted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleRevoked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "prevValue",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "newValue",
        type: "address",
      },
    ],
    name: "TreasuryChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "contract IERC20",
        name: "prevValue",
        type: "address",
      },
      {
        indexed: false,
        internalType: "contract IERC20",
        name: "newValue",
        type: "address",
      },
    ],
    name: "TreasuryTokenChanged",
    type: "event",
  },
  {
    inputs: [],
    name: "DEFAULT_ADMIN_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "DEPOSITOR_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MAX_PRECISION",
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
        name: "_protectionId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_fee",
        type: "uint256",
      },
      {
        internalType: "uint16",
        name: "_feeComponent",
        type: "uint16",
      },
    ],
    name: "depositFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
    ],
    name: "getRoleAdmin",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "grantRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "hasRole",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "_treasury",
        type: "address",
      },
      {
        internalType: "contract IERC20",
        name: "_treasuryToken",
        type: "address",
      },
    ],
    name: "initialize",
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
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "renounceRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "revokeRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_treasury",
        type: "address",
      },
    ],
    name: "setTreasury",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "_treasuryToken",
        type: "address",
      },
    ],
    name: "setTreasuryToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
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
    inputs: [],
    name: "treasury",
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
    name: "treasuryToken",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b5061124d806100206000396000f3fe608060405234801561001057600080fd5b50600436106101165760003560e01c806391d14854116100a2578063c0c53b8b11610071578063c0c53b8b14610264578063d547741f14610277578063e19cb55b1461028a578063f0f442601461029d578063f2fde38b146102b057600080fd5b806391d148541461020f578063a217fddf14610222578063a3b0b5a31461022a578063b2ce514b1461025157600080fd5b8063505eb889116100e9578063505eb8891461019c57806361d027b3146101af578063715018a6146101da57806373f599da146101e25780638da5cb5b146101fe57600080fd5b806301ffc9a71461011b578063248a9ca3146101435780632f2ff15d1461017457806336568abe14610189575b600080fd5b61012e610129366004610fbe565b6102c3565b60405190151581526020015b60405180910390f35b610166610151366004610f77565b60009081526097602052604090206001015490565b60405190815260200161013a565b610187610182366004610f8f565b6102fa565b005b610187610197366004610f8f565b610324565b6101876101aa366004610ffe565b6103a7565b60c9546101c2906001600160a01b031681565b6040516001600160a01b03909116815260200161013a565b610187610573565b6101eb61271081565b60405161ffff909116815260200161013a565b6033546001600160a01b03166101c2565b61012e61021d366004610f8f565b6105d9565b610166600081565b6101667f8f4f2da22e8ac8f11e15f9fc141cddbb5deea8800186560abb6e68c5496619a981565b60ca546101c2906001600160a01b031681565b610187610272366004610f0d565b610604565b610187610285366004610f8f565b6106ad565b610187610298366004610ef1565b6106d2565b6101876102ab366004610ef1565b610798565b6101876102be366004610ef1565b61085e565b60006001600160e01b03198216637965db0b60e01b14806102f457506301ffc9a760e01b6001600160e01b03198316145b92915050565b60008281526097602052604090206001015461031581610929565b61031f8383610933565b505050565b6001600160a01b03811633146103995760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b60648201526084015b60405180910390fd5b6103a382826109b9565b5050565b7f8f4f2da22e8ac8f11e15f9fc141cddbb5deea8800186560abb6e68c5496619a96103d181610929565b600083116104215760405162461bcd60e51b815260206004820152601960248201527f466565206d757374206265206c6172676572207468616e2030000000000000006044820152606401610390565b60008261ffff16116104815760405162461bcd60e51b815260206004820152602360248201527f46656520636f6d706f6e656e74206d757374206265206c61726765722074686160448201526206e20360ec1b6064820152608401610390565b60ca5460c9546040516323b872dd60e01b81523360048201526001600160a01b039182166024820152604481018690529116906323b872dd90606401602060405180830381600087803b1580156104d757600080fd5b505af11580156104eb573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061050f9190610f57565b5060c95460ca546040805186815261ffff861660208201526001600160a01b0392831691810191909152911690339086907f2b54718111eae574079699852302680c3d8a61d2fe55d9fff0a15722a2cbb35e9060600160405180910390a450505050565b6033546001600160a01b031633146105cd5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610390565b6105d76000610a20565b565b60009182526097602090815260408084206001600160a01b0393909316845291905290205460ff1690565b60006106106001610a72565b90508015610628576000805461ff0019166101001790555b61063184610afa565b60c980546001600160a01b038086166001600160a01b03199283161790925560ca80549285169290911691909117905580156106a7576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15b50505050565b6000828152609760205260409020600101546106c881610929565b61031f83836109b9565b6106dd600033610b3c565b806001600160a01b0381166107265760405162461bcd60e51b815260206004820152600f60248201526e496e76616c6964206164647265737360881b6044820152606401610390565b61072e610ba0565b60ca54604080516001600160a01b03928316815291841660208301527f24849ad5bda8ee73461a15d79f42caad7ee1373d30b64db8d38301cf4bed982b910160405180910390a15060ca80546001600160a01b0319166001600160a01b0392909216919091179055565b6107a3600033610b3c565b806001600160a01b0381166107ec5760405162461bcd60e51b815260206004820152600f60248201526e496e76616c6964206164647265737360881b6044820152606401610390565b6107f4610ba0565b60c954604080516001600160a01b03928316815291841660208301527f8c3aa5f43a388513435861bf27dfad7829cd248696fed367c62d441f62954496910160405180910390a15060c980546001600160a01b0319166001600160a01b0392909216919091179055565b6033546001600160a01b031633146108b85760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610390565b6001600160a01b03811661091d5760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b6064820152608401610390565b61092681610a20565b50565b6109268133610b3c565b61093d82826105d9565b6103a35760008281526097602090815260408083206001600160a01b03851684529091529020805460ff191660011790556109753390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b6109c382826105d9565b156103a35760008281526097602090815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b603380546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b60008054610100900460ff1615610ab9578160ff166001148015610a955750303b155b610ab15760405162461bcd60e51b8152600401610390906110d9565b506000919050565b60005460ff808416911610610ae05760405162461bcd60e51b8152600401610390906110d9565b506000805460ff191660ff92909216919091179055600190565b600054610100900460ff16610b215760405162461bcd60e51b815260040161039090611127565b610b29610c78565b610b31610ca7565b61091d600082610cce565b610b4682826105d9565b6103a357610b5e816001600160a01b03166014610cd8565b610b69836020610cd8565b604051602001610b7a929190611031565b60408051601f198184030181529082905262461bcd60e51b8252610390916004016110a6565b60ca5460c9546040516370a0823160e01b81526001600160a01b0391821660048201529116906370a082319060240160206040518083038186803b158015610be757600080fd5b505afa158015610bfb573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c1f9190610fe6565b156105d75760405162461bcd60e51b815260206004820152602360248201527f4578697374696e672074726561737572792062616c616e6365206d757374206260448201526206520360ec1b6064820152608401610390565b600054610100900460ff16610c9f5760405162461bcd60e51b815260040161039090611127565b6105d7610ec1565b600054610100900460ff166105d75760405162461bcd60e51b815260040161039090611127565b6103a38282610933565b60606000610ce783600261118a565b610cf2906002611172565b67ffffffffffffffff811115610d1857634e487b7160e01b600052604160045260246000fd5b6040519080825280601f01601f191660200182016040528015610d42576020820181803683370190505b509050600360fc1b81600081518110610d6b57634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a905350600f60fb1b81600181518110610da857634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a9053506000610dcc84600261118a565b610dd7906001611172565b90505b6001811115610e6b576f181899199a1a9b1b9c1cb0b131b232b360811b85600f1660108110610e1957634e487b7160e01b600052603260045260246000fd5b1a60f81b828281518110610e3d57634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a90535060049490941c93610e64816111d5565b9050610dda565b508315610eba5760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152606401610390565b9392505050565b600054610100900460ff16610ee85760405162461bcd60e51b815260040161039090611127565b6105d733610a20565b600060208284031215610f02578081fd5b8135610eba81611202565b600080600060608486031215610f21578182fd5b8335610f2c81611202565b92506020840135610f3c81611202565b91506040840135610f4c81611202565b809150509250925092565b600060208284031215610f68578081fd5b81518015158114610eba578182fd5b600060208284031215610f88578081fd5b5035919050565b60008060408385031215610fa1578182fd5b823591506020830135610fb381611202565b809150509250929050565b600060208284031215610fcf578081fd5b81356001600160e01b031981168114610eba578182fd5b600060208284031215610ff7578081fd5b5051919050565b600080600060608486031215611012578283fd5b8335925060208401359150604084013561ffff81168114610f4c578182fd5b7f416363657373436f6e74726f6c3a206163636f756e74200000000000000000008152600083516110698160178501602088016111a9565b7001034b99036b4b9b9b4b733903937b6329607d1b601791840191820152835161109a8160288401602088016111a9565b01602801949350505050565b60208152600082518060208401526110c58160408501602087016111a9565b601f01601f19169190910160400192915050565b6020808252602e908201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160408201526d191e481a5b9a5d1a585b1a5e995960921b606082015260800190565b6020808252602b908201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960408201526a6e697469616c697a696e6760a81b606082015260800190565b60008219821115611185576111856111ec565b500190565b60008160001904831182151516156111a4576111a46111ec565b500290565b60005b838110156111c45781810151838201526020016111ac565b838111156106a75750506000910152565b6000816111e4576111e46111ec565b506000190190565b634e487b7160e01b600052601160045260246000fd5b6001600160a01b038116811461092657600080fdfea26469706673582212202f0700225116f692db5fe7e8c1b1fb3ea0f252a3196f3288903413e33de3eb1c64736f6c63430008040033";

type TreasuryControllerConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: TreasuryControllerConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class TreasuryController__factory extends ContractFactory {
  constructor(...args: TreasuryControllerConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<TreasuryController> {
    return super.deploy(overrides || {}) as Promise<TreasuryController>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): TreasuryController {
    return super.attach(address) as TreasuryController;
  }
  override connect(signer: Signer): TreasuryController__factory {
    return super.connect(signer) as TreasuryController__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): TreasuryControllerInterface {
    return new utils.Interface(_abi) as TreasuryControllerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): TreasuryController {
    return new Contract(address, _abi, signerOrProvider) as TreasuryController;
  }
}
