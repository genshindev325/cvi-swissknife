import { HttpStatus } from '@nestjs/common'
import { nestBeforeAfterEach } from '@coti-cvi/tests-infra-be'
import type { AxiosResponse } from 'axios'
import axios from 'axios'
import waitForExpect from 'wait-for-expect'
import { AppModule } from '../src/app.module'
import { CHAIN_IDS_INFO } from '@coti-cvi/lw-sdk'

const { startApp } = nestBeforeAfterEach({
  addAdditionalAllowedNockCalls: [
    'py-parabola-coefficients.cvi-team.com:443',
    'hardhat-polygon.cvi-team.com:443',
    'hardhat-polygon-deployments-file.cvi-team.com:443',
    ...new Set(
      Object.values(CHAIN_IDS_INFO)
        .flatMap(c => [c.deployAndForkRpcUrl, c.cviRpcUrl])
        .map(url => new URL(url).origin.replace('https://', '').replace('http://', '')),
    ),
  ],
})

test('check liveness is true after service is up', async () => {
  const app = await startApp({
    mainNestModule: AppModule,
  })

  await waitForExpect(
    async () => {
      await expect(axios.get(await app.app.getUrl())).resolves.toMatchObject<AxiosResponse<string>>(
        expect.objectContaining<Partial<AxiosResponse<string>>>({ status: HttpStatus.OK }),
      )
    },
    10_000,
    50,
  )
})
