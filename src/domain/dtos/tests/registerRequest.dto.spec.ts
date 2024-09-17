import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { RegisterDTO } from '../registerRequest.dto';

describe('RegisterDTO', () => {
  it('should succeed with valid data', async () => {
    const dto = plainToClass(RegisterDTO, {
      name: 'test',
      email: 'test.user@example.com',
      surname: 'user',
      password: 'StrongP@ssw0rd',
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail if name is empty', async () => {
    const dto = plainToClass(RegisterDTO, {
      name: '',
      email: 'test.user@example.com',
      surname: 'user',
      password: 'StrongP@ssw0rd',
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(1);
    expect(errors[0].property).toBe('name');
    expect(errors[0].constraints?.isNotEmpty).toBe('name should not be empty');
  });

  it('should fail if email is invalid', async () => {
    const dto = plainToClass(RegisterDTO, {
      name: 'test',
      email: 'invalid-email',
      surname: 'user',
      password: 'StrongP@ssw0rd',
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(1);
    expect(errors[0].property).toBe('email');
    expect(errors[0].constraints?.isEmail).toBe('email must be an email');
  });

  it('should fail if email is empty', async () => {
    const dto = plainToClass(RegisterDTO, {
      name: 'test',
      email: '',
      surname: 'user',
      password: 'StrongP@ssw0rd',
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(1);
    expect(errors[0].property).toBe('email');
    expect(errors[0].constraints?.isNotEmpty).toBe('email should not be empty');
  });

  it('should fail if surname is empty', async () => {
    const dto = plainToClass(RegisterDTO, {
      name: 'test',
      email: 'test.user@example.com',
      surname: '',
      password: 'StrongP@ssw0rd',
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(1);
    expect(errors[0].property).toBe('surname');
    expect(errors[0].constraints?.isNotEmpty).toBe(
      'surname should not be empty',
    );
  });

  it('should fail if password is not strong enough', async () => {
    const dto = plainToClass(RegisterDTO, {
      name: 'test',
      email: 'test.user@example.com',
      surname: 'user',
      password: 'weak',
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(1);
    expect(errors[0].property).toBe('password');
    expect(errors[0].constraints?.isStrongPassword).toBe(
      'Password not strong enough. It must have more than 6 characters, 1 uppercase, 1 lowercase and 1 number',
    );
  });

  it('should fail if password users not contain uppercase characters', async () => {
    const dto = plainToClass(RegisterDTO, {
      name: 'test',
      email: 'test.user@example.com',
      surname: 'user',
      password: 'strongpass1',
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(1);
    expect(errors[0].property).toBe('password');
    expect(errors[0].constraints?.isStrongPassword).toBe(
      'Password not strong enough. It must have more than 6 characters, 1 uppercase, 1 lowercase and 1 number',
    );
  });

  it('should fail if password users not contain lowercase characters', async () => {
    const dto = plainToClass(RegisterDTO, {
      name: 'test',
      email: 'test.user@example.com',
      surname: 'user',
      password: 'STRONGPASS1',
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(1);
    expect(errors[0].property).toBe('password');
    expect(errors[0].constraints?.isStrongPassword).toBe(
      'Password not strong enough. It must have more than 6 characters, 1 uppercase, 1 lowercase and 1 number',
    );
  });

  it('should fail if password users not contain numbers', async () => {
    const dto = plainToClass(RegisterDTO, {
      name: 'test',
      email: 'test.user@example.com',
      surname: 'user',
      password: 'StrongPassword',
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(1);
  });
});
