import { request, gql } from 'graphql-request'
import type { ChainName } from '../utils/general'

const ETHEREUM_GRAPH_URL = 'https://api.thegraph.com/subgraphs/name/vladi-coti/cvi-chainlink'
const POLYGON_GRAPH_URL = 'https://api.thegraph.com/subgraphs/name/vladi-coti/cvi-chainlink-polygon'

export type AnswerUpdate = {
  blockNumber: string
  cviValue: string
  id: string
  roundId: string
  timestamp: string
}

const cviChainlinkQuery = gql`
  {
    answerUpdateds(first: 1000, orderBy: timestamp, orderDirection: desc) {
      id
      blockNumber
      timestamp
      roundId
      cviValue
    }
  }
`

export async function cviChainlinkData(chain: ChainName): Promise<AnswerUpdate[]> {
  const endpoint = chain === 'Ethereum' ? ETHEREUM_GRAPH_URL : POLYGON_GRAPH_URL
  try {
    const res: { answerUpdateds: AnswerUpdate[] } = await request(endpoint, cviChainlinkQuery)

    const uniq = new Map<string, AnswerUpdate>()
    res.answerUpdateds.forEach(au => {
      const answerUpdated = uniq.get(au.roundId)
      if (!answerUpdated) {
        uniq.set(au.roundId, au)
      }
    })

    return Array.from(uniq.values())
  } catch (err) {
    console.error('Error in cviChainlinkData due to:', err)
    return []
  }
}
