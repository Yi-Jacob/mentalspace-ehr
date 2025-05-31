
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send, X, Users } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ComposeMessageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ComposeMessageModal: React.FC<ComposeMessageModalProps> = ({ open, onOpenChange }) => {
  const [recipientId, setRecipientId] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users } = useQuery({
    queryKey: ['users-for-messaging'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('id, first_name, last_name, email')
        .order('first_name');
      
      if (error) throw error;
      return data;
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');

      const { data: userRecord } = await supabase
        .from('users')
        .select('id')
        .eq('auth_user_id', userData.user.id)
        .single();
      
      if (!userRecord) throw new Error('User record not found');

      // Create a new conversation
      const { data: conversation, error: conversationError } = await supabase
        .from('conversations' as any)
        .insert({
          title: subject || 'Quick Message',
          created_by: userRecord.id,
        })
        .select()
        .single();

      if (conversationError) throw conversationError;

      // Add participants
      const { error: participantError } = await supabase
        .from('conversation_participants' as any)
        .insert([
          { conversation_id: conversation.id, user_id: userRecord.id },
          { conversation_id: conversation.id, user_id: recipientId },
        ]);

      if (participantError) throw participantError;

      // Send the message
      const { data: messageData, error: messageError } = await supabase
        .from('messages' as any)
        .insert({
          conversation_id: conversation.id,
          sender_id: userRecord.id,
          content: message,
        })
        .select()
        .single();

      if (messageError) throw messageError;
      return messageData;
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
    setRecipientId('');
    setSubject('');
    setMessage('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientId || !message.trim()) {
      toast({
        title: "Validation Error",
        description: "Please select a recipient and enter a message.",
        variant: "destructive",
      });
      return;
    }
    sendMessageMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-xl">
            <Send className="h-5 w-5 text-green-600" />
            <span>Compose Message</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Recipient */}
          <div className="space-y-2">
            <Label htmlFor="recipient" className="text-sm font-medium">
              Recipient *
            </Label>
            <Select value={recipientId} onValueChange={setRecipientId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a recipient" />
              </SelectTrigger>
              <SelectContent>
                {users?.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>{user.first_name} {user.last_name}</span>
                      <span className="text-sm text-gray-500">({user.email})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject" className="text-sm font-medium">
              Subject
            </Label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter message subject (optional)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm font-medium">
              Message *
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              rows={6}
              className="resize-none"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={sendMessageMutation.isPending}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={sendMessageMutation.isPending}
              className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700"
            >
              <Send className="h-4 w-4 mr-2" />
              {sendMessageMutation.isPending ? 'Sending...' : 'Send Message'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ComposeMessageModal;
