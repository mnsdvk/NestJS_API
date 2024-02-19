// import { Module } from '@nestjs/common';
// import { MulterModule } from '@nestjs/platform-express';
// import { diskStorage } from 'multer';
// import { extname } from 'path';

// @Module({
//   imports: [
//     MulterModule.register({
//       dest: './uploads', // Specify the destination directory
//       storage: diskStorage({
//         destination: './uploads',
//         filename: (req, file, callback) => {
//           const randomName = Array(32).fill(null).map(() => Math.round(Math.random() * 16).toString(16)).join('');
//           callback(null, `${randomName}${extname(file.originalname)}`);
//         },
//       }),
//     }),
//   ],
// })
// export class FileUploadModule {}


// file-upload.module.ts

// import { Module } from '@nestjs/common';
// import { MulterModule } from '@nestjs/platform-express';
// import { FileUploadController } from './file-upload.controller';

// @Module({
//   imports: [
//     MulterModule.register({
//       dest: './uploads', // Specify the destination directory
//     }),
//   ],
//   controllers: [FileUploadController],
// })
// export class FileUploadModule {}

// file-upload.module.ts

import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FileUploadController } from './file-upload.controller';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const originalName = file.originalname;
          callback(null, originalName); // Use the original filename
        },
      }),
    }),
  ],
  controllers: [FileUploadController],
})
export class FileUploadModule {}

// file-upload.module.ts

// import { Module } from '@nestjs/common';
// import { MulterModule } from '@nestjs/platform-express';
// import { diskStorage } from 'multer';
// import * as multerS3 from 'multer-s3';
// import { S3 } from 'aws-sdk';
// import { FileUploadController } from './file-upload.controller';

// @Module({
//   imports: [
//     MulterModule.registerAsync({
//       useFactory: () => ({
//         storage: diskStorage({
//           destination: './uploads', // Local directory
//           filename: (req, file, callback) => {
//             const originalName = file.originalname;
//             callback(null, originalName); // Use the original filename for local storage
//           },
//         }),
//       }),
//     }),
//     MulterModule.registerAsync({
//       useFactory: () => ({
//         storage: multerS3({
//           s3: new S3(),
//           bucket: 'your-bucket-name', // AWS S3 bucket name
//           acl: 'public-read', // Adjust permissions as needed
//           contentType: multerS3.AUTO_CONTENT_TYPE, // Automatically set content type
//           key: (req, file, callback) => {
//             callback(null, file.originalname); // Use the original filename as the S3 key
//           },
//         }),
//       }),
//     }),
//   ],
//   controllers: [FileUploadController],
// })
// export class FileUploadModule {}



