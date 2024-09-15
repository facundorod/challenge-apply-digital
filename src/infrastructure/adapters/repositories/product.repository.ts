import { ProductFilterDto } from '@/domain/dtos/productFilter.dto';
import { Product } from '@/domain/models/product.model';
import { ProductRepository } from '@/domain/ports/repositories/product.repository';
import { ProductTypeOrmEntity } from '@/infrastructure/configuration/database/entities/product.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class ProductTypeOrmRepository implements ProductRepository {
  constructor(
    @InjectRepository(ProductTypeOrmEntity)
    private readonly productRepo: Repository<ProductTypeOrmEntity>,
  ) {}

  async getAll(
    productFilterDTO: ProductFilterDto,
  ): Promise<{ total: number; products: Product[] }> {
    const productQueryBuilder = this.getProductQuery(productFilterDTO);

    const [products, total] = await productQueryBuilder.getManyAndCount();

    return {
      total,
      products: products.map((product: ProductTypeOrmEntity) =>
        product.convertToProductModel(),
      ),
    };
  }

  private getProductQuery(
    productFilterDTO: ProductFilterDto,
  ): SelectQueryBuilder<ProductTypeOrmEntity> {
    const productQuery = this.productRepo.createQueryBuilder('product');

    if (productFilterDTO.name)
      productQuery.andWhere('lower(product.name) LIKE :name', {
        name: `%${productFilterDTO.name}%`,
      });

    if (productFilterDTO.category)
      productQuery.andWhere('product.category = :category', {
        category: productFilterDTO.category,
      });

    if (productFilterDTO.color)
      productQuery.andWhere('product.color = :color', {
        color: productFilterDTO.color,
      });

    if (productFilterDTO.brand)
      productQuery.andWhere('product.brand = :brand', {
        brand: productFilterDTO.brand,
      });

    if (productFilterDTO.model)
      productQuery.andWhere('product.model = :model', {
        model: productFilterDTO.model,
      });
    if (productFilterDTO.currency)
      productQuery.andWhere('product.currency = :currency', {
        currency: productFilterDTO.currency,
      });

    if (productFilterDTO.minPrice) {
      productQuery.andWhere('product.price >= :minPrice', {
        minPrice: productFilterDTO.minPrice,
      });
    }

    if (productFilterDTO.maxPrice) {
      productQuery.andWhere('product.price <= :maxPrice', {
        maxPrice: productFilterDTO.maxPrice,
      });
    }

    if (productFilterDTO.minStock) {
      productQuery.andWhere('product.stock >= :minStock', {
        minStock: productFilterDTO.minStock,
      });
    }

    if (productFilterDTO.maxStock) {
      productQuery.andWhere('product.stock >= :maxStock', {
        maxStock: productFilterDTO.maxStock,
      });
    }

    productQuery.orderBy(
      `product.${productFilterDTO.orderBy}`,
      productFilterDTO.order,
    );

    productQuery.skip(productFilterDTO.page).take(productFilterDTO.pageSize);

    return productQuery;
  }

  async insert(product: Product): Promise<void> {
    const productToInsert = new ProductTypeOrmEntity();
    productToInsert.convertToProductEntity(product);
    await this.productRepo.save(productToInsert);
  }

  async update(product: Product): Promise<void> {
    const productToInsert = new ProductTypeOrmEntity();
    productToInsert.convertToProductEntity(product);
    await this.productRepo.update(product.getSku(), productToInsert);
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
