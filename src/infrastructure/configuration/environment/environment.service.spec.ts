import { Test, TestingModule } from '@nestjs/testing';
import { NestConfigService } from './environment.service';
import { ConfigService } from '@nestjs/config';
import { AppEnv } from '@/domain/enums/appEnv.enum';

describe('EnvironmentService', () => {
  let service: NestConfigService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NestConfigService,
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<NestConfigService>(NestConfigService);

    configService = module.get<ConfigService>(ConfigService);
  });

  it('should return the correct app environment', () => {
    (configService.getOrThrow as jest.Mock).mockReturnValue(AppEnv.Production);

    const result = service.getAppEnv();

    expect(result).toBe(AppEnv.Production);
    expect(configService.getOrThrow).toHaveBeenCalledWith('APP_ENV');
  });

  it('should return the correct database URI', () => {
    const mockDatabaseUri = 'postgres://user:password@localhost:5432/mydb';
    (configService.getOrThrow as jest.Mock).mockReturnValue(mockDatabaseUri);

    const result = service.getDatabaseURI();

    expect(result).toBe(mockDatabaseUri);
    expect(configService.getOrThrow).toHaveBeenCalledWith('DATABASE_URI');
  });
});
