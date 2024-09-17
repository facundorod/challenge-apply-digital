import { EncryptationService } from '@/domain/ports/encryptation/encryptation.port';
import { LoggerService } from '@/domain/ports/logger/logger.port';
import { UserRepository } from '@/domain/ports/repositories/user.repository';
import { RegisterUseCase } from '../register.interface';
import { Register } from '../register.usecase';
import { User } from '@/domain/models/user.model';
import { RegisterDTO } from '@/domain/dtos/registerRequest.dto';
import { UserAlreadyExist } from '@/domain/errors/userAlreadyExist.error';

describe('Register usecase unit test', () => {
  let loggerService: jest.Mocked<LoggerService>;
  let encryptationService: jest.Mocked<EncryptationService>;
  let userRepository: jest.Mocked<UserRepository>;
  let userRegister: RegisterUseCase;

  beforeAll(() => {
    loggerService = {
      log: jest.fn(),
    } as unknown as jest.Mocked<LoggerService>;
    encryptationService = {
      compare: jest.fn(),
      encryptData: jest.fn(),
    };

    userRepository = {
      findByEmail: jest.fn(),
      insert: jest.fn(),
    };

    userRegister = new Register(
      loggerService,
      userRepository,
      encryptationService,
    );
  });

  afterAll(() => jest.resetAllMocks());

  it('should thrown an error if the email is already in use', async () => {
    userRepository.findByEmail.mockResolvedValueOnce(
      new User(1, 'test', 'test@test.com', 'encrpass', 'Test'),
    );
    const userRegisterDTO: RegisterDTO = {
      email: 'test@test.com',
    } as unknown as RegisterDTO;

    await expect(userRegister.execute(userRegisterDTO)).rejects.toThrow(
      UserAlreadyExist,
    );
  });

  it('should encrypt the user password', async () => {
    userRepository.findByEmail.mockResolvedValueOnce(null);
    const userRegisterDTO: RegisterDTO = {
      email: 'test@test.com',
      password: 'password',
      name: 'test',
      surname: 'Test',
    };

    encryptationService.encryptData.mockResolvedValueOnce(
      'encrypted----password',
    );

    const newUser = new User(
      undefined,
      'test',
      'test@test.com',
      'encrypted----password',
      'Test',
    );

    await userRegister.execute(userRegisterDTO);
    expect(encryptationService.encryptData).toHaveBeenCalledWith(
      userRegisterDTO.password,
    );
    expect(userRepository.insert).toHaveBeenCalledWith(newUser);
  });
});
