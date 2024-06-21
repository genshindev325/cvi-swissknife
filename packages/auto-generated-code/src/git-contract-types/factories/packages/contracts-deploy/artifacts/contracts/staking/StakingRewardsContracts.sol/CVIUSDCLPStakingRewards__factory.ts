/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  CVIUSDCLPStakingRewards,
  CVIUSDCLPStakingRewardsInterface,
} from "../../../../../../../packages/contracts-deploy/artifacts/contracts/staking/StakingRewardsContracts.sol/CVIUSDCLPStakingRewards";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "_rewardsDistribution",
        type: "address",
      },
      {
        internalType: "address",
        name: "_rewardsToken",
        type: "address",
      },
      {
        internalType: "address",
        name: "_stakingToken",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "oldOwner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnerChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnerNominated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bool",
        name: "isPaused",
        type: "bool",
      },
    ],
    name: "PauseChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Recovered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "reward",
        type: "uint256",
      },
    ],
    name: "RewardAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "reward",
        type: "uint256",
      },
    ],
    name: "RewardPaid",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "newDuration",
        type: "uint256",
      },
    ],
    name: "RewardsDurationUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Staked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Withdrawn",
    type: "event",
  },
  {
    inputs: [],
    name: "acceptOwnership",
    outputs: [],
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
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "earned",
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
    name: "exit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getReward",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getRewardForDuration",
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
    name: "lastPauseTime",
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
    name: "lastTimeRewardApplicable",
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
    name: "lastUpdateTime",
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
        name: "_owner",
        type: "address",
      },
    ],
    name: "nominateNewOwner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "nominatedOwner",
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
        internalType: "uint256",
        name: "reward",
        type: "uint256",
      },
    ],
    name: "notifyRewardAmount",
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
    name: "paused",
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
    name: "periodFinish",
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
        name: "tokenAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenAmount",
        type: "uint256",
      },
    ],
    name: "recoverERC20",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "rewardPerToken",
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
    name: "rewardPerTokenStored",
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
    name: "rewardRate",
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
        name: "",
        type: "address",
      },
    ],
    name: "rewards",
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
    name: "rewardsDistribution",
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
    name: "rewardsDuration",
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
    name: "rewardsToken",
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
  {
    inputs: [
      {
        internalType: "bool",
        name: "_paused",
        type: "bool",
      },
    ],
    name: "setPaused",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_rewardsDistribution",
        type: "address",
      },
    ],
    name: "setRewardsDistribution",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_rewardsDuration",
        type: "uint256",
      },
    ],
    name: "setRewardsDuration",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "stake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "stakingToken",
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
        name: "",
        type: "address",
      },
    ],
    name: "userRewardPerTokenPaid",
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
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040526000600755600060085562093a806009553480156200002257600080fd5b50604051620018fa380380620018fa8339810160408190526200004591620001c3565b83838383836001600160a01b038116620000a65760405162461bcd60e51b815260206004820152601960248201527f4f776e657220616464726573732063616e6e6f7420626520300000000000000060448201526064015b60405180910390fd5b600080546001600160a01b0319166001600160a01b03831690811782556040805192835260208301919091527fb532073b38c83145e3e5135377a08bf9aab55bc0fd7c1179cd4fb995d2a5159c910160405180910390a15060016003556000546001600160a01b0316620001515760405162461bcd60e51b815260206004820152601160248201527013dddb995c881b5d5cdd081899481cd95d607a1b60448201526064016200009d565b600580546001600160a01b0393841661010002610100600160a81b0319909116179055600680549183166001600160a01b031992831617905560028054939092169216919091179055506200021f9350505050565b80516001600160a01b0381168114620001be57600080fd5b919050565b60008060008060808587031215620001d9578384fd5b620001e485620001a6565b9350620001f460208601620001a6565b92506200020460408601620001a6565b91506200021460608601620001a6565b905092959194509250565b6116cb806200022f6000396000f3fe608060405234801561001057600080fd5b50600436106101e45760003560e01c806372f702f31161010f578063a694fc3a116100a2578063d1af0c7d11610071578063d1af0c7d146103e7578063df136d65146103ff578063e9fad8ee14610408578063ebe2b12b1461041057600080fd5b8063a694fc3a146103b0578063c8f33c91146103c3578063cc1a378f146103cc578063cd3daf9d146103df57600080fd5b80638980f11f116100de5780638980f11f146103615780638b876347146103745780638da5cb5b1461039457806391b4ded9146103a757600080fd5b806372f702f31461033557806379ba5097146103485780637b0a47ee1461035057806380faa57d1461035957600080fd5b80632e1a7d4d116101875780633fc6df6e116101565780633fc6df6e146102b157806353a47bb7146102dc5780635c975abb146102ef57806370a082311461030c57600080fd5b80632e1a7d4d1461027a578063386a95251461028d5780633c6b16ab146102965780633d18b912146102a957600080fd5b806316c38b3c116101c357806316c38b3c1461024457806318160ddd14610257578063197621431461025f5780631c1f78eb1461027257600080fd5b80628cc262146101e95780630700037d1461020f5780631627540c1461022f575b600080fd5b6101fc6101f73660046113f2565b610419565b6040519081526020015b60405180910390f35b6101fc61021d3660046113f2565b600d6020526000908152604090205481565b61024261023d3660046113f2565b610496565b005b610242610252366004611435565b6104f3565b600e546101fc565b61024261026d3660046113f2565b610569565b6101fc610593565b61024261028836600461150b565b6105aa565b6101fc60095481565b6102426102a436600461150b565b610711565b61024261096a565b6002546102c4906001600160a01b031681565b6040516001600160a01b039091168152602001610206565b6001546102c4906001600160a01b031681565b6005546102fc9060ff1681565b6040519015158152602001610206565b6101fc61031a3660046113f2565b6001600160a01b03166000908152600f602052604090205490565b6006546102c4906001600160a01b031681565b610242610a6b565b6101fc60085481565b6101fc610b55565b61024261036f36600461140c565b610b63565b6101fc6103823660046113f2565b600c6020526000908152604090205481565b6000546102c4906001600160a01b031681565b6101fc60045481565b6102426103be36600461150b565b610d21565b6101fc600a5481565b6102426103da36600461150b565b610ee9565b6101fc610fce565b6005546102c49061010090046001600160a01b031681565b6101fc600b5481565b610242611030565b6101fc60075481565b6001600160a01b0381166000908152600d6020908152604080832054600c909252822054670de0b6b3a76400009061044f610fce565b6104599190611618565b6001600160a01b0385166000908152600f602052604090205461047c91906115f9565b61048691906115d9565b61049091906115c1565b92915050565b61049e611053565b600180546001600160a01b0319166001600160a01b0383169081179091556040519081527f906a1c6bd7e3091ea86693dd029a831c19049ce77f1dce2ce0bab1cacbabce22906020015b60405180910390a150565b6104fb611053565b60055460ff161515811515141561050f5750565b6005805460ff191682151590811790915560ff161561052d57426004555b60055460405160ff909116151581527f8fb6c181ee25a520cf3dd6565006ef91229fcfe5a989566c2a3b8c115570cec5906020016104e8565b50565b610571611053565b600280546001600160a01b0319166001600160a01b0392909216919091179055565b60006009546008546105a591906115f9565b905090565b600260035414156105d65760405162461bcd60e51b81526004016105cd9061158a565b60405180910390fd5b6002600355336105e4610fce565b600b556105ef610b55565b600a556001600160a01b038116156106365761060a81610419565b6001600160a01b0382166000908152600d6020908152604080832093909355600b54600c909152919020555b6000821161067a5760405162461bcd60e51b8152602060048201526011602482015270043616e6e6f74207769746864726177203607c1b60448201526064016105cd565b81600e546106889190611618565b600e55336000908152600f60205260409020546106a6908390611618565b336000818152600f60205260409020919091556006546106d2916001600160a01b0390911690846110c5565b60405182815233907f7084f5476618d8e60b11ef0d7d3f06914655adb8793e28ff7f018d4c76d505d5906020015b60405180910390a250506001600355565b6002546001600160a01b0316331461077e5760405162461bcd60e51b815260206004820152602a60248201527f43616c6c6572206973206e6f742052657761726473446973747269627574696f6044820152691b8818dbdb9d1c9858dd60b21b60648201526084016105cd565b6000610788610fce565b600b55610793610b55565b600a556001600160a01b038116156107da576107ae81610419565b6001600160a01b0382166000908152600d6020908152604080832093909355600b54600c909152919020555b60075442106107f8576009546107f090836115d9565b60085561083a565b6000426007546108089190611618565b905060006008548261081a91906115f9565b60095490915061082a82866115c1565b61083491906115d9565b60085550505b6005546040516370a0823160e01b815230600482015260009161010090046001600160a01b0316906370a082319060240160206040518083038186803b15801561088357600080fd5b505afa158015610897573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108bb9190611523565b9050600954816108cb91906115d9565b600854111561091c5760405162461bcd60e51b815260206004820152601860248201527f50726f76696465642072657761726420746f6f2068696768000000000000000060448201526064016105cd565b42600a81905560095461092e916115c1565b6007556040518381527fde88a922e0d3b88b24e9623efeb464919c6bf9f66857a65e2bfcf2ce87a9433d906020015b60405180910390a1505050565b6002600354141561098d5760405162461bcd60e51b81526004016105cd9061158a565b60026003553361099b610fce565b600b556109a6610b55565b600a556001600160a01b038116156109ed576109c181610419565b6001600160a01b0382166000908152600d6020908152604080832093909355600b54600c909152919020555b336000908152600d60205260409020548015610a6257336000818152600d6020526040812055600554610a30916101009091046001600160a01b031690836110c5565b60405181815233907fe2403640ba68fed3a2f88b7557551d1993f84b99bb10ff833f0cf8db0c5e048690602001610700565b50506001600355565b6001546001600160a01b03163314610ae35760405162461bcd60e51b815260206004820152603560248201527f596f75206d757374206265206e6f6d696e61746564206265666f726520796f7560448201527402063616e20616363657074206f776e65727368697605c1b60648201526084016105cd565b600054600154604080516001600160a01b0393841681529290911660208301527fb532073b38c83145e3e5135377a08bf9aab55bc0fd7c1179cd4fb995d2a5159c910160405180910390a160018054600080546001600160a01b03199081166001600160a01b03841617909155169055565b60006105a54260075461112d565b610b6b611053565b6000826001600160a01b03166395d89b416040518163ffffffff1660e01b815260040160006040518083038186803b158015610ba657600080fd5b505afa158015610bba573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052610be2919081019061146d565b80516020918201206040805180820190915260038152620a69cb60eb1b9201919091526006547fc33e514e79311fe606801af4b4f343c83a3b72dca711239a516f2103673922d190911491506001600160a01b03848116911614801590610c5c57506005546001600160a01b038481166101009092041614155b8015610c66575080155b610cc85760405162461bcd60e51b815260206004820152602d60248201527f43616e6e6f7420776974686472617720746865207374616b696e67206f72207260448201526c65776172647320746f6b656e7360981b60648201526084016105cd565b600054610ce2906001600160a01b038581169116846110c5565b604080516001600160a01b0385168152602081018490527f8c1256b8896378cd5044f80c202f9772b9d77dc85c8a6eb51967210b09bfaa28910161095d565b60026003541415610d445760405162461bcd60e51b81526004016105cd9061158a565b600260035560055460ff1615610dc25760405162461bcd60e51b815260206004820152603c60248201527f5468697320616374696f6e2063616e6e6f7420626520706572666f726d65642060448201527f7768696c652074686520636f6e7472616374206973207061757365640000000060648201526084016105cd565b33610dcb610fce565b600b55610dd6610b55565b600a556001600160a01b03811615610e1d57610df181610419565b6001600160a01b0382166000908152600d6020908152604080832093909355600b54600c909152919020555b60008211610e5e5760405162461bcd60e51b815260206004820152600e60248201526d043616e6e6f74207374616b6520360941b60448201526064016105cd565b81600e54610e6c91906115c1565b600e55336000908152600f6020526040902054610e8a9083906115c1565b336000818152600f6020526040902091909155600654610eb7916001600160a01b03909116903085611145565b60405182815233907f9e71bc8eea02a63969f509818f2dafb9254532904319f9dbda79b67bd34a5f3d90602001610700565b610ef1611053565b6007541580610f01575060075442115b610f995760405162461bcd60e51b815260206004820152605860248201527f50726576696f7573207265776172647320706572696f64206d7573742062652060448201527f636f6d706c657465206265666f7265206368616e67696e67207468652064757260648201527f6174696f6e20666f7220746865206e657720706572696f640000000000000000608482015260a4016105cd565b60098190556040518181527ffb46ca5a5e06d4540d6387b930a7c978bce0db5f449ec6b3f5d07c6e1d44f2d3906020016104e8565b6000600e5460001415610fe25750600b5490565b600e54600854600a54610ff3610b55565b610ffd9190611618565b61100791906115f9565b61101990670de0b6b3a76400006115f9565b61102391906115d9565b600b546105a591906115c1565b336000908152600f6020526040902054611049906105aa565b61105161096a565b565b6000546001600160a01b031633146110515760405162461bcd60e51b815260206004820152602f60248201527f4f6e6c792074686520636f6e7472616374206f776e6572206d6179207065726660448201526e37b936903a3434b99030b1ba34b7b760891b60648201526084016105cd565b6040516001600160a01b03831660248201526044810182905261112890849063a9059cbb60e01b906064015b60408051601f198184030181529190526020810180516001600160e01b03166001600160e01b031990931692909217909152611183565b505050565b600081831061113c578161113e565b825b9392505050565b6040516001600160a01b038085166024830152831660448201526064810182905261117d9085906323b872dd60e01b906084016110f1565b50505050565b60006111d8826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b03166112559092919063ffffffff16565b80519091501561112857808060200190518101906111f69190611451565b6111285760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b60648201526084016105cd565b6060611264848460008561126c565b949350505050565b6060824710156112cd5760405162461bcd60e51b815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f6044820152651c8818d85b1b60d21b60648201526084016105cd565b6001600160a01b0385163b6113245760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e747261637400000060448201526064016105cd565b600080866001600160a01b03168587604051611340919061153b565b60006040518083038185875af1925050503d806000811461137d576040519150601f19603f3d011682016040523d82523d6000602084013e611382565b606091505b509150915061139282828661139d565b979650505050505050565b606083156113ac57508161113e565b8251156113bc5782518084602001fd5b8160405162461bcd60e51b81526004016105cd9190611557565b80356001600160a01b03811681146113ed57600080fd5b919050565b600060208284031215611403578081fd5b61113e826113d6565b6000806040838503121561141e578081fd5b611427836113d6565b946020939093013593505050565b600060208284031215611446578081fd5b813561113e81611687565b600060208284031215611462578081fd5b815161113e81611687565b60006020828403121561147e578081fd5b815167ffffffffffffffff80821115611495578283fd5b818401915084601f8301126114a8578283fd5b8151818111156114ba576114ba611671565b604051601f8201601f19908116603f011681019083821181831017156114e2576114e2611671565b816040528281528760208487010111156114fa578586fd5b61139283602083016020880161162f565b60006020828403121561151c578081fd5b5035919050565b600060208284031215611534578081fd5b5051919050565b6000825161154d81846020870161162f565b9190910192915050565b602081526000825180602084015261157681604085016020870161162f565b601f01601f19169190910160400192915050565b6020808252601f908201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c00604082015260600190565b600082198211156115d4576115d461165b565b500190565b6000826115f457634e487b7160e01b81526012600452602481fd5b500490565b60008160001904831182151516156116135761161361165b565b500290565b60008282101561162a5761162a61165b565b500390565b60005b8381101561164a578181015183820152602001611632565b8381111561117d5750506000910152565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052604160045260246000fd5b801515811461056657600080fdfea26469706673582212200d5c0ec32650a09c98d8b1c84ff05af1acc0db38fd4f8dedd2203f18fab1f5e564736f6c63430008040033";

type CVIUSDCLPStakingRewardsConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: CVIUSDCLPStakingRewardsConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class CVIUSDCLPStakingRewards__factory extends ContractFactory {
  constructor(...args: CVIUSDCLPStakingRewardsConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _owner: string,
    _rewardsDistribution: string,
    _rewardsToken: string,
    _stakingToken: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<CVIUSDCLPStakingRewards> {
    return super.deploy(
      _owner,
      _rewardsDistribution,
      _rewardsToken,
      _stakingToken,
      overrides || {}
    ) as Promise<CVIUSDCLPStakingRewards>;
  }
  override getDeployTransaction(
    _owner: string,
    _rewardsDistribution: string,
    _rewardsToken: string,
    _stakingToken: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      _owner,
      _rewardsDistribution,
      _rewardsToken,
      _stakingToken,
      overrides || {}
    );
  }
  override attach(address: string): CVIUSDCLPStakingRewards {
    return super.attach(address) as CVIUSDCLPStakingRewards;
  }
  override connect(signer: Signer): CVIUSDCLPStakingRewards__factory {
    return super.connect(signer) as CVIUSDCLPStakingRewards__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): CVIUSDCLPStakingRewardsInterface {
    return new utils.Interface(_abi) as CVIUSDCLPStakingRewardsInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): CVIUSDCLPStakingRewards {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as CVIUSDCLPStakingRewards;
  }
}
