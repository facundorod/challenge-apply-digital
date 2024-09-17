import { EncryptationService } from '@/domain/ports/encryptation/encryptation.port';
import { AuthenticationService } from '@/domain/ports/authentication/authentication.port';

import { EnvironmentService } from '@/domain/ports/configuration/environment.port';
import { UserRepository } from '@/domain/ports/repositories/user.repository';
import { LoggerService } from '@/domain/ports/logger/logger.port';
import { LoginUseCase } from '../login.interface';
import { UserLogin } from '../login.usecase';
import { UserLoginDTO } from '@/domain/dtos/userLoginRequest.dto';
import { UserNotFound } from '@/domain/errors/userNotFound.error';
import { User } from '@/domain/models/user.model';
import { InvalidPassword } from '@/domain/errors/invalidUserPassword.error';

describe('User login Use Case', () => {
  let userRepository: jest.Mocked<UserRepository>;
  let loggerService: jest.Mocked<LoggerService>;
  let encryptationService: jest.Mocked<EncryptationService>;
  let authenticationService: jest.Mocked<AuthenticationService>;
  let userLogin: LoginUseCase;
  let configurationService: jest.Mocked<EnvironmentService>;
  beforeAll(() => {
    userRepository = {
      findByEmail: jest.fn(),
      insert: jest.fn(),
    };
    loggerService = {
      error: jest.fn(),
      log: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    };

    encryptationService = {
      compare: jest.fn(),
      encryptData: jest.fn(),
    };

    authenticationService = {
      signData: jest.fn(),
      verify: jest.fn(),
    };
    configurationService = {
      getJWTSecret: jest.fn(),
      getEncryptationSaltValue: jest.fn(),
      getExpirationTime: jest.fn(),
    } as unknown as jest.Mocked<EnvironmentService>;

    userLogin = new UserLogin(
      loggerService,
      userRepository,
      authenticationService,
      encryptationService,
      configurationService,
    );
  });

  afterAll(() => jest.clearAllMocks());

  it('should throw an error if the email does not exist', async () => {
    const email = 'test@test.com';
    const password = 'password!';
    const informationLogin = new UserLoginDTO();
    informationLogin.email = email;
    informationLogin.password = password;
    userRepository.findByEmail.mockResolvedValueOnce(null);

    await expect(userLogin.execute(informationLogin)).rejects.toThrow(
      UserNotFound,
    );
  });

  it('should throw an error if the password is not correct', async () => {
    const email = 'test@test.com';
    const newUser = new User(1, 'Test', 'test@test.com', 'password', 'User');
    const password = 'passwordinvalid';
    const informationLogin = new UserLoginDTO();
    informationLogin.email = email;
    informationLogin.password = password;

    userRepository.findByEmail.mockResolvedValueOnce(newUser);
    encryptationService.compare.mockResolvedValueOnce(false);
    await expect(userLogin.execute(informationLogin)).rejects.toThrow(
      InvalidPassword,
    );
  });

  it('should return the new user token', async () => {
    const email = 'test@test.com';
    const newUser = new User(1, 'Test', 'test@test.com', 'password', 'User');
    const password = 'correctPassword';
    const informationLogin = new UserLoginDTO();
    informationLogin.email = email;
    informationLogin.password = password;
    configurationService.getExpirationTime.mockReturnValueOnce('1d');

    userRepository.findByEmail.mockResolvedValueOnce(newUser);
    encryptationService.compare.mockResolvedValueOnce(true);

    authenticationService.signData.mockResolvedValueOnce('token');
    const userLoginResponse = await userLogin.execute(informationLogin);
    expect(userLoginResponse.userToken).not.toBeUndefined();
    expect(userLoginResponse.expirationDate).not.toBeUndefined();
  });
});
