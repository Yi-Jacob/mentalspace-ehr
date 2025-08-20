import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateConversationDto, CreateGroupConversationDto, CreateMessageDto, MarkMessageReadDto, UpdateConversationDto, UpdateGroupParticipantsDto } from './dto';
import { ConversationPriority, ConversationCategory } from './dto/shared-enums';
import { MessagesEventsService } from './messages-events.service';

@Injectable()
export class MessagesService {
  constructor(
    private prisma: PrismaService,
    private messagesEventsService: MessagesEventsService,
  ) {}

  // Get all conversations for a user (both individual and group)
  async getConversations(userId: string) {
    return this.prisma.conversation.findMany({
      where: {
        OR: [
          { therapistId: userId },
          { clientId: userId },
          {
            participants: {
              some: {
                userId,
                leftAt: null,
              },
            },
          },
        ],
      },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        therapist: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        participants: {
          where: {
            leftAt: null,
          },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        messages: {
          include: {
            sender: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
      orderBy: {
        lastMessageAt: 'desc',
      },
    });
  }

  // Get conversation by ID
  async getConversation(id: string, userId: string) {
    const conversation = await this.prisma.conversation.findFirst({
      where: {
        id,
        OR: [
          { therapistId: userId },
          { clientId: userId },
          {
            participants: {
              some: {
                userId,
                leftAt: null,
              },
            },
          },
        ],
      },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        therapist: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        participants: {
          where: {
            leftAt: null,
          },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return conversation;
  }

  // Create a new individual conversation
  async createConversation(createConversationDto: CreateConversationDto, therapistId: string) {
    // Check if conversation already exists
    const existingConversation = await this.prisma.conversation.findFirst({
      where: {
        clientId: createConversationDto.clientId,
        therapistId,
        type: 'individual',
      },
    });

    if (existingConversation) {
      throw new ConflictException('A conversation with this client already exists');
    }

    return this.prisma.conversation.create({
      data: {
        title: createConversationDto.title || 'New Conversation',
        type: 'individual',
        clientId: createConversationDto.clientId,
        therapistId,
        category: createConversationDto.category || 'general',
        priority: createConversationDto.priority || 'normal',
        createdBy: therapistId,
        lastMessageAt: new Date(), // Set this explicitly to ensure it's current
      },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        therapist: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  // Create a new group conversation
  async createGroupConversation(createGroupConversationDto: CreateGroupConversationDto, creatorId: string) {
    // Verify all participants exist
    const participants = await this.prisma.user.findMany({
      where: {
        id: {
          in: createGroupConversationDto.participantIds,
        },
      },
    });

    if (participants.length !== createGroupConversationDto.participantIds.length) {
      throw new NotFoundException('One or more participants not found');
    }

        // Create conversation and participants in a transaction
    return this.prisma.$transactionWithRetry(async (prisma) => {
      const conversation = await prisma.conversation.create({
        data: {
          title: createGroupConversationDto.title,
          type: 'group',
          category: createGroupConversationDto.category || 'general',
          priority: createGroupConversationDto.priority || 'normal',
          createdBy: creatorId,
        },
      });

      // Add all participants including creator
      const allParticipantIds = [...createGroupConversationDto.participantIds, creatorId];
      const uniqueParticipantIds = [...new Set(allParticipantIds)];

      const participantData = uniqueParticipantIds.map((participantId) => ({
        conversationId: conversation.id,
        userId: participantId,
        role: participantId === creatorId ? 'admin' : 'participant',
      }));

      await prisma.conversationParticipant.createMany({
        data: participantData,
      });

      return prisma.conversation.findUnique({
        where: { id: conversation.id },
        include: {
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      });
    }, {
      timeout: 10000, // 10 seconds timeout
      maxRetries: 3,
    });
  }

  // Get messages for a conversation
  async getMessages(conversationId: string, userId: string) {
    // Verify conversation access
    const conversation = await this.prisma.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [
          { therapistId: userId },
          { clientId: userId },
          {
            participants: {
              some: {
                userId,
                leftAt: null,
              },
            },
          },
        ],
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return this.prisma.message.findMany({
      where: {
        conversationId,
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        replyTo: {
          select: {
            id: true,
            content: true,
            sender: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        readReceipts: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  // Send a message
  async sendMessage(createMessageDto: CreateMessageDto, senderId: string) {
    // Verify conversation exists and sender has access
    const conversation = await this.prisma.conversation.findFirst({
      where: {
        id: createMessageDto.conversationId,
        OR: [
          { therapistId: senderId },
          { clientId: senderId },
          {
            participants: {
              some: {
                userId: senderId,
                leftAt: null,
              },
            },
          },
        ],
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found or access denied');
    }

    // If this is a reply, verify the original message exists
    if (createMessageDto.replyToId) {
      const originalMessage = await this.prisma.message.findFirst({
        where: {
          id: createMessageDto.replyToId,
          conversationId: createMessageDto.conversationId,
        },
      });

      if (!originalMessage) {
        throw new NotFoundException('Original message not found');
      }
    }

    // Create message
    const message = await this.prisma.message.create({
      data: {
        conversationId: createMessageDto.conversationId,
        senderId,
        content: createMessageDto.content,
        priority: createMessageDto.priority || 'normal',
        messageType: createMessageDto.messageType,
        replyToId: createMessageDto.replyToId,
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        replyTo: {
          select: {
            id: true,
            content: true,
            sender: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    // Update conversation's last message timestamp
    await this.prisma.conversation.update({
      where: {
        id: createMessageDto.conversationId,
      },
      data: {
        lastMessageAt: new Date(),
      },
    });

    // Broadcast new message to all participants via WebSocket
    this.messagesEventsService.emitNewMessage(createMessageDto.conversationId, message);
    
    return message;
  }

  // Mark message as read
  async markMessageAsRead(markReadDto: MarkMessageReadDto, userId: string) {
    // Verify message exists and user has access to the conversation
    const message = await this.prisma.message.findFirst({
      where: {
        id: markReadDto.messageId,
        conversation: {
          OR: [
            { therapistId: userId },
            { clientId: userId },
            {
              participants: {
                some: {
                  userId,
                  leftAt: null,
                },
              },
            },
          ],
        },
      },
    });

    if (!message) {
      throw new NotFoundException('Message not found or access denied');
    }

    // Create or update read receipt
    return this.prisma.messageReadReceipt.upsert({
      where: {
        messageId_userId: {
          messageId: markReadDto.messageId,
          userId,
        },
      },
      update: {
        readAt: new Date(),
      },
      create: {
        messageId: markReadDto.messageId,
        userId,
        readAt: new Date(),
      },
    });
  }

  // Find or create conversation for quick message
  async findOrCreateConversation(recipientId: string, therapistId: string, category?: ConversationCategory, priority?: ConversationPriority) {
    // First, try to find an existing conversation between these users
    let conversation = await this.prisma.conversation.findFirst({
      where: {
        OR: [
          // Check if recipient is a client
          { clientId: recipientId, therapistId, type: 'individual' },
          // Check if recipient is a therapist (staff)
          { clientId: therapistId, therapistId: recipientId, type: 'individual' },
        ],
      },
    });

    if (!conversation) {
      // Determine if the recipient is a client or staff member
      // For now, we'll assume the recipient is a client if no existing conversation is found
      // This can be enhanced later with proper user type checking
      conversation = await this.prisma.conversation.create({
        data: {
          title: 'Quick Message',
          type: 'individual',
          clientId: recipientId,
          therapistId,
          category: category || 'general',
          priority: priority || 'normal',
          createdBy: therapistId,
          lastMessageAt: new Date(), // Set this explicitly to ensure it's current
        },
      });
    }

    return conversation;
  }

  // Create conversation with initial message
  async createConversationWithMessage(
    data: {
      title: string;
      participantIds: string[];
      category?: ConversationCategory;
      priority?: ConversationPriority;
      initialMessage: string;
      type: 'individual' | 'group';
    },
    creatorId: string
  ) {
    return this.prisma.$transactionWithRetry(async (prisma) => {
      // Create conversation with lastMessageAt set to current time
      const conversation = await prisma.conversation.create({
        data: {
          title: data.title,
          type: data.type,
          category: data.category || 'general',
          priority: data.priority || 'normal',
          createdBy: creatorId,
          lastMessageAt: new Date(), // Set this explicitly to ensure it's current
          // For individual conversations, set clientId and therapistId
          ...(data.type === 'individual' && data.participantIds.length === 2 && {
            clientId: data.participantIds.find(id => id !== creatorId),
            therapistId: creatorId,
          }),
        },
      });

      // Add participants for group conversations
      if (data.type === 'group') {
        // Create participant data for selected users
        const participantData = data.participantIds.map((participantId) => ({
          conversationId: conversation.id,
          userId: participantId,
          role: 'participant', // All selected users are participants
        }));

        // Add the creator as admin (if not already in the participant list)
        const allParticipantIds = [...data.participantIds, creatorId];
        const uniqueParticipantIds = [...new Set(allParticipantIds)];

        // Create all participants including creator
        const allParticipantData = uniqueParticipantIds.map((participantId) => ({
          conversationId: conversation.id,
          userId: participantId,
          role: participantId === creatorId ? 'admin' : 'participant',
        }));

        await prisma.conversationParticipant.createMany({
          data: allParticipantData,
        });
      }

      // Send initial message
      const message = await prisma.message.create({
        data: {
          conversationId: conversation.id,
          senderId: creatorId,
          content: data.initialMessage,
          priority: data.priority || 'normal',
        },
        include: {
          sender: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      return {
        conversation,
        message,
      };
    }, {
      timeout: 15000, // 15 seconds timeout
      maxRetries: 3,
    });
  }

  // Get unread message count for a user
  async getUnreadMessageCount(userId: string) {
    const conversations = await this.prisma.conversation.findMany({
      where: {
        OR: [
          { therapistId: userId },
          { clientId: userId },
          {
            participants: {
              some: {
                userId,
                leftAt: null,
              },
            },
          },
        ],
      },
      select: {
        id: true,
      },
    });

    const conversationIds = conversations.map(c => c.id);

    const unreadCount = await this.prisma.message.count({
      where: {
        conversationId: {
          in: conversationIds,
        },
        senderId: {
          not: userId,
        },
        readReceipts: {
          none: {
            userId,
          },
        },
      },
    });

    return unreadCount;
  }

  // Update conversation details (priority, category, title)
  async updateConversation(
    conversationId: string,
    userId: string,
    updateData: {
      priority?: ConversationPriority;
      category?: ConversationCategory;
      title?: string;
    }
  ) {
    // Verify user has access to this conversation
    const conversation = await this.prisma.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [
          { therapistId: userId },
          { clientId: userId },
          {
            participants: {
              some: {
                userId,
                leftAt: null,
                role: { in: ['admin', 'participant'] },
              },
            },
          },
        ],
      },
      include: {
        participants: {
          where: {
            leftAt: null,
          },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found or access denied');
    }

    // For group conversations, only admins can update
    if (conversation.type === 'group') {
      const userParticipant = conversation.participants.find(p => p.user.id === userId);
      if (!userParticipant || userParticipant.role !== 'admin') {
        throw new ForbiddenException('Only admins can update group conversations');
      }
    }

    // Update conversation
    const updatedConversation = await this.prisma.conversation.update({
      where: { id: conversationId },
      data: {
        ...(updateData.priority && { priority: updateData.priority }),
        ...(updateData.category && { category: updateData.category }),
        ...(updateData.title && conversation.type === 'group' && { title: updateData.title }),
      },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        therapist: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        participants: {
          where: {
            leftAt: null,
          },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        messages: {
          include: {
            sender: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    });

    // Broadcast conversation update via WebSocket
    this.messagesEventsService.emitConversationUpdate(conversationId, {
      type: 'conversation_updated',
      data: updateData,
      conversation: updatedConversation,
    });

    return updatedConversation;
  }

  // Update group conversation participants
  async updateGroupConversationParticipants(
    conversationId: string,
    userId: string,
    participantIds: string[]
  ) {
    // Verify user is admin of this group conversation
    const conversation = await this.prisma.conversation.findFirst({
      where: {
        id: conversationId,
        type: 'group',
        participants: {
          some: {
            userId,
            leftAt: null,
            role: 'admin',
          },
        },
      },
      include: {
        participants: {
          where: {
            leftAt: null,
          },
        },
      },
    });

    if (!conversation) {
      throw new ForbiddenException('Only admins can update group participants');
    }

    // Ensure the admin user is always included
    const allParticipantIds = [...new Set([...participantIds, userId])];

    return this.prisma.$transaction(async (prisma) => {
      // Mark all current participants as left
      await prisma.conversationParticipant.updateMany({
        where: {
          conversationId,
          leftAt: null,
        },
        data: {
          leftAt: new Date(),
        },
      });

      // Create new participants
      const participantData = allParticipantIds.map((participantId) => ({
        conversationId,
        userId: participantId,
        role: participantId === userId ? 'admin' : 'participant',
        joinedAt: new Date(),
      }));

      await prisma.conversationParticipant.createMany({
        data: participantData,
      });

      // Update conversation's lastMessageAt to trigger refresh
      await prisma.conversation.update({
        where: { id: conversationId },
        data: {
          lastMessageAt: new Date(),
        },
      });

      // Return updated conversation
      const updatedConversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: {
          client: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          therapist: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          participants: {
            where: {
              leftAt: null,
            },
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
          messages: {
            include: {
              sender: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
            take: 1,
          },
        },
      });

      // Broadcast participant change via WebSocket
      this.messagesEventsService.emitParticipantChange(conversationId, {
        type: 'participants_updated',
        participantIds: allParticipantIds,
        conversation: updatedConversation,
      });

      return updatedConversation;
    });
  }
} 