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

export interface CVOLUSDCPositionRewardsImplementationInterface
  extends utils.Interface {
  contractName: "CVOLUSDCPositionRewardsImplementation";
  functions: {
    "PRECISION_DECIMALS()": FunctionFragment;
    "calculatePositionReward(uint256,uint256)": FunctionFragment;
    "claimReward()": FunctionFragment;
    "claimedPositionUnits(address,uint32)": FunctionFragment;
    "cviToken()": FunctionFragment;
    "extractRewards()": FunctionFragment;
    "initialize(address)": FunctionFragment;
    "lastClaimedDay()": FunctionFragment;
    "lastMaxSingleReward()": FunctionFragment;
    "lastRewardMaxLinearGOVI()": FunctionFragment;
    "lastRewardMaxLinearPositionUnits()": FunctionFragment;
    "maxClaimPeriod()": FunctionFragment;
    "maxDailyReward()": FunctionFragment;
    "maxRewardTime()": FunctionFragment;
    "maxRewardTimePercentageGain()": FunctionFragment;
    "maxSingleReward()": FunctionFragment;
    "owner()": FunctionFragment;
    "platform()": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "rewardCalculationValidTimestamp()": FunctionFragment;
    "rewardFactor()": FunctionFragment;
    "rewardMaxLinearGOVI()": FunctionFragment;
    "rewardMaxLinearPositionUnits()": FunctionFragment;
    "setMaxClaimPeriod(uint256)": FunctionFragment;
    "setMaxDailyReward(uint256)": FunctionFragment;
    "setMaxRewardTime(uint256)": FunctionFragment;
    "setMaxRewardTimePercentageGain(uint256)": FunctionFragment;
    "setPlatform(address)": FunctionFragment;
    "setRewardCalculationParameters(uint256,uint256,uint256)": FunctionFragment;
    "setRewardFactor(uint256)": FunctionFragment;
    "todayClaimedRewards()": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "PRECISION_DECIMALS",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "calculatePositionReward",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "claimReward",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "claimedPositionUnits",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "cviToken", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "extractRewards",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "initialize", values: [string]): string;
  encodeFunctionData(
    functionFragment: "lastClaimedDay",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "lastMaxSingleReward",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "lastRewardMaxLinearGOVI",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "lastRewardMaxLinearPositionUnits",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "maxClaimPeriod",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "maxDailyReward",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "maxRewardTime",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "maxRewardTimePercentageGain",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "maxSingleReward",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(functionFragment: "platform", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "rewardCalculationValidTimestamp",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "rewardFactor",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "rewardMaxLinearGOVI",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "rewardMaxLinearPositionUnits",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setMaxClaimPeriod",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setMaxDailyReward",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setMaxRewardTime",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setMaxRewardTimePercentageGain",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "setPlatform", values: [string]): string;
  encodeFunctionData(
    functionFragment: "setRewardCalculationParameters",
    values: [BigNumberish, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setRewardFactor",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "todayClaimedRewards",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;

  decodeFunctionResult(
    functionFragment: "PRECISION_DECIMALS",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "calculatePositionReward",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "claimReward",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "claimedPositionUnits",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "cviToken", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "extractRewards",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "lastClaimedDay",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "lastMaxSingleReward",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "lastRewardMaxLinearGOVI",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "lastRewardMaxLinearPositionUnits",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "maxClaimPeriod",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "maxDailyReward",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "maxRewardTime",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "maxRewardTimePercentageGain",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "maxSingleReward",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "platform", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "rewardCalculationValidTimestamp",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "rewardFactor",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "rewardMaxLinearGOVI",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "rewardMaxLinearPositionUnits",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setMaxClaimPeriod",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setMaxDailyReward",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setMaxRewardTime",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setMaxRewardTimePercentageGain",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setPlatform",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setRewardCalculationParameters",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setRewardFactor",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "todayClaimedRewards",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;

  events: {
    "Claimed(address,uint256)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Claimed"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
}

export type ClaimedEvent = TypedEvent<
  [string, BigNumber],
  { account: string; rewardAmount: BigNumber }
>;

export type ClaimedEventFilter = TypedEventFilter<ClaimedEvent>;

export type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  { previousOwner: string; newOwner: string }
>;

export type OwnershipTransferredEventFilter =
  TypedEventFilter<OwnershipTransferredEvent>;

export interface CVOLUSDCPositionRewardsImplementation extends BaseContract {
  contractName: "CVOLUSDCPositionRewardsImplementation";
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: CVOLUSDCPositionRewardsImplementationInterface;

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
    PRECISION_DECIMALS(overrides?: CallOverrides): Promise<[BigNumber]>;

    calculatePositionReward(
      _positionUnits: BigNumberish,
      _positionTimestamp: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { rewardAmount: BigNumber }>;

    claimReward(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    claimedPositionUnits(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    cviToken(overrides?: CallOverrides): Promise<[string]>;

    extractRewards(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    initialize(
      _cviToken: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    lastClaimedDay(overrides?: CallOverrides): Promise<[BigNumber]>;

    lastMaxSingleReward(overrides?: CallOverrides): Promise<[BigNumber]>;

    lastRewardMaxLinearGOVI(overrides?: CallOverrides): Promise<[BigNumber]>;

    lastRewardMaxLinearPositionUnits(
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    maxClaimPeriod(overrides?: CallOverrides): Promise<[BigNumber]>;

    maxDailyReward(overrides?: CallOverrides): Promise<[BigNumber]>;

    maxRewardTime(overrides?: CallOverrides): Promise<[BigNumber]>;

    maxRewardTimePercentageGain(
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    maxSingleReward(overrides?: CallOverrides): Promise<[BigNumber]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    platform(overrides?: CallOverrides): Promise<[string]>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    rewardCalculationValidTimestamp(
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    rewardFactor(overrides?: CallOverrides): Promise<[BigNumber]>;

    rewardMaxLinearGOVI(overrides?: CallOverrides): Promise<[BigNumber]>;

    rewardMaxLinearPositionUnits(
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    setMaxClaimPeriod(
      _newMaxClaimPeriod: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setMaxDailyReward(
      _newMaxDailyReward: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setMaxRewardTime(
      _newMaxRewardTime: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setMaxRewardTimePercentageGain(
      _newMaxRewardTimePercentageGain: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setPlatform(
      _newPlatform: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setRewardCalculationParameters(
      _newMaxSingleReward: BigNumberish,
      _rewardMaxLinearPositionUnits: BigNumberish,
      _rewardMaxLinearGOVI: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setRewardFactor(
      _newRewardFactor: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    todayClaimedRewards(overrides?: CallOverrides): Promise<[BigNumber]>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  PRECISION_DECIMALS(overrides?: CallOverrides): Promise<BigNumber>;

  calculatePositionReward(
    _positionUnits: BigNumberish,
    _positionTimestamp: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  claimReward(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  claimedPositionUnits(
    arg0: string,
    arg1: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  cviToken(overrides?: CallOverrides): Promise<string>;

  extractRewards(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  initialize(
    _cviToken: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  lastClaimedDay(overrides?: CallOverrides): Promise<BigNumber>;

  lastMaxSingleReward(overrides?: CallOverrides): Promise<BigNumber>;

  lastRewardMaxLinearGOVI(overrides?: CallOverrides): Promise<BigNumber>;

  lastRewardMaxLinearPositionUnits(
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  maxClaimPeriod(overrides?: CallOverrides): Promise<BigNumber>;

  maxDailyReward(overrides?: CallOverrides): Promise<BigNumber>;

  maxRewardTime(overrides?: CallOverrides): Promise<BigNumber>;

  maxRewardTimePercentageGain(overrides?: CallOverrides): Promise<BigNumber>;

  maxSingleReward(overrides?: CallOverrides): Promise<BigNumber>;

  owner(overrides?: CallOverrides): Promise<string>;

  platform(overrides?: CallOverrides): Promise<string>;

  renounceOwnership(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  rewardCalculationValidTimestamp(
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  rewardFactor(overrides?: CallOverrides): Promise<BigNumber>;

  rewardMaxLinearGOVI(overrides?: CallOverrides): Promise<BigNumber>;

  rewardMaxLinearPositionUnits(overrides?: CallOverrides): Promise<BigNumber>;

  setMaxClaimPeriod(
    _newMaxClaimPeriod: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setMaxDailyReward(
    _newMaxDailyReward: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setMaxRewardTime(
    _newMaxRewardTime: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setMaxRewardTimePercentageGain(
    _newMaxRewardTimePercentageGain: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setPlatform(
    _newPlatform: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setRewardCalculationParameters(
    _newMaxSingleReward: BigNumberish,
    _rewardMaxLinearPositionUnits: BigNumberish,
    _rewardMaxLinearGOVI: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setRewardFactor(
    _newRewardFactor: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  todayClaimedRewards(overrides?: CallOverrides): Promise<BigNumber>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    PRECISION_DECIMALS(overrides?: CallOverrides): Promise<BigNumber>;

    calculatePositionReward(
      _positionUnits: BigNumberish,
      _positionTimestamp: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    claimReward(overrides?: CallOverrides): Promise<void>;

    claimedPositionUnits(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    cviToken(overrides?: CallOverrides): Promise<string>;

    extractRewards(overrides?: CallOverrides): Promise<void>;

    initialize(_cviToken: string, overrides?: CallOverrides): Promise<void>;

    lastClaimedDay(overrides?: CallOverrides): Promise<BigNumber>;

    lastMaxSingleReward(overrides?: CallOverrides): Promise<BigNumber>;

    lastRewardMaxLinearGOVI(overrides?: CallOverrides): Promise<BigNumber>;

    lastRewardMaxLinearPositionUnits(
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    maxClaimPeriod(overrides?: CallOverrides): Promise<BigNumber>;

    maxDailyReward(overrides?: CallOverrides): Promise<BigNumber>;

    maxRewardTime(overrides?: CallOverrides): Promise<BigNumber>;

    maxRewardTimePercentageGain(overrides?: CallOverrides): Promise<BigNumber>;

    maxSingleReward(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<string>;

    platform(overrides?: CallOverrides): Promise<string>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    rewardCalculationValidTimestamp(
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    rewardFactor(overrides?: CallOverrides): Promise<BigNumber>;

    rewardMaxLinearGOVI(overrides?: CallOverrides): Promise<BigNumber>;

    rewardMaxLinearPositionUnits(overrides?: CallOverrides): Promise<BigNumber>;

    setMaxClaimPeriod(
      _newMaxClaimPeriod: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    setMaxDailyReward(
      _newMaxDailyReward: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    setMaxRewardTime(
      _newMaxRewardTime: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    setMaxRewardTimePercentageGain(
      _newMaxRewardTimePercentageGain: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    setPlatform(_newPlatform: string, overrides?: CallOverrides): Promise<void>;

    setRewardCalculationParameters(
      _newMaxSingleReward: BigNumberish,
      _rewardMaxLinearPositionUnits: BigNumberish,
      _rewardMaxLinearGOVI: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    setRewardFactor(
      _newRewardFactor: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    todayClaimedRewards(overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "Claimed(address,uint256)"(
      account?: string | null,
      rewardAmount?: null
    ): ClaimedEventFilter;
    Claimed(account?: string | null, rewardAmount?: null): ClaimedEventFilter;

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
    PRECISION_DECIMALS(overrides?: CallOverrides): Promise<BigNumber>;

    calculatePositionReward(
      _positionUnits: BigNumberish,
      _positionTimestamp: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    claimReward(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    claimedPositionUnits(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    cviToken(overrides?: CallOverrides): Promise<BigNumber>;

    extractRewards(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    initialize(
      _cviToken: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    lastClaimedDay(overrides?: CallOverrides): Promise<BigNumber>;

    lastMaxSingleReward(overrides?: CallOverrides): Promise<BigNumber>;

    lastRewardMaxLinearGOVI(overrides?: CallOverrides): Promise<BigNumber>;

    lastRewardMaxLinearPositionUnits(
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    maxClaimPeriod(overrides?: CallOverrides): Promise<BigNumber>;

    maxDailyReward(overrides?: CallOverrides): Promise<BigNumber>;

    maxRewardTime(overrides?: CallOverrides): Promise<BigNumber>;

    maxRewardTimePercentageGain(overrides?: CallOverrides): Promise<BigNumber>;

    maxSingleReward(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    platform(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    rewardCalculationValidTimestamp(
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    rewardFactor(overrides?: CallOverrides): Promise<BigNumber>;

    rewardMaxLinearGOVI(overrides?: CallOverrides): Promise<BigNumber>;

    rewardMaxLinearPositionUnits(overrides?: CallOverrides): Promise<BigNumber>;

    setMaxClaimPeriod(
      _newMaxClaimPeriod: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setMaxDailyReward(
      _newMaxDailyReward: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setMaxRewardTime(
      _newMaxRewardTime: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setMaxRewardTimePercentageGain(
      _newMaxRewardTimePercentageGain: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setPlatform(
      _newPlatform: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setRewardCalculationParameters(
      _newMaxSingleReward: BigNumberish,
      _rewardMaxLinearPositionUnits: BigNumberish,
      _rewardMaxLinearGOVI: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setRewardFactor(
      _newRewardFactor: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    todayClaimedRewards(overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    PRECISION_DECIMALS(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    calculatePositionReward(
      _positionUnits: BigNumberish,
      _positionTimestamp: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    claimReward(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    claimedPositionUnits(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    cviToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    extractRewards(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    initialize(
      _cviToken: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    lastClaimedDay(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    lastMaxSingleReward(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    lastRewardMaxLinearGOVI(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    lastRewardMaxLinearPositionUnits(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    maxClaimPeriod(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    maxDailyReward(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    maxRewardTime(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    maxRewardTimePercentageGain(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    maxSingleReward(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    platform(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    rewardCalculationValidTimestamp(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    rewardFactor(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    rewardMaxLinearGOVI(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    rewardMaxLinearPositionUnits(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    setMaxClaimPeriod(
      _newMaxClaimPeriod: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setMaxDailyReward(
      _newMaxDailyReward: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setMaxRewardTime(
      _newMaxRewardTime: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setMaxRewardTimePercentageGain(
      _newMaxRewardTimePercentageGain: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setPlatform(
      _newPlatform: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setRewardCalculationParameters(
      _newMaxSingleReward: BigNumberish,
      _rewardMaxLinearPositionUnits: BigNumberish,
      _rewardMaxLinearGOVI: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setRewardFactor(
      _newRewardFactor: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    todayClaimedRewards(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
