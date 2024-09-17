import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { RegisterUseCase } from '@/usecases/authentication/register/register.interface';
import { UseCaseProxy } from '@/infrastructure/proxy/usecase/usecase.proxy';
import { UsecaseProxyModule } from '@/infrastructure/proxy/usecase/usecase-proxy.module';
import { RegisterDTO } from '@/domain/dtos/registerRequest.dto';
import { LoginUseCase } from '@/usecases/authentication/login/login.interface';
import { UserLoginResponse } from '@/domain/dtos/userLoginResponse.dto';
import { User } from '@/domain/models/user.model';
import { UserLoginDTO } from '@/domain/dtos/userLoginRequest.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let registerUseCaseMock: jest.Mocked<UseCaseProxy<RegisterUseCase>>;
  let registerInstanceMock: jest.Mocked<RegisterUseCase>;
  let loginUseCaseMock: jest.Mocked<UseCaseProxy<LoginUseCase>>;
  let loginInstanceMock: jest.Mocked<LoginUseCase>;

  beforeEach(async () => {
    registerInstanceMock = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<RegisterUseCase>;

    registerUseCaseMock = {
      getInstance: jest.fn().mockReturnValue(registerInstanceMock),
    } as undefined as jest.Mocked<UseCaseProxy<RegisterUseCase>>;

    loginInstanceMock = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<LoginUseCase>;

    loginUseCaseMock = {
      getInstance: jest.fn().mockReturnValue(loginInstanceMock),
    } as undefined as jest.Mocked<UseCaseProxy<LoginUseCase>>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: UsecaseProxyModule.USER_REGISTER_USE_CASE,
          useValue: registerUseCaseMock,
        },
        {
          provide: UsecaseProxyModule.USER_LOGIN_USE_CASE,
          useValue: loginUseCaseMock,
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

  it('should call loginUsecase', async () => {
    const userLoginDTO: UserLoginResponse = {
      expirationDate: new Date(),
      user: new User(undefined, 'Test', 'test@test.com', undefined, 'User'),
      userToken: 'jwt...',
    };
    loginInstanceMock.execute.mockResolvedValue(userLoginDTO);
    const loginDTO: UserLoginDTO = {
      email: 'test@test.com',
      password: 'password',
    };
    await controller.login(loginDTO);
    expect(loginUseCaseMock.getInstance).toHaveBeenCalled();
    expect(loginInstanceMock.execute).toHaveBeenCalledWith(loginDTO);
  });
});
