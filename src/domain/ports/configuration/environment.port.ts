import { AppEnv } from '@/domain/enums/appEnv.enum';

export interface EnvironmentService {
  getAppEnv(): AppEnv;
  getDatabaseURI(): string;
  getContentFulAPIURL(): string;
  getContentFulAPISpaceId(): string;
  getContentFulAPIAccessToken(): string;
  getContentFulAPIEnvironment(): string;
  getContentFulAPIContentType(): string;
}
