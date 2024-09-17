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
import { RemoveProduct } from '@/usecases/remove-product/remove-product.usecase';
import { Reports } from '@/usecases/reports/reports.usecase';
import { UserTypeOrmRepository } from '@/infrastructure/adapters/repositories/user.repository';
import { BCryptService } from '@/infrastructure/adapters/encryptation/bcrypt/bcrypt.adapter';
import { BcryptModule } from '@/infrastructure/adapters/encryptation/bcrypt/bcrypt.module';
import { UserRepository } from '@/domain/ports/repositories/user.repository';
import { EncryptationService } from '@/domain/ports/encryptation/encryptation.port';
import { Register } from '@/usecases/authentication/register/register.usecase';
import { JWTService } from '@/infrastructure/adapters/authentication/jwt/jwt.adapter';
import { AuthenticationService } from '@/domain/ports/authentication/authentication.port';
import { UserLogin } from '@/usecases/authentication/login/login.usecase';
import { JWTModule } from '@/infrastructure/adapters/authentication/jwt/jwt.module';

@Module({
  imports: [
    ConfigurationModule,
    WinstonModule,
    AxiosModule,
    RepositoriesModule,
    BcryptModule,
    JWTModule,
  ],
})
export class UsecaseProxyModule {
  static readonly FETCH_PRODUCTS_USE_CASE = 'FETCH_PRODUCTS_USECASE';
  static readonly GET_ALL_PRODUCTS_USE_CASE = 'GET_ALL_PRODUCTS_USECASE';
  static readonly DELETE_PRODUCT_USE_CASE = 'DELETE_PRODUCT_USECASE';
  static readonly REPORTS_USE_CASE = 'REPORTS_USECASE';
  static readonly USER_REGISTER_USE_CASE = 'USER_REGISTER_USECASE';
  static readonly USER_LOGIN_USE_CASE = 'USER_LOGIN_USECASE';

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
          ) => new UseCaseProxy(new RemoveProduct(logger, productRepository)),
        },
        {
          provide: UsecaseProxyModule.REPORTS_USE_CASE,
          inject: [WinstonAdapter, ProductTypeOrmRepository],
          useFactory: (
            logger: LoggerService,
            productRepository: ProductRepository,
          ) => new UseCaseProxy(new Reports(logger, productRepository)),
        },
        {
          provide: UsecaseProxyModule.USER_REGISTER_USE_CASE,
          inject: [WinstonAdapter, UserTypeOrmRepository, BCryptService],
          useFactory: (
            logger: LoggerService,
            userRepo: UserRepository,
            encryptation: EncryptationService,
          ) => new UseCaseProxy(new Register(logger, userRepo, encryptation)),
        },
        {
          provide: UsecaseProxyModule.USER_LOGIN_USE_CASE,
          inject: [
            WinstonAdapter,
            UserTypeOrmRepository,
            BCryptService,
            JWTService,
            NestConfigService,
          ],
          useFactory: (
            logger: LoggerService,
            userRepo: UserRepository,
            encryptationService: EncryptationService,
            authService: AuthenticationService,
            envService: EnvironmentService,
          ) =>
            new UseCaseProxy(
              new UserLogin(
                logger,
                userRepo,
                authService,
                encryptationService,
                envService,
              ),
            ),
        },
      ],
      exports: [
        UsecaseProxyModule.FETCH_PRODUCTS_USE_CASE,
        UsecaseProxyModule.GET_ALL_PRODUCTS_USE_CASE,
        UsecaseProxyModule.DELETE_PRODUCT_USE_CASE,
        UsecaseProxyModule.REPORTS_USE_CASE,
        UsecaseProxyModule.USER_REGISTER_USE_CASE,
        UsecaseProxyModule.USER_LOGIN_USE_CASE,
      ],
    };
  }
}
