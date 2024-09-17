import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty({ description: 'Unique identifier for the user', example: '1' })
  private userId: number;
  @ApiProperty({ description: 'First name of the user', example: 'John' })
  private name: string;

  @ApiProperty({
    description: 'User email address',
    example: 'test@example.com',
  })
  private email: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123',
    type: 'password',
  })
  private password: string;
  @ApiProperty({ description: 'Last name of the user', example: 'Doe' })
  private surname: string;

  constructor(
    userId: number,
    name: string,
    email: string,
    password: string,
    surname: string,
  ) {
    this.setUserId(userId);
    this.setName(name);
    this.setEmail(email);
    this.setPassword(password);
    this.setSurname(surname);
  }

  public getUserId(): number {
    return this.userId;
  }

  public setUserId(userId: number): void {
    this.userId = userId;
  }

  public getName(): string {
    return this.name;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public getEmail(): string {
    return this.email;
  }

  public setEmail(email: string): void {
    this.email = email;
  }

  public getPassword(): string {
    return this.password;
  }

  public setPassword(encryptedPass: string): void {
    this.password = encryptedPass;
  }

  public getSurname(): string {
    return this.surname;
  }

  public setSurname(surname: string): void {
    this.surname = surname;
  }
}
