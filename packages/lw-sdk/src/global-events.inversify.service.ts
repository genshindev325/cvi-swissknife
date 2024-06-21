import { injectable } from 'inversify'
import { StrictEventEmitter } from 'strict-event-emitter'
import type { State } from './state'
import { Stator } from './state'
import type {
  Address,
  GlobalEvents,
  GlobalEventsWithAddress,
  TVaultGlobalEvents,
  VolatilityTGlobalEvents,
  VtGlobalEventsWithAddress,
} from './types'

@injectable()
export class GlobalEventsInversifyService {
  private readonly caches = new Map<keyof GlobalEvents, State<unknown>>()

  public readonly eventEmitter = new StrictEventEmitter<GlobalEvents>()

  private readonly cachesByAddress = new Map<keyof GlobalEventsWithAddress, Map<Address, State<unknown>>>()

  public readonly eventEmitterWithAddress = new StrictEventEmitter<GlobalEventsWithAddress>()

  private readonly cachesByAddressVT = new Map<keyof VtGlobalEventsWithAddress, Map<Address, State<unknown>>>()

  public readonly eventEmitterWithAddressVT = new StrictEventEmitter<VtGlobalEventsWithAddress>()

  private readonly cachesTVault = new Map<keyof TVaultGlobalEvents, State<unknown>>()

  public readonly eventEmitterTVault = new StrictEventEmitter<TVaultGlobalEvents>()

  private readonly cachesVolatility = new Map<keyof VolatilityTGlobalEvents, State<unknown>>()

  public readonly eventEmitterVolatility = new StrictEventEmitter<VolatilityTGlobalEvents>()

  public clearCache() {
    this.caches.clear()
    this.cachesByAddress.clear()
    this.cachesTVault.clear()
    this.cachesVolatility.clear()
    this.cachesByAddressVT.clear()
  }

  public async emitWithAddress<
    Topic extends keyof GlobalEventsWithAddress,
    T extends Parameters<GlobalEventsWithAddress[Topic]>[1] extends State<infer P> ? P : never,
  >(topic: Topic, address: string, getData: () => Promise<T>) {
    const topicCache =
      this.cachesByAddress.get(topic) ??
      (() => {
        const cache = new Map<Address, State<unknown>>()
        this.cachesByAddress.set(topic, cache)
        return cache
      })()

    const lastState = topicCache.get(address) as State<T> | undefined
    let newState: State<T> = Stator.pending<T>(lastState)
    try {
      topicCache.set(address, newState)
      // @ts-ignore
      this.eventEmitterWithAddress.emit(topic, address, newState)
      const data: T = await getData()
      newState = Stator.resolve(data)
      topicCache.set(address, newState)
      // @ts-ignore
      this.eventEmitterWithAddress.emit(topic, address, newState)
    } catch (error) {
      this.eventEmitterWithAddress.emit('errorWithAddress', address, error)
      newState = Stator.reject(newState, error)
      topicCache.set(address, newState)
      // @ts-ignore
      this.eventEmitterWithAddress.emit(topic, address, newState)
    }
  }

  public async emitWithAddressVT<
    Topic extends keyof VtGlobalEventsWithAddress,
    T extends Parameters<VtGlobalEventsWithAddress[Topic]>[1] extends State<infer P> ? P : never,
  >(topic: Topic, address: string, getData: () => Promise<T>) {
    const topicCache =
      this.cachesByAddressVT.get(topic) ??
      (() => {
        const cache = new Map<Address, State<unknown>>()
        this.cachesByAddressVT.set(topic, cache)
        return cache
      })()

    const lastState = topicCache.get(address) as State<T> | undefined
    let newState: State<T> = Stator.pending<T>(lastState)
    try {
      topicCache.set(address, newState)
      // @ts-ignore
      this.eventEmitterWithAddressVT.emit(topic, address, newState)
      const data: T = await getData()
      newState = Stator.resolve(data)
      topicCache.set(address, newState)
      // @ts-ignore
      this.eventEmitterWithAddressVT.emit(topic, address, newState)
    } catch (error) {
      this.eventEmitterWithAddressVT.emit('errorWithAddress', address, error)
      newState = Stator.reject(newState, error)
      topicCache.set(address, newState)
      // @ts-ignore
      this.eventEmitterWithAddressVT.emit(topic, address, newState)
    }
  }

  public async emit<
    Topic extends keyof GlobalEvents,
    T extends Parameters<GlobalEvents[Topic]>[0] extends State<infer P> ? P : never,
  >(topic: Topic, getData: () => Promise<T>) {
    const lastState = this.caches.get(topic) as State<T> | undefined
    let newState: State<T> = Stator.pending<T>(lastState)
    try {
      this.caches.set(topic, newState)
      // @ts-ignore
      this.eventEmitter.emit(topic, newState)
      const data: T = await getData()
      newState = Stator.resolve(data)
      this.caches.set(topic, newState)
      // @ts-ignore
      this.eventEmitter.emit(topic, newState)
    } catch (error) {
      this.eventEmitter.emit('errors', error)
      newState = Stator.reject(newState, error)
      this.caches.set(topic, newState)
      // @ts-ignore
      this.eventEmitter.emit(topic, newState)
    }
  }

  public async emitTvault<
    Topic extends keyof TVaultGlobalEvents,
    T extends Parameters<TVaultGlobalEvents[Topic]>[0] extends State<infer P> ? P : never,
  >(topic: Topic, getData: () => Promise<T>) {
    const lastState = this.cachesTVault.get(topic) as State<T> | undefined
    let newState: State<T> = Stator.pending<T>(lastState)
    try {
      this.cachesTVault.set(topic, newState)
      // @ts-ignore
      this.eventEmitterTVault.emit(topic, newState)
      const data: T = await getData()
      newState = Stator.resolve(data)
      this.cachesTVault.set(topic, newState)
      // @ts-ignore
      this.eventEmitterTVault.emit(topic, newState)
    } catch (error) {
      this.eventEmitter.emit('errors', error)
      newState = Stator.reject(newState, error)
      this.cachesTVault.set(topic, newState)
      // @ts-ignore
      this.eventEmitter.emit(topic, newState)
    }
  }

  public async emitVolatility<
    Topic extends keyof VolatilityTGlobalEvents,
    T extends Parameters<VolatilityTGlobalEvents[Topic]>[0] extends State<infer P> ? P : never,
  >(topic: Topic, getData: () => Promise<T>) {
    const lastState = this.cachesVolatility.get(topic) as State<T> | undefined
    let newState: State<T> = Stator.pending<T>(lastState)
    try {
      this.cachesVolatility.set(topic, newState)
      // @ts-ignore
      this.eventEmitterVolatility.emit(topic, newState)
      const data: T = await getData()
      newState = Stator.resolve(data)
      this.cachesVolatility.set(topic, newState)
      // @ts-ignore
      this.eventEmitterVolatility.emit(topic, newState)
    } catch (error) {
      this.eventEmitter.emit('errors', error)
      newState = Stator.reject(newState, error)
      this.cachesVolatility.set(topic, newState)
      // @ts-ignore
      this.eventEmitter.emit(topic, newState)
    }
  }
}
