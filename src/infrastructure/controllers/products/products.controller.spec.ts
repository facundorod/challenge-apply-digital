import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { UsecaseProxyModule } from '@/infrastructure/proxy/usecase/usecase-proxy.module';
import { UseCaseProxy } from '@/infrastructure/proxy/usecase/usecase.proxy';
import { GetAllProducts } from '@/usecases/get-products/get-products.usecase';
import { ProductFilterDto } from '@/domain/dtos/productFilter.dto';
import { Product } from '@/domain/models/product.model';
import { PaginatedDataDto } from '@/domain/dtos/paginatedData.dto';
import { RemoveProductUseCase } from '@/usecases/remove-product/remove-product.interface';
import { RemoveProduct } from '@/usecases/remove-product/remove-product.usecase';
import { ReportsUseCase } from '@/usecases/reports/reports.interface';
import { ReportsResponseDTO } from '@/domain/dtos/reportsResponse.dto';

describe('ProductsController', () => {
  let controller: ProductsController;
  let getAllProductsUseCaseMock: jest.Mocked<UseCaseProxy<GetAllProducts>>;
  let getAllProductsInstanceMock: jest.Mocked<GetAllProducts>;
  let deleteProductUseCaseMock: jest.Mocked<UseCaseProxy<RemoveProductUseCase>>;
  let deleteProductInstanceMock: jest.Mocked<RemoveProduct>;
  let reportsUseCaseMock: jest.Mocked<UseCaseProxy<ReportsUseCase>>;
  let reportInstanceMock: jest.Mocked<ReportsUseCase>;
  beforeEach(async () => {
    getAllProductsInstanceMock = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<GetAllProducts>;

    getAllProductsUseCaseMock = {
      getInstance: jest.fn().mockReturnValue(getAllProductsInstanceMock),
    } as undefined as jest.Mocked<UseCaseProxy<GetAllProducts>>;

    deleteProductInstanceMock = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<RemoveProduct>;

    deleteProductUseCaseMock = {
      getInstance: jest.fn().mockReturnValue(deleteProductInstanceMock),
    } as undefined as jest.Mocked<UseCaseProxy<RemoveProductUseCase>>;

    reportInstanceMock = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<ReportsUseCase>;

    reportsUseCaseMock = {
      getInstance: jest.fn().mockReturnValue(reportInstanceMock),
    } as undefined as jest.Mocked<UseCaseProxy<ReportsUseCase>>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: UsecaseProxyModule.GET_ALL_PRODUCTS_USE_CASE,
          useValue: getAllProductsUseCaseMock,
        },
        {
          provide: UsecaseProxyModule.DELETE_PRODUCT_USE_CASE,
          useValue: deleteProductUseCaseMock,
        },
        {
          provide: UsecaseProxyModule.REPORTS_USE_CASE,
          useValue: reportsUseCaseMock,
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

  it('should call deleteProductUseCase', async () => {
    deleteProductInstanceMock.execute.mockResolvedValue();
    await controller.deleteProduct('11234A');
    expect(deleteProductUseCaseMock.getInstance).toHaveBeenCalled();
    expect(deleteProductInstanceMock.execute).toHaveBeenCalledWith('11234A');
  });

  it('should call reportsUseCase', async () => {
    const reportDTO: ReportsResponseDTO = {
      averagePriceOfNonDeletedProducts: 10,
      percentageOfDeletedProducts: 1,
      percentageOfNonDeletedProducts: {
        customDateRange: 0,
        withoutPrice: 5,
        withPrice: 95,
      },
    };
    reportInstanceMock.execute.mockResolvedValue(reportDTO);
    const requestDTO = { endDate: new Date(), startDate: null };
    await controller.reports(requestDTO);
    expect(reportsUseCaseMock.getInstance).toHaveBeenCalled();
    expect(reportInstanceMock.execute).toHaveBeenCalledWith(requestDTO);
  });
});
