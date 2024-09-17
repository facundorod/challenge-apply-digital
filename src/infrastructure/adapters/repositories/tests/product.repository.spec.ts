import { Test, TestingModule } from '@nestjs/testing';
import { Between, MoreThan, Repository, SelectQueryBuilder } from 'typeorm';
import { ProductTypeOrmRepository } from '../product.repository';
import { ProductTypeOrmEntity } from '@/infrastructure/configuration/database/entities/product.entity';
import { Product } from '@/domain/models/product.model';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductFilterDto } from '@/domain/dtos/productFilter.dto';

describe('ProductTypeOrmRepository', () => {
  let repository: ProductTypeOrmRepository;
  let productRepoMock: jest.Mocked<Repository<ProductTypeOrmEntity>>;
  let queryBuilderMock: jest.Mocked<SelectQueryBuilder<ProductTypeOrmEntity>>;

  const mockProductEntity = new ProductTypeOrmEntity();
  mockProductEntity.sku = '123';
  mockProductEntity.name = 'Test Product';
  mockProductEntity.brand = 'Test Brand';
  mockProductEntity.price = 100;
  mockProductEntity.currency = 'USD';
  mockProductEntity.stock = 10;
  mockProductEntity.category = 'Test Category';
  mockProductEntity.color = 'Blue';
  mockProductEntity.model = 'Test Model';
  mockProductEntity.convertToProductModel = jest.fn().mockReturnValue(
    new Product({
      sku: '123',
      name: 'Test Product',
      brand: 'Test Brand',
      price: 100,
      currency: 'USD',
      stock: 10,
      category: 'Test Category',
      color: 'Blue',
      model: 'Test Model',
    }),
  );

  beforeEach(async () => {
    queryBuilderMock = {
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockResolvedValue([[mockProductEntity], 1]),
    } as unknown as jest.Mocked<SelectQueryBuilder<ProductTypeOrmEntity>>;

    productRepoMock = {
      createQueryBuilder: jest.fn().mockReturnValue(queryBuilderMock),
      save: jest.fn(),
      update: jest.fn(),
      findOneBy: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    } as unknown as jest.Mocked<Repository<ProductTypeOrmEntity>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductTypeOrmRepository,
        {
          provide: getRepositoryToken(ProductTypeOrmEntity),
          useValue: productRepoMock,
        },
      ],
    }).compile();

    repository = module.get<ProductTypeOrmRepository>(ProductTypeOrmRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return all products with filters correctly', async () => {
    const productFilter: ProductFilterDto = {
      name: 'Test',
      category: 'Test Category',
      page: 0,
      pageSize: 5,
      orderBy: 'name',
      order: 'ASC',
    };

    const result = await repository.getAll(productFilter);

    expect(productRepoMock.createQueryBuilder).toHaveBeenCalledWith('product');
    expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
      'lower(product.name) LIKE :name',
      { name: `%${productFilter.name}%` },
    );
    expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
      'product.category = :category',
      { category: productFilter.category },
    );
    expect(queryBuilderMock.orderBy).toHaveBeenCalledWith(
      'product.name',
      'ASC',
    );
    expect(queryBuilderMock.skip).toHaveBeenCalledWith(productFilter.page);
    expect(queryBuilderMock.take).toHaveBeenCalledWith(productFilter.pageSize);
    expect(queryBuilderMock.getManyAndCount).toHaveBeenCalled();

    expect(result).toEqual({
      total: 1,
      products: [
        new Product({
          sku: '123',
          name: 'Test Product',
          brand: 'Test Brand',
          price: 100,
          currency: 'USD',
          stock: 10,
          category: 'Test Category',
          color: 'Blue',
          model: 'Test Model',
        }),
      ],
    });
  });

  it('should insert a product correctly', async () => {
    const product = new Product({
      sku: '123',
      name: 'Test Product',
      brand: 'Test Brand',
      price: 100,
      currency: 'USD',
      stock: 10,
      category: 'Test Category',
      color: 'Blue',
      model: 'Test Model',
    });

    await repository.insert(product);

    expect(productRepoMock.save).toHaveBeenCalledWith(
      expect.any(ProductTypeOrmEntity),
    );
  });

  it('should update a product correctly', async () => {
    const product = new Product({
      sku: '123',
      name: 'Updated Product',
      brand: 'Updated Brand',
      price: 150,
      currency: 'USD',
      stock: 20,
      category: 'Updated Category',
      color: 'Red',
      model: 'Updated Model',
    });

    await repository.update(product);

    expect(productRepoMock.update).toHaveBeenCalledWith(
      '123',
      expect.any(ProductTypeOrmEntity),
    );
  });

  it('should bulk insert products correctly', async () => {
    const products = [
      new Product({
        sku: '123',
        name: 'Product 1',
        brand: 'Brand 1',
        price: 100,
        currency: 'USD',
        stock: 10,
        category: 'Category 1',
        color: 'Blue',
        model: 'Model 1',
      }),
      new Product({
        sku: '456',
        name: 'Product 2',
        brand: 'Brand 2',
        price: 200,
        currency: 'USD',
        stock: 20,
        category: 'Category 2',
        color: 'Red',
        model: 'Model 2',
      }),
    ];

    await repository.bulkInsert(products);

    expect(productRepoMock.save).toHaveBeenCalledWith(expect.any(Array));
  });

  it('should return a product by SKU if found', async () => {
    productRepoMock.findOneBy.mockResolvedValue(mockProductEntity);

    const result = await repository.getBySku('123');

    expect(productRepoMock.findOneBy).toHaveBeenCalledWith({ sku: '123' });
    expect(mockProductEntity.convertToProductModel).toHaveBeenCalled();
    expect(result).toEqual(
      new Product({
        sku: '123',
        name: 'Test Product',
        brand: 'Test Brand',
        price: 100,
        currency: 'USD',
        stock: 10,
        category: 'Test Category',
        color: 'Blue',
        model: 'Test Model',
      }),
    );
  });

  it('should return null if product by SKU is not found', async () => {
    productRepoMock.findOneBy.mockResolvedValue(null);

    const result = await repository.getBySku('unknown_sku');

    expect(productRepoMock.findOneBy).toHaveBeenCalledWith({
      sku: 'unknown_sku',
    });
    expect(result).toBeNull();
  });

  it('should delete a product by SKU', async () => {
    await repository.deleteBySku('123');

    expect(productRepoMock.delete).toHaveBeenCalledWith({ sku: '123' });
  });

  it('should count the number of deleted products', async () => {
    productRepoMock.count.mockResolvedValue(5);

    const result = await repository.countDeleted();

    expect(productRepoMock.count).toHaveBeenCalledWith({
      where: { isDeleted: true },
    });
    expect(result).toBe(5);
  });

  it('should count the number of non-deleted products', async () => {
    productRepoMock.count.mockResolvedValue(10);

    const result = await repository.countNotDeleted();

    expect(productRepoMock.count).toHaveBeenCalledWith({
      where: { isDeleted: false },
    });
    expect(result).toBe(10);
  });

  it('should count the number of deleted products with a price greater than 0', async () => {
    productRepoMock.count.mockResolvedValue(3);

    const result = await repository.countDeletedWithPrice();

    expect(productRepoMock.count).toHaveBeenCalledWith({
      where: { isDeleted: true, price: MoreThan(0) },
    });
    expect(result).toBe(3);
  });

  it('should count the number of deleted products in a date range', async () => {
    const startDate = new Date('2023-01-01');
    const endDate = new Date('2023-12-31');

    productRepoMock.count.mockResolvedValue(2);

    const result = await repository.countDeletedByDateRange(startDate, endDate);

    expect(productRepoMock.count).toHaveBeenCalledWith({
      where: { isDeleted: true, createdAt: Between(startDate, endDate) },
    });
    expect(result).toBe(2);
  });

  it('should get the average price of non-deleted products', async () => {
    const avgPrice = { avgPrice: 150.5 };
    productRepoMock.createQueryBuilder.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getRawOne: jest.fn().mockResolvedValue(avgPrice),
    } as any);

    const result = await repository.getAvgPriceOfNonDeletedProducts();

    expect(productRepoMock.createQueryBuilder).toHaveBeenCalledWith('product');
    expect(result).toBe(150.5);
  });

  it('should return all non-deleted products with filters correctly', async () => {
    const productFilter: ProductFilterDto = {
      name: 'Test',
      category: 'Test Category',
      page: 0,
      pageSize: 5,
      orderBy: 'name',
      order: 'ASC',
    };

    const result = await repository.getAll(productFilter);

    expect(productRepoMock.createQueryBuilder).toHaveBeenCalledWith('product');
    expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
      'is_deleted = :deleted',
      { deleted: false },
    );
    expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
      'lower(product.name) LIKE :name',
      { name: `%${productFilter.name}%` },
    );
    expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
      'product.category = :category',
      { category: productFilter.category },
    );
    expect(queryBuilderMock.orderBy).toHaveBeenCalledWith(
      'product.name',
      'ASC',
    );
    expect(queryBuilderMock.skip).toHaveBeenCalledWith(productFilter.page);
    expect(queryBuilderMock.take).toHaveBeenCalledWith(productFilter.pageSize);
    expect(queryBuilderMock.getManyAndCount).toHaveBeenCalled();

    expect(result).toEqual({
      total: 1,
      products: [
        new Product({
          sku: '123',
          name: 'Test Product',
          brand: 'Test Brand',
          price: 100,
          currency: 'USD',
          stock: 10,
          category: 'Test Category',
          color: 'Blue',
          model: 'Test Model',
        }),
      ],
    });
  });
});
