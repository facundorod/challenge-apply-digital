import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { UsecaseProxyModule } from '@/infrastructure/proxy/usecase/usecase-proxy.module';
import { UseCaseProxy } from '@/infrastructure/proxy/usecase/usecase.proxy';
import { GetAllProducts } from '@/usecases/get-products/get-products.usecase';
import { ProductFilterDto } from '@/domain/dtos/productFilter.dto';
import { Product } from '@/domain/models/product.model';
import { PaginatedDataDto } from '@/domain/dtos/paginatedData.dto';

describe('ProductsController', () => {
  let controller: ProductsController;
  let getAllProductsUseCaseMock: jest.Mocked<UseCaseProxy<GetAllProducts>>;
  let getAllProductsInstanceMock: jest.Mocked<GetAllProducts>;

  beforeEach(async () => {
    getAllProductsInstanceMock = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<GetAllProducts>;

    getAllProductsUseCaseMock = {
      getInstance: jest.fn().mockReturnValue(getAllProductsInstanceMock),
    } as undefined as jest.Mocked<UseCaseProxy<GetAllProducts>>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: UsecaseProxyModule.GET_ALL_PRODUCTS_USE_CASE,
          useValue: getAllProductsUseCaseMock,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call getAllProductsUseCase and return paginated data', async () => {
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

    const mockPaginatedData: PaginatedDataDto<Product> = {
      data: [mockProduct],
      totalItems: 1,
      page: 1,
      totalPages: 1,
    };

    getAllProductsInstanceMock.execute.mockResolvedValue(mockPaginatedData);

    const productFilterDto: ProductFilterDto = {
      page: 1,
      pageSize: 5,
      name: 'Test Product',
    };

    const result = await controller.getAllProducts(productFilterDto);

    expect(getAllProductsUseCaseMock.getInstance).toHaveBeenCalled();
    expect(getAllProductsInstanceMock.execute).toHaveBeenCalledWith(
      productFilterDto,
    );
    expect(result).toEqual(mockPaginatedData);
  });
});
