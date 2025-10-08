import { Module } from '@nestjs/common';
import { LibraryController } from './library.controller';
import { LibraryService } from './library.service';
import { PortalFormController } from './portal-form.controller';
import { PortalFormService } from './portal-form.service';
import { PrismaService } from '../database/prisma.service';
import { S3Service } from '../common/s3.service';

@Module({
  controllers: [LibraryController, PortalFormController],
  providers: [LibraryService, PortalFormService, PrismaService, S3Service],
  exports: [LibraryService, PortalFormService],
})
export class LibraryModule {}
