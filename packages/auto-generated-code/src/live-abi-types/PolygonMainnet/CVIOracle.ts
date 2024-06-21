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

export interface CVIOracleInterface extends utils.Interface {
  contractName: "CVIOracle";
  functions: {
    "cviAggregator()": FunctionFragment;
    "cviDeviationAggregator()": FunctionFragment;
    "deviationCheck()": FunctionFragment;
    "getCVILatestRoundData()": FunctionFragment;
    "getCVIRoundData(uint80)": FunctionFragment;
    "maxCVIValue()": FunctionFragment;
    "maxDeviation()": FunctionFragment;
    "owner()": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "setDeviationCheck(bool)": FunctionFragment;
    "setMaxDeviation(uint16)": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "cviAggregator",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "cviDeviationAggregator",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "deviationCheck",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getCVILatestRoundData",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getCVIRoundData",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "maxCVIValue",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "maxDeviation",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setDeviationCheck",
    values: [boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "setMaxDeviation",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;

  decodeFunctionResult(
    functionFragment: "cviAggregator",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "cviDeviationAggregator",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "deviationCheck",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getCVILatestRoundData",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getCVIRoundData",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "maxCVIValue",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "maxDeviation",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setDeviationCheck",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setMaxDeviation",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
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

export interface CVIOracle extends BaseContract {
  contractName: "CVIOracle";
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: CVIOracleInterface;

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
    cviAggregator(overrides?: CallOverrides): Promise<[string]>;

    cviDeviationAggregator(overrides?: CallOverrides): Promise<[string]>;

    deviationCheck(overrides?: CallOverrides): Promise<[boolean]>;

    getCVILatestRoundData(
      overrides?: CallOverrides
    ): Promise<
      [number, BigNumber, BigNumber] & {
        cviValue: number;
        cviRoundId: BigNumber;
        cviTimestamp: BigNumber;
      }
    >;

    getCVIRoundData(
      _roundId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [number, BigNumber] & { cviValue: number; cviTimestamp: BigNumber }
    >;

    maxCVIValue(overrides?: CallOverrides): Promise<[BigNumber]>;

    maxDeviation(overrides?: CallOverrides): Promise<[number]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setDeviationCheck(
      _newDeviationCheck: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setMaxDeviation(
      _newMaxDeviation: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  cviAggregator(overrides?: CallOverrides): Promise<string>;

  cviDeviationAggregator(overrides?: CallOverrides): Promise<string>;

  deviationCheck(overrides?: CallOverrides): Promise<boolean>;

  getCVILatestRoundData(
    overrides?: CallOverrides
  ): Promise<
    [number, BigNumber, BigNumber] & {
      cviValue: number;
      cviRoundId: BigNumber;
      cviTimestamp: BigNumber;
    }
  >;

  getCVIRoundData(
    _roundId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [number, BigNumber] & { cviValue: number; cviTimestamp: BigNumber }
  >;

  maxCVIValue(overrides?: CallOverrides): Promise<BigNumber>;

  maxDeviation(overrides?: CallOverrides): Promise<number>;

  owner(overrides?: CallOverrides): Promise<string>;

  renounceOwnership(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setDeviationCheck(
    _newDeviationCheck: boolean,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setMaxDeviation(
    _newMaxDeviation: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    cviAggregator(overrides?: CallOverrides): Promise<string>;

    cviDeviationAggregator(overrides?: CallOverrides): Promise<string>;

    deviationCheck(overrides?: CallOverrides): Promise<boolean>;

    getCVILatestRoundData(
      overrides?: CallOverrides
    ): Promise<
      [number, BigNumber, BigNumber] & {
        cviValue: number;
        cviRoundId: BigNumber;
        cviTimestamp: BigNumber;
      }
    >;

    getCVIRoundData(
      _roundId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [number, BigNumber] & { cviValue: number; cviTimestamp: BigNumber }
    >;

    maxCVIValue(overrides?: CallOverrides): Promise<BigNumber>;

    maxDeviation(overrides?: CallOverrides): Promise<number>;

    owner(overrides?: CallOverrides): Promise<string>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    setDeviationCheck(
      _newDeviationCheck: boolean,
      overrides?: CallOverrides
    ): Promise<void>;

    setMaxDeviation(
      _newMaxDeviation: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;
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
    cviAggregator(overrides?: CallOverrides): Promise<BigNumber>;

    cviDeviationAggregator(overrides?: CallOverrides): Promise<BigNumber>;

    deviationCheck(overrides?: CallOverrides): Promise<BigNumber>;

    getCVILatestRoundData(overrides?: CallOverrides): Promise<BigNumber>;

    getCVIRoundData(
      _roundId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    maxCVIValue(overrides?: CallOverrides): Promise<BigNumber>;

    maxDeviation(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setDeviationCheck(
      _newDeviationCheck: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setMaxDeviation(
      _newMaxDeviation: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    cviAggregator(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    cviDeviationAggregator(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    deviationCheck(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getCVILatestRoundData(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getCVIRoundData(
      _roundId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    maxCVIValue(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    maxDeviation(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setDeviationCheck(
      _newDeviationCheck: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setMaxDeviation(
      _newMaxDeviation: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
