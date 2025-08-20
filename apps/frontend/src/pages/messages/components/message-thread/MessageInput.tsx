
import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/basic/button';
import { Send, X, Reply } from 'lucide-react';
import { useWebSocket } from '../../../../services/websocketService';

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
  const { webSocketService } = useWebSocket();
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

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

  // Handle typing indicators
  const handleTyping = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    
    // Start typing indicator
    if (!isTyping) {
      setIsTyping(true);
      webSocketService.startTyping(conversationId);
    }

    // Clear existing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Set timeout to stop typing indicator
    const timeout = setTimeout(() => {
      setIsTyping(false);
      webSocketService.stopTyping(conversationId);
    }, 2000); // Stop typing indicator after 2 seconds of inactivity

    setTypingTimeout(timeout);
  };

  // Cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [typingTimeout]);

  return (
    <div className="border-t border-gray-200 p-2 bg-gradient-to-r from-gray-50 to-blue-50/50">
      <div className="flex flex-col space-y-2">
        {/* Reply indicator */}
        {replyToId && (
          <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2">
              <Reply className="h-3 w-3 text-blue-600" />
              <span className="text-xs text-blue-700 font-medium">
                Replying to message
              </span>
            </div>
            {onCancelReply && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onCancelReply}
                className="h-5 w-5 p-0 hover:bg-blue-100"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}
        
        <div className="flex space-x-2">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleTyping}
            onKeyPress={onKeyPress}
            placeholder={replyToId ? "Type your reply..." : "Type your message..."}
            className="flex-1 resize-none h-10 border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:outline-none text-sm transition-all duration-200"
            disabled={isLoading}
            rows={1}
            style={{ 
              minHeight: '40px', 
              maxHeight: '80px'
            }}
          />
          <Button
            onClick={onSend}
            disabled={disabled}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 h-10 px-3"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
