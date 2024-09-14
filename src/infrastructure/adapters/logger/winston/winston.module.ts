import { Module } from '@nestjs/common';
import { WinstonAdapter } from './winston.adapter';

@Module({
  providers: [WinstonAdapter],
  exports: [WinstonAdapter],
})
export class WinstonModule {}
