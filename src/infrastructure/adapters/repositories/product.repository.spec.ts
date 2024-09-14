import { ProductTypeOrmRepository } from './product.repository';
import { ProductTypeOrmEntity } from '@/infrastructure/configuration/database/entities/product.entity';
import { Product } from '@/domain/models/product.model';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ProductTypeOrmRepository', () => {
  let repository: ProductTypeOrmRepository;
  let productRepoMock: jest.Mocked<Repository<ProductTypeOrmEntity>>;

  const mockProductEntity = new ProductTypeOrmEntity();
  mockProductEntity.sku = '123';
  mockProductEntity.name = 'Test Product';
  mockProductEntity.brand = 'Test Brand';
  mockProductEntity.price = 100;
  mockProductEntity.currency = 'USD';
  mockProductEntity.stock = 10;
  mockProductEntity.convertToProductModel = jest.fn().mockReturnValue(
    new Product({
      sku: '123',
      name: 'Test Product',
      brand: 'Test Brand',
      price: 100,
      currency: 'USD',
      stock: 10,
      category: 'Test category',
      color: 'Blue',
      model: 'Test model',
    }),
  );

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductTypeOrmRepository,
        {
          provide: getRepositoryToken(ProductTypeOrmEntity),
          useValue: {
            find: jest.fn(),
            save: jest.fn(),
            insert: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<ProductTypeOrmRepository>(ProductTypeOrmRepository);
    productRepoMock = module.get(getRepositoryToken(ProductTypeOrmEntity));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return all products correctly', async () => {
    productRepoMock.find.mockResolvedValue([mockProductEntity]);

    const products = await repository.getAll();

    expect(productRepoMock.find).toHaveBeenCalledTimes(1);
    expect(products).toHaveLength(1);
    expect(products[0]).toEqual(
      new Product({
        sku: '123',
        name: 'Test Product',
        brand: 'Test Brand',
        price: 100,
        currency: 'USD',
        stock: 10,
        category: 'Test category',
        color: 'Blue',
        model: 'Test model',
      }),
    );
  });

  it('should insert a product correctly', async () => {
    const product = new Product({
      sku: '123',
      name: 'Test Product',
      brand: 'Test Brand',
      price: 100,
      currency: 'USD',
      stock: 10,
      category: 'Test category',
      color: 'Blue',
      model: 'Test model',
    });

    await repository.insert(product);

    expect(productRepoMock.save).toHaveBeenCalledTimes(1);
    expect(productRepoMock.save).toHaveBeenCalledWith(
      expect.any(ProductTypeOrmEntity),
    );
  });

  it('should update a product correctly', async () => {
    const product = new Product({
      sku: '123',
      name: 'Test Product',
      brand: 'Test Brand',
      price: 100,
      currency: 'USD',
      stock: 10,
      category: 'Test category',
      color: 'Blue',
      model: 'Test model',
    });

    await repository.update(product);

    expect(productRepoMock.save).toHaveBeenCalledTimes(1);
    expect(productRepoMock.save).toHaveBeenCalledWith(
      expect.any(ProductTypeOrmEntity),
    );
  });

  it('should bulk insert products correctly', async () => {
    const products = [
      new Product({
        sku: '123',
        name: 'Test Product 1',
        brand: 'Brand 1',
        price: 100,
        currency: 'USD',
        stock: 10,
        category: 'Category 1',
        color: 'Color 1',
        model: 'model 1',
      }),
      new Product({
        sku: '456',
        name: 'Test Product 2',
        brand: 'Brand 2',
        price: 200,
        currency: 'USD',
        stock: 20,
        category: 'category 2',
        color: 'Color 2',
        model: 'model 2',
      }),
    ];

    await repository.bulkInsert(products);

    expect(productRepoMock.insert).toHaveBeenCalledTimes(1);
    expect(productRepoMock.insert).toHaveBeenCalledWith(expect.any(Array));
  });
});
