import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { WinstonAdapter } from './infrastructure/adapters/logger/winston/winston.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: new WinstonAdapter(),
  });
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  app.setGlobalPrefix('/v1/api/');
  await app.listen(3000);
}
bootstrap();
