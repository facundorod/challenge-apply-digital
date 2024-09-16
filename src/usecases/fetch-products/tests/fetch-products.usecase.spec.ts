import { HTTPService } from '@/domain/ports/httpService/httpService.port';
import { LoggerService } from '@/domain/ports/logger/logger.port';
import { ProductRepository } from '@/domain/ports/repositories/product.repository';
import { FetchProductsUseCase } from '../fetch-products.interface';
import { EnvironmentService } from '@/domain/ports/configuration/environment.port';
import { FetchProducts } from '../fetch-products.usecase';
import { productsAPIMockResponse, productsMock } from './mock/product.mock';

describe('Fetch products usecase', () => {
  let loggerService: jest.Mocked<LoggerService>;
  let productRepository: jest.Mocked<ProductRepository>;
  let httpClient: jest.Mocked<HTTPService>;
  let envService: jest.Mocked<EnvironmentService>;
  let fetchProducts: FetchProductsUseCase;
  beforeAll(() => {
    loggerService = {
      error: jest.fn(),
      log: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      fatal: jest.fn(),
    };

    productRepository = {
      bulkInsert: jest.fn(),
      getAll: jest.fn(),
      insert: jest.fn(),
      update: jest.fn(),
      deleteBySku: jest.fn(),
      getBySku: jest.fn(),
    };

    httpClient = {
      delete: jest.fn(),
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
    };

    envService = {
      getAppEnv: jest.fn(),
      getDatabaseURI: jest.fn(),
      getContentFulAPIAccessToken: jest.fn(),
      getContentFulAPIContentType: jest.fn(),
      getContentFulAPIEnvironment: jest.fn(),
      getContentFulAPISpaceId: jest.fn(),
      getContentFulAPIURL: jest.fn(),
    };

    fetchProducts = new FetchProducts(
      loggerService,
      httpClient,
      productRepository,
      envService,
    );
    envService.getContentFulAPIURL.mockReturnValue(
      'https://mockcontentapi.com/',
    );
    envService.getContentFulAPIAccessToken.mockReturnValue('ewt123as....');
    envService.getContentFulAPIContentType.mockReturnValue('product');
    envService.getContentFulAPISpaceId.mockReturnValue('space_id');
    envService.getContentFulAPIEnvironment.mockReturnValue('master');
  });

  afterAll(() => jest.resetAllMocks());

  it('should call to the API to fetch the data for product entries', async () => {
    const expectedUrl: string = `${envService.getContentFulAPIURL()}/${envService.getContentFulAPISpaceId()}/environments/${envService.getContentFulAPIEnvironment()}/entries?access_token=${envService.getContentFulAPIAccessToken()}&content_type=${envService.getContentFulAPIContentType()}`;
    httpClient.get.mockResolvedValueOnce(productsAPIMockResponse);
    fetchProducts.execute();
    expect(httpClient.get).toHaveBeenCalledWith(expectedUrl);
  });

  it('should insert the products into the database', async () => {
    const expectedUrl: string = `${envService.getContentFulAPIURL()}/${envService.getContentFulAPISpaceId()}/environments/${envService.getContentFulAPIEnvironment()}/entries?access_token=${envService.getContentFulAPIAccessToken()}&content_type=${envService.getContentFulAPIContentType()}`;
    httpClient.get.mockResolvedValueOnce(productsAPIMockResponse);
    fetchProducts.execute();
    expect(httpClient.get).toHaveBeenCalledWith(expectedUrl);
    expect(productRepository.bulkInsert).toHaveBeenCalledWith(productsMock);
  });
});
