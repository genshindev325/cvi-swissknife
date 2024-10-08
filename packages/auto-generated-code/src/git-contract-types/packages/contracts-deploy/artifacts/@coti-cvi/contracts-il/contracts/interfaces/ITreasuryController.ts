/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
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
} from "../../../../../../../common";

export interface ITreasuryControllerInterface extends utils.Interface {
  functions: {
    "depositFee(uint256,uint256,uint16)": FunctionFragment;
    "setTreasury(address)": FunctionFragment;
    "setTreasuryToken(address)": FunctionFragment;
    "treasury()": FunctionFragment;
    "treasuryToken()": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "depositFee"
      | "setTreasury"
      | "setTreasuryToken"
      | "treasury"
      | "treasuryToken"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "depositFee",
    values: [BigNumberish, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "setTreasury", values: [string]): string;
  encodeFunctionData(
    functionFragment: "setTreasuryToken",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "treasury", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "treasuryToken",
    values?: undefined
  ): string;

  decodeFunctionResult(functionFragment: "depositFee", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setTreasury",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setTreasuryToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "treasury", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "treasuryToken",
    data: BytesLike
  ): Result;

  events: {
    "DepositFee(uint256,address,uint256,uint16,address,address)": EventFragment;
    "TreasuryChanged(address,address)": EventFragment;
    "TreasuryTokenChanged(address,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "DepositFee"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "TreasuryChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "TreasuryTokenChanged"): EventFragment;
}

export interface DepositFeeEventObject {
  protectionId: BigNumber;
  from: string;
  fee: BigNumber;
  feeComponent: number;
  treasury: string;
  treasuryToken: string;
}
export type DepositFeeEvent = TypedEvent<
  [BigNumber, string, BigNumber, number, string, string],
  DepositFeeEventObject
>;

export type DepositFeeEventFilter = TypedEventFilter<DepositFeeEvent>;

export interface TreasuryChangedEventObject {
  prevValue: string;
  newValue: string;
}
export type TreasuryChangedEvent = TypedEvent<
  [string, string],
  TreasuryChangedEventObject
>;

export type TreasuryChangedEventFilter = TypedEventFilter<TreasuryChangedEvent>;

export interface TreasuryTokenChangedEventObject {
  prevValue: string;
  newValue: string;
}
export type TreasuryTokenChangedEvent = TypedEvent<
  [string, string],
  TreasuryTokenChangedEventObject
>;

export type TreasuryTokenChangedEventFilter =
  TypedEventFilter<TreasuryTokenChangedEvent>;

export interface ITreasuryController extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: ITreasuryControllerInterface;

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
    depositFee(
      _protectionId: BigNumberish,
      _fee: BigNumberish,
      _feeComponent: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setTreasury(
      _treasury: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setTreasuryToken(
      _treasuryToken: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    treasury(overrides?: CallOverrides): Promise<[string]>;

    treasuryToken(overrides?: CallOverrides): Promise<[string]>;
  };

  depositFee(
    _protectionId: BigNumberish,
    _fee: BigNumberish,
    _feeComponent: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setTreasury(
    _treasury: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setTreasuryToken(
    _treasuryToken: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  treasury(overrides?: CallOverrides): Promise<string>;

  treasuryToken(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    depositFee(
      _protectionId: BigNumberish,
      _fee: BigNumberish,
      _feeComponent: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    setTreasury(_treasury: string, overrides?: CallOverrides): Promise<void>;

    setTreasuryToken(
      _treasuryToken: string,
      overrides?: CallOverrides
    ): Promise<void>;

    treasury(overrides?: CallOverrides): Promise<string>;

    treasuryToken(overrides?: CallOverrides): Promise<string>;
  };

  filters: {
    "DepositFee(uint256,address,uint256,uint16,address,address)"(
      protectionId?: BigNumberish | null,
      from?: string | null,
      fee?: null,
      feeComponent?: null,
      treasury?: string | null,
      treasuryToken?: null
    ): DepositFeeEventFilter;
    DepositFee(
      protectionId?: BigNumberish | null,
      from?: string | null,
      fee?: null,
      feeComponent?: null,
      treasury?: string | null,
      treasuryToken?: null
    ): DepositFeeEventFilter;

    "TreasuryChanged(address,address)"(
      prevValue?: null,
      newValue?: null
    ): TreasuryChangedEventFilter;
    TreasuryChanged(
      prevValue?: null,
      newValue?: null
    ): TreasuryChangedEventFilter;

    "TreasuryTokenChanged(address,address)"(
      prevValue?: null,
      newValue?: null
    ): TreasuryTokenChangedEventFilter;
    TreasuryTokenChanged(
      prevValue?: null,
      newValue?: null
    ): TreasuryTokenChangedEventFilter;
  };

  estimateGas: {
    depositFee(
      _protectionId: BigNumberish,
      _fee: BigNumberish,
      _feeComponent: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setTreasury(
      _treasury: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setTreasuryToken(
      _treasuryToken: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    treasury(overrides?: CallOverrides): Promise<BigNumber>;

    treasuryToken(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    depositFee(
      _protectionId: BigNumberish,
      _fee: BigNumberish,
      _feeComponent: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setTreasury(
      _treasury: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setTreasuryToken(
      _treasuryToken: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    treasury(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    treasuryToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
