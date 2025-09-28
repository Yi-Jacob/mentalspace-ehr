
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/basic/dialog';
import { Send, Edit3 } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { staffService } from '@/services/staffService';
import { messageService } from '@/services/messageService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import ComposeMessageForm from './compose/ComposeMessageForm';
import ComposeMessageActions from './compose/ComposeMessageActions';
import { ConversationData } from '@/services/messageService';

interface ComposeMessageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedClientId?: string;
  conversationToEdit?: ConversationData | null;
}

const ComposeMessageModal: React.FC<ComposeMessageModalProps> = ({ 
  open, 
  onOpenChange,
  preselectedClientId,
  conversationToEdit
}) => {
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [conversationTitle, setConversationTitle] = useState('');
  const [messageCategory, setMessageCategory] = useState<'clinical' | 'administrative' | 'urgent' | 'general'>('general');
  const [messagePriority, setMessagePriority] = useState<'low' | 'normal' | 'high' | 'urgent'>('normal');
  const [messageContent, setMessageContent] = useState('');

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();

  const isEditing = !!conversationToEdit;

  // Set preselected user when modal opens
  useEffect(() => {
    if (open && preselectedClientId) {
      setSelectedUserIds([preselectedClientId]);
      setConversationTitle(''); // Reset title for single recipient
    }
  }, [open, preselectedClientId]);

  // Reset selected users when modal opens (no auto-selection of current user)
  useEffect(() => {
    if (open) {
      if (preselectedClientId) {
        setSelectedUserIds([preselectedClientId]);
      } else if (conversationToEdit) {
        // If editing, set the current participants (excluding current user)
        if (conversationToEdit.type === 'group' && conversationToEdit.participants) {
          const participantIds = conversationToEdit.participants
            .filter(p => p.user.id !== currentUser?.id)
            .map(p => p.user.id);
          setSelectedUserIds(participantIds);
        } else if (conversationToEdit.type === 'individual') {
          // For individual conversations, set the other participant
          if (conversationToEdit.client && conversationToEdit.client.id !== currentUser?.id) {
            setSelectedUserIds([conversationToEdit.client.id]);
          } else if (conversationToEdit.therapist && conversationToEdit.therapist.id !== currentUser?.id) {
            setSelectedUserIds([conversationToEdit.therapist.id]);
          }
        }
        
        // Set other conversation details
        setConversationTitle(conversationToEdit.title || '');
        setMessageCategory((conversationToEdit.category as any) || 'general');
        setMessagePriority((conversationToEdit.priority as any) || 'normal');
        setMessageContent(''); // Clear message content for editing
      } else {
        setSelectedUserIds([]); // Start with no users selected
      }
    }
  }, [open, preselectedClientId, conversationToEdit, currentUser?.id]);

  const { data: allUsers, isLoading: usersLoading, error: usersError } = useQuery({
    queryKey: ['all-users-for-compose'],
    queryFn: async () => {
      return staffService.getAllUsersForMessaging();
    },
    enabled: open, // Only fetch when modal is open
  });

  // Filter out the current user from the available recipients
  const availableUsers = allUsers?.filter(user => user.id !== currentUser?.id) || [];

  useEffect(() => {
    if (usersError) {
      console.error('Users query error:', usersError);
    }
    if (usersLoading) {
      console.log('Loading users...');
    }
    if (allUsers) {
      console.log('All users loaded:', allUsers.length, 'users');
      console.log('Available recipients (excluding current user):', availableUsers.length, 'users');
    }
  }, [allUsers, usersLoading, usersError, availableUsers.length]);

  const sendMessageMutation = useMutation({
    mutationFn: async () => {
      if (selectedUserIds.length === 0 || (!isEditing && !messageContent.trim())) {
        throw new Error('At least one recipient and message content are required');
      }

      if (isEditing) {
        // Update existing conversation
        if (conversationToEdit.type === 'group') {
          // For group conversations, update participants and other details
          const updateData: any = {};
          
          // Only update title if it's different
          if (conversationTitle !== conversationToEdit.title) {
            updateData.title = conversationTitle;
          }
          
          // Only update category if it's different
          if (messageCategory !== conversationToEdit.category) {
            updateData.category = messageCategory;
          }
          
          // Only update priority if it's different
          if (messagePriority !== conversationToEdit.priority) {
            updateData.priority = messagePriority;
          }

          // Update conversation details first
          if (Object.keys(updateData).length > 0) {
            await messageService.updateConversation(conversationToEdit.id, updateData);
          }

          // Update participants if they've changed
          const currentParticipantIds = conversationToEdit.participants
            ?.filter(p => p.user.id !== currentUser?.id)
            .map(p => p.user.id) || [];
          
          const newParticipantIds = selectedUserIds;
          
          // Check if participants have actually changed
          const participantsChanged = currentParticipantIds.length !== newParticipantIds.length ||
            currentParticipantIds.some(id => !newParticipantIds.includes(id)) ||
            newParticipantIds.some(id => !currentParticipantIds.includes(id));

          if (participantsChanged) {
            return messageService.updateGroupParticipants(conversationToEdit.id, { participantIds: newParticipantIds });
          }

          // If only details changed, return the updated conversation
          return messageService.getConversation(conversationToEdit.id);
        } else {
          // For individual conversations, update priority and category
          const updateData: any = {};
          
          if (messageCategory !== conversationToEdit.category) {
            updateData.category = messageCategory;
          }
          
          if (messagePriority !== conversationToEdit.priority) {
            updateData.priority = messagePriority;
          }

          if (Object.keys(updateData).length > 0) {
            return messageService.updateConversation(conversationToEdit.id, updateData);
          }

          // If nothing changed, return the current conversation
          return conversationToEdit;
        }
      } else {
        // Create new conversation
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
      }
    },
    onSuccess: () => {
      const action = isEditing ? 'Updated' : 'Sent';
      const messageType = isEditing ? 'conversation' : 'message';
      
      toast({
        title: `${action} ${messageType}`,
        description: `${action} ${messageType} successfully.`,
      });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      onOpenChange(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to process request. Please try again.",
        variant: "destructive",
      });
      console.error('Action error:', error);
    },
  });

  const resetForm = () => {
    if (!preselectedClientId && !conversationToEdit) {
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
            {isEditing ? (
              <>
                <Edit3 className="h-5 w-5 text-blue-600" />
                <span>Edit Conversation</span>
              </>
            ) : (
              <>
                <Send className="h-5 w-5 text-green-600" />
                <span>Quick Message</span>
              </>
            )}
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
            users={availableUsers}
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
            isEditing={isEditing}
            conversationType={conversationToEdit?.type}
          />

          <ComposeMessageActions
            onCancel={() => onOpenChange(false)}
            isLoading={sendMessageMutation.isPending}
            disabled={selectedUserIds.length === 0 || (!isEditing && !messageContent.trim())}
            submitText={isEditing ? 'Update Conversation' : 'Send Message'}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ComposeMessageModal;
