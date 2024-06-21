export type ResolvedState<T> = {
  readonly status: 'resolved'
  readonly data: T
}

export type RejectedState<T> = {
  readonly status: 'rejected'
  readonly error?: Error
  readonly data?: T
}

export type PendingState<T> = {
  readonly status: 'pending'
  readonly data?: T
}

export type State<T> = ResolvedState<T> | RejectedState<T> | PendingState<T>

export class Stator {
  public static cloneSerializable<T>(state: T): T {
    const clone = { ...state }
    // @ts-ignore
    delete clone.error
    return clone
  }

  public static deriveState<T>(
    states: State<T>[],
    derive: (date: Exclude<T, undefined>[]) => Exclude<T, undefined>,
  ): State<Exclude<T, undefined>> {
    const data = states.every(s => s.data !== undefined)
      ? derive(states.map(s => s.data as Exclude<T, undefined>))
      : undefined
    if (states.every(s => s.status === 'resolved')) {
      return {
        status: 'resolved',
        data: data!,
      }
    }
    return {
      status: states.some(s => s.status === 'rejected') ? 'rejected' : 'pending',
      data,
    }
  }

  public static map<T, U>(state: ResolvedState<T>, mapper: (data: T) => U): ResolvedState<U> | RejectedState<U>
  public static map<T, U>(state: RejectedState<T>, mapper: (data: T) => U): RejectedState<U>
  public static map<T, U>(state: PendingState<T>, mapper: (data: T) => U): PendingState<U> | RejectedState<U>
  public static map<T, U>(state: State<T>, mapper: (data: T) => U): State<U>
  public static map<T, U>(state: State<T>, mapper: (data: T) => U): State<U> {
    try {
      switch (state.status) {
        case 'resolved':
          return {
            status: 'resolved',
            data: mapper(state.data),
          }
        case 'rejected':
          return {
            status: 'rejected',
            error: state.error,
            data: state.data === undefined ? undefined : mapper(state.data),
          }
        case 'pending':
          return {
            status: 'pending',
            data: state.data === undefined ? undefined : mapper(state.data),
          }
      }
    } catch (error) {
      return {
        status: 'rejected',
        error: error,
      }
    }
  }

  public static pending<T>(state?: State<T>, options?: { resetState?: boolean }): PendingState<T> {
    if (state) {
      switch (state.status) {
        case 'resolved':
        case 'rejected':
          return {
            status: 'pending',
            data: options?.resetState ? undefined : state.data,
          }
        case 'pending':
          return state
      }
    }
    return {
      status: 'pending',
    }
  }

  public static resolve<T>(data: T): ResolvedState<T> {
    return {
      status: 'resolved',
      data,
    }
  }

  public static reject<T>(state?: State<T>, error?: Error): RejectedState<T> {
    return {
      status: 'rejected',
      error: error,
      data: state?.data,
    }
  }
}
