
import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/basic/button';
import { Send, X, Reply } from 'lucide-react';

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  replyToId?: string | null;
  onCancelReply?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  conversationId: string;
}

const MessageInput: React.FC<MessageInputProps> = ({
  value,
  onChange,
  priority,
  onSend,
  onKeyPress,
  replyToId,
  onCancelReply,
  disabled = false,
  isLoading = false,
  conversationId,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      
      // Reset height to calculate new dimensions
      textarea.style.height = 'auto';
      
      // Calculate new height based on content
      const scrollHeight = textarea.scrollHeight;
      const lineHeight = 20; // Approximate line height in pixels
      const maxHeight = lineHeight * 4; // Maximum 4 rows
      
      // Set height to minimum of calculated height or max height
      textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    }
  }, [value]);

  return (
        <div className="flex items-end space-x-2">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={onKeyPress}
            placeholder="Type your message..."
            disabled={disabled || isLoading}
            className="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            rows={1}
            style={{ minHeight: '40px' }}
          />
          
          <Button
            onClick={onSend}
            disabled={disabled || isLoading || !value.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
  );
};

export default MessageInput;
