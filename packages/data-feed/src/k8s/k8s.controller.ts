import { Controller, Get, Inject } from '@nestjs/common'
import { ApiOperation, ApiTags, ApiProperty, ApiResponse } from '@nestjs/swagger'
import type { HardhatPodStarted } from '@coti-cvi/lw-sdk'
import { BlockchainName } from '@coti-cvi/lw-sdk'
import { K8sService } from './k8s.service'

export class HardhatPodStartedDto implements HardhatPodStarted {
  @ApiProperty({ type: String, enum: BlockchainName })
  BlockchainName!: BlockchainName

  @ApiProperty({ type: String })
  dateUtc!: string
}

@ApiTags(`K8S`)
@Controller('/k8s')
export class K8sController {
  constructor(@Inject(K8sService) private readonly k8sService: K8sService) {}

  @Get('/hardhats-pods-started')
  @ApiOperation({ description: 'get time of when hardhat pods started' })
  @ApiResponse({ type: HardhatPodStartedDto, isArray: true })
  public getWhenHardhatPodsStarted(): HardhatPodStartedDto[] {
    return this.k8sService.getWhenHardhatPodsStarted()
  }
}
