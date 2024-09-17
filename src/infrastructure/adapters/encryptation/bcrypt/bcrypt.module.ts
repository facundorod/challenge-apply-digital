import { ConfigurationModule } from '@/infrastructure/configuration/configuration.module';
import { Module } from '@nestjs/common';
import { BCryptService } from './bcrypt.adapter';
import { NestConfigService } from '@/infrastructure/configuration/environment/environment.service';
import { EnvironmentService } from '@/domain/ports/configuration/environment.port';

@Module({
  imports: [ConfigurationModule],
  providers: [
    {
      provide: BCryptService,
      inject: [NestConfigService],
      useFactory: (configService: EnvironmentService) =>
        new BCryptService(configService),
    },
  ],
  exports: [BCryptService],
})
export class BcryptModule {}
