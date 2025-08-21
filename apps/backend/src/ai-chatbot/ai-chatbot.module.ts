import { Module } from '@nestjs/common';
import { AIChatbotController } from './ai-chatbot.controller';
import { AIChatbotService } from './ai-chatbot.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [AIChatbotController],
  providers: [AIChatbotService],
  exports: [AIChatbotService],
})
export class AIChatbotModule {}
