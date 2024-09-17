import { DatabaseModule } from '@/infrastructure/configuration/database/database.module';
import { UserTypeOrmEntity } from '@/infrastructure/configuration/database/entities/user.entity';
import { AuthController } from '@/infrastructure/controllers/auth/auth.controller';
import { UsecaseProxyModule } from '@/infrastructure/proxy/usecase/usecase-proxy.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import supertest from 'supertest';
import { Repository } from 'typeorm';

describe('ProductsController (Integration)', () => {
  let app: INestApplication;
  let repository: Repository<UserTypeOrmEntity>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [UserTypeOrmEntity],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([UserTypeOrmEntity]),
        UsecaseProxyModule.register(),
      ],
      controllers: [AuthController],
    })
      .overrideModule(DatabaseModule)
      .useModule(jest.fn())
      .compile();

    app = moduleFixture.createNestApplication();
    repository = moduleFixture.get<Repository<UserTypeOrmEntity>>(
      getRepositoryToken(UserTypeOrmEntity),
    );
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await repository.clear();
  });

  describe('POST /auth/register', () => {
    it('should return validation error for invalid user email', async () => {
      const response = await supertest(app.getHttpServer())
        .post('/auth/register')
        .send({
          name: 'Facundo',
          surname: 'Rodriguez',
          email: 'rodriguezfacundohernan',
          password: 'ApplyDigital2024',
        });

      expect(response.status).toBe(400);
      expect(response.body.message[0]).toContain('email must be an email');
    });
    it('should return validation error for weak user password', async () => {
      const response = await supertest(app.getHttpServer())
        .post('/auth/register')
        .send({
          name: 'Facundo',
          surname: 'Rodriguez',
          email: 'rodriguezfacundohernan@gmail.com',
          password: 'ApplyDigital',
        });

      expect(response.status).toBe(400);
      expect(response.body.message[0]).toContain(
        'Password not strong enough. It must have more than 6 characters, 1 uppercase, 1 lowercase and 1 number',
      );
    });
    it('should return validation error if the email is already registered', async () => {
      const newUserEntity = new UserTypeOrmEntity();
      newUserEntity.email = 'rodriguezfacundohernan@gmail.com';
      newUserEntity.password = 'encryptedpass';
      newUserEntity.name = 'Facundo';
      newUserEntity.surname = 'Rodriguez';
      repository.insert(newUserEntity);
      const response = await supertest(app.getHttpServer())
        .post('/auth/register')
        .send({
          name: 'Facundo',
          surname: 'Rodriguez',
          email: 'rodriguezfacundohernan@gmail.com',
          password: 'ApplyDigital2024',
        });

      expect(response.status).toBe(422);
      expect(response.body).toStrictEqual({
        message: 'The email is already in use',
      });
    });
    it('should register the user successfully', async () => {
      const response = await supertest(app.getHttpServer())
        .post('/auth/register')
        .send({
          name: 'Facundo',
          surname: 'Rodriguez',
          email: 'rodriguezfacundohernan+new@gmail.com',
          password: 'ApplyDigital2024',
        });

      expect(response.status).toBe(201);
      expect(response.body).toStrictEqual({
        message: 'User registered successfully',
      });
    });
  });
});
