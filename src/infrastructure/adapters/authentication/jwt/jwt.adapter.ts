import { AuthenticationService } from '@/domain/ports/authentication/authentication.port';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JWTService implements AuthenticationService {
  constructor(private readonly jwtService: JwtService) {}

  signData(dataToSign: object): Promise<string> {
    return this.jwtService.signAsync(dataToSign);
  }
  verify(accessToken: string): Promise<object> {
    return this.jwtService.verifyAsync(accessToken);
  }
}
