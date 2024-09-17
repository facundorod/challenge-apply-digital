import { RegisterDTO } from '@/domain/dtos/registerRequest.dto';
import { RegisterUseCase } from './register.interface';
import { UserRepository } from '@/domain/ports/repositories/user.repository';
import { LoggerService } from '@/domain/ports/logger/logger.port';
import { EncryptationService } from '@/domain/ports/encryptation/encryptation.port';
import { UserAlreadyExist } from '@/domain/errors/userAlreadyExist.error';
import { User } from '@/domain/models/user.model';

export class Register implements RegisterUseCase {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly userRepository: UserRepository,
    private readonly encryptationService: EncryptationService,
  ) {}

  async execute(userRegisterDTO: RegisterDTO): Promise<void> {
    this.loggerService.log(`Registering new user...`);

    const alreadyExistUser = await this.userRepository.findByEmail(
      userRegisterDTO.email,
    );

    if (alreadyExistUser) throw new UserAlreadyExist();

    const newEncryptedPassword: string =
      await this.encryptationService.encryptData(userRegisterDTO.password);

    const newUser = new User(
      undefined,
      userRegisterDTO.name,
      userRegisterDTO.email,
      newEncryptedPassword,
      userRegisterDTO.surname,
    );

    await this.userRepository.insert(newUser);

    this.loggerService.log(`New user registered ${userRegisterDTO.email}..`);
  }
}
