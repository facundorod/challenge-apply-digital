import { Module } from '@nestjs/common';
import { NestConfigService } from './environment/environment.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [NestConfigService],
  imports: [ConfigModule.forRoot({ isGlobal: false })],
  exports: [NestConfigService],
})
export class ConfigurationModule {}
