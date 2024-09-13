import { AppEnv } from '@/domain/enums/appEnv.enum';
import { EnvironmentService } from '@/domain/ports/configuration/environment.port';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NestConfigService implements EnvironmentService {
  constructor(private readonly configService: ConfigService) {}

  getAppEnv(): AppEnv {
    return this.configService.getOrThrow<AppEnv>('APP_ENV');
  }
  getDatabaseURI(): string {
    return this.configService.getOrThrow<string>('DATABASE_URI');
  }
}
