
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send } from 'lucide-react';

interface MessageInputProps {
  newMessage: string;
  onMessageChange: (value: string) => void;
  messagePriority: 'low' | 'normal' | 'high' | 'urgent';
  onPriorityChange: (value: 'low' | 'normal' | 'high' | 'urgent') => void;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  isLoading: boolean;
  disabled: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  newMessage,
  onMessageChange,
  messagePriority,
  onPriorityChange,
  onSendMessage,
  onKeyPress,
  isLoading,
  disabled,
}) => {
  return (
    <div className="border-t border-gray-200 p-4 bg-gradient-to-r from-gray-50 to-purple-50/50">
      <div className="flex flex-col space-y-3">
        <div className="flex space-x-2">
          <Select value={messagePriority} onValueChange={onPriorityChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex space-x-3">
          <Textarea
            value={newMessage}
            onChange={(e) => onMessageChange(e.target.value)}
            onKeyPress={onKeyPress}
            placeholder="Type your message to the client..."
            className="flex-1 resize-none min-h-[60px] border-gray-300 focus:border-purple-500 focus:ring-purple-500"
            disabled={isLoading}
          />
          <Button
            onClick={onSendMessage}
            disabled={disabled}
            className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 self-end"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
