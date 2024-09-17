import { Module } from '@nestjs/common';
import { ConfigurationModule } from './configuration/configuration.module';
import { DatabaseModule } from './configuration/database/database.module';
import { AxiosModule } from './adapters/http-client/axios/axios.module';
import { WinstonModule } from './adapters/logger/winston/winston.module';
import { RepositoriesModule } from './adapters/repositories/repositories.module';
import { UsecaseProxyModule } from './proxy/usecase/usecase-proxy.module';
import { JobsModule } from './jobs/jobs.module';
import { ControllersModule } from './controllers/controllers.module';
import { JWTModule } from './adapters/authentication/jwt/jwt.module';
import { BcryptModule } from './adapters/encryptation/bcrypt/bcrypt.module';

@Module({
  imports: [
    ConfigurationModule,
    DatabaseModule,
    WinstonModule,
    AxiosModule,
    RepositoriesModule,
    UsecaseProxyModule,
    JobsModule,
    ControllersModule,
    JWTModule,
    BcryptModule,
  ],
})
export class InfrastructureModule {}
