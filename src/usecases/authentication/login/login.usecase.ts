import { UserLoginDTO } from '@/domain/dtos/userLoginRequest.dto';
import { UserLoginResponse } from '@/domain/dtos/userLoginResponse.dto';
import { LoginUseCase } from './login.interface';
import { LoggerService } from '@/domain/ports/logger/logger.port';
import { UserRepository } from '@/domain/ports/repositories/user.repository';
import { AuthenticationService } from '@/domain/ports/authentication/authentication.port';
import { EncryptationService } from '@/domain/ports/encryptation/encryptation.port';
import { UserNotFound } from '@/domain/errors/userNotFound.error';
import { InvalidPassword } from '@/domain/errors/invalidUserPassword.error';
import { User } from '@/domain/models/user.model';
import ms from 'ms';
import { EnvironmentService } from '@/domain/ports/configuration/environment.port';

export class UserLogin implements LoginUseCase {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly userRepository: UserRepository,
    private readonly authService: AuthenticationService,
    private readonly encryptationService: EncryptationService,
    private readonly envService: EnvironmentService,
  ) {}

  async execute(userLoginDTO: UserLoginDTO): Promise<UserLoginResponse> {
    this.loggerService.log(`Logging user ${userLoginDTO.email}...`);

    const user = await this.userRepository.findByEmail(userLoginDTO.email);
    if (!user) throw new UserNotFound();

    const isValidPassword = await this.encryptationService.compare(
      userLoginDTO.password,
      user.getPassword(),
    );

    if (!isValidPassword) throw new InvalidPassword();

    const accessToken: string = await this.authService.signData({
      id: user.getUserId(),
      email: user.getEmail(),
    });
    const expirationDate = new Date(
      Date.now() + ms(this.envService.getExpirationTime()),
    );
    return {
      expirationDate: expirationDate,
      user: new User(
        undefined,
        user.getName(),
        user.getEmail(),
        undefined,
        user.getSurname(),
      ),
      userToken: accessToken,
    };
  }
}
