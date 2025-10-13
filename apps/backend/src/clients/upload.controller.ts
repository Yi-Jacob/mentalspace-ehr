import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  UseGuards,
  BadRequestException,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { S3Service } from '../common/s3.service';
import { PrismaService } from '../database/prisma.service';
import { AuditLogService } from '../audit/audit-log.service';

@Controller('upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(
    private readonly s3Service: S3Service,
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  @Post('client-file')
  @UseInterceptors(FileInterceptor('file'))
  async uploadClientFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('clientId') clientId: string,
    @Request() req: any,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (!clientId) {
      throw new BadRequestException('Client ID is required');
    }

    try {
      // Basic file validation for HIPAA compliance
      if (file.size === 0) {
        throw new BadRequestException('File cannot be empty');
      }

      if (file.size > 100 * 1024 * 1024) { // 100MB limit
        throw new BadRequestException('File size exceeds 100MB limit');
      }

      // Generate simple hash for basic integrity
      const crypto = require('crypto');
      const fileHash = crypto.createHash('sha256').update(file.buffer).digest('hex');

      // Generate a unique filename
      const timestamp = Date.now();
      const fileExtension = file.originalname.split('.').pop();
      const fileName = `client-${clientId}/${timestamp}-${file.originalname}`;

      // Upload to S3
      const fileUrl = await this.s3Service.uploadFile(file.buffer, fileName, file.mimetype);

      // Store file record with basic integrity info
      const fileRecord = await this.prisma.file.create({
        data: {
          fileName: file.originalname,
          fileUrl,
          fileSize: file.size,
          mimeType: file.mimetype,
          fileHash: fileHash,
          hashAlgorithm: 'sha256',
          integrityVerified: true,
          lastVerified: new Date(),
          clientId,
          createdBy: req.user.id,
        }
      });

      // Log file upload for audit trail
      await this.auditLogService.log({
        userId: req.user.id,
        userEmail: req.user.email,
        userRole: req.user.roles?.[0],
        action: 'CREATE',
        resource: 'File',
        resourceId: fileRecord.id,
        description: `Uploaded client file: ${file.originalname} with hash: ${fileHash.substring(0, 8)}...${fileHash.substring(fileHash.length - 8)}`,
        newValues: {
          fileName: file.originalname,
          fileSize: file.size,
          fileHash: fileHash,
          clientId
        }
      });

      return {
        fileId: fileRecord.id,
        fileUrl,
        fileName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype,
        fileHash: fileHash.substring(0, 8) + '...' + fileHash.substring(fileHash.length - 8),
        integrityVerified: true,
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
