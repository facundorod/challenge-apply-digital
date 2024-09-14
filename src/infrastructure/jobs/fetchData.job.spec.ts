import { Test, TestingModule } from '@nestjs/testing';
import { FetchProductDataJob } from './fetchData.job';
import { UsecaseProxyModule } from '../proxy/usecase/usecase-proxy.module';
import { UseCaseProxy } from '../proxy/usecase/usecase.proxy';
import { FetchProductsUseCase } from '@/usecases/fetch-products/fetch-products.interface';

describe('FetchProductDataJob', () => {
  let fetchProductDataJob: FetchProductDataJob;
  let fetchProductsUseCase: FetchProductsUseCase;
  let useCaseProxy: UseCaseProxy<FetchProductsUseCase>;

  beforeEach(async () => {
    const mockFetchProductsUseCase = {
      execute: jest.fn(),
    };

    const mockUseCaseProxy = {
      getInstance: jest.fn().mockReturnValue(mockFetchProductsUseCase),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FetchProductDataJob,
        {
          provide: UsecaseProxyModule.FETCH_PRODUCTS_USE_CASE,
          useValue: mockUseCaseProxy,
        },
      ],
    }).compile();

    fetchProductDataJob = module.get<FetchProductDataJob>(FetchProductDataJob);
    fetchProductsUseCase =
      mockFetchProductsUseCase as unknown as FetchProductsUseCase;
    useCaseProxy =
      mockUseCaseProxy as unknown as UseCaseProxy<FetchProductsUseCase>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(fetchProductDataJob).toBeDefined();
  });

  it('should call execute method of fetchProductsUseCase when executeJob is called', () => {
    fetchProductDataJob.executeJob();

    expect(useCaseProxy.getInstance).toHaveBeenCalledTimes(1);
    expect(fetchProductsUseCase.execute).toHaveBeenCalledTimes(1);
  });
});
