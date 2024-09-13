import { Module } from '@nestjs/common';
import { ConfigurationModule } from './configuration/configuration.module';
import { DatabaseModule } from './configuration/database/database.module';

@Module({
  imports: [ConfigurationModule, DatabaseModule],
})
export class InfrastructureModule {}
