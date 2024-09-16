import { ProductFilterDto } from '@/domain/dtos/productFilter.dto';
import { Product } from '@/domain/models/product.model';
import { ProductRepository } from '@/domain/ports/repositories/product.repository';
import { ProductTypeOrmEntity } from '@/infrastructure/configuration/database/entities/product.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, MoreThan, Repository, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class ProductTypeOrmRepository implements ProductRepository {
  constructor(
    @InjectRepository(ProductTypeOrmEntity)
    private readonly productRepo: Repository<ProductTypeOrmEntity>,
  ) {}

  async countDeleted(): Promise<number> {
    return this.productRepo.count({ where: { isDeleted: true } });
  }

  async countNotDeleted(): Promise<number> {
    return this.productRepo.count({ where: { isDeleted: false } });
  }

  async count(): Promise<number> {
    return this.productRepo.count();
  }
  async countDeletedWithPrice(): Promise<number> {
    return this.productRepo.count({
      where: { isDeleted: true, price: MoreThan(0) },
    });
  }

  countDeletedByDateRange(startDate: Date, endDate: Date): Promise<number> {
    return this.productRepo.count({
      where: { isDeleted: true, createdAt: Between(startDate, endDate) },
    });
  }

  async getAvgPriceOfNonDeletedProducts(): Promise<number> {
    const result = await this.productRepo
      .createQueryBuilder('product')
      .select('AVG(product.price)', 'avgPrice')
      .where('product.isDeleted = :isDeleted', { isDeleted: false })
      .getRawOne();

    return +result.avgPrice || 0;
  }

  async getBySku(sku: string): Promise<Product | null> {
    const productEntity = await this.productRepo.findOneBy({ sku });
    if (!productEntity) return null;

    return productEntity.convertToProductModel();
  }

  async deleteBySku(sku: string): Promise<void> {
    await this.productRepo.delete({ sku });
  }

  async getAll(
    productFilterDTO: ProductFilterDto,
  ): Promise<{ total: number; products: Product[] }> {
    const productQueryBuilder = this.getProductQuery(productFilterDTO);
    productQueryBuilder.andWhere('is_deleted = :deleted', { deleted: false });

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
      `product.${productFilterDTO.orderBy ?? 'name'}`,
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
