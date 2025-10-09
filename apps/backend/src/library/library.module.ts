import { Module } from '@nestjs/common';
import { LibraryController } from './library.controller';
import { LibraryService } from './library.service';
import { PortalFormController } from './portal-form.controller';
import { PortalFormService } from './portal-form.service';
import { OutcomeMeasureController } from './outcome-measure.controller';
import { OutcomeMeasureService } from './outcome-measure.service';
import { PrismaService } from '../database/prisma.service';
import { S3Service } from '../common/s3.service';

@Module({
  controllers: [LibraryController, PortalFormController, OutcomeMeasureController],
  providers: [LibraryService, PortalFormService, OutcomeMeasureService, PrismaService, S3Service],
  exports: [LibraryService, PortalFormService, OutcomeMeasureService],
})
export class LibraryModule {}
