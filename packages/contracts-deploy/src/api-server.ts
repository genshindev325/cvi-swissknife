import fs from 'fs'
import Fastify from 'fastify'
import isDocker from 'is-docker'
import { AppEnv } from '../../common-be/src/config/types'
import fastifyCors from '@fastify/cors'
import { StatusCodes } from 'http-status-codes'
import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { BlockchainName } from '@coti-cvi/lw-sdk/src/types/config-types'

export type ServerParams = {
  blockchainName: BlockchainName
  forkBlockNumber: number
  forkTimestampUtc: string
  hardhatPreparationTimeSeconds: number
  singleDeploymentsFilePath: string
  port: number
  appEnv: AppEnv
}

export async function runServer(hre: HardhatRuntimeEnvironment, serverParams: ServerParams) {
  const startServerTimeMs = Date.now()

  const {
    blockchainName,
    forkTimestampUtc,
    forkBlockNumber,
    hardhatPreparationTimeSeconds,
    singleDeploymentsFilePath,
    port,
    appEnv,
  } = serverParams

  const app = Fastify({})

  // allow all origins to reach out to this server (for all UIs)
  app.register(fastifyCors)

  // k8s liveness
  app.get(`/`, async () => {
    return {
      description: `this is a helper server for the staging network. use /deployments to get the deployments-file`,
      dateTimeNowUtc: new Date().toISOString(),
      forkTimeUtc: forkTimestampUtc,
      forkBlockNumber: forkBlockNumber,
      podRunningMinutes: process.uptime() / 60,
      startServerTimeUtc: new Date(startServerTimeMs).toISOString(),
      hardhatPreparationTimeMinutes: hardhatPreparationTimeSeconds / 60,
    }
  })

  // k8s readiness
  app.get(`/readiness`, (_req, res) => {
    res.status(StatusCodes.OK).send()
  })

  app.get(`/fork-time-utc`, async () => {
    return forkTimestampUtc
  })

  app.get(`/fork-block-number`, async () => {
    return forkBlockNumber
  })

  app.get(`/deployments`, async () => {
    return fs.promises.readFile(singleDeploymentsFilePath, 'utf-8')
  })

  app.get(`/deploy`, async (req, res) => {
    const isValid = (data: unknown): data is { tags: string } =>
      typeof data === 'object' &&
      data !== null &&
      'tags' in data &&
      typeof data.tags === 'string' &&
      data.tags.length > 0
    if (isValid(req.query)) {
      try {
        await hre.run('deploy', { tags: req.query.tags, description: '', noCompile: true })
        return `deployed ${req.query.tags}`
      } catch (error) {
        console.error(error.stack)
        return res.status(500).send({ error: error.stack })
      }
    }
    return res.status(500).send('invalid tags')
  })

  let serverAddress: string
  try {
    if (isDocker()) {
      serverAddress = await app.listen(port, '0.0.0.0')
    } else {
      serverAddress = await app.listen(port)
    }
  } catch (e1) {
    if (e1.code === 'EADDRINUSE') {
      // if this task is running again, the server will be already running on different process.
      // we can exit this script safely.
      return
    }
    throw e1
  }

  const addressToString =
    appEnv === AppEnv.K8s ? `https://hardhat-${blockchainName}-deployments-file.cvi-team.com` : serverAddress

  console.log('Starting Single-Deployments-File Server as nodejs worker-thread with params:', serverParams)
  console.log(`/deployment Server listening on ${addressToString}. Open ${addressToString}/deployments`)
}
