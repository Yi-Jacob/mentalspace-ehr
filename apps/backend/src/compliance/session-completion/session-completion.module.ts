import { Module } from '@nestjs/common';
import { SessionCompletionController } from './session-completion.controller';
import { SessionCompletionService } from './session-completion.service';
import { SessionManagementService } from './session-management.service';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [SessionCompletionController],
  providers: [SessionCompletionService, SessionManagementService],
  exports: [SessionCompletionService, SessionManagementService],
})
export class SessionCompletionModule {}
