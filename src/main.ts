import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { WinstonAdapter } from './infrastructure/adapters/logger/winston/winston.adapter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: new WinstonAdapter(),
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('ApplyDigital Challenge')
    .setDescription('API RESTful for ApplyDigital Challenge')
    .setVersion('1.0')
    .addTag('Products', 'Operations about products')
    .addTag('Authentication', 'Operations about user authentication')
    .addTag('Base', 'Base API')
    .addServer('/v1/api')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  app.setGlobalPrefix('/v1/api/');
  SwaggerModule.setup('docs', app, document);
  await app.listen(3000);
}
bootstrap();
