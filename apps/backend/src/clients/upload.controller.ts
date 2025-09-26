import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { S3Service } from '../common/s3.service';

@Controller('upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(private readonly s3Service: S3Service) {}

  @Post('client-file')
  @UseInterceptors(FileInterceptor('file'))
  async uploadClientFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('clientId') clientId: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (!clientId) {
      throw new BadRequestException('Client ID is required');
    }

    try {
      // Generate a unique filename
      const timestamp = Date.now();
      const fileExtension = file.originalname.split('.').pop();
      const fileName = `client-${clientId}/${timestamp}-${file.originalname}`;

      // Upload to S3
      const fileUrl = await this.s3Service.uploadFile(file.buffer, fileName, file.mimetype);
      return {
        fileUrl,
        fileName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype,
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new BadRequestException('Failed to upload file');
    }
  }

  @Post('library')
  @UseInterceptors(FileInterceptor('file'))
  async uploadLibraryFile(
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    try {
      // Generate a unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const fileExtension = file.originalname.split('.').pop();
      const fileName = `library/${timestamp}-${randomString}.${fileExtension}`;

      // Upload to S3
      const fileUrl = await this.s3Service.uploadFile(file.buffer, fileName, file.mimetype);
      return {
        fileUrl,
        fileName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype,
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new BadRequestException('Failed to upload file');
    }
  }
}
