# Enhanced Messaging System

This document describes the enhanced messaging system that supports both individual and group conversations with advanced features like message replies and read receipts.

## Features

### 1. Individual Conversations
- **1:1 messaging** between therapists and clients
- **Quick message** functionality for immediate communication
- **Conversation management** with categories and priorities

### 2. Group Conversations
- **Multi-participant chats** for team collaboration
- **Role-based access** (admin, participant, moderator)
- **Flexible participant management**

### 3. Message Features
- **Reply functionality** - reply to specific messages
- **Read receipts** - track who has read messages
- **Priority levels** - low, normal, high, urgent
- **Message types** - support for different content types

### 4. Enhanced API Endpoints

#### Conversations
- `GET /messages/conversations` - Get all conversations for user
- `GET /messages/conversations/:id` - Get specific conversation
- `POST /messages/conversations` - Create individual conversation
- `POST /messages/conversations/group` - Create group conversation

#### Messages
- `GET /messages/conversations/:id/messages` - Get messages for conversation
- `POST /messages/messages` - Send a message
- `POST /messages/messages/read` - Mark message as read
- `GET /messages/unread-count` - Get unread message count
- `POST /messages/quick-message` - Send quick message

## Database Schema

### Conversations Table
```sql
- id: UUID (Primary Key)
- title: String
- type: String ('individual' or 'group')
- clientId: UUID (nullable, for individual conversations)
- therapistId: UUID (nullable, for individual conversations)
- category: String
- priority: String
- status: String
- createdBy: UUID
- createdAt: DateTime
- updatedAt: DateTime
- lastMessageAt: DateTime
```

### Messages Table
```sql
- id: UUID (Primary Key)
- conversationId: UUID (Foreign Key)
- senderId: UUID (Foreign Key to Users)
- content: String
- messageType: String (nullable)
- priority: String
- replyToId: UUID (nullable, Foreign Key to Messages)
- createdAt: DateTime
- updatedAt: DateTime
```

### Conversation Participants Table
```sql
- id: UUID (Primary Key)
- conversationId: UUID (Foreign Key)
- userId: UUID (Foreign Key to Users)
- role: String ('admin', 'participant', 'moderator')
- joinedAt: DateTime
- leftAt: DateTime (nullable)
```

### Message Read Receipts Table
```sql
- id: UUID (Primary Key)
- messageId: UUID (Foreign Key to Messages)
- userId: UUID (Foreign Key to Users)
- readAt: DateTime
- UNIQUE(messageId, userId)
```

## Frontend Components

### Message Management
- **ConversationList** - Displays all conversations with type indicators
- **MessageThread** - Shows messages in a conversation with reply support
- **MessageInput** - Enhanced input with reply functionality
- **CreateGroupConversationModal** - Modal for creating group chats

### State Management
- **MessageManagementState** - Manages modal states and conversation selection
- **MessageService** - Handles all API communication

## Usage Examples

### Creating a Group Conversation
```typescript
const groupData = {
  title: "Team Discussion",
  participantIds: ["user1", "user2", "user3"],
  category: "general",
  priority: "normal"
};

await messageService.createGroupConversation(groupData);
```

### Sending a Reply
```typescript
const messageData = {
  conversationId: "conv123",
  content: "This is a reply",
  replyToId: "msg456"
};

await messageService.sendMessage(messageData);
```

### Marking Message as Read
```typescript
await messageService.markMessageAsRead({
  messageId: "msg123"
});
```

## Migration

To update your existing database schema, run:

```bash
cd apps/backend
node scripts/update-messages-schema.js
```

This will:
1. Add new columns to existing tables
2. Create new tables for participants and read receipts
3. Remove deprecated columns
4. Create necessary indexes for performance

## Security Features

- **JWT Authentication** required for all endpoints
- **Access Control** - users can only access conversations they're part of
- **Input Validation** - all inputs are validated using DTOs
- **SQL Injection Protection** - using Prisma ORM

## Performance Considerations

- **Indexed queries** on frequently accessed fields
- **Efficient joins** using Prisma's optimized queries
- **Pagination support** for large message lists
- **Real-time updates** can be added using WebSockets

## Future Enhancements

- **Real-time messaging** with WebSocket support
- **File attachments** for messages
- **Message search** functionality
- **Conversation archiving**
- **Push notifications** for new messages
- **Message encryption** for sensitive conversations
