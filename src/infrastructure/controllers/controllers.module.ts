import { Module } from '@nestjs/common';
import { ProductsController } from './products/products.controller';
import { UsecaseProxyModule } from '../proxy/usecase/usecase-proxy.module';
import { AuthController } from './auth/auth.controller';

@Module({
  imports: [UsecaseProxyModule.register()],
  controllers: [ProductsController, AuthController],
})
export class ControllersModule {}
