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

export interface StakingInterface extends utils.Interface {
  contractName: "Staking";
  functions: {
    "PRECISION_DECIMALS()": FunctionFragment;
    "creationTimestamp()": FunctionFragment;
    "fallbackRecipient()": FunctionFragment;
    "owner()": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "stakeLockupTime()": FunctionFragment;
    "stakeTimestamps(address)": FunctionFragment;
    "stakes(address)": FunctionFragment;
    "totalProfits(address)": FunctionFragment;
    "totalStaked()": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "sendProfit(uint256,address)": FunctionFragment;
    "stake(uint256)": FunctionFragment;
    "unstake(uint256)": FunctionFragment;
    "claimProfit(address)": FunctionFragment;
    "claimAllProfits()": FunctionFragment;
    "addClaimableToken(address)": FunctionFragment;
    "removeClaimableToken(address)": FunctionFragment;
    "addToken(address)": FunctionFragment;
    "removeToken(address)": FunctionFragment;
    "convertFunds()": FunctionFragment;
    "setSwapper(address)": FunctionFragment;
    "setStakingLockupTime(uint256)": FunctionFragment;
    "profitOf(address,address)": FunctionFragment;
    "getClaimableTokens()": FunctionFragment;
    "getOtherTokens()": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "PRECISION_DECIMALS",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "creationTimestamp",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "fallbackRecipient",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "stakeLockupTime",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "stakeTimestamps",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "stakes", values: [string]): string;
  encodeFunctionData(
    functionFragment: "totalProfits",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "totalStaked",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "sendProfit",
    values: [BigNumberish, string]
  ): string;
  encodeFunctionData(functionFragment: "stake", values: [BigNumberish]): string;
  encodeFunctionData(
    functionFragment: "unstake",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "claimProfit", values: [string]): string;
  encodeFunctionData(
    functionFragment: "claimAllProfits",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "addClaimableToken",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "removeClaimableToken",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "addToken", values: [string]): string;
  encodeFunctionData(functionFragment: "removeToken", values: [string]): string;
  encodeFunctionData(
    functionFragment: "convertFunds",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "setSwapper", values: [string]): string;
  encodeFunctionData(
    functionFragment: "setStakingLockupTime",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "profitOf",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "getClaimableTokens",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getOtherTokens",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "PRECISION_DECIMALS",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "creationTimestamp",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "fallbackRecipient",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "stakeLockupTime",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "stakeTimestamps",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "stakes", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "totalProfits",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "totalStaked",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "sendProfit", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "stake", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "unstake", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "claimProfit",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "claimAllProfits",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "addClaimableToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "removeClaimableToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "addToken", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "removeToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "convertFunds",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setSwapper", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setStakingLockupTime",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "profitOf", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getClaimableTokens",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getOtherTokens",
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

export interface Staking extends BaseContract {
  contractName: "Staking";
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: StakingInterface;

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

    creationTimestamp(overrides?: CallOverrides): Promise<[BigNumber]>;

    fallbackRecipient(overrides?: CallOverrides): Promise<[string]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    stakeLockupTime(overrides?: CallOverrides): Promise<[BigNumber]>;

    stakeTimestamps(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    stakes(arg0: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    totalProfits(arg0: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    totalStaked(overrides?: CallOverrides): Promise<[BigNumber]>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    sendProfit(
      _amount: BigNumberish,
      _token: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    stake(
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    unstake(
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    claimProfit(
      token: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    claimAllProfits(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    addClaimableToken(
      _newClaimableToken: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    removeClaimableToken(
      _removedClaimableToken: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    addToken(
      _newToken: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    removeToken(
      _removedToken: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    convertFunds(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setSwapper(
      _newSwapper: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setStakingLockupTime(
      _newLockupTime: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    profitOf(
      _account: string,
      _token: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getClaimableTokens(overrides?: CallOverrides): Promise<[string[]]>;

    getOtherTokens(overrides?: CallOverrides): Promise<[string[]]>;
  };

  PRECISION_DECIMALS(overrides?: CallOverrides): Promise<BigNumber>;

  creationTimestamp(overrides?: CallOverrides): Promise<BigNumber>;

  fallbackRecipient(overrides?: CallOverrides): Promise<string>;

  owner(overrides?: CallOverrides): Promise<string>;

  renounceOwnership(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  stakeLockupTime(overrides?: CallOverrides): Promise<BigNumber>;

  stakeTimestamps(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  stakes(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  totalProfits(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  totalStaked(overrides?: CallOverrides): Promise<BigNumber>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  sendProfit(
    _amount: BigNumberish,
    _token: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  stake(
    _amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  unstake(
    _amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  claimProfit(
    token: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  claimAllProfits(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  addClaimableToken(
    _newClaimableToken: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  removeClaimableToken(
    _removedClaimableToken: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  addToken(
    _newToken: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  removeToken(
    _removedToken: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  convertFunds(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setSwapper(
    _newSwapper: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setStakingLockupTime(
    _newLockupTime: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  profitOf(
    _account: string,
    _token: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getClaimableTokens(overrides?: CallOverrides): Promise<string[]>;

  getOtherTokens(overrides?: CallOverrides): Promise<string[]>;

  callStatic: {
    PRECISION_DECIMALS(overrides?: CallOverrides): Promise<BigNumber>;

    creationTimestamp(overrides?: CallOverrides): Promise<BigNumber>;

    fallbackRecipient(overrides?: CallOverrides): Promise<string>;

    owner(overrides?: CallOverrides): Promise<string>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    stakeLockupTime(overrides?: CallOverrides): Promise<BigNumber>;

    stakeTimestamps(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    stakes(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    totalProfits(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    totalStaked(overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;

    sendProfit(
      _amount: BigNumberish,
      _token: string,
      overrides?: CallOverrides
    ): Promise<void>;

    stake(_amount: BigNumberish, overrides?: CallOverrides): Promise<void>;

    unstake(_amount: BigNumberish, overrides?: CallOverrides): Promise<void>;

    claimProfit(token: string, overrides?: CallOverrides): Promise<BigNumber>;

    claimAllProfits(overrides?: CallOverrides): Promise<BigNumber[]>;

    addClaimableToken(
      _newClaimableToken: string,
      overrides?: CallOverrides
    ): Promise<void>;

    removeClaimableToken(
      _removedClaimableToken: string,
      overrides?: CallOverrides
    ): Promise<void>;

    addToken(_newToken: string, overrides?: CallOverrides): Promise<void>;

    removeToken(
      _removedToken: string,
      overrides?: CallOverrides
    ): Promise<void>;

    convertFunds(overrides?: CallOverrides): Promise<void>;

    setSwapper(_newSwapper: string, overrides?: CallOverrides): Promise<void>;

    setStakingLockupTime(
      _newLockupTime: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    profitOf(
      _account: string,
      _token: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getClaimableTokens(overrides?: CallOverrides): Promise<string[]>;

    getOtherTokens(overrides?: CallOverrides): Promise<string[]>;
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
    PRECISION_DECIMALS(overrides?: CallOverrides): Promise<BigNumber>;

    creationTimestamp(overrides?: CallOverrides): Promise<BigNumber>;

    fallbackRecipient(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    stakeLockupTime(overrides?: CallOverrides): Promise<BigNumber>;

    stakeTimestamps(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    stakes(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    totalProfits(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    totalStaked(overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    sendProfit(
      _amount: BigNumberish,
      _token: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    stake(
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    unstake(
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    claimProfit(
      token: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    claimAllProfits(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    addClaimableToken(
      _newClaimableToken: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    removeClaimableToken(
      _removedClaimableToken: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    addToken(
      _newToken: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    removeToken(
      _removedToken: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    convertFunds(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setSwapper(
      _newSwapper: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setStakingLockupTime(
      _newLockupTime: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    profitOf(
      _account: string,
      _token: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getClaimableTokens(overrides?: CallOverrides): Promise<BigNumber>;

    getOtherTokens(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    PRECISION_DECIMALS(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    creationTimestamp(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    fallbackRecipient(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    stakeLockupTime(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    stakeTimestamps(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    stakes(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    totalProfits(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    totalStaked(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    sendProfit(
      _amount: BigNumberish,
      _token: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    stake(
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    unstake(
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    claimProfit(
      token: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    claimAllProfits(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    addClaimableToken(
      _newClaimableToken: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    removeClaimableToken(
      _removedClaimableToken: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    addToken(
      _newToken: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    removeToken(
      _removedToken: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    convertFunds(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setSwapper(
      _newSwapper: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setStakingLockupTime(
      _newLockupTime: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    profitOf(
      _account: string,
      _token: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getClaimableTokens(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getOtherTokens(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
