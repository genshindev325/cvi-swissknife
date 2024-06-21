import { ConfigModule, SentryModule } from '@coti-cvi/common-be'
import { Module } from '@nestjs/common'
import { InversifyModule } from '../inversify/init-inversify.module'
import { ArmadilloEligibleDiscountController } from './armadillo-eligible-discount.controller'

@Module({
  imports: [InversifyModule, ConfigModule, SentryModule],
  controllers: [ArmadilloEligibleDiscountController],
})
export class ArmadilloEligibleDiscountModule {}
