export const AI_CHATBOT_CONFIG = {
  // Context management
  MAX_CONTEXT_MESSAGES: 10,
  MAX_TOKENS: 1000,
  TEMPERATURE: 0.7,
  
  // OpenAI settings
  MODEL: 'gpt-3.5-turbo',
  API_URL: 'https://api.openai.com/v1/chat/completions',
  
  // System prompt
  SYSTEM_PROMPT: 'You are a helpful AI assistant for a mental health EHR system. You help users with questions about the system, mental health practices, and general support. Be professional, empathetic, and helpful.',
  
  // Performance settings
  REQUEST_TIMEOUT: 30000, // 30 seconds
  MAX_RETRIES: 3,
} as const;
