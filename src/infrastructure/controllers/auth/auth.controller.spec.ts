import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { RegisterUseCase } from '@/usecases/authentication/register/register.interface';
import { UseCaseProxy } from '@/infrastructure/proxy/usecase/usecase.proxy';
import { UsecaseProxyModule } from '@/infrastructure/proxy/usecase/usecase-proxy.module';
import { RegisterDTO } from '@/domain/dtos/registerRequest.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let registerUseCaseMock: jest.Mocked<UseCaseProxy<RegisterUseCase>>;
  let registerInstanceMock: jest.Mocked<RegisterUseCase>;

  beforeEach(async () => {
    registerInstanceMock = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<RegisterUseCase>;

    registerUseCaseMock = {
      getInstance: jest.fn().mockReturnValue(registerInstanceMock),
    } as undefined as jest.Mocked<UseCaseProxy<RegisterUseCase>>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: UsecaseProxyModule.USER_REGISTER_USE_CASE,
          useValue: registerUseCaseMock,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => jest.resetAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call registerUseCase', async () => {
    registerInstanceMock.execute.mockResolvedValue();
    const registerDTO: RegisterDTO = {
      email: 'test@test.com',
      name: 'Test',
      surname: 'User',
      password: 'password',
    };
    await controller.register(registerDTO);
    expect(registerUseCaseMock.getInstance).toHaveBeenCalled();
    expect(registerInstanceMock.execute).toHaveBeenCalledWith(registerDTO);
  });
});
