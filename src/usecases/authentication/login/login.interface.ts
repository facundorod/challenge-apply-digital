import { UserLoginDTO } from '@/domain/dtos/userLoginRequest.dto';
import { UserLoginResponse } from '@/domain/dtos/userLoginResponse.dto';

export interface LoginUseCase {
  execute(userLoginDTO: UserLoginDTO): Promise<UserLoginResponse>;
}
