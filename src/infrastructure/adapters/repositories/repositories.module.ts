import { DatabaseModule } from '@/infrastructure/configuration/database/database.module';
import { ProductTypeOrmEntity } from '@/infrastructure/configuration/database/entities/product.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductTypeOrmRepository } from './product.repository';
import { UserTypeOrmEntity } from '@/infrastructure/configuration/database/entities/user.entity';
import { UserTypeOrmRepository } from './user.repository';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([ProductTypeOrmEntity, UserTypeOrmEntity]),
  ],
  providers: [ProductTypeOrmRepository, UserTypeOrmRepository],
  exports: [ProductTypeOrmRepository, UserTypeOrmRepository],
})
export class RepositoriesModule {}
