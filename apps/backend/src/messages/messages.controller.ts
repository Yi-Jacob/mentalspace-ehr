import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  UseGuards, 
  Request,
  HttpStatus,
  HttpCode 
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateConversationDto, CreateMessageDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  // Get all conversations for the authenticated therapist
  @Get('conversations')
  async getConversations(@Request() req) {
    const therapistId = req.user.id;
    return this.messagesService.getConversations(therapistId);
  }

  // Get a specific conversation
  @Get('conversations/:id')
  async getConversation(@Param('id') id: string, @Request() req) {
    const therapistId = req.user.id;
    return this.messagesService.getConversation(id, therapistId);
  }

  // Create a new conversation
  @Post('conversations')
  @HttpCode(HttpStatus.CREATED)
  async createConversation(
    @Body() createConversationDto: CreateConversationDto,
    @Request() req
  ) {
    const therapistId = req.user.id;
    return this.messagesService.createConversation(createConversationDto, therapistId);
  }

  // Get messages for a conversation
  @Get('conversations/:conversationId/messages')
  async getMessages(
    @Param('conversationId') conversationId: string,
    @Request() req
  ) {
    const therapistId = req.user.id;
    return this.messagesService.getMessages(conversationId, therapistId);
  }

  // Send a message
  @Post('messages')
  @HttpCode(HttpStatus.CREATED)
  async sendMessage(
    @Body() createMessageDto: CreateMessageDto,
    @Request() req
  ) {
    const senderId = req.user.id;
    return this.messagesService.sendMessage(createMessageDto, senderId);
  }

  // Quick message endpoint (find or create conversation and send message)
  @Post('quick-message')
  @HttpCode(HttpStatus.CREATED)
  async sendQuickMessage(
    @Body() data: {
      clientId: string;
      content: string;
      category?: string;
      priority?: string;
    },
    @Request() req
  ) {
    const therapistId = req.user.id;
    
    // Find or create conversation
    const conversation = await this.messagesService.findOrCreateConversation(
      data.clientId,
      therapistId,
      data.category,
      data.priority
    );

    // Send message
    const messageDto: CreateMessageDto = {
      conversationId: conversation.id,
      content: data.content,
      priority: data.priority as any,
    };

    return this.messagesService.sendMessage(messageDto, therapistId);
  }
} 