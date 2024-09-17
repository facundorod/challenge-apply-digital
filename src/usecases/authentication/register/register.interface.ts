import { RegisterDTO } from '@/domain/dtos/registerRequest.dto';

export interface RegisterUseCase {
  execute(userRegisterDTO: RegisterDTO): Promise<void>;
}
