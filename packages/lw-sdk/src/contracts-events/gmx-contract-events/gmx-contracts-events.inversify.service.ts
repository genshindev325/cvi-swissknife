import { inject, injectable } from 'inversify'
import type { GetContractInversifyService } from '../../get-contract.inversify.service'
import type { GmxContractsInversifyService } from '../../gmx'
import type { FormattedExecuteDecreasePositionEvent, FormattedExecuteIncreasePositionEvent } from '../gmx-types'
import type { FormatGmxContractsEventsInversifyService } from './format-gmx-contract-events.inversify.service'

@injectable()
export class GmxContractsEventsInversifyService {
  constructor(
    @inject('FormatGmxContractsEventsInversifyService')
    private readonly formatGmxContractsEventsInversifyService: FormatGmxContractsEventsInversifyService,
    @inject('GmxContractsInversifyService') private readonly gmxContractsInversifyService: GmxContractsInversifyService,
    @inject('GetContractInversifyService') private readonly getContractInversifyService: GetContractInversifyService,
  ) {}

  public async getPositionEvents({ from = 0, to = 'latest' }: { from?: number; to?: number | 'latest' }) {
    const contract = this.gmxContractsInversifyService.gmxVault
    const increaseFilter = contract.filters.IncreasePosition()
    const decreaseFilter = contract.filters.DecreasePosition()
    const closeFilter = contract.filters.ClosePosition()
    const [increaseEvents, decreaseEvents, closeEvents] = await Promise.all([
      contract.queryFilter(increaseFilter, from, to),
      contract.queryFilter(decreaseFilter, from, to),
      contract.queryFilter(closeFilter, from, to),
    ])
    return { increaseEvents, decreaseEvents, closeEvents }
  }

  public async syncEvents<T>({
    save,
    load,
    getEvents,
  }: {
    save: (lastBlock: number, items: T[]) => Promise<void>
    load: () => Promise<{ lastBlock: number }>
    getEvents: (from: number, to: number) => Promise<T[]>
  }) {
    const [{ lastBlock }, { number: currentBlockNumber }] = await Promise.all([
      load(),
      this.gmxContractsInversifyService.provider.getBlock('latest'),
    ])
    let to = currentBlockNumber
    for (let from = lastBlock; from < currentBlockNumber; ) {
      try {
        const events = await getEvents(from, to)
        from = to
        await save(to, events)
        to = currentBlockNumber
      } catch (error) {
        const message = error.message
        if (message.startsWith('Log response size exceeded')) {
          to = Number(message.slice(message.indexOf('[') + 1, message.lastIndexOf(']')).split(', ')[1])
        } else {
          throw error
        }
      }
    }
  }

  public getOldExecuteIncreasePositionEvents({
    address,
    from = 0,
    to = 'latest',
  }: {
    address?: string
    from?: number
    to?: number | 'latest'
  }) {
    return this.gmxContractsInversifyService.gmxPositionRouter
      .queryFilter(
        this.gmxContractsInversifyService.gmxPositionRouter.filters.ExecuteIncreasePosition(address),
        from,
        to,
      )
      .then<FormattedExecuteIncreasePositionEvent[]>(async r => {
        const erc20Instances = Object.fromEntries(
          r
            .flatMap(e => [e.args.indexToken, ...e.args.path])
            .map(address => [address, this.getContractInversifyService.getGenericErc20TokenByAddress(address)]),
        )
        const erc20Info: Record<string, { decimals: number }> = Object.fromEntries(
          await Promise.all(
            Object.entries(erc20Instances).map(async ([address, token]) => {
              const decimals = await token.decimals()
              return [address, { decimals }]
            }),
          ),
        )

        return r.map(e =>
          this.formatGmxContractsEventsInversifyService.toFormattedExecuteIncreasePosition({
            e,
            decimals: {
              acceptablePrice: 30,
              amountIn: erc20Info[e.args.path[0]].decimals, // not verified
              executionFee: erc20Info[e.args.path[0]].decimals, // not verified
              minOut: 10, // not verified
              sizeDeltaUsd: 30, // verified
            },
          }),
        )
      })
  }

  public getOldExecuteDecreasePositionEvents({
    address,
    from = 0,
    to = 'latest',
  }: {
    address?: string
    from?: number
    to?: number | 'latest'
  }) {
    return this.gmxContractsInversifyService.gmxPositionRouter
      .queryFilter(
        this.gmxContractsInversifyService.gmxPositionRouter.filters.ExecuteDecreasePosition(address),
        from,
        to,
      )
      .then<FormattedExecuteDecreasePositionEvent[]>(async r => {
        const erc20Instances = Object.fromEntries(
          r
            .flatMap(e => [e.args.indexToken, ...e.args.path])
            .map(address => [address, this.getContractInversifyService.getGenericErc20TokenByAddress(address)]),
        )
        const erc20Info: Record<string, { decimals: number }> = Object.fromEntries(
          await Promise.all(
            Object.entries(erc20Instances).map(async ([address, token]) => {
              const decimals = await token.decimals()
              return [address, { decimals }]
            }),
          ),
        )

        return Promise.all(
          r.map(async e => {
            return this.formatGmxContractsEventsInversifyService.toFormattedExecuteDecreasePosition({
              e,
              decimals: {
                acceptablePrice: 30,
                executionFee: erc20Info[e.args.path[0]].decimals, // not verified
                minOut: 10, // not verified
                sizeDeltaUsd: 30, // verified
                blockGap: 10, // not verified
                collateralDelta: erc20Info[e.args.path[0]].decimals, // not verified
              },
            })
          }),
        )
      })
  }
}
