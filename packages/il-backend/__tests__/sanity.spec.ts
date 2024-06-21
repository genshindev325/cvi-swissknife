import { HttpStatus } from '@nestjs/common'
import { nestBeforeAfterEach } from '@coti-cvi/tests-infra-be'
import type { AxiosResponse } from 'axios'
import axios from 'axios'
import waitForExpect from 'wait-for-expect'
import { AppModule } from '../src/app.module'
import nock from 'nock'
import { CHAIN_IDS_INFO, theGraphUrls } from '@coti-cvi/lw-sdk'

const { startApp } = nestBeforeAfterEach({
  addAdditionalAllowedNockCalls: [
    'hardhat-polygon-deployments-file.cvi-team.com',
    'hardhat-arbitrum-deployments-file.cvi-team.com',
    'cvi-armadillo-bucket.s3.eu-west-1.amazonaws.com:443',
    ...new Set(
      Object.values(CHAIN_IDS_INFO)
        .flatMap(c => [c.deployAndForkRpcUrl, c.cviRpcUrl])
        .map(url => new URL(url).origin.replace('https://', '').replace('http://', '')),
    ),
  ],
})

function setupEmptyUniswapSwapTheGraphResponse() {
  const uri1 = new URL(theGraphUrls.uniswapV2.ethereum)
  nock(uri1.origin)
    .post(uri1.pathname)
    .reply(200, { data: { pairDayDatas: [] } })
    .persist()

  const uri2 = new URL(theGraphUrls.uniswapV3.ethereum)
  nock(uri2.origin)
    .post(uri2.pathname)
    .reply(200, { data: { pairs: [] } })
    .persist()
}

test('check liveness is true after service is up', async () => {
  setupEmptyUniswapSwapTheGraphResponse()

  const app = await startApp({
    mainNestModule: AppModule,
    dontFailOnSentryErrors: true,
  })

  await waitForExpect(
    async () => {
      await expect(axios.get(await app.app.getUrl())).resolves.toMatchObject<AxiosResponse<string>>(
        expect.objectContaining<Partial<AxiosResponse<string>>>({ status: HttpStatus.OK }),
      )
    },
    120_000,
    1_000,
  )
})
