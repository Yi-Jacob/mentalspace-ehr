import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../database/prisma.service';
import { ChatRequestDto, ChatResponseDto, MessageRole } from './dto/chat-message.dto';
import { OpenAIMessage, OpenAIRequest, OpenAIResponse } from './interfaces/openai.interface';
import { AI_CHATBOT_CONFIG } from './ai-chatbot.config';

@Injectable()
export class AIChatbotService {
  private readonly logger = new Logger(AIChatbotService.name);
  private readonly openaiApiKey: string;
  private readonly openaiApiUrl = AI_CHATBOT_CONFIG.API_URL;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.openaiApiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!this.openaiApiKey) {
      this.logger.warn('OpenAI API key not found in environment variables');
    }
  }

  async processChatMessage(request: ChatRequestDto, userId: string): Promise<ChatResponseDto> {
    try {
      // Get or create chat session
      let sessionId = request.sessionId;
      if (!sessionId) {
        const session = await this.createChatSession(userId);
        sessionId = session.id;
      }

      // Get existing messages for context
      const existingSession = await this.prisma.chatSession.findUnique({
        where: { id: sessionId, userId },
      });

      if (!existingSession) {
        throw new HttpException('Chat session not found', HttpStatus.NOT_FOUND);
      }

      // Prepare messages for OpenAI - only send last N messages for performance
      const recentMessages = (existingSession.messages as unknown as OpenAIMessage[]).slice(-AI_CHATBOT_CONFIG.MAX_CONTEXT_MESSAGES);
      
      // Build system prompt with note context if available
      let systemPrompt = AI_CHATBOT_CONFIG.SYSTEM_PROMPT;
      if (request.noteContext) {
        systemPrompt += `\n\nYou are currently discussing a ${request.noteContext.noteType.replace('_', ' ')} note for client ${request.noteContext.clientName}. Here is the note content:\n\n${request.noteContext.noteContent}\n\nPlease provide helpful insights and assistance related to this specific note.`;
      }
      
      const messages: OpenAIMessage[] = [
        {
          role: 'system',
          content: systemPrompt
        },
        ...recentMessages,
        {
          role: 'user',
          content: request.message
        }
      ];

      // Call OpenAI API
      const aiResponse = await this.callOpenAI(messages);
      
      // Save the new messages to the session
      const updatedMessages = [
        ...(existingSession.messages as unknown as OpenAIMessage[]),
        { role: 'user', content: request.message },
        { role: 'assistant', content: aiResponse }
      ];

      await this.prisma.chatSession.update({
        where: { id: sessionId },
        data: {
          messages: updatedMessages,
          updatedAt: new Date()
        }
      });

      return {
        message: aiResponse,
        sessionId,
      };

    } catch (error) {
      this.logger.error('Error processing chat message:', error);
      throw new HttpException(
        'Failed to process chat message',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  private async createChatSession(userId: string) {
    return await this.prisma.chatSession.create({
      data: {
        userId,
        messages: [],
      }
    });
  }

  private async callOpenAI(messages: OpenAIMessage[]): Promise<string> {
    if (!this.openaiApiKey) {
      throw new HttpException('OpenAI API key not configured', HttpStatus.SERVICE_UNAVAILABLE);
    }

    const requestBody: OpenAIRequest = {
      model: AI_CHATBOT_CONFIG.MODEL,
      messages,
      max_tokens: AI_CHATBOT_CONFIG.MAX_TOKENS,
      temperature: AI_CHATBOT_CONFIG.TEMPERATURE,
    };

    try {
      const response = await fetch(this.openaiApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.openaiApiKey}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        this.logger.error('OpenAI API error:', errorData);
        throw new HttpException(
          `OpenAI API error: ${errorData.error?.message || 'Unknown error'}`,
          HttpStatus.BAD_REQUEST
        );
      }

      const data: OpenAIResponse = await response.json();
      return data.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

    } catch (error) {
      this.logger.error('Error calling OpenAI API:', error);
      throw new HttpException(
        'Failed to communicate with AI service',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getChatHistory(sessionId: string, userId: string) {
    const session = await this.prisma.chatSession.findUnique({
      where: { id: sessionId, userId },
    });

    if (!session) {
      throw new HttpException('Chat session not found', HttpStatus.NOT_FOUND);
    }

    return session.messages;
  }

  async getUserChatSessions(userId: string) {
    return await this.prisma.chatSession.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        messages: true
      }
    });
  }
}
