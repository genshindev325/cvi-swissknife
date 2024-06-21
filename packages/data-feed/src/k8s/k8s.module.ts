import { Module } from '@nestjs/common'
import { ConfigModule, SentryModule } from '@coti-cvi/common-be'
import { K8sController } from './k8s.controller'
import { K8sService } from './k8s.service'

@Module({
  imports: [ConfigModule, SentryModule],
  providers: [K8sService],
  controllers: [K8sController],
})
export class K8sModule {}
