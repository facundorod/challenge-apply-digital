import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { FetchProductDataJob } from './fetchData.job';
import { UsecaseProxyModule } from '../proxy/usecase/usecase-proxy.module';

@Module({
  imports: [UsecaseProxyModule.register(), ScheduleModule.forRoot()],
  providers: [FetchProductDataJob],
})
export class JobsModule {}
