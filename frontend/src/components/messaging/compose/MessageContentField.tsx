
import React from 'react';
import { Label } from '@/components/shared/ui/label';
import { Textarea } from '@/components/shared/ui/textarea';

interface MessageContentFieldProps {
  messageContent: string;
  onContentChange: (value: string) => void;
  isLoading: boolean;
}

const MessageContentField: React.FC<MessageContentFieldProps> = ({
  messageContent,
  onContentChange,
  isLoading,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="content" className="text-sm font-medium">
        Message Content *
      </Label>
      <Textarea
        id="content"
        value={messageContent}
        onChange={(e) => onContentChange(e.target.value)}
        placeholder="Type your message to the client..."
        rows={6}
        className="resize-none border-gray-300 focus:border-green-500 focus:ring-green-500"
        disabled={isLoading}
      />
    </div>
  );
};

export default MessageContentField;
