import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class RegisterDTO {
  @ApiProperty({ description: 'User name', type: 'string', example: 'John' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'User email',
    type: 'string',
    example: 'test@example.com',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'User surname', type: 'string', example: 'User' })
  surname: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword(
    {
      minLength: 6,
      minUppercase: 1,
      minLowercase: 1,
      minSymbols: 0,
      minNumbers: 1,
    },
    {
      message:
        'Password not strong enough. It must have more than 6 characters, 1 uppercase, 1 lowercase and 1 number',
    },
  )
  @ApiProperty({
    description:
      'User password. It must have more than 6 characters, 1 uppercase, 1 lowercase and 1 number',
    example: 'TestPass1234',
    type: 'string',
  })
  password: string;
}
