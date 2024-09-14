import { Product } from '@/domain/models/product.model';
import { ProductRepository } from '@/domain/ports/repositories/product.repository';
import { ProductTypeOrmEntity } from '@/infrastructure/configuration/database/entities/product.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProductTypeOrmRepository implements ProductRepository {
  constructor(
    @InjectRepository(ProductTypeOrmEntity)
    private readonly productRepo: Repository<ProductTypeOrmEntity>,
  ) {}

  async getAll(): Promise<Product[]> {
    const productsEntities = await this.productRepo.find();

    return productsEntities.map((product: ProductTypeOrmEntity) =>
      product.convertToProductModel(),
    );
  }

  async insert(product: Product): Promise<void> {
    const productToInsert = new ProductTypeOrmEntity();
    productToInsert.convertToProductEntity(product);
    await this.productRepo.save(productToInsert);
  }

  async update(product: Product): Promise<void> {
    const productToInsert = new ProductTypeOrmEntity();
    productToInsert.convertToProductEntity(product);
    await this.productRepo.save(productToInsert);
  }

  async bulkInsert(products: Product[]): Promise<void> {
    const productsEntities: ProductTypeOrmEntity[] = products.map(
      (value: Product) => {
        const newProductEntity = new ProductTypeOrmEntity();
        newProductEntity.convertToProductEntity(value);
        return newProductEntity;
      },
    );

    await this.productRepo.save(productsEntities);
  }
}
