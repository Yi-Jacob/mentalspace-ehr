
import React from 'react';
import UserSelectionField from './UserSelectionField';
import MessageCategoryField from './MessageCategoryField';
import MessagePriorityField from './MessagePriorityField';
import MessageContentField from './MessageContentField';
import { Label } from '@/components/basic/label';
import { Input } from '@/components/basic/input';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userType: 'staff' | 'client';
  jobTitle?: string;
  department?: string;
}

interface ComposeMessageFormProps {
  users: User[];
  selectedUserIds: string[];
  onUserChange: (value: string[]) => void;
  conversationTitle: string;
  onTitleChange: (value: string) => void;
  messageCategory: 'clinical' | 'administrative' | 'urgent' | 'general';
  onCategoryChange: (value: 'clinical' | 'administrative' | 'urgent' | 'general') => void;
  messagePriority: 'low' | 'normal' | 'high' | 'urgent';
  onPriorityChange: (value: 'low' | 'normal' | 'high' | 'urgent') => void;
  messageContent: string;
  onContentChange: (value: string) => void;
  isLoading: boolean;
  disabled?: boolean;
  showTitleField: boolean;
}

const ComposeMessageForm: React.FC<ComposeMessageFormProps> = ({
  users,
  selectedUserIds,
  onUserChange,
  conversationTitle,
  onTitleChange,
  messageCategory,
  onCategoryChange,
  messagePriority,
  onPriorityChange,
  messageContent,
  onContentChange,
  isLoading,
  disabled = false,
  showTitleField,
}) => {
  return (
    <div className="space-y-6">
      <UserSelectionField
        users={users}
        selectedUserIds={selectedUserIds}
        onUserChange={onUserChange}
        disabled={disabled}
      />

      {/* Conversation Title Field - Only show for group conversations */}
      {showTitleField && (
        <div className="space-y-2">
          <Label htmlFor="conversationTitle" className="text-sm font-medium">
            Conversation Title *
          </Label>
          <Input
            id="conversationTitle"
            type="text"
            placeholder="Enter conversation title..."
            value={conversationTitle}
            onChange={(e) => onTitleChange(e.target.value)}
            disabled={disabled}
            required
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <MessageCategoryField
          messageCategory={messageCategory}
          onCategoryChange={onCategoryChange}
        />
        <MessagePriorityField
          messagePriority={messagePriority}
          onPriorityChange={onPriorityChange}
        />
      </div>

      <MessageContentField
        messageContent={messageContent}
        onContentChange={onContentChange}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ComposeMessageForm;
