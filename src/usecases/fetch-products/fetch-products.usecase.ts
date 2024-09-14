import { LoggerService } from '@/domain/ports/logger/logger.port';
import { FetchProductsUseCase } from './fetch-products.interface';
import { HTTPService } from '@/domain/ports/httpService/httpService.port';
import { ProductRepository } from '@/domain/ports/repositories/product.repository';
import { EnvironmentService } from '@/domain/ports/configuration/environment.port';
import {
  ContentFulApiDTO,
  ContentFulApiItems,
} from '@/domain/dtos/contentFulAPI.dto';
import { Product } from '@/domain/models/product.model';

export class FetchProducts implements FetchProductsUseCase {
  constructor(
    private readonly logger: LoggerService,
    private readonly httpService: HTTPService,
    private readonly productRepository: ProductRepository,
    private readonly envService: EnvironmentService,
  ) {}

  async execute(): Promise<void> {
    this.logger.debug(`Executing Fetch products usecase...`);
    const apiUrl = this.getAPIUrl();

    const productsApi: ContentFulApiDTO =
      await this.httpService.get<ContentFulApiDTO>(apiUrl);

    const productsToInsert = this.getProductsToInsert(productsApi);
    if (productsToInsert.length) {
      this.logger.debug(
        `Trying to insert ${productsToInsert.length} products...`,
      );
      await this.productRepository.bulkInsert(productsToInsert);
      this.logger.debug(`Bulk insert finished`);
    } else this.logger.debug(`There are no products to insert`);
  }

  private getAPIUrl(): string {
    const contentFulApi = this.envService.getContentFulAPIURL();
    const spaceId = this.envService.getContentFulAPISpaceId();
    const environment = this.envService.getContentFulAPIEnvironment();
    const accessToken = this.envService.getContentFulAPIAccessToken();
    const contentType = this.envService.getContentFulAPIContentType();
    return `${contentFulApi}/${spaceId}/environments/${environment}/entries?access_token=${accessToken}&content_type=${contentType}`;
  }

  private getProductsToInsert(productsApi: ContentFulApiDTO): Product[] {
    return productsApi?.items.length
      ? productsApi.items.map(
          (value: ContentFulApiItems) => new Product(value.fields),
        )
      : [];
  }
}
