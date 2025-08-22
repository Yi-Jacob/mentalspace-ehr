export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system'
}

export interface ChatMessage {
  id: string;
  content: string;
  role: MessageRole;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  userId: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface ChatRequest {
  message: string;
  sessionId?: string;
  noteContext?: {
    noteId: string;
    noteType: string;
    clientName: string;
    noteContent: string;
  };
}

export interface ChatResponse {
  message: string;
  sessionId: string;
  error?: string;
}

export interface AIChatbotState {
  isOpen: boolean;
  currentSessionId: string | null;
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  noteContext?: {
    noteId: string;
    noteType: string;
    clientName: string;
    noteContent: string;
  };
}
