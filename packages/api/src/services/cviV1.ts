import axios from 'axios'
import type { Index } from '../utils/general'

export type IndexV1Data = [string, number, number, number, number, number, number, string, string, string]

const CVI_HOURLY_DATA_URL = 'http://defi.r-synergy.com/V003/cvijson1000hour'
const ETH_VOL_HOURLY_DATA_URL = 'http://defi.r-synergy.com/V0043/ethvol_changes_N/1000'

const CVI_DAILY_DATA_URL = 'http://defi.r-synergy.com/V003/cvijson1000day'
const ETH_VOL_DAILY_DATA_URL = 'http://defi.r-synergy.com/V0043/ethvoljson1000day'

export async function indexV1Data(index: Index, interval: 'hour' | 'day'): Promise<IndexV1Data[]> {
  const url =
    index === 'ETHVOL'
      ? interval === 'hour'
        ? ETH_VOL_HOURLY_DATA_URL
        : ETH_VOL_DAILY_DATA_URL
      : interval === 'hour'
      ? CVI_HOURLY_DATA_URL
      : CVI_DAILY_DATA_URL

  try {
    const body = await axios.get(url)
    const { data } = body

    data.sort((a: IndexV1Data, b: IndexV1Data) => {
      const dateOne = new Date(a[0]).getTime()
      const dateTwo = new Date(b[0]).getTime()
      return dateTwo - dateOne
    })

    return data
  } catch (err) {
    console.error(`Error in indexV1Data with index ${index} due to: ${err}`)
    return []
  }
}
