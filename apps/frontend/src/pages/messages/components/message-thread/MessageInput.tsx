
import React from 'react';
import { Button } from '@/components/basic/button';
import { Textarea } from '@/components/basic/textarea';
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
}) => {
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
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={onKeyPress}
            placeholder={replyToId ? "Type your reply..." : "Type your message..."}
            className="flex-1 resize-none h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm"
            disabled={isLoading}
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
