import path from 'path'
import { CHAIN_IDS_INFO, NetworkName } from '@coti-cvi/lw-sdk'
import { runTypeChain } from 'typechain'
import os from 'os'
import fs from 'fs'
import { glob } from 'typechain'

async function createTypesFromMainnetAbis({
  repoPath,
  hardhatConfigNetworkName,
  outdir,
  skipCache,
}: {
  repoPath: string
  hardhatConfigNetworkName: string
  outdir: string
  skipCache: boolean
}): Promise<void> {
  const files = glob(
    path.join(repoPath, 'packages', 'lw-sdk', 'deployments', hardhatConfigNetworkName),
    [path.join('**', '*.json')],
    true,
  )

  const cacheFilePath = path.join(os.tmpdir(), `creat-types-of-mainnet-abis-${hardhatConfigNetworkName}.cache`)
  const expectedCacheContent = await fs.promises.readFile(cacheFilePath, 'utf8').catch(e => {
    if (e.code === 'ENOENT') {
      return ''
    }
    throw e
  })

  const actualCacheContent = await Promise.all(files.map(f => fs.promises.readFile(f, 'utf-8'))).then(result =>
    result.join('\n'),
  )

  if (!skipCache) {
    if (actualCacheContent === expectedCacheContent) {
      return
    }

    console.log(`no cache found for "${hardhatConfigNetworkName}". creating types...`)
  } else {
    console.log(`creating types for "${hardhatConfigNetworkName}"...`)
  }

  const dir = path.join(
    os.tmpdir(),
    'creat-types-of-mainnet-abis',
    hardhatConfigNetworkName,
    `epoch-ms--${Date.now().toString()}`,
  )

  await fs.promises.mkdir(dir, { recursive: true })

  await runTypeChain({
    cwd: __dirname,
    filesToProcess: files,
    allFiles: files,
    outDir: outdir,
    target: 'ethers-v5',
  })

  // prepare the cache for next time, even when the cache is diabled NOW
  await fs.promises.writeFile(cacheFilePath, actualCacheContent, 'utf8')
}

export const generateTypesFromMultipleAbiFilesTask = async ({
  repoPath,
  skipCache,
}: {
  repoPath: string
  skipCache: boolean
}) => {
  const typesFromMainnetAbiPath = path.join(
    repoPath,
    'packages',
    'auto-generated-code',
    'src',
    `${NetworkName.Mainnet}-abi-types`,
  )

  await Promise.all(
    Object.values(CHAIN_IDS_INFO)
      .filter(r => r.networkName === NetworkName.Mainnet)
      .map(async r => {
        await createTypesFromMainnetAbis({
          skipCache,
          repoPath,
          hardhatConfigNetworkName: r.hardhatConfigNetworkName,
          outdir: path.join(typesFromMainnetAbiPath, r.hardhatConfigNetworkName),
        })
      }),
  )
}
