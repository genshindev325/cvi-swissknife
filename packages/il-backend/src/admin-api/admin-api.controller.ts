import { Controller, Get, Inject, Query } from '@nestjs/common'
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AdminApiService } from './admin-api.service'
import { ProtectionDuePayoutPointsDto, ProtectionStatusDto, WalletProtectionsDto } from './dtos'

@ApiTags(`Accounts`)
@Controller('/accounts')
export class AdminApiController {
  constructor(@Inject(AdminApiService) private readonly adminApiService: AdminApiService) {}

  @Get('/protections')
  @ApiOperation({
    description: `Get all protections exist in the smart contract`,
  })
  @ApiResponse({ type: WalletProtectionsDto, isArray: true })
  public protections(): WalletProtectionsDto[] {
    return this.adminApiService.ilAdminInversifyService.getProtectionsByWalletAsJson()
  }

  @Get('/due-payouts-for-a-protection-id')
  @ApiOperation({
    description: `For a protection-id, get all its due-payouts and il-percentage lifecycle per protection (inc. specifying number of points in lifecycle)`,
  })
  @ApiQuery({
    name: 'protection-id',
    required: true,
    type: String,
  })
  @ApiQuery({
    name: 'points-to-calculate',
    required: true,
    type: Number,
  })
  @ApiResponse({ type: ProtectionDuePayoutPointsDto })
  public getDuePayoutsForProtectionId(
    @Query('protection-id')
    protectionId: string,
    @Query('points-to-calculate')
    pointsToCalculate: number,
  ): Promise<ProtectionDuePayoutPointsDto> {
    return this.adminApiService.ilAdminInversifyService.getProtectionHistory({
      pointsToCalculate,
      protectionId,
    })
  }

  @Get('/protection-status')
  @ApiOperation({
    description: `get protection status`,
  })
  @ApiQuery({
    name: 'protection-id',
    required: true,
    type: String,
  })
  @ApiQuery({
    name: 'use-cache',
    required: true,
    type: Boolean,
  })
  @ApiQuery({
    name: 'block-number',
    required: false,
    type: Number,
  })
  @ApiResponse({ type: ProtectionStatusDto })
  public async getProtectionStatusById(
    @Query('protection-id')
    protectionId: string,
    @Query('use-cache')
    useCache: string,
    @Query('block-number')
    blockNumber?: string,
  ): Promise<ProtectionStatusDto> {
    return this.adminApiService.ilAdminInversifyService.getProtectionStatusById({
      protectionId,
      useCache: useCache === 'true',
      blockNumber: blockNumber ? Number(blockNumber) : undefined,
    })
  }
}
