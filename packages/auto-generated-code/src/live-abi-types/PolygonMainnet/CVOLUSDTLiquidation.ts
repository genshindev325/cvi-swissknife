/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";

export interface CVOLUSDTLiquidationInterface extends utils.Interface {
  contractName: "CVOLUSDTLiquidation";
  functions: {
    "LIQUIDATION_MAX_FEE_PERCENTAGE()": FunctionFragment;
    "liquidationMaxRewardPercents(uint256)": FunctionFragment;
    "liquidationMinRewardPercent()": FunctionFragment;
    "liquidationMinThresholdPercents(uint256)": FunctionFragment;
    "owner()": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "setMinLiquidationThresholdPercents(uint16[8])": FunctionFragment;
    "setMinLiquidationRewardPercent(uint16)": FunctionFragment;
    "setMaxLiquidationRewardPercents(uint16[8])": FunctionFragment;
    "isLiquidationCandidate(uint256,bool,uint168,uint16,uint8)": FunctionFragment;
    "getLiquidationReward(uint256,bool,uint168,uint16,uint8)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "LIQUIDATION_MAX_FEE_PERCENTAGE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "liquidationMaxRewardPercents",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "liquidationMinRewardPercent",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "liquidationMinThresholdPercents",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "setMinLiquidationThresholdPercents",
    values: [BigNumberish[]]
  ): string;
  encodeFunctionData(
    functionFragment: "setMinLiquidationRewardPercent",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setMaxLiquidationRewardPercents",
    values: [BigNumberish[]]
  ): string;
  encodeFunctionData(
    functionFragment: "isLiquidationCandidate",
    values: [BigNumberish, boolean, BigNumberish, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getLiquidationReward",
    values: [BigNumberish, boolean, BigNumberish, BigNumberish, BigNumberish]
  ): string;

  decodeFunctionResult(
    functionFragment: "LIQUIDATION_MAX_FEE_PERCENTAGE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "liquidationMaxRewardPercents",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "liquidationMinRewardPercent",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "liquidationMinThresholdPercents",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setMinLiquidationThresholdPercents",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setMinLiquidationRewardPercent",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setMaxLiquidationRewardPercents",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isLiquidationCandidate",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getLiquidationReward",
    data: BytesLike
  ): Result;

  events: {
    "OwnershipTransferred(address,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
}

export type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  { previousOwner: string; newOwner: string }
>;

export type OwnershipTransferredEventFilter =
  TypedEventFilter<OwnershipTransferredEvent>;

export interface CVOLUSDTLiquidation extends BaseContract {
  contractName: "CVOLUSDTLiquidation";
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: CVOLUSDTLiquidationInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    LIQUIDATION_MAX_FEE_PERCENTAGE(
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    liquidationMaxRewardPercents(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[number]>;

    liquidationMinRewardPercent(overrides?: CallOverrides): Promise<[number]>;

    liquidationMinThresholdPercents(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[number]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setMinLiquidationThresholdPercents(
      _newMinThresholdPercents: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setMinLiquidationRewardPercent(
      _newMinRewardPercent: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setMaxLiquidationRewardPercents(
      _newMaxRewardPercents: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    isLiquidationCandidate(
      _positionBalance: BigNumberish,
      _isPositive: boolean,
      _positionUnitsAmount: BigNumberish,
      _openCVIValue: BigNumberish,
      _leverage: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    getLiquidationReward(
      _positionBalance: BigNumberish,
      _isPositive: boolean,
      _positionUnitsAmount: BigNumberish,
      _openCVIValue: BigNumberish,
      _leverage: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { finderFeeAmount: BigNumber }>;
  };

  LIQUIDATION_MAX_FEE_PERCENTAGE(overrides?: CallOverrides): Promise<BigNumber>;

  liquidationMaxRewardPercents(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<number>;

  liquidationMinRewardPercent(overrides?: CallOverrides): Promise<number>;

  liquidationMinThresholdPercents(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<number>;

  owner(overrides?: CallOverrides): Promise<string>;

  renounceOwnership(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setMinLiquidationThresholdPercents(
    _newMinThresholdPercents: BigNumberish[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setMinLiquidationRewardPercent(
    _newMinRewardPercent: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setMaxLiquidationRewardPercents(
    _newMaxRewardPercents: BigNumberish[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  isLiquidationCandidate(
    _positionBalance: BigNumberish,
    _isPositive: boolean,
    _positionUnitsAmount: BigNumberish,
    _openCVIValue: BigNumberish,
    _leverage: BigNumberish,
    overrides?: CallOverrides
  ): Promise<boolean>;

  getLiquidationReward(
    _positionBalance: BigNumberish,
    _isPositive: boolean,
    _positionUnitsAmount: BigNumberish,
    _openCVIValue: BigNumberish,
    _leverage: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  callStatic: {
    LIQUIDATION_MAX_FEE_PERCENTAGE(
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    liquidationMaxRewardPercents(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<number>;

    liquidationMinRewardPercent(overrides?: CallOverrides): Promise<number>;

    liquidationMinThresholdPercents(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<number>;

    owner(overrides?: CallOverrides): Promise<string>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;

    setMinLiquidationThresholdPercents(
      _newMinThresholdPercents: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<void>;

    setMinLiquidationRewardPercent(
      _newMinRewardPercent: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    setMaxLiquidationRewardPercents(
      _newMaxRewardPercents: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<void>;

    isLiquidationCandidate(
      _positionBalance: BigNumberish,
      _isPositive: boolean,
      _positionUnitsAmount: BigNumberish,
      _openCVIValue: BigNumberish,
      _leverage: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    getLiquidationReward(
      _positionBalance: BigNumberish,
      _isPositive: boolean,
      _positionUnitsAmount: BigNumberish,
      _openCVIValue: BigNumberish,
      _leverage: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  filters: {
    "OwnershipTransferred(address,address)"(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter;
  };

  estimateGas: {
    LIQUIDATION_MAX_FEE_PERCENTAGE(
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    liquidationMaxRewardPercents(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    liquidationMinRewardPercent(overrides?: CallOverrides): Promise<BigNumber>;

    liquidationMinThresholdPercents(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setMinLiquidationThresholdPercents(
      _newMinThresholdPercents: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setMinLiquidationRewardPercent(
      _newMinRewardPercent: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setMaxLiquidationRewardPercents(
      _newMaxRewardPercents: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    isLiquidationCandidate(
      _positionBalance: BigNumberish,
      _isPositive: boolean,
      _positionUnitsAmount: BigNumberish,
      _openCVIValue: BigNumberish,
      _leverage: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getLiquidationReward(
      _positionBalance: BigNumberish,
      _isPositive: boolean,
      _positionUnitsAmount: BigNumberish,
      _openCVIValue: BigNumberish,
      _leverage: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    LIQUIDATION_MAX_FEE_PERCENTAGE(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    liquidationMaxRewardPercents(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    liquidationMinRewardPercent(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    liquidationMinThresholdPercents(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setMinLiquidationThresholdPercents(
      _newMinThresholdPercents: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setMinLiquidationRewardPercent(
      _newMinRewardPercent: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setMaxLiquidationRewardPercents(
      _newMaxRewardPercents: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    isLiquidationCandidate(
      _positionBalance: BigNumberish,
      _isPositive: boolean,
      _positionUnitsAmount: BigNumberish,
      _openCVIValue: BigNumberish,
      _leverage: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getLiquidationReward(
      _positionBalance: BigNumberish,
      _isPositive: boolean,
      _positionUnitsAmount: BigNumberish,
      _openCVIValue: BigNumberish,
      _leverage: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
