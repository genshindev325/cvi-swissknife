import { task } from 'hardhat/config'
import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { AppEnv } from '../../../common-be/src/config/types'
import type { EnvConfig } from '../types'
import { getEnvConfig } from '../config'
import { UntypedToken } from '../../../lw-sdk/src/token/token'
import { toHex } from '../../../lw-sdk/src/util/big-number'
import { DRY_RUN } from '../constants'

const DEFAULT_AMOUNT = 100_000

function getTransferAmount(balance: number, recipientCount: number) {
  return Math.floor(balance < DEFAULT_AMOUNT * recipientCount ? balance / recipientCount : DEFAULT_AMOUNT)
}

async function distributeToken({
  tokenName,
  token,
  whaleSigner,
  recipients,
}: {
  tokenName: string
  token: UntypedToken
  whaleSigner: SignerWithAddress
  recipients: string[]
}) {
  const whale = whaleSigner.address
  const whaleBalance = await token.getBalance(whale)
  const tAmount = getTransferAmount(token.toNumber(whaleBalance), recipients.length)

  await Promise.all(
    recipients.map(async recipient => {
      try {
        await token.transfer(whaleSigner, recipient, tAmount)
      } catch (error) {
        console.error(`failed to transfer ${tokenName} (${tAmount}) from whale: "${whale}" to "${recipient}": ${error}`)
      }
    }),
  )

  console.log(`Distributed ${tokenName} from whale "${whale}"...`, {
    total: token.toString(whaleBalance),
  })
}

async function setNativeBalance(hre: HardhatRuntimeEnvironment, address: string, balance: number) {
  return hre.ethers.provider.send('hardhat_setBalance', [address, toHex(balance, 18)])
}

async function distributeTokens({
  hre,
  envConfig,
  recipients,
}: {
  hre: HardhatRuntimeEnvironment
  envConfig: EnvConfig
  recipients: string[]
}) {
  await Promise.all(
    (envConfig.appEnv === AppEnv.K8s ? envConfig.mainnetWhales : envConfig.mainnetWhales.slice(0, 2)).map(
      async whale => {
        await hre.network.provider.request({
          method: 'hardhat_impersonateAccount',
          params: [whale.whaleAccount],
        })

        await setNativeBalance(hre, whale.whaleAccount, 100)

        const whaleSigner = await hre.ethers.getSigner(whale.whaleAccount)
        const token = await UntypedToken.fromAddress(whale.tokenAddress, whaleSigner)
        await distributeToken({
          token,
          tokenName: whale.tokenName,
          recipients,
          whaleSigner: whaleSigner,
        })
      },
    ),
  )
}

export const beforeNodeStartTask = () =>
  task('node', 'Starts a JSON-RPC server on top of Hardhat Network (Overridden)', async (args, hre, runSuper) => {
    const envConfig = getEnvConfig()

    if (!DRY_RUN) {
      console.log('starting to distribute tokens...')
      const [namedAccounts, unnamedAccounts] = await Promise.all([hre.getNamedAccounts(), hre.getUnnamedAccounts()])
      const recipients = [...Object.values(namedAccounts), ...unnamedAccounts].map(s => s.toLocaleLowerCase())
      await distributeTokens({ hre, envConfig, recipients })
      await Promise.all(recipients.map(async r => setNativeBalance(hre, r, DEFAULT_AMOUNT)))

      console.log('ended distributing tokens')
    } else {
      const { owner, liquidityProvider } = await hre.getNamedAccounts()
      const recipients = [owner, liquidityProvider].map(s => s.toLocaleLowerCase())
      await Promise.all(recipients.map(async r => setNativeBalance(hre, r, 0.1)))
    }

    console.log(`chain info: ${JSON.stringify(envConfig.chainId, null, 2)}`)

    await runSuper(args)
  })
