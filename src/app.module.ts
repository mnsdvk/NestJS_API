import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
//import { FileUploadModule } from './file-upload/file-upload.module';
//import { TodolistModule } from './todolist/todolist.module';
//import { UserModule } from './user/user.module';
//import { AuthModule } from './auth/auth.module';

// app.module.ts


//import { FileUploadController } from './user/file-upload.controller';


import { FileUploadModule } from './file-upload/file-upload.module';

import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';


@Module({
  imports: [
    
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'klubdb',
      entities: [User],
      synchronize: true,
      logging: true,
    }),
    UserModule,FileUploadModule,
    //TodolistModule,
    //UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}



