import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductTypeOrmEntity } from '@/infrastructure/configuration/database/entities/product.entity';
import supertest from 'supertest';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { UsecaseProxyModule } from '@/infrastructure/proxy/usecase/usecase-proxy.module';
import { ProductsController } from '@/infrastructure/controllers/products/products.controller';
import { Repository } from 'typeorm';
import { Product } from '@/domain/models/product.model';
import { DatabaseModule } from '@/infrastructure/configuration/database/database.module';

describe('ProductsController (Integration)', () => {
  let app: INestApplication;
  let repository: Repository<ProductTypeOrmEntity>;

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
    })
      .overrideModule(DatabaseModule)
      .useModule(jest.fn())
      .compile();

    app = moduleFixture.createNestApplication();
    repository = moduleFixture.get<Repository<ProductTypeOrmEntity>>(
      getRepositoryToken(ProductTypeOrmEntity),
    );
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    await app.init();
  });

  const products: Product[] = [
    new Product({
      sku: '123',
      name: 'Test Product 1',
      brand: 'Brand A',
      model: 'Model X',
      category: 'Category A',
      color: 'Blue',
      price: 100,
      currency: 'USD',
      stock: 10,
    }),
    new Product({
      sku: '456',
      name: 'Test Product 2',
      brand: 'Brand B',
      model: 'Model Y',
      category: 'Category B',
      color: 'Red',
      price: 200,
      currency: 'USD',
      stock: 20,
    }),
    new Product({
      sku: '789',
      name: 'Test Product 3',
      brand: 'Brand A',
      model: 'Model Z',
      category: 'Category A',
      color: 'Green',
      price: 150,
      currency: 'EUR',
      stock: 15,
    }),
  ];

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await repository.clear();
    const productsEntity: ProductTypeOrmEntity[] = products.map(
      (product: Product) => {
        const productEntity = new ProductTypeOrmEntity();
        productEntity.convertToProductEntity(product);
        return productEntity;
      },
    );
    await repository.save(productsEntity);
  });

  describe('GET /products', () => {
    it('should return validation error for invalid price filter', async () => {
      const response = await supertest(app.getHttpServer())
        .get('/products')
        .query({
          minPrice: 'invalid',
        });

      expect(response.status).toBe(400);
      expect(response.body.message[0]).toContain(
        'minPrice must be a positive number',
      );
    });

    it('should return validation error for invalid page value', async () => {
      const response = await supertest(app.getHttpServer())
        .get('/products')
        .query({
          page: 0,
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('page must not be less than 1');
    });

    it('should return validation error for invalid order value', async () => {
      const response = await supertest(app.getHttpServer())
        .get('/products')
        .query({
          order: 'invalidOrder',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain(
        'order must be one of the following values: ASC, DESC',
      );
    });

    it('should return validation error for additional unrecognized field', async () => {
      const response = await supertest(app.getHttpServer())
        .get('/products')
        .query({
          unrecognizedField: 'someValue',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain(
        'property unrecognizedField should not exist',
      );
    });

    it('should return products filtered by name', async () => {
      const response = await supertest(app.getHttpServer())
        .get('/products')
        .query({
          name: 'Test Product 1',
        });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].name).toBe('Test Product 1');
    });

    it('should return products filtered by category', async () => {
      const response = await supertest(app.getHttpServer())
        .get('/products')
        .query({
          category: 'Category A',
        });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0].category).toBe('Category A');
      expect(response.body.data[1].category).toBe('Category A');
    });

    it('should return products filtered by price range', async () => {
      const response = await supertest(app.getHttpServer())
        .get('/products')
        .query({
          minPrice: 100,
          maxPrice: 150,
        });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0].price).toBeGreaterThanOrEqual(100);
      expect(response.body.data[1].price).toBeLessThanOrEqual(150);
    });

    it('should return products filtered by brand', async () => {
      const response = await supertest(app.getHttpServer())
        .get('/products')
        .query({
          brand: 'Brand A',
        });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0].brand).toBe('Brand A');
      expect(response.body.data[1].brand).toBe('Brand A');
    });

    it('should return products filtered by currency', async () => {
      const response = await supertest(app.getHttpServer())
        .get('/products')
        .query({
          currency: 'EUR',
        });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].currency).toBe('EUR');
    });

    it('should return products filtered by stock range', async () => {
      const response = await supertest(app.getHttpServer())
        .get('/products')
        .query({
          minStock: 10,
          maxStock: 20,
        });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].stock).toBeGreaterThanOrEqual(10);
      expect(response.body.data[0].stock).toBeLessThanOrEqual(20);
    });

    it('should return products sorted by price in descending order', async () => {
      const response = await supertest(app.getHttpServer())
        .get('/products')
        .query({
          orderBy: 'price',
          order: 'DESC',
        });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(3);
      expect(response.body.data[0].price).toBeGreaterThan(
        response.body.data[1].price,
      );
      expect(response.body.data[1].price).toBeGreaterThan(
        response.body.data[2].price,
      );
    });

    it('should return products sorted by stock in ascending order', async () => {
      const response = await supertest(app.getHttpServer())
        .get('/products')
        .query({
          orderBy: 'stock',
          order: 'ASC',
        });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(3);
      expect(response.body.data[0].stock).toBeLessThan(
        response.body.data[1].stock,
      );
      expect(response.body.data[1].stock).toBeLessThan(
        response.body.data[2].stock,
      );
    });

    it('should paginate products correctly', async () => {
      const response = await supertest(app.getHttpServer())
        .get('/products')
        .query({
          page: 1,
          pageSize: 2,
        });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.totalItems).toBe(3);
      expect(response.body.totalPages).toBe(2);
    });

    it('should return the second page of products', async () => {
      const response = await supertest(app.getHttpServer())
        .get('/products')
        .query({
          page: 2,
          pageSize: 2,
        });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.totalItems).toBe(3);
      expect(response.body.totalPages).toBe(2);
    });

    it('should return paginated products (GET /products)', async () => {
      const response = await supertest(app.getHttpServer())
        .get('/products')
        .query({
          page: 1,
          pageSize: 5,
        });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(3);
      expect(response.body.totalItems).toBe(3);
      expect(response.body.page).toBe(1);
      expect(response.body.totalPages).toBe(1);
      expect(response.body.data[0].sku).not.toBeUndefined();
      expect(response.body.data[0].sku).not.toBeUndefined();
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

  describe('DELETE /products/:sku', () => {
    it('should return 404 if the product sku does not exist', async () => {
      const response = await supertest(app.getHttpServer()).delete(
        '/products/invalidSKU',
      );

      expect(response.status).toBe(404);
      expect(response.body).toStrictEqual({
        message: 'The product does not exist',
      });
    });
    it('should delete the product if the product exists', async () => {
      const response = await supertest(app.getHttpServer()).delete(
        '/products/123',
      );

      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual({
        message: 'Product deleted successfully',
      });
    });
  });
  describe('GET /products/reports', () => {
    it('should return the report with default values when no filters are provided', async () => {
      const response = await supertest(app.getHttpServer()).get(
        '/products/reports',
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('percentageOfDeletedProducts');
      expect(response.body).toHaveProperty(
        'percentageOfNonDeletedProducts.withPrice',
      );
      expect(response.body).toHaveProperty(
        'percentageOfNonDeletedProducts.withoutPrice',
      );
      expect(response.body).toHaveProperty(
        'percentageOfNonDeletedProducts.customDateRange',
      );
      expect(response.body).toHaveProperty('averagePriceOfNonDeletedProducts');
    });

    it('should return the report for a specific date range', async () => {
      const response = await supertest(app.getHttpServer())
        .get('/products/reports')
        .query({
          startDate: '2024-01-01',
          endDate: '2024-12-31',
        });

      expect(response.status).toBe(200);
      expect(
        response.body.percentageOfNonDeletedProducts.customDateRange,
      ).toBeDefined();
      expect(response.body).toHaveProperty('percentageOfDeletedProducts');
      expect(response.body).toHaveProperty('averagePriceOfNonDeletedProducts');
    });

    it('should return validation error when the startDate or endDate is invalid', async () => {
      const response = await supertest(app.getHttpServer())
        .get('/products/reports')
        .query({
          startDate: 'invalid-date',
          endDate: '2024-12-31',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('startDate must be a valid date');
    });

    it('should return the report with only the endDate provided', async () => {
      const response = await supertest(app.getHttpServer())
        .get('/products/reports')
        .query({
          endDate: '2024-12-31',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('percentageOfDeletedProducts');
      expect(response.body).toHaveProperty('averagePriceOfNonDeletedProducts');
    });
  });
});
