import { Module } from '@nestjs/common';
import { ProductsController } from './products/products.controller';
import { UsecaseProxyModule } from '../proxy/usecase/usecase-proxy.module';

@Module({
  imports: [UsecaseProxyModule.register()],
  controllers: [ProductsController],
})
export class ControllersModule {}
