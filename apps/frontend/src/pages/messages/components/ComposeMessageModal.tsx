
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/basic/dialog';
import { Send } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { clientService } from '@/services/clientService';
import { messageService } from '@/services/messageService';
import { useToast } from '@/hooks/use-toast';
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
  const [selectedClientId, setSelectedClientId] = useState('');
  const [messageCategory, setMessageCategory] = useState<'clinical' | 'administrative' | 'urgent' | 'general'>('general');
  const [messagePriority, setMessagePriority] = useState<'low' | 'normal' | 'high' | 'urgent'>('normal');
  const [messageContent, setMessageContent] = useState('');

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Set preselected client when modal opens
  useEffect(() => {
    if (open && preselectedClientId) {
      setSelectedClientId(preselectedClientId);
    }
  }, [open, preselectedClientId]);

  const { data: clients, isLoading: clientsLoading, error: clientsError } = useQuery({
    queryKey: ['therapist-clients-for-compose'],
    queryFn: async () => {
      console.log('Fetching clients for compose message...');
      return clientService.getClientsForNotes();
    },
    enabled: open, // Only fetch when modal is open
  });

  useEffect(() => {
    if (clientsError) {
      console.error('Clients query error:', clientsError);
    }
    if (clientsLoading) {
      console.log('Loading clients...');
    }
    if (clients) {
      console.log('Clients loaded:', clients.length, 'clients');
    }
  }, [clients, clientsLoading, clientsError]);

  const sendMessageMutation = useMutation({
    mutationFn: async () => {
      if (!selectedClientId || !messageContent.trim()) {
        throw new Error('Client and message content are required');
      }

      return messageService.sendQuickMessage({
        clientId: selectedClientId,
        content: messageContent.trim(),
        category: messageCategory,
        priority: messagePriority,
      });
    },
    onSuccess: () => {
      toast({
        title: "Message Sent",
        description: "Your message has been sent successfully.",
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
      setSelectedClientId('');
    }
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
            <span>Quick Message to Client</span>
          </DialogTitle>
        </DialogHeader>

        {clientsLoading && (
          <div className="text-center py-4">
            <p className="text-gray-500">Loading clients...</p>
          </div>
        )}

        {clientsError && (
          <div className="text-center py-4">
            <p className="text-red-500">Error loading clients: {clientsError.message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <ComposeMessageForm
            clients={clients || []}
            selectedClientId={selectedClientId}
            onClientChange={setSelectedClientId}
            messageCategory={messageCategory}
            onCategoryChange={setMessageCategory}
            messagePriority={messagePriority}
            onPriorityChange={setMessagePriority}
            messageContent={messageContent}
            onContentChange={setMessageContent}
            isLoading={sendMessageMutation.isPending}
            disabled={!!preselectedClientId}
          />

          <ComposeMessageActions
            onCancel={() => onOpenChange(false)}
            isLoading={sendMessageMutation.isPending}
            disabled={!selectedClientId || !messageContent.trim()}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ComposeMessageModal;
