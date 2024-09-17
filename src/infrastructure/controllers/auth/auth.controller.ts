import { RegisterDTO } from '@/domain/dtos/registerRequest.dto';
import { UsecaseProxyModule } from '@/infrastructure/proxy/usecase/usecase-proxy.module';
import { UseCaseProxy } from '@/infrastructure/proxy/usecase/usecase.proxy';
import { RegisterUseCase } from '@/usecases/authentication/register/register.interface';
import { Body, Controller, HttpCode, Inject, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(UsecaseProxyModule.USER_REGISTER_USE_CASE)
    private readonly userRegisterUseCase: UseCaseProxy<RegisterUseCase>,
  ) {}

  @Post('register')
  @HttpCode(201)
  public async register(
    @Body() userRegisterDTO: RegisterDTO,
  ): Promise<{ message: string }> {
    const userRegisterInstance = this.userRegisterUseCase.getInstance();
    await userRegisterInstance.execute(userRegisterDTO);

    return { message: 'User registered successfully' };
  }
}
