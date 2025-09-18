import { 
  Controller, 
  Get, 
  Post, 
  Put,
  Body, 
  Param, 
  UseGuards, 
  Request,
  HttpStatus,
  HttpCode 
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateConversationDto, CreateGroupConversationDto, CreateMessageDto, MarkMessageReadDto, UpdateConversationDto, UpdateGroupParticipantsDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  // Get all conversations for the authenticated user
  @Get('conversations')
  async getConversations(@Request() req) {
    const userId = req.user.id;
    return this.messagesService.getConversations(userId);
  }

  // Get a specific conversation
  @Get('conversations/:id')
  async getConversation(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;
    return this.messagesService.getConversation(id, userId);
  }

  // Create a new individual conversation
  @Post('conversations')
  @HttpCode(HttpStatus.CREATED)
  async createConversation(
    @Body() createConversationDto: CreateConversationDto,
    @Request() req
  ) {
    const therapistId = req.user.id;
    return this.messagesService.createConversation(createConversationDto, therapistId);
  }

  // Create a new group conversation
  @Post('conversations/group')
  @HttpCode(HttpStatus.CREATED)
  async createGroupConversation(
    @Body() createGroupConversationDto: CreateGroupConversationDto,
    @Request() req
  ) {
    const creatorId = req.user.id;
    return this.messagesService.createGroupConversation(createGroupConversationDto, creatorId);
  }

  // Get messages for a conversation
  @Get('conversations/:conversationId/messages')
  async getMessages(
    @Param('conversationId') conversationId: string,
    @Request() req
  ) {
    const userId = req.user.id;
    return this.messagesService.getMessages(conversationId, userId);
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

  // Mark message as read
  @Post('messages/read')
  @HttpCode(HttpStatus.OK)
  async markMessageAsRead(
    @Body() markReadDto: MarkMessageReadDto,
    @Request() req
  ) {
    const userId = req.user.id;
    return this.messagesService.markMessageAsRead(markReadDto, userId);
  }

  // Get unread message count
  @Get('unread-count')
  async getUnreadCount(@Request() req) {
    const userId = req.user.id;
    return this.messagesService.getUnreadMessageCount(userId);
  }

  // Quick message endpoint (find or create conversation and send message)
  @Post('quick-message')
  @HttpCode(HttpStatus.CREATED)
  async sendQuickMessage(
    @Body() data: {
      recipientId: string;
      content: string;
      category?: string;
      priority?: string;
    },
    @Request() req
  ) {
    const therapistId = req.user.id;
    
    // Find or create conversation
    const conversation = await this.messagesService.findOrCreateConversation(
      data.recipientId,
      therapistId,
      data.category as any,
      data.priority as any
    );

    // Send message
    const messageDto: CreateMessageDto = {
      conversationId: conversation.id,
      content: data.content,
      priority: data.priority as any,
    };

    return this.messagesService.sendMessage(messageDto, therapistId);
  }

  // Create conversation with initial message
  @Post('conversations/with-message')
  @HttpCode(HttpStatus.CREATED)
  async createConversationWithMessage(
    @Body() data: {
      title: string;
      participantIds: string[];
      category?: string;
      priority?: string;
      initialMessage: string;
      type: 'individual' | 'group';
    },
    @Request() req
  ) {
    const creatorId = req.user.id;
    return this.messagesService.createConversationWithMessage({
      ...data,
      category: data.category as any,
      priority: data.priority as any,
    }, creatorId);
  }

  // Update conversation details (priority, category, title)
  @Put('conversations/:id')
  @HttpCode(HttpStatus.OK)
  async updateConversation(
    @Param('id') id: string,
    @Body() updateConversationDto: UpdateConversationDto,
    @Request() req
  ) {
    const userId = req.user.id;
    return this.messagesService.updateConversation(id, userId, updateConversationDto);
  }

  // Update group conversation participants
  @Put('conversations/:id/participants')
  @HttpCode(HttpStatus.OK)
  async updateGroupParticipants(
    @Param('id') id: string,
    @Body() updateGroupParticipantsDto: UpdateGroupParticipantsDto,
    @Request() req
  ) {
    const userId = req.user.id;
    return this.messagesService.updateGroupConversationParticipants(id, userId, updateGroupParticipantsDto.participantIds);
  }

  // Get conversations for a specific client
  @Get('conversations/client/:clientId')
  async getClientConversations(
    @Param('clientId') clientId: string,
    @Request() req
  ) {
    const userId = req.user.id;
    return this.messagesService.getClientConversations(clientId, userId);
  }
} 