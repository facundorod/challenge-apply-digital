import { EnvironmentService } from '@/domain/ports/configuration/environment.port';
import { EncryptationService } from '@/domain/ports/encryptation/encryptation.port';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BCryptService implements EncryptationService {
  constructor(private readonly configService: EnvironmentService) {}

  async encryptData(data: string | Buffer): Promise<string> {
    const saltValue = this.configService.getEncryptationSaltValue();
    const generatedSalt = await bcrypt.genSalt(+saltValue);
    return bcrypt.hash(data, generatedSalt);
  }

  compare(data: string, encrypted: string): Promise<boolean> {
    return bcrypt.compare(data, encrypted);
  }
}
