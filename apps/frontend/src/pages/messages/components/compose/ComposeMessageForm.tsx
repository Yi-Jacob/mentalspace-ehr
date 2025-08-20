
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
  isEditing?: boolean;
  conversationType?: 'individual' | 'group';
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
  isEditing = false,
  conversationType,
}) => {
  return (
    <div className="space-y-6">
      {/* Show conversation type when editing */}
      {isEditing && conversationType && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-sm text-blue-800">
            <span className="font-medium">Conversation Type:</span> {conversationType === 'group' ? 'Group Chat' : 'Individual Chat'}
          </div>
        </div>
      )}

      <UserSelectionField
        users={users}
        selectedUserIds={selectedUserIds}
        onUserChange={onUserChange}
        disabled={disabled}
        isEditing={isEditing}
        conversationType={conversationType}
      />

      {/* Conversation Title Field - Show for group conversations or when editing */}
      {(showTitleField || (isEditing && conversationType === 'group')) && (
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

      {/* Only show message content field when not editing */}
      {!isEditing && (
        <MessageContentField
          messageContent={messageContent}
          onContentChange={onContentChange}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default ComposeMessageForm;
