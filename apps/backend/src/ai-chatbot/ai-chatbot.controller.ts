import { Controller, Post, Get, Body, UseGuards, Request, Param, HttpStatus, HttpException } from '@nestjs/common';
import { AIChatbotService } from './ai-chatbot.service';
import { ChatRequestDto, ChatResponseDto } from './dto/chat-message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('ai-chatbot')
@UseGuards(JwtAuthGuard)
export class AIChatbotController {
  constructor(private readonly aiChatbotService: AIChatbotService) {}

  @Post('chat')
  async processChatMessage(
    @Body() chatRequest: ChatRequestDto,
    @Request() req: any
  ): Promise<ChatResponseDto> {
    try {
      const userId = req.user.id;
      return await this.aiChatbotService.processChatMessage(chatRequest, userId);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to process chat message',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('sessions')
  async getUserChatSessions(@Request() req: any) {
    try {
      const userId = req.user.id;
      return await this.aiChatbotService.getUserChatSessions(userId);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to get chat sessions',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('sessions/:sessionId/history')
  async getChatHistory(
    @Param('sessionId') sessionId: string,
    @Request() req: any
  ) {
    try {
      const userId = req.user.id;
      return await this.aiChatbotService.getChatHistory(sessionId, userId);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to get chat history',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('generate-form-data')
  async generateFormData(
    @Body() request: { summary: string; noteType: string; clientName: string },
    @Request() req: any
  ) {
    try {
      const userId = req.user.id;
      return await this.aiChatbotService.generateFormData(request, userId);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to generate form data',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
