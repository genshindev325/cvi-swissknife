import { Controller, Get, Query } from '@nestjs/common'
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'

@ApiTags(`Discount`)
@Controller('/discount')
export class ArmadilloEligibleDiscountController {
  @Get('/first-campaign/is-eligible')
  @ApiOperation({
    description: `is address eligible for a discount in armadillo`,
  })
  @ApiQuery({
    name: 'address',
    required: true,
    type: String,
  })
  @ApiResponse({ type: Boolean })
  public isEligible(
    @Query('address')
    address: string,
  ): boolean {
    return true
  }
}
