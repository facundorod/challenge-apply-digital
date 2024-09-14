import { Module } from '@nestjs/common';
import { WinstonAdapter } from './winston.adapter';

@Module({
  providers: [WinstonAdapter],
})
export class WinstonModule {}
