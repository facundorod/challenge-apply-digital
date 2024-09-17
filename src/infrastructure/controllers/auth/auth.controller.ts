import { RegisterDTO } from '@/domain/dtos/registerRequest.dto';
import { UserLoginDTO } from '@/domain/dtos/userLoginRequest.dto';
import { UserLoginResponse } from '@/domain/dtos/userLoginResponse.dto';
import { Public } from '@/infrastructure/configuration/decorators/public.decorator';
import { UsecaseProxyModule } from '@/infrastructure/proxy/usecase/usecase-proxy.module';
import { UseCaseProxy } from '@/infrastructure/proxy/usecase/usecase.proxy';
import { LoginUseCase } from '@/usecases/authentication/login/login.interface';
import { RegisterUseCase } from '@/usecases/authentication/register/register.interface';
import { Body, Controller, HttpCode, Inject, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(UsecaseProxyModule.USER_REGISTER_USE_CASE)
    private readonly userRegisterUseCase: UseCaseProxy<RegisterUseCase>,
    @Inject(UsecaseProxyModule.USER_LOGIN_USE_CASE)
    private readonly userLoginUseCase: UseCaseProxy<LoginUseCase>,
  ) {}

  @Post('register')
  @HttpCode(201)
  @Public()
  public async register(
    @Body() userRegisterDTO: RegisterDTO,
  ): Promise<{ message: string }> {
    const userRegisterInstance = this.userRegisterUseCase.getInstance();
    await userRegisterInstance.execute(userRegisterDTO);

    return { message: 'User registered successfully' };
  }

  @Post('login')
  @HttpCode(200)
  @Public()
  public async login(
    @Body() userLoginDto: UserLoginDTO,
  ): Promise<UserLoginResponse> {
    const userLoginInstance = this.userLoginUseCase.getInstance();

    return userLoginInstance.execute(userLoginDto);
  }
}
