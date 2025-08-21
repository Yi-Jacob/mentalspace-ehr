# AI Chatbot Module

This module provides AI-powered chatbot functionality using OpenAI's GPT models for the Mental Health EHR system.

## Features

- **Conversational AI**: Stateful chat with context memory
- **Performance Optimized**: Only sends last 10 messages to maintain speed
- **User Sessions**: Persistent conversation history per user
- **Smart Context Management**: Automatic conversation truncation
- **Professional Prompting**: Tailored for mental health EHR assistance

## Configuration

The chatbot behavior can be configured in `ai-chatbot.config.ts`:

```typescript
export const AI_CHATBOT_CONFIG = {
  MAX_CONTEXT_MESSAGES: 10,    // How many messages to keep in context
  MAX_TOKENS: 1000,            // OpenAI API token limit
  TEMPERATURE: 0.7,            // Response creativity (0.0 = focused, 1.0 = creative)
  MODEL: 'gpt-3.5-turbo',      // OpenAI model to use
  // ... more settings
}
```

## API Endpoints

- `POST /ai-chatbot/chat` - Send a message and get AI response
- `GET /ai-chatbot/sessions` - Get user's chat sessions
- `GET /ai-chatbot/sessions/:id/history` - Get specific session history

## Database Schema

```prisma
model ChatSession {
  id        String   @id @default(uuid())
  userId    String   @map("user_id")
  messages  Json[]   // Array of message objects
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  user User @relation("UserChatSessions", fields: [userId], references: [id])
}
```

## Frontend Components

- `AIChatbot` - Main floating button and chat interface
- `ChatInterface` - Chat window with messages and input
- `ChatMessage` - Individual message display
- `ChatInput` - Message input with send functionality

## Performance Features

1. **Context Limiting**: Only sends last 10 messages to OpenAI
2. **Session Management**: Efficient database queries
3. **Error Handling**: Graceful fallbacks for API failures
4. **Rate Limiting**: Built-in request throttling

## Security

- JWT authentication required for all endpoints
- User isolation: users can only access their own chat sessions
- Input validation and sanitization
- Secure API key management

## Usage

1. User clicks floating AI button (bottom-right corner)
2. Chat interface opens with welcome message
3. User types questions about the EHR system
4. AI responds with contextual, helpful information
5. Conversation history is maintained across sessions
6. Users can start new conversations or clear history

## Environment Variables

Required environment variables:
- `OPENAI_API_KEY` - Your OpenAI API key
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT signing secret

## Troubleshooting

- **API Key Issues**: Check `OPENAI_API_KEY` environment variable
- **Database Errors**: Ensure Prisma migrations are run
- **Performance Issues**: Adjust `MAX_CONTEXT_MESSAGES` in config
- **Authentication Errors**: Verify JWT token and user permissions
