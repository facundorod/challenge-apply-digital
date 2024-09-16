import { WinstonModule } from '@/infrastructure/adapters/logger/winston/winston.module';
import { ConfigurationModule } from '@/infrastructure/configuration/configuration.module';
import { DynamicModule, Module } from '@nestjs/common';
import { UseCaseProxy } from './usecase.proxy';
import { FetchProducts } from '@/usecases/fetch-products/fetch-products.usecase';
import { WinstonAdapter } from '@/infrastructure/adapters/logger/winston/winston.adapter';
import { AxiosAdapter } from '@/infrastructure/adapters/http-client/axios/axios.adapter';
import { ProductTypeOrmRepository } from '@/infrastructure/adapters/repositories/product.repository';
import { NestConfigService } from '@/infrastructure/configuration/environment/environment.service';
import { LoggerService } from '@/domain/ports/logger/logger.port';
import { HTTPService } from '@/domain/ports/httpService/httpService.port';
import { ProductRepository } from '@/domain/ports/repositories/product.repository';
import { EnvironmentService } from '@/domain/ports/configuration/environment.port';
import { AxiosModule } from '@/infrastructure/adapters/http-client/axios/axios.module';
import { RepositoriesModule } from '@/infrastructure/adapters/repositories/repositories.module';
import { GetAllProducts } from '@/usecases/get-products/get-products.usecase';
import { RemoveProducts } from '@/usecases/remove-product/remove-product.usecase';

@Module({
  imports: [
    ConfigurationModule,
    WinstonModule,
    AxiosModule,
    RepositoriesModule,
  ],
})
export class UsecaseProxyModule {
  static readonly FETCH_PRODUCTS_USE_CASE = 'FETCH_PRODUCTS_USECASE';
  static readonly GET_ALL_PRODUCTS_USE_CASE = 'GET_ALL_PRODUCTS_USECASE';
  static readonly DELETE_PRODUCT_USE_CASE = 'DELETE_PRODUCT_USECASE';

  static register(): DynamicModule {
    return {
      module: UsecaseProxyModule,
      providers: [
        {
          provide: UsecaseProxyModule.FETCH_PRODUCTS_USE_CASE,
          inject: [
            WinstonAdapter,
            AxiosAdapter,
            ProductTypeOrmRepository,
            NestConfigService,
          ],
          useFactory: (
            logger: LoggerService,
            httpClient: HTTPService,
            productRepository: ProductRepository,
            envService: EnvironmentService,
          ) =>
            new UseCaseProxy(
              new FetchProducts(
                logger,
                httpClient,
                productRepository,
                envService,
              ),
            ),
        },
        {
          provide: UsecaseProxyModule.GET_ALL_PRODUCTS_USE_CASE,
          inject: [WinstonAdapter, ProductTypeOrmRepository],
          useFactory: (
            logger: LoggerService,
            productRepository: ProductRepository,
          ) => new UseCaseProxy(new GetAllProducts(logger, productRepository)),
        },
        {
          provide: UsecaseProxyModule.DELETE_PRODUCT_USE_CASE,
          inject: [WinstonAdapter, ProductTypeOrmRepository],
          useFactory: (
            logger: LoggerService,
            productRepository: ProductRepository,
          ) => new UseCaseProxy(new RemoveProducts(logger, productRepository)),
        },
      ],
      exports: [
        UsecaseProxyModule.FETCH_PRODUCTS_USE_CASE,
        UsecaseProxyModule.GET_ALL_PRODUCTS_USE_CASE,
        UsecaseProxyModule.DELETE_PRODUCT_USE_CASE,
      ],
    };
  }
}
