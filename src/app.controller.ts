import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './infrastructure/configuration/decorators/public.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiTags('Base')
  @ApiOperation({ summary: 'Hello world!' })
  @Public()
  getHello(): string {
    return this.appService.getHello();
  }
}
