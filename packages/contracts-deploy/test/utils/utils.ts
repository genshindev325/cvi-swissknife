import type { BaseContract, Event, EventFilter } from 'ethers'
import { ethers, network } from 'hardhat'

interface EventQuery {
  contract: BaseContract
  fromBlock: number
  toBlock: number
  filters: EventFilter[]
}

export async function getLatestBlockTimestamp() {
  const blockNumBefore = await ethers.provider.getBlockNumber()
  const blockBefore = await ethers.provider.getBlock(blockNumBefore)
  return blockBefore.timestamp
}

export async function setNextBlockTimestampAndMine(timestamp: number) {
  await network.provider.send('evm_setNextBlockTimestamp', [timestamp])
  await network.provider.send('evm_mine')
}

export async function queryEvents(eventsQuery: EventQuery[]): Promise<Event[]> {
  const retEvents: Event[][] = []

  for (const eventQuery of eventsQuery) {
    for (const eventFilter of eventQuery.filters) {
      const events = await eventQuery.contract.queryFilter(eventFilter, eventQuery.fromBlock, eventQuery.toBlock)

      retEvents.push(events)
    }
  }

  return retEvents.flatMap(e => e)
}

export const range = (start: number, end: number, step = 1) =>
  Array.from({ length: (end - start) / step + 1 }, (_, i) => start + i * step)
