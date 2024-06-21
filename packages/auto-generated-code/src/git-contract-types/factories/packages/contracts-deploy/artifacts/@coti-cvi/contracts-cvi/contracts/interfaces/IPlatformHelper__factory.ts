/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IPlatformHelper,
  IPlatformHelperInterface,
} from "../../../../../../../../packages/contracts-deploy/artifacts/@coti-cvi/contracts-cvi/contracts/interfaces/IPlatformHelper";

const _abi = [
  {
    inputs: [
      {
        internalType: "contract IVolatilityToken",
        name: "volToken",
        type: "address",
      },
      {
        internalType: "bool",
        name: "isKeepers",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "volTokensAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "timeWindow",
        type: "uint256",
      },
    ],
    name: "calculatePreBurn",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "netBurnAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "expectedUSDCAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "closeFee",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "timeWindowFee",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "keepersFee",
            type: "uint256",
          },
        ],
        internalType: "struct IPlatformHelper.PreBurnResult",
        name: "result",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IVolatilityToken",
        name: "volToken",
        type: "address",
      },
      {
        internalType: "bool",
        name: "isKeepers",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "usdcAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "timeWindow",
        type: "uint256",
      },
    ],
    name: "calculatePreMint",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "netMintAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "expectedVolTokensAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "buyingPremiumFeePercentage",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "openPositionFee",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "buyingPremiumFee",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "timeWindowFee",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "keepersFee",
            type: "uint256",
          },
        ],
        internalType: "struct IPlatformHelper.PreMintResult",
        name: "result",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "calculateStakingAPR",
    outputs: [
      {
        internalType: "uint256",
        name: "apr",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IVolatilityToken",
        name: "volToken",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "requestId",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isKeepers",
        type: "bool",
      },
    ],
    name: "checkBurnRequest",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "netBurnAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "expectedUSDCAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "closeFee",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "timePenaltyFee",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "keepersFee",
            type: "uint256",
          },
        ],
        internalType: "struct IPlatformHelper.CheckBurnResult",
        name: "result",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IVolatilityToken",
        name: "volToken",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "requestId",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isKeepers",
        type: "bool",
      },
    ],
    name: "checkMintRequest",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "netMintAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "expectedVolTokensAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "buyingPremiumFeePercentage",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "openPositionFee",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "buyingPremiumFee",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "timePenaltyFee",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "keepersFee",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "insufficientLiquidity",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "insufficientSlippage",
            type: "bool",
          },
        ],
        internalType: "struct IPlatformHelper.CheckMintResult",
        name: "result",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IPlatform",
        name: "platform",
        type: "address",
      },
    ],
    name: "collateralRatio",
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
    name: "convertGOVIToXGOVI",
    outputs: [
      {
        internalType: "uint256",
        name: "xGOVIAmount",
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
        name: "xGOVIAmount",
        type: "uint256",
      },
    ],
    name: "convertXGOVIToGOVI",
    outputs: [
      {
        internalType: "uint256",
        name: "goviAmount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IPlatform",
        name: "platform",
        type: "address",
      },
    ],
    name: "dailyFundingFee",
    outputs: [
      {
        internalType: "uint256",
        name: "fundingFeePercent",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IPlatform",
        name: "platform",
        type: "address",
      },
      {
        internalType: "uint32",
        name: "minCVI",
        type: "uint32",
      },
      {
        internalType: "uint32",
        name: "maxCVI",
        type: "uint32",
      },
      {
        internalType: "uint256",
        name: "minCollateral",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "maxCollateral",
        type: "uint256",
      },
    ],
    name: "fundingFeeValues",
    outputs: [
      {
        internalType: "uint256[][]",
        name: "fundingFeeRatePercent",
        type: "uint256[][]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IVolatilityToken",
        name: "volToken",
        type: "address",
      },
    ],
    name: "maxMintAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "maxAmount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IThetaVault",
        name: "thetaVault",
        type: "address",
      },
    ],
    name: "maxWithdrawAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "maxAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "maxUSDCAmount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IPlatform",
        name: "platform",
        type: "address",
      },
    ],
    name: "premiumFeeCollateralRatio",
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
    name: "stakedGOVI",
    outputs: [
      {
        internalType: "uint256",
        name: "stakedAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "share",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IThetaVault",
        name: "thetaVault",
        type: "address",
      },
    ],
    name: "volTokenDexPrice",
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
        internalType: "contract IVolatilityToken",
        name: "volToken",
        type: "address",
      },
    ],
    name: "volTokenIntrinsicPrice",
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
        internalType: "contract IThetaVault",
        name: "thetaVault",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "withdrawAmount",
        type: "uint256",
      },
    ],
    name: "willWithdrawSucceed",
    outputs: [
      {
        internalType: "bool",
        name: "success",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export class IPlatformHelper__factory {
  static readonly abi = _abi;
  static createInterface(): IPlatformHelperInterface {
    return new utils.Interface(_abi) as IPlatformHelperInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IPlatformHelper {
    return new Contract(address, _abi, signerOrProvider) as IPlatformHelper;
  }
}
