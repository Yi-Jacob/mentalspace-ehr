
import React from 'react';
import ClientSelectionField from './ClientSelectionField';
import MessageCategoryField from './MessageCategoryField';
import MessagePriorityField from './MessagePriorityField';
import MessageContentField from './MessageContentField';

interface Client {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface ComposeMessageFormProps {
  clients: Client[];
  selectedClientId: string;
  onClientChange: (value: string) => void;
  messageCategory: 'clinical' | 'administrative' | 'urgent' | 'general';
  onCategoryChange: (value: 'clinical' | 'administrative' | 'urgent' | 'general') => void;
  messagePriority: 'low' | 'normal' | 'high' | 'urgent';
  onPriorityChange: (value: 'low' | 'normal' | 'high' | 'urgent') => void;
  messageContent: string;
  onContentChange: (value: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

const ComposeMessageForm: React.FC<ComposeMessageFormProps> = ({
  clients,
  selectedClientId,
  onClientChange,
  messageCategory,
  onCategoryChange,
  messagePriority,
  onPriorityChange,
  messageContent,
  onContentChange,
  isLoading,
  disabled = false,
}) => {
  return (
    <div className="space-y-6">
      <ClientSelectionField
        clients={clients}
        selectedClientId={selectedClientId}
        onClientChange={onClientChange}
        disabled={disabled}
      />

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
