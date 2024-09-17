import { AppEnv } from '@/domain/enums/appEnv.enum';
import { EnvironmentService } from '@/domain/ports/configuration/environment.port';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NestConfigService implements EnvironmentService {
  constructor(private readonly configService: ConfigService) {}

  getEncryptationSaltValue(): number {
    return this.configService.getOrThrow<number>('SALT_VALUE');
  }

  getJWTSecret(): string {
    return this.configService.getOrThrow<string>('JWT_SECRET');
  }

  getExpirationTime(): string {
    return this.configService.getOrThrow<string>('JWT_EXPIRATION_TIME');
  }

  getContentFulAPIURL(): string {
    return this.configService.getOrThrow<string>('CONTENTFUL_API_URL');
  }
  getContentFulAPISpaceId(): string {
    return this.configService.getOrThrow<string>('CONTENTFUL_API_SPACEID');
  }
  getContentFulAPIAccessToken(): string {
    return this.configService.getOrThrow<string>('CONTENTFUL_API_ACCESSTOKEN');
  }
  getContentFulAPIEnvironment(): string {
    return this.configService.getOrThrow<string>('CONTENTFUL_API_ENVIRONMENT');
  }
  getContentFulAPIContentType(): string {
    return this.configService.getOrThrow<string>('CONTENTFUL_API_CONTENTTYPE');
  }

  getAppEnv(): AppEnv {
    return this.configService.getOrThrow<AppEnv>('APP_ENV');
  }
  getDatabaseURI(): string {
    return this.configService.getOrThrow<string>('DATABASE_URI');
  }
}
