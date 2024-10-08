/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type {
  CVOLUSDCPlatformImplementation,
  CVOLUSDCPlatformImplementationInterface,
} from "../CVOLUSDCPlatformImplementation";

const _abi = [
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
        name: "account",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tokenAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "feeAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "positionUnitsAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "leverage",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "cviValue",
        type: "uint256",
      },
    ],
    name: "ClosePosition",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tokenAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "lpTokensAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "feeAmount",
        type: "uint256",
      },
    ],
    name: "Deposit",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "positionAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "currentPositionBalance",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "isBalancePositive",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "positionUnitsAmount",
        type: "uint256",
      },
    ],
    name: "LiquidatePosition",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tokenAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "leverage",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "feeAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "positionUnitsAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "cviValue",
        type: "uint256",
      },
    ],
    name: "OpenPosition",
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
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tokenAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "lpTokensAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "feeAmount",
        type: "uint256",
      },
    ],
    name: "Withdraw",
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
    name: "PRECISION_DECIMALS",
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
    name: "buyersLockupPeriod",
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
    name: "calculateLatestTurbulenceIndicatorPercent",
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
        internalType: "address",
        name: "_positionAddress",
        type: "address",
      },
    ],
    name: "calculatePositionBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "currentPositionBalance",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isPositive",
        type: "bool",
      },
      {
        internalType: "uint168",
        name: "positionUnitsAmount",
        type: "uint168",
      },
      {
        internalType: "uint8",
        name: "leverage",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "fundingFees",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "marginDebt",
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
        name: "_positionAddress",
        type: "address",
      },
      {
        internalType: "uint168",
        name: "_positionUnitsAmount",
        type: "uint168",
      },
    ],
    name: "calculatePositionPendingFees",
    outputs: [
      {
        internalType: "uint256",
        name: "pendingFees",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint168",
        name: "_positionUnitsAmount",
        type: "uint168",
      },
      {
        internalType: "uint16",
        name: "_minCVI",
        type: "uint16",
      },
      {
        internalType: "uint16",
        name: "_maxClosingPremiumFeePercentage",
        type: "uint16",
      },
    ],
    name: "closePosition",
    outputs: [
      {
        internalType: "uint256",
        name: "tokenAmount",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint168",
        name: "_positionUnitsAmount",
        type: "uint168",
      },
      {
        internalType: "uint16",
        name: "_minCVI",
        type: "uint16",
      },
    ],
    name: "closePositionWithoutVolumeFee",
    outputs: [
      {
        internalType: "uint256",
        name: "tokenAmount",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "cviOracle",
    outputs: [
      {
        internalType: "contract ICVIOracle",
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
        name: "",
        type: "uint256",
      },
    ],
    name: "cviSnapshots",
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
        internalType: "uint256",
        name: "_tokenAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_minLPTokenAmount",
        type: "uint256",
      },
    ],
    name: "deposit",
    outputs: [
      {
        internalType: "uint256",
        name: "lpTokenAmount",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "emergencyWithdrawAllowed",
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
    name: "feesCalculator",
    outputs: [
      {
        internalType: "contract IFeesCalculator",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "feesCollector",
    outputs: [
      {
        internalType: "contract IFeesCollector",
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
        internalType: "uint256",
        name: "_tokenAmount",
        type: "uint256",
      },
    ],
    name: "increaseSharedPool",
    outputs: [],
    stateMutability: "nonpayable",
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
    name: "increaseSharedPoolAllowedAddresses",
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
    name: "initialTokenToLPTokenRate",
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
        internalType: "contract IERC20Upgradeable",
        name: "_token",
        type: "address",
      },
      {
        internalType: "string",
        name: "_lpTokenName",
        type: "string",
      },
      {
        internalType: "string",
        name: "_lpTokenSymbolName",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_initialTokenToLPTokenRate",
        type: "uint256",
      },
      {
        internalType: "uint16",
        name: "_maxCVIValue",
        type: "uint16",
      },
      {
        internalType: "contract IFeesCalculator",
        name: "_feesCalculator",
        type: "address",
      },
      {
        internalType: "contract ICVIOracle",
        name: "_cviOracle",
        type: "address",
      },
      {
        internalType: "contract ILiquidation",
        name: "_liquidation",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
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
    name: "lastDepositTimestamp",
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
    name: "latestOracleRoundId",
    outputs: [
      {
        internalType: "uint80",
        name: "",
        type: "uint80",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "latestSnapshotTimestamp",
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
    inputs: [
      {
        internalType: "address[]",
        name: "_positionOwners",
        type: "address[]",
      },
    ],
    name: "liquidatePositions",
    outputs: [
      {
        internalType: "uint256",
        name: "finderFeeAmount",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "liquidation",
    outputs: [
      {
        internalType: "contract ILiquidation",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "lpsLockupPeriod",
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
    name: "maxAllowedLeverage",
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
    name: "maxTimeAllowedAfterLatestRound",
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
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "noLockPositionAddresses",
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
        name: "",
        type: "address",
      },
    ],
    name: "noPremiumFeeAllowedAddresses",
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
        internalType: "uint168",
        name: "_tokenAmount",
        type: "uint168",
      },
      {
        internalType: "uint16",
        name: "_maxCVI",
        type: "uint16",
      },
      {
        internalType: "uint16",
        name: "_maxBuyingPremiumFeePercentage",
        type: "uint16",
      },
      {
        internalType: "uint8",
        name: "_leverage",
        type: "uint8",
      },
    ],
    name: "openPosition",
    outputs: [
      {
        internalType: "uint168",
        name: "positionUnitsAmount",
        type: "uint168",
      },
      {
        internalType: "uint168",
        name: "positionedTokenAmount",
        type: "uint168",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint168",
        name: "_tokenAmount",
        type: "uint168",
      },
      {
        internalType: "uint16",
        name: "_maxCVI",
        type: "uint16",
      },
      {
        internalType: "uint8",
        name: "_leverage",
        type: "uint8",
      },
    ],
    name: "openPositionWithoutPremiumFee",
    outputs: [
      {
        internalType: "uint168",
        name: "positionUnitsAmount",
        type: "uint168",
      },
      {
        internalType: "uint168",
        name: "positionedTokenAmount",
        type: "uint168",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint168",
        name: "_tokenAmount",
        type: "uint168",
      },
      {
        internalType: "uint16",
        name: "_maxCVI",
        type: "uint16",
      },
      {
        internalType: "uint16",
        name: "_maxBuyingPremiumFeePercentage",
        type: "uint16",
      },
      {
        internalType: "uint8",
        name: "_leverage",
        type: "uint8",
      },
    ],
    name: "openPositionWithoutVolumeFee",
    outputs: [
      {
        internalType: "uint168",
        name: "positionUnitsAmount",
        type: "uint168",
      },
      {
        internalType: "uint168",
        name: "positionedTokenAmount",
        type: "uint168",
      },
    ],
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
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "positions",
    outputs: [
      {
        internalType: "uint168",
        name: "positionUnitsAmount",
        type: "uint168",
      },
      {
        internalType: "uint8",
        name: "leverage",
        type: "uint8",
      },
      {
        internalType: "uint16",
        name: "openCVIValue",
        type: "uint16",
      },
      {
        internalType: "uint32",
        name: "creationTimestamp",
        type: "uint32",
      },
      {
        internalType: "uint32",
        name: "originalCreationTimestamp",
        type: "uint32",
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
        name: "",
        type: "address",
      },
    ],
    name: "revertLockedTransfered",
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
    name: "rewards",
    outputs: [
      {
        internalType: "contract IRewardsCollector",
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
        name: "_holderAddress",
        type: "address",
      },
      {
        internalType: "bool",
        name: "_shouldLockPosition",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "_noPremiumFeeAllowed",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "_increaseSharedPoolAllowed",
        type: "bool",
      },
    ],
    name: "setAddressSpecificParameters",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "_newEmergencyWithdrawAllowed",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "_newCanPurgeSnapshots",
        type: "bool",
      },
    ],
    name: "setEmergencyParameters",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IFeesCalculator",
        name: "_newCalculator",
        type: "address",
      },
    ],
    name: "setFeesCalculator",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint80",
        name: "_newOracleRoundId",
        type: "uint80",
      },
    ],
    name: "setLatestOracleRoundId",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_newLPLockupPeriod",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_newBuyersLockupPeriod",
        type: "uint256",
      },
    ],
    name: "setLockupPeriods",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_newMaxAllowedLeverage",
        type: "uint8",
      },
    ],
    name: "setMaxAllowedLeverage",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "_newMaxTimeAllowedAfterLatestRound",
        type: "uint32",
      },
    ],
    name: "setMaxTimeAllowedAfterLatestRound",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "_revertLockedTransfers",
        type: "bool",
      },
    ],
    name: "setRevertLockedTransfers",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IFeesCollector",
        name: "_newCollector",
        type: "address",
      },
      {
        internalType: "contract ICVIOracle",
        name: "_newOracle",
        type: "address",
      },
      {
        internalType: "contract IRewardsCollector",
        name: "_newRewards",
        type: "address",
      },
      {
        internalType: "contract ILiquidation",
        name: "_newLiquidation",
        type: "address",
      },
      {
        internalType: "address",
        name: "_newStakingContractAddress",
        type: "address",
      },
    ],
    name: "setSubContracts",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "stakingContractAddress",
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
    name: "token",
    outputs: [
      {
        internalType: "contract IERC20Upgradeable",
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
        name: "_withAddendum",
        type: "bool",
      },
    ],
    name: "totalBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "balance",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalFundingFeesAmount",
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
    name: "totalLeveragedTokensAmount",
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
    name: "totalPositionUnitsAmount",
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
        name: "recipient",
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
        name: "sender",
        type: "address",
      },
      {
        internalType: "address",
        name: "recipient",
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
        internalType: "uint256",
        name: "_tokenAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_maxLPTokenBurnAmount",
        type: "uint256",
      },
    ],
    name: "withdraw",
    outputs: [
      {
        internalType: "uint256",
        name: "burntAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "withdrawnAmount",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_lpTokensAmount",
        type: "uint256",
      },
    ],
    name: "withdrawLPTokens",
    outputs: [
      {
        internalType: "uint256",
        name: "burntAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "withdrawnAmount",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class CVOLUSDCPlatformImplementation__factory {
  static readonly abi = _abi;
  static createInterface(): CVOLUSDCPlatformImplementationInterface {
    return new utils.Interface(_abi) as CVOLUSDCPlatformImplementationInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): CVOLUSDCPlatformImplementation {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as CVOLUSDCPlatformImplementation;
  }
}
