import { AppEnv } from '@/domain/enums/appEnv.enum';

export interface EnvironmentService {
  getAppEnv(): AppEnv;
  getDatabaseURI(): string;
}
