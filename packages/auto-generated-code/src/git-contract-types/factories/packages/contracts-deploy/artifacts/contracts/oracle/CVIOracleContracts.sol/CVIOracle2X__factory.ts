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
  CVIOracle2X,
  CVIOracle2XInterface,
} from "../../../../../../../packages/contracts-deploy/artifacts/contracts/oracle/CVIOracleContracts.sol/CVIOracle2X";

const _abi = [
  {
    inputs: [
      {
        internalType: "contract AggregatorV3Interface",
        name: "_cviAggregator",
        type: "address",
      },
      {
        internalType: "contract AggregatorV3Interface",
        name: "_cviDeviationAggregator",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_maxCVIValue",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "leverage",
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
    name: "cviAggregator",
    outputs: [
      {
        internalType: "contract AggregatorV3Interface",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "cviDeviationAggregator",
    outputs: [
      {
        internalType: "contract AggregatorV3Interface",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "deviationCheck",
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
        name: "_roundId",
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
    inputs: [],
    name: "leverage",
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
    name: "maxCVIValue",
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
    name: "maxDeviation",
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
        internalType: "bool",
        name: "_newDeviationCheck",
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
        name: "_newMaxDeviation",
        type: "uint16",
      },
    ],
    name: "setMaxDeviation",
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

const _bytecode =
  "0x60a06040526001805462ffffff60a01b1916607d60ab1b17905534801561002557600080fd5b50604051610b72380380610b7283398101604081905261004491610114565b83838383610051336100a8565b6001600160601b031960609490941b939093166080526001805460029290925560ff909316600160b81b02600163ff00000160a01b03199091166001600160a01b0392909216919091171790555061016792505050565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b80516001600160a01b038116811461010f57600080fd5b919050565b60008060008060808587031215610129578384fd5b610132856100f8565b9350610140602086016100f8565b925060408501519150606085015160ff8116811461015c578182fd5b939692955090935050565b60805160601c6109df610193600039600081816101fc0152818161029a01526103c201526109df6000f3fe608060405234801561001057600080fd5b50600436106100cf5760003560e01c8063c1639a2b1161008c578063e0530f4211610066578063e0530f42146101f7578063e34a05d31461021e578063f2fde38b14610231578063fe1e33651461024457600080fd5b8063c1639a2b14610198578063d934c20b146101cd578063de40c5ae146101e457600080fd5b80632a1bab73146100d45780632c86d98e146101015780635a7b84b114610127578063715018a6146101565780638da5cb5b14610160578063986f396b14610185575b600080fd5b6001546100e990600160a81b900461ffff1681565b60405161ffff90911681526020015b60405180910390f35b60015461011590600160b81b900460ff1681565b60405160ff90911681526020016100f8565b61013a61013536600461086f565b610268565b6040805163ffffffff90931683526020830191909152016100f8565b61015e610330565b005b6000546001600160a01b03165b6040516001600160a01b0390911681526020016100f8565b61015e61019336600461082d565b61036f565b6101a06103b7565b6040805163ffffffff909416845269ffffffffffffffffffff9092166020840152908201526060016100f8565b6101d660025481565b6040519081526020016100f8565b60015461016d906001600160a01b031681565b61016d7f000000000000000000000000000000000000000000000000000000000000000081565b61015e61022c36600461084d565b6105bc565b61015e61023f366004610806565b610608565b60015461025890600160a01b900460ff1681565b60405190151581526020016100f8565b604051639a6fc8f560e01b815269ffffffffffffffffffff821660048201526000908190819081906001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001690639a6fc8f59060240160a06040518083038186803b1580156102dc57600080fd5b505afa1580156102f0573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610314919061088b565b50935050925050809250610327826106a3565b93505050915091565b6000546001600160a01b031633146103635760405162461bcd60e51b815260040161035a906108e2565b60405180910390fd5b61036d60006107b6565b565b6000546001600160a01b031633146103995760405162461bcd60e51b815260040161035a906108e2565b60018054911515600160a01b0260ff60a01b19909216919091179055565b6000806000806000807f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663feaf968c6040518163ffffffff1660e01b815260040160a06040518083038186803b15801561041957600080fd5b505afa15801561042d573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610451919061088b565b50935050925092506000610464836106a3565b600154909150600160a01b900460ff16156105b05760015460408051633fabe5a360e21b815290516000926001600160a01b03169163feaf968c9160048083019260a0929190829003018186803b1580156104be57600080fd5b505afa1580156104d2573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104f6919061088b565b5050509150506000610507826106a3565b905060008363ffffffff168263ffffffff161161052d576105288285610956565b610537565b6105378483610956565b60015463ffffffff9182169250600160a81b900461ffff1690831661055e61271084610937565b6105689190610917565b11156105ac5760405162461bcd60e51b8152602060048201526013602482015272446576696174696f6e20746f6f206c6172676560681b604482015260640161035a565b5050505b96929550935090915050565b6000546001600160a01b031633146105e65760405162461bcd60e51b815260040161035a906108e2565b6001805461ffff909216600160a81b0261ffff60a81b19909216919091179055565b6000546001600160a01b031633146106325760405162461bcd60e51b815260040161035a906108e2565b6001600160a01b0381166106975760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b606482015260840161035a565b6106a0816107b6565b50565b60015460009081906106bf90600160b81b900460ff1684610937565b9050600254811115610748576000662386f26fc100006002546106e29190610917565b63ffffffff161161072c5760405162461bcd60e51b8152602060048201526014602482015273435649206d75737420626520706f73697469766560601b604482015260640161035a565b662386f26fc100006002546107419190610917565b9392505050565b600061075b662386f26fc1000083610917565b63ffffffff16116107a55760405162461bcd60e51b8152602060048201526014602482015273435649206d75737420626520706f73697469766560601b604482015260640161035a565b610741662386f26fc1000082610917565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b600060208284031215610817578081fd5b81356001600160a01b0381168114610741578182fd5b60006020828403121561083e578081fd5b81358015158114610741578182fd5b60006020828403121561085e578081fd5b813561ffff81168114610741578182fd5b600060208284031215610880578081fd5b813561074181610991565b600080600080600060a086880312156108a2578081fd5b85516108ad81610991565b8095505060208601519350604086015192506060860151915060808601516108d481610991565b809150509295509295909350565b6020808252818101527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604082015260600190565b60008261093257634e487b7160e01b81526012600452602481fd5b500490565b60008160001904831182151516156109515761095161097b565b500290565b600063ffffffff838116908316818110156109735761097361097b565b039392505050565b634e487b7160e01b600052601160045260246000fd5b69ffffffffffffffffffff811681146106a057600080fdfea2646970667358221220694583d075e244b07ed93237d43ab5346e6fb1323e9afce49af0c46223539c1b64736f6c63430008040033";

type CVIOracle2XConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: CVIOracle2XConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class CVIOracle2X__factory extends ContractFactory {
  constructor(...args: CVIOracle2XConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _cviAggregator: string,
    _cviDeviationAggregator: string,
    _maxCVIValue: BigNumberish,
    leverage: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<CVIOracle2X> {
    return super.deploy(
      _cviAggregator,
      _cviDeviationAggregator,
      _maxCVIValue,
      leverage,
      overrides || {}
    ) as Promise<CVIOracle2X>;
  }
  override getDeployTransaction(
    _cviAggregator: string,
    _cviDeviationAggregator: string,
    _maxCVIValue: BigNumberish,
    leverage: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      _cviAggregator,
      _cviDeviationAggregator,
      _maxCVIValue,
      leverage,
      overrides || {}
    );
  }
  override attach(address: string): CVIOracle2X {
    return super.attach(address) as CVIOracle2X;
  }
  override connect(signer: Signer): CVIOracle2X__factory {
    return super.connect(signer) as CVIOracle2X__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): CVIOracle2XInterface {
    return new utils.Interface(_abi) as CVIOracle2XInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): CVIOracle2X {
    return new Contract(address, _abi, signerOrProvider) as CVIOracle2X;
  }
}
