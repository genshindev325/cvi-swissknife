/* eslint-disable @typescript-eslint/no-use-before-define */
import type { W3 } from '@coti-cvi/cvi-sdk'
import { asyncQueue } from '../async-queue'
import environment from '../utils/environment'

const interval = environment.refreshInterval

export async function startTVLRefresh(w3s: W3[]) {
  w3s.map(w3 => refreshTVL(w3))
}

async function refreshTVL(w3: W3) {
  try {
    await Promise.all(w3.components.map(c => asyncQueue.push(() => c.getTVL())))
  } catch (error) {
    console.trace(`${w3} refreshTVL error ${error}`)
  } finally {
    // call self after interval (refresh)
    setTimeout(() => refreshTVL(w3), interval * 1000)
  }
}
