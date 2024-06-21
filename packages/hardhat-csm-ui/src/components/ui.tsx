import { useEffect, useState } from 'react'
import type { Block, HardhatPodStarted, State } from '@coti-cvi/lw-sdk'
import { BlockchainName, BackendEnvironment } from '@coti-cvi/lw-sdk'
import { NetworkName, CHAIN_IDS_INFO, ChainId, TokenName, getDataFeedClient } from '@coti-cvi/lw-sdk'
import { Combobox } from 'react-widgets'
import type { InitInversifyReturnType } from '../init-inversify'
import { initInversify } from '../init-inversify'
import { AdvanceTime } from './advance-time'
import { Impersonate } from './impersonate'
import usePromise from 'react-use-promise'
import { format } from 'date-fns'
import { ChangeTokenWorthInUsd } from './change-token-worth-in-usd'

export function Ui() {
  const [chainTerm, setChainTerm] = useState<string>(CHAIN_IDS_INFO[ChainId.PolygonStaging].hardhatConfigNetworkName)

  const [isLoadingAdvanceTime, setIsLoadingAdvanceTime] = useState(false)
  const [isLoadingImpersonate, setIsLoadingImpersonate] = useState(false)

  const chainInfo = Object.values(ChainId)
    .map(chainId => CHAIN_IDS_INFO[chainId])
    .find(chainInfo => chainInfo.hardhatConfigNetworkName === chainTerm)

  const [container, setContainer] = useState<InitInversifyReturnType>()
  const [latestBlock, setLatestBlock] = useState<State<Block>>()

  const [podsStatus, setPodsStatus] = useState<HardhatPodStarted[]>([])

  const blockchainPod =
    chainInfo?.networkName === NetworkName.Staging &&
    podsStatus.find(p => p.BlockchainName === chainInfo.blockchainName)

  const [globalEventsInversifyService] = usePromise(async () => {
    return container?.getAsync('GlobalEventsInversifyService')
  }, [container])

  // we need it to start listen for blocks
  usePromise(async () => container?.getAsync('LatestBlockInfoInversifyService'), [container])

  useEffect(() => {
    if (chainInfo?.networkName === NetworkName.Staging) {
      async function get() {
        const r = await getDataFeedClient({
          backendEnvironment: BackendEnvironment.K8s,
        }).k8S.k8SControllerGetWhenHardhatPodsStarted()
        setPodsStatus(r)
      }

      get()
      const invervalId = setInterval(() => get(), 10_000)

      return () => clearInterval(invervalId)
    }
  }, [chainInfo])

  useEffect(() => {
    if (chainInfo) {
      const con = initInversify(chainInfo.chainId)

      setContainer(con)

      return () => {
        setContainer(undefined)
        setIsLoadingAdvanceTime(false)
        setLatestBlock(undefined)
        con.closeContainer()
      }
    }
  }, [chainInfo, chainTerm])

  useEffect(() => {
    if (globalEventsInversifyService) {
      globalEventsInversifyService.eventEmitter.on('latestBlock', setLatestBlock)

      return () => {
        globalEventsInversifyService.eventEmitter.off('latestBlock', setLatestBlock)
      }
    }
  }, [globalEventsInversifyService])

  const [eTHPriceInversifyService] = usePromise(
    async () =>
      chainInfo?.blockchainName === BlockchainName.POLYGON &&
      container?.getByBlockchain(chainInfo.blockchainName, 'ETHPriceInversifyService'),
    [chainInfo?.blockchainName, container],
  )

  return (
    <div
      style={{
        margin: '10px',
      }}
    >
      <div style={{ fontSize: '20px' }}>CVI Staging CSM</div>
      <div style={{ fontSize: '13px', marginTop: '-13px' }}>
        <br />
        (Use this to manipulate CVI Staging Blockchains), aka:{' '}
        <a target="_blank" href="https://armadillo.is" rel="noreferrer">
          armadillo.is
        </a>{' '}
        and all{' '}
        <a target="_blank" href="https://github.com/govi-dao/cvi-swissknife/pulls" rel="noreferrer">
          open PRs
        </a>
      </div>
      <br />
      <div>
        <Combobox
          style={{
            width: '300px',
          }}
          data={Object.values(CHAIN_IDS_INFO)
            .filter(r => r.networkName === NetworkName.Local || r.networkName === NetworkName.Staging)
            .map(r => r.hardhatConfigNetworkName)}
          value={chainTerm}
          onChange={value => setChainTerm(value)}
          disabled={isLoadingAdvanceTime}
        />
        <br />
        {chainInfo?.networkName === NetworkName.Staging && (
          <div style={{ height: '30px' }}>
            <span>
              Last Node Restart:{' '}
              {blockchainPod ? (
                <span
                  style={{
                    color: Date.now() - new Date(blockchainPod.dateUtc).getTime() > 1000 * 60 * 60 ? 'black' : 'red',
                  }}
                >
                  {format(new Date(blockchainPod.dateUtc), 'dd/MM/yyyy HH:mm:ss')}
                </span>
              ) : (
                'Loading....'
              )}
            </span>
          </div>
        )}
      </div>
      <div>
        {latestBlock?.status === 'resolved' ? (
          <div>
            <span>
              Latest Block Number: <span style={{ color: 'red' }}>{latestBlock.data.number}</span>{' '}
            </span>
            <span>
              Timestamp:{' '}
              <span style={{ color: 'red' }}>
                {format(new Date(latestBlock.data.timestamp * 1000), 'dd/MM/yyyy HH:mm:ss')}
              </span>
              <div style={{ fontSize: '12px' }}>
                * This information is used as the single source of truth for the client
                <br />* Note that this information is stale, unless manually moved herby
              </div>
            </span>
          </div>
        ) : (
          <div>Loading Blockchain state...</div>
        )}
      </div>
      <br />
      ----------------------------
      <AdvanceTime
        container={container}
        latestBlock={latestBlock?.data}
        isLoadingAdvanceTime={isLoadingAdvanceTime}
        setIsLoadingAdvanceTime={setIsLoadingAdvanceTime}
      />
      ----------------------------
      <Impersonate
        container={container}
        latestBlock={latestBlock?.data}
        isLoadingImpersonate={isLoadingImpersonate}
        setIsLoadingImpersonate={setIsLoadingImpersonate}
      />
      ----------------------------
      {chainInfo?.blockchainName === BlockchainName.POLYGON ? (
        <div>
          <div>Change Tokens Values:</div>
          {eTHPriceInversifyService ? (
            <div>
              <br />

              <ChangeTokenWorthInUsd
                tokenName={TokenName.WETH}
                getTokenPriceUsd={async () => {
                  const result = await eTHPriceInversifyService.getPrice()
                  return result.priceNumber
                }}
                setTokenPriceUsd={async (newPrice: number) => {
                  await eTHPriceInversifyService.setPrice(newPrice)
                }}
              />
            </div>
          ) : (
            <div>Loading ETH Price...</div>
          )}
        </div>
      ) : (
        <div>{}</div>
      )}
    </div>
  )
}
