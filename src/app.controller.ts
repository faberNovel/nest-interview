import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('hello')
@ApiTags('hello')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Simply returns the "Hello World!" string',
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
