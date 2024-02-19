import { Controller, Get, Post,UseInterceptors} from '@nestjs/common';
import { AppService } from './app.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';


@Controller()
export class AppController {
 constructor(
  private readonly appService: AppService,) {}

  @Get('/hello')
  getHello(): string {
    //return this.appService.getHello();
    return 'Hello World!';
  }


}

