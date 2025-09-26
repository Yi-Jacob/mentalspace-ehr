import { Module } from '@nestjs/common';
import { LibraryController } from './library.controller';
import { LibraryService } from './library.service';
import { PrismaService } from '../database/prisma.service';
import { S3Service } from '../common/s3.service';

@Module({
  controllers: [LibraryController],
  providers: [LibraryService, PrismaService, S3Service],
  exports: [LibraryService],
})
export class LibraryModule {}
