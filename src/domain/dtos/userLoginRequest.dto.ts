import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserLoginDTO {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description: 'User email',
    type: 'string',
    example: 'test@example.com',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'User password',
    type: 'string',
    example: 'Password133',
  })
  password: string;
}
