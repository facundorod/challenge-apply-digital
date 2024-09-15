import { LoggerService } from '@/domain/ports/logger/logger.port';
import { ProductRepository } from '@/domain/ports/repositories/product.repository';
import { Product } from '@/domain/models/product.model';
import { ProductFilterDto } from '@/domain/dtos/productFilter.dto';
import { PaginatedDataDto } from '@/domain/dtos/paginatedData.dto';
import { GetAllProducts } from '../get-products.usecase';

describe('GetAllProducts', () => {
  let getAllProducts: GetAllProducts;
  let loggerServiceMock: jest.Mocked<LoggerService>;
  let productRepositoryMock: jest.Mocked<ProductRepository>;

  beforeEach(() => {
    loggerServiceMock = {
      log: jest.fn(),
    } as undefined as jest.Mocked<LoggerService>;

    productRepositoryMock = {
      getAll: jest.fn(),
    } as undefined as jest.Mocked<ProductRepository>;

    getAllProducts = new GetAllProducts(
      loggerServiceMock,
      productRepositoryMock,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should log a message when getting products', async () => {
    const productFilter: ProductFilterDto = { page: 1, pageSize: 5 };

    productRepositoryMock.getAll.mockResolvedValueOnce({
      products: [],
      total: 0,
    });

    await getAllProducts.execute(productFilter);

    expect(loggerServiceMock.log).toHaveBeenCalledWith(
      'Getting all products...',
    );
  });

  it('should return paginated data with correct format when products exist', async () => {
    const productFilter: ProductFilterDto = { page: 1, pageSize: 5 };

    const mockProducts: Product[] = [
      new Product({
        sku: '123',
        name: 'Product 1',
        price: 100,
        stock: 10,
        currency: 'USD',
        category: 'Category 1',
        brand: 'Brand 1',
        model: 'Model 1',
        color: 'Red',
      }),
      new Product({
        sku: '456',
        name: 'Product 2',
        price: 200,
        stock: 20,
        currency: 'USD',
        category: 'Category 2',
        brand: 'Brand 2',
        model: 'Model 2',
        color: 'Blue',
      }),
    ];

    productRepositoryMock.getAll.mockResolvedValueOnce({
      products: mockProducts,
      total: 10,
    });

    const result: PaginatedDataDto<Product> =
      await getAllProducts.execute(productFilter);

    expect(result).toEqual({
      data: mockProducts,
      totalItems: 10,
      page: 0,
      totalPages: 2,
    });

    expect(productRepositoryMock.getAll).toHaveBeenCalledWith({
      page: 0,
      pageSize: 5,
    });
  });

  it('should return an empty paginated response if no products exist', async () => {
    const productFilter: ProductFilterDto = { page: 1, pageSize: 5 };

    productRepositoryMock.getAll.mockResolvedValueOnce({
      products: [],
      total: 0,
    });

    const result: PaginatedDataDto<Product> =
      await getAllProducts.execute(productFilter);

    expect(result).toEqual({
      data: [],
      totalItems: 0,
      page: 0,
      totalPages: 0,
    });
  });
});
