import { UserTypeOrmEntity } from './user.entity';
import { User } from '@/domain/models/user.model';

describe('UserEntityTypeORM', () => {
  let userEntity: UserTypeOrmEntity;

  beforeEach(() => {
    userEntity = new UserTypeOrmEntity();
    userEntity.userId = 1;
    userEntity.name = 'User';
    userEntity.surname = 'Test';
    userEntity.email = 'test@test.com';
    userEntity.password = 'encryptedPassword';
  });

  it('should initialize entity fields correctly', () => {
    expect(userEntity.userId).toBe(1);
    expect(userEntity.name).toBe('User');
    expect(userEntity.surname).toBe('Test');
    expect(userEntity.email).toBe('test@test.com');
    expect(userEntity.password).toBe('encryptedPassword');
  });

  it('should convert entity to User model correctly', () => {
    const userModel = userEntity.convertToUserModel();

    expect(userModel).toBeInstanceOf(User);
    expect(userModel.getUserId()).toBe(1);
    expect(userModel.getName()).toBe('User');
    expect(userModel.getSurname()).toBe('Test');
    expect(userModel.getEmail()).toBe('test@test.com');
    expect(userModel.getPassword()).toBe('encryptedPassword');
  });
});
