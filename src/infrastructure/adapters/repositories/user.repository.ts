import { User } from '@/domain/models/user.model';
import { UserRepository } from '@/domain/ports/repositories/user.repository';
import { UserTypeOrmEntity } from '@/infrastructure/configuration/database/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserTypeOrmRepository implements UserRepository {
  constructor(
    @InjectRepository(UserTypeOrmEntity)
    private readonly userRepo: Repository<UserTypeOrmEntity>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    const userEntity = await this.userRepo.findOneBy({ email });
    if (!userEntity) return null;
    return userEntity.convertToUserModel();
  }

  async insert(user: User): Promise<void> {
    const userEntity = new UserTypeOrmEntity();
    userEntity.convertToUserEntity(user);

    await this.userRepo.insert(userEntity);
  }
}
