

// import { Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
// import { FilesInterceptor } from '@nestjs/platform-express';

// @Controller('files')
// export class FileUploadController {
//   @Post('upload')
//   @UseInterceptors(FilesInterceptor('files'))
//   async uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
//     // Check if files were uploaded
//     if (!files || files.length === 0) {
//       return { message: 'No files uploaded' };
//     }

//     // Process each uploaded file
//     const uploadedFileNames: string[] = [];
//     for (const file of files) {
//       // Handle each file as needed
//       // For example, save the file to disk, database, or perform other operations
//       // Here, we're just pushing the file names to an array
//       uploadedFileNames.push(file.filename);
//     }
    
//     // Return a response with the uploaded file names
//     return { uploadedFiles: uploadedFileNames };
   
//   }
// }

// file-upload.controller.ts

// import { Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
// import { FilesInterceptor } from '@nestjs/platform-express';

// @Controller('files')
// export class FileUploadController {
//   @Post('upload')
//   @UseInterceptors(FilesInterceptor('files'))
//   async uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
//     // Handle uploaded files
//     //return { files };
//     return "successfully uploaded the file";

//   }
// }

// file-upload.controller.ts

import { Controller, Post,Param, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as multerS3 from 'multer-s3';
import { S3 } from 'aws-sdk';

@Controller('files')
export class FileUploadController {
//     @Post(':filename')
    
//   @UseInterceptors(FilesInterceptor('files'))
//     uploadFile(@UploadedFiles() file: Express.Multer.File, @Param('filename') filename: string) {
//       // Logic to handle file upload with the specified filename
//       return `File ${filename} uploaded successfully`;

 @Post('upload')
 @UseInterceptors(FilesInterceptor('files'))
 async uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    //Handle uploaded files
   return { files };
   //return "successfully uploaded the file";
  }
}
