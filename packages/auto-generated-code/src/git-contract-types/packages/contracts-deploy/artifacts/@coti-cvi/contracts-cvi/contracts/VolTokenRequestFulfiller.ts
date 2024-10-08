/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
} from "../../../../../../common";

export interface VolTokenRequestFulfillerInterface extends utils.Interface {
  functions: {
    "BURN_REQUEST_TYPE()": FunctionFragment;
    "MINT_REQUEST_TYPE()": FunctionFragment;
    "checkUpkeep(bytes)": FunctionFragment;
    "enableWhitelist()": FunctionFragment;
    "fulfillers(address)": FunctionFragment;
    "initialize(address)": FunctionFragment;
    "owner()": FunctionFragment;
    "performUpkeep(bytes)": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "requestManager()": FunctionFragment;
    "setEnableWhitelist(bool)": FunctionFragment;
    "setFulfillerAddress(address,bool)": FunctionFragment;
    "setRequestManager(address)": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "BURN_REQUEST_TYPE"
      | "MINT_REQUEST_TYPE"
      | "checkUpkeep"
      | "enableWhitelist"
      | "fulfillers"
      | "initialize"
      | "owner"
      | "performUpkeep"
      | "renounceOwnership"
      | "requestManager"
      | "setEnableWhitelist"
      | "setFulfillerAddress"
      | "setRequestManager"
      | "transferOwnership"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "BURN_REQUEST_TYPE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "MINT_REQUEST_TYPE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "checkUpkeep",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "enableWhitelist",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "fulfillers", values: [string]): string;
  encodeFunctionData(functionFragment: "initialize", values: [string]): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "performUpkeep",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "requestManager",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setEnableWhitelist",
    values: [boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "setFulfillerAddress",
    values: [string, boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "setRequestManager",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;

  decodeFunctionResult(
    functionFragment: "BURN_REQUEST_TYPE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "MINT_REQUEST_TYPE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "checkUpkeep",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "enableWhitelist",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "fulfillers", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "performUpkeep",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "requestManager",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setEnableWhitelist",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setFulfillerAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setRequestManager",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;

  events: {
    "Initialized(uint8)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Initialized"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
}

export interface InitializedEventObject {
  version: number;
}
export type InitializedEvent = TypedEvent<[number], InitializedEventObject>;

export type InitializedEventFilter = TypedEventFilter<InitializedEvent>;

export interface OwnershipTransferredEventObject {
  previousOwner: string;
  newOwner: string;
}
export type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  OwnershipTransferredEventObject
>;

export type OwnershipTransferredEventFilter =
  TypedEventFilter<OwnershipTransferredEvent>;

export interface VolTokenRequestFulfiller extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: VolTokenRequestFulfillerInterface;

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
    BURN_REQUEST_TYPE(overrides?: CallOverrides): Promise<[number]>;

    MINT_REQUEST_TYPE(overrides?: CallOverrides): Promise<[number]>;

    checkUpkeep(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<
      [boolean, string] & { upkeepNeeded: boolean; performData: string }
    >;

    enableWhitelist(overrides?: CallOverrides): Promise<[boolean]>;

    fulfillers(arg0: string, overrides?: CallOverrides): Promise<[boolean]>;

    initialize(
      _requestManager: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    performUpkeep(
      arg0: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    requestManager(overrides?: CallOverrides): Promise<[string]>;

    setEnableWhitelist(
      _enableWhitelist: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setFulfillerAddress(
      user: string,
      isAllowed: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setRequestManager(
      _requestManager: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  BURN_REQUEST_TYPE(overrides?: CallOverrides): Promise<number>;

  MINT_REQUEST_TYPE(overrides?: CallOverrides): Promise<number>;

  checkUpkeep(
    arg0: BytesLike,
    overrides?: CallOverrides
  ): Promise<
    [boolean, string] & { upkeepNeeded: boolean; performData: string }
  >;

  enableWhitelist(overrides?: CallOverrides): Promise<boolean>;

  fulfillers(arg0: string, overrides?: CallOverrides): Promise<boolean>;

  initialize(
    _requestManager: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  owner(overrides?: CallOverrides): Promise<string>;

  performUpkeep(
    arg0: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  renounceOwnership(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  requestManager(overrides?: CallOverrides): Promise<string>;

  setEnableWhitelist(
    _enableWhitelist: boolean,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setFulfillerAddress(
    user: string,
    isAllowed: boolean,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setRequestManager(
    _requestManager: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    BURN_REQUEST_TYPE(overrides?: CallOverrides): Promise<number>;

    MINT_REQUEST_TYPE(overrides?: CallOverrides): Promise<number>;

    checkUpkeep(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<
      [boolean, string] & { upkeepNeeded: boolean; performData: string }
    >;

    enableWhitelist(overrides?: CallOverrides): Promise<boolean>;

    fulfillers(arg0: string, overrides?: CallOverrides): Promise<boolean>;

    initialize(
      _requestManager: string,
      overrides?: CallOverrides
    ): Promise<void>;

    owner(overrides?: CallOverrides): Promise<string>;

    performUpkeep(arg0: BytesLike, overrides?: CallOverrides): Promise<void>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    requestManager(overrides?: CallOverrides): Promise<string>;

    setEnableWhitelist(
      _enableWhitelist: boolean,
      overrides?: CallOverrides
    ): Promise<void>;

    setFulfillerAddress(
      user: string,
      isAllowed: boolean,
      overrides?: CallOverrides
    ): Promise<void>;

    setRequestManager(
      _requestManager: string,
      overrides?: CallOverrides
    ): Promise<void>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "Initialized(uint8)"(version?: null): InitializedEventFilter;
    Initialized(version?: null): InitializedEventFilter;

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
    BURN_REQUEST_TYPE(overrides?: CallOverrides): Promise<BigNumber>;

    MINT_REQUEST_TYPE(overrides?: CallOverrides): Promise<BigNumber>;

    checkUpkeep(arg0: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;

    enableWhitelist(overrides?: CallOverrides): Promise<BigNumber>;

    fulfillers(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    initialize(
      _requestManager: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    performUpkeep(
      arg0: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    requestManager(overrides?: CallOverrides): Promise<BigNumber>;

    setEnableWhitelist(
      _enableWhitelist: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setFulfillerAddress(
      user: string,
      isAllowed: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setRequestManager(
      _requestManager: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    BURN_REQUEST_TYPE(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    MINT_REQUEST_TYPE(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    checkUpkeep(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    enableWhitelist(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    fulfillers(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    initialize(
      _requestManager: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    performUpkeep(
      arg0: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    requestManager(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    setEnableWhitelist(
      _enableWhitelist: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setFulfillerAddress(
      user: string,
      isAllowed: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setRequestManager(
      _requestManager: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
