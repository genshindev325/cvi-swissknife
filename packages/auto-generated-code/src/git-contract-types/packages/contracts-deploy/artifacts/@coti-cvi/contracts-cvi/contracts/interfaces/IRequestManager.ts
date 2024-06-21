/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BytesLike,
  CallOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
} from "../../../../../../../common";

export interface IRequestManagerInterface extends utils.Interface {
  functions: {
    "maxMinRequestIncrements()": FunctionFragment;
    "minRequestId()": FunctionFragment;
    "nextRequestId()": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "maxMinRequestIncrements"
      | "minRequestId"
      | "nextRequestId"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "maxMinRequestIncrements",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "minRequestId",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "nextRequestId",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "maxMinRequestIncrements",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "minRequestId",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "nextRequestId",
    data: BytesLike
  ): Result;

  events: {};
}

export interface IRequestManager extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IRequestManagerInterface;

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
    maxMinRequestIncrements(overrides?: CallOverrides): Promise<[BigNumber]>;

    minRequestId(overrides?: CallOverrides): Promise<[BigNumber]>;

    nextRequestId(overrides?: CallOverrides): Promise<[BigNumber]>;
  };

  maxMinRequestIncrements(overrides?: CallOverrides): Promise<BigNumber>;

  minRequestId(overrides?: CallOverrides): Promise<BigNumber>;

  nextRequestId(overrides?: CallOverrides): Promise<BigNumber>;

  callStatic: {
    maxMinRequestIncrements(overrides?: CallOverrides): Promise<BigNumber>;

    minRequestId(overrides?: CallOverrides): Promise<BigNumber>;

    nextRequestId(overrides?: CallOverrides): Promise<BigNumber>;
  };

  filters: {};

  estimateGas: {
    maxMinRequestIncrements(overrides?: CallOverrides): Promise<BigNumber>;

    minRequestId(overrides?: CallOverrides): Promise<BigNumber>;

    nextRequestId(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    maxMinRequestIncrements(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    minRequestId(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    nextRequestId(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
