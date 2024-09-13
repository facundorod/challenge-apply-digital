import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigurationModule } from '../configuration.module';
import { NestConfigService } from '../environment/environment.service';
import { EnvironmentService } from '@/domain/ports/configuration/environment.port';
import { AppEnv } from '@/domain/enums/appEnv.enum';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigurationModule],
      inject: [NestConfigService],

      useFactory: (config: EnvironmentService) => ({
        type: 'postgres',
        logging: ['error'],
        entities: [],
        url: config.getDatabaseURI(),
        synchronize: config.getAppEnv() !== AppEnv.Production,
      }),
    }),
  ],
})
export class DatabaseModule {}
