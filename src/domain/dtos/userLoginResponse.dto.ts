import { ApiProperty } from '@nestjs/swagger';
import { User } from '../models/user.model';

export class UserLoginResponse {
  @ApiProperty({
    description: 'The user object, excluding the password',
    type: User,
  })
  user: Omit<User, 'password'>;

  @ApiProperty({
    description: 'JWT token for the authenticated user',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  userToken: string;

  @ApiProperty({
    description: 'Expiration date for the token',
    example: '2024-12-31T23:59:59.999Z',
  })
  expirationDate: Date;

  constructor(
    user: Omit<User, 'password'>,
    userToken: string,
    expirationDate: Date,
  ) {
    this.user = user;
    this.userToken = userToken;
    this.expirationDate = expirationDate;
  }
}
