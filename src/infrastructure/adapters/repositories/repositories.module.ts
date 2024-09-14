import { DatabaseModule } from '@/infrastructure/configuration/database/database.module';
import { ProductTypeOrmEntity } from '@/infrastructure/configuration/database/entities/product.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductTypeOrmRepository } from './product.repository';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([ProductTypeOrmEntity])],
  providers: [ProductTypeOrmRepository],
  exports: [ProductTypeOrmRepository],
})
export class RepositoriesModule {}
