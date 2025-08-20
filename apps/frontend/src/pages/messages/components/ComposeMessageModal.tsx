
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/basic/dialog';
import { Send } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { staffService } from '@/services/staffService';
import { messageService } from '@/services/messageService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import ComposeMessageForm from './compose/ComposeMessageForm';
import ComposeMessageActions from './compose/ComposeMessageActions';

interface ComposeMessageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedClientId?: string;
}

const ComposeMessageModal: React.FC<ComposeMessageModalProps> = ({ 
  open, 
  onOpenChange,
  preselectedClientId 
}) => {
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [conversationTitle, setConversationTitle] = useState('');
  const [messageCategory, setMessageCategory] = useState<'clinical' | 'administrative' | 'urgent' | 'general'>('general');
  const [messagePriority, setMessagePriority] = useState<'low' | 'normal' | 'high' | 'urgent'>('normal');
  const [messageContent, setMessageContent] = useState('');

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();

  // Set preselected user when modal opens
  useEffect(() => {
    if (open && preselectedClientId) {
      setSelectedUserIds([preselectedClientId]);
      setConversationTitle(''); // Reset title for single recipient
    }
  }, [open, preselectedClientId]);

  useEffect(() => {
    console.log('currentUser.id', currentUser?.id)
    if (open && currentUser?.id) {
      setSelectedUserIds(prev => {
        if (preselectedClientId) {
          // If there's a preselected client, add current user to the list
          return prev.includes(currentUser.id) ? prev : [...prev, currentUser.id];
        } else {
          // If no preselected client, just select current user
          return [currentUser.id];
        }
      });
    }
  }, [open, currentUser?.id, preselectedClientId]);

  const { data: users, isLoading: usersLoading, error: usersError } = useQuery({
    queryKey: ['all-users-for-compose'],
    queryFn: async () => {
      console.log('Fetching all users for compose message...');
      return staffService.getAllUsers();
    },
    enabled: open, // Only fetch when modal is open
  });

  useEffect(() => {
    if (usersError) {
      console.error('Users query error:', usersError);
    }
    if (usersLoading) {
      console.log('Loading users...');
    }
    if (users) {
      console.log('Users loaded:', users.length, 'users');
    }
  }, [users, usersLoading, usersError]);

  const sendMessageMutation = useMutation({
    mutationFn: async () => {
      if (selectedUserIds.length === 0 || !messageContent.trim()) {
        throw new Error('At least one recipient and message content are required');
      }

      if (selectedUserIds.length === 1) {
        // Single recipient - use quick message
        return messageService.sendQuickMessage({
          recipientId: selectedUserIds[0],
          content: messageContent.trim(),
          category: messageCategory,
          priority: messagePriority,
        });
      } else {
        // Multiple recipients - create group conversation
        const title = conversationTitle.trim() || `Group Message - ${new Date().toLocaleDateString()}`;
        return messageService.createConversationWithMessage({
          title,
          participantIds: selectedUserIds,
          category: messageCategory,
          priority: messagePriority,
          initialMessage: messageContent.trim(),
          type: 'group',
        });
      }
    },
    onSuccess: () => {
      const recipientCount = selectedUserIds.length;
      const messageType = recipientCount === 1 ? 'Message' : 'Group message';
      
      toast({
        title: `${messageType} Sent`,
        description: `Your ${messageType.toLowerCase()} has been sent successfully to ${recipientCount} recipient${recipientCount > 1 ? 's' : ''}.`,
      });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      onOpenChange(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      console.error('Send message error:', error);
    },
  });

  const resetForm = () => {
    if (!preselectedClientId) {
      setSelectedUserIds([]);
    }
    setConversationTitle('');
    setMessageCategory('general');
    setMessagePriority('normal');
    setMessageContent('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessageMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-xl">
            <Send className="h-5 w-5 text-green-600" />
            <span>Quick Message</span>
          </DialogTitle>
        </DialogHeader>

        {usersLoading && (
          <div className="text-center py-4">
            <p className="text-gray-500">Loading users...</p>
          </div>
        )}

        {usersError && (
          <div className="text-center py-4">
            <p className="text-red-500">Error loading users: {usersError.message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <ComposeMessageForm
            users={users || []}
            selectedUserIds={selectedUserIds}
            onUserChange={setSelectedUserIds}
            conversationTitle={conversationTitle}
            onTitleChange={setConversationTitle}
            messageCategory={messageCategory}
            onCategoryChange={setMessageCategory}
            messagePriority={messagePriority}
            onPriorityChange={setMessagePriority}
            messageContent={messageContent}
            onContentChange={setMessageContent}
            isLoading={sendMessageMutation.isPending}
            disabled={!!preselectedClientId}
            showTitleField={selectedUserIds.length > 1}
          />

          <ComposeMessageActions
            onCancel={() => onOpenChange(false)}
            isLoading={sendMessageMutation.isPending}
            disabled={selectedUserIds.length === 0 || !messageContent.trim()}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ComposeMessageModal;
