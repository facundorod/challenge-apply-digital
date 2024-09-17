import { UserTypeOrmEntity } from '@/infrastructure/configuration/database/entities/user.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { UserTypeOrmRepository } from '../user.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '@/domain/models/user.model';

describe('UserTypeOrmRepository', () => {
  let repository: UserTypeOrmRepository;
  let userRepoMock: jest.Mocked<Repository<UserTypeOrmEntity>>;

  const mockUserEntity = new UserTypeOrmEntity();
  mockUserEntity.userId = 1;
  mockUserEntity.name = 'Test';
  mockUserEntity.surname = 'User';
  mockUserEntity.email = 'test@test.com';
  mockUserEntity.password = 'password';
  mockUserEntity.convertToUserModel = jest
    .fn()
    .mockReturnValue(new User(1, 'Test', 'User', 'test@test.com', 'password'));
  beforeEach(async () => {
    userRepoMock = {
      insert: jest.fn(),
      update: jest.fn(),
      findOneBy: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    } as unknown as jest.Mocked<Repository<UserTypeOrmEntity>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserTypeOrmRepository,
        {
          provide: getRepositoryToken(UserTypeOrmEntity),
          useValue: userRepoMock,
        },
      ],
    }).compile();

    repository = module.get<UserTypeOrmRepository>(UserTypeOrmRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should insert a user correctly', async () => {
    const user = new User(
      undefined,
      'Test',
      'test@test.com',
      'password',
      'User',
    );

    await repository.insert(user);

    expect(userRepoMock.insert).toHaveBeenCalledWith(
      expect.any(UserTypeOrmEntity),
    );
  });

  it('should return a user by email if found', async () => {
    const user = new User(
      undefined,
      'Test',
      'test@test.com',
      'password',
      'User',
    );
    userRepoMock.findOneBy.mockResolvedValue(mockUserEntity);

    const result = await repository.findByEmail(user.getEmail());

    expect(userRepoMock.findOneBy).toHaveBeenCalledWith({
      email: user.getEmail(),
    });
    expect(mockUserEntity.convertToUserModel).toHaveBeenCalled();
    expect(result).toEqual(
      new User(1, 'Test', 'User', 'test@test.com', 'password'),
    );
  });
});
