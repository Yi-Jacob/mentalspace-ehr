
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Send, X } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ComposeMessageForm from './compose/ComposeMessageForm';
import ComposeMessageActions from './compose/ComposeMessageActions';

interface ComposeMessageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ComposeMessageModal: React.FC<ComposeMessageModalProps> = ({ open, onOpenChange }) => {
  const [selectedClientId, setSelectedClientId] = useState('');
  const [messageCategory, setMessageCategory] = useState<'clinical' | 'administrative' | 'urgent' | 'general'>('general');
  const [messagePriority, setMessagePriority] = useState<'low' | 'normal' | 'high' | 'urgent'>('normal');
  const [messageContent, setMessageContent] = useState('');

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: clients } = useQuery({
    queryKey: ['therapist-clients-for-compose'],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');

      const { data: userRecord } = await supabase
        .from('users')
        .select('id')
        .eq('auth_user_id', userData.user.id)
        .single();
      
      if (!userRecord) throw new Error('User record not found');

      const { data, error } = await supabase
        .from('clients')
        .select('id, first_name, last_name, email')
        .eq('assigned_clinician_id', userRecord.id)
        .eq('is_active', true)
        .order('first_name');
      
      if (error) throw error;
      return data;
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: async () => {
      if (!selectedClientId || !messageContent.trim()) {
        throw new Error('Client and message content are required');
      }

      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');

      const { data: userRecord } = await supabase
        .from('users')
        .select('id')
        .eq('auth_user_id', userData.user.id)
        .single();
      
      if (!userRecord) throw new Error('User record not found');

      // Find or create conversation
      let { data: conversation } = await supabase
        .from('conversations')
        .select('id')
        .eq('client_id', selectedClientId)
        .eq('therapist_id', userRecord.id)
        .single();

      if (!conversation) {
        const { data: newConversation, error: conversationError } = await supabase
          .from('conversations')
          .insert({
            client_id: selectedClientId,
            therapist_id: userRecord.id,
            category: messageCategory,
            priority: messagePriority,
            created_by: userRecord.id,
            title: 'Quick Message'
          })
          .select('id')
          .single();

        if (conversationError) throw conversationError;
        conversation = newConversation;
      }

      // Send message
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversation.id,
          sender_id: userRecord.id,
          content: messageContent.trim(),
          priority: messagePriority,
        })
        .select()
        .single();

      if (error) throw error;

      // Update conversation's last_message_at
      await supabase
        .from('conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', conversation.id);

      return data;
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
    setSelectedClientId('');
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
