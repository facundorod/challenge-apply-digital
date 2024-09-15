import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductTypeOrmEntity } from '@/infrastructure/configuration/database/entities/product.entity';
import supertest from 'supertest';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { UsecaseProxyModule } from '@/infrastructure/proxy/usecase/usecase-proxy.module';
import { ProductsController } from '@/infrastructure/controllers/products/products.controller';
import { Repository } from 'typeorm';
import { Product } from '@/domain/models/product.model';

describe('ProductsController (Integration)', () => {
  let app: INestApplication;
  let repository: Repository<ProductTypeOrmEntity>;

  const mockProduct: Product = new Product({
    sku: '123',
    name: 'Test Product',
    brand: 'Test Brand',
    model: 'Test Model',
    category: 'Test Category',
    color: 'Blue',
    price: 100,
    currency: 'USD',
    stock: 10,
  });

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [ProductTypeOrmEntity],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([ProductTypeOrmEntity]),
        UsecaseProxyModule.register(),
      ],
      controllers: [ProductsController],
    }).compile();

    app = moduleFixture.createNestApplication();
    repository = moduleFixture.get<Repository<ProductTypeOrmEntity>>(
      getRepositoryToken(ProductTypeOrmEntity),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return paginated products (GET /products)', async () => {
    const productEntity = new ProductTypeOrmEntity();
    productEntity.convertToProductEntity(mockProduct);
    await repository.save(repository.create(productEntity));

    const response = await supertest(app.getHttpServer())
      .get('/products')
      .query({
        page: 1,
        pageSize: 5,
      });

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.totalItems).toBe(1);
    expect(response.body.page).toBe(1);
    expect(response.body.totalPages).toBe(1);
    expect(response.body.data[0].sku).toBe(mockProduct.getSku());
    expect(response.body.data[0].name).toBe(mockProduct.getName());
  });

  it('should return an empty list if no products exist (GET /products)', async () => {
    await repository.clear();

    const response = await supertest(app.getHttpServer())
      .get('/products')
      .query({
        page: 1,
        pageSize: 5,
      });

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(0);
    expect(response.body.totalItems).toBe(0);
    expect(response.body.page).toBe(1);
    expect(response.body.totalPages).toBe(0);
  });
});
