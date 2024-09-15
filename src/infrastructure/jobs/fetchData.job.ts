import { Inject, Injectable } from '@nestjs/common';
import { UsecaseProxyModule } from '../proxy/usecase/usecase-proxy.module';
import { FetchProductsUseCase } from '@/usecases/fetch-products/fetch-products.interface';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UseCaseProxy } from '../proxy/usecase/usecase.proxy';

@Injectable()
export class FetchProductDataJob {
  constructor(
    @Inject(UsecaseProxyModule.FETCH_PRODUCTS_USE_CASE)
    private readonly fetchProductsUseCase: UseCaseProxy<FetchProductsUseCase>,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  public executeJob(): void {
    const fetchInstance = this.fetchProductsUseCase.getInstance();
    fetchInstance.execute();
  }
}
