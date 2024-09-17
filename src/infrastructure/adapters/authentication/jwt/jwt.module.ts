import { Module } from '@nestjs/common';
import { JWTService } from './jwt.adapter';
import { JwtModule } from '@nestjs/jwt';
import { ConfigurationModule } from '@/infrastructure/configuration/configuration.module';
import { NestConfigService } from '@/infrastructure/configuration/environment/environment.service';
import { EnvironmentService } from '@/domain/ports/configuration/environment.port';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigurationModule],
      inject: [NestConfigService],
      useFactory: (configService: EnvironmentService) => ({
        global: true,
        secret: configService.getJWTSecret(),
        signOptions: {
          expiresIn: configService.getExpirationTime(),
        },
      }),
    }),
  ],
  providers: [JWTService],
  exports: [JWTService],
})
export class JWTModule {}
