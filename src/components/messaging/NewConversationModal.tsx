
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, X, Plus } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface NewConversationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NewConversationModal: React.FC<NewConversationModalProps> = ({ open, onOpenChange }) => {
  const [title, setTitle] = useState('');
  const [selectedClientId, setSelectedClientId] = useState('');
  const [category, setCategory] = useState<'clinical' | 'administrative' | 'urgent' | 'general'>('general');
  const [priority, setPriority] = useState<'low' | 'normal' | 'high' | 'urgent'>('normal');

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: clients, isLoading: clientsLoading } = useQuery({
    queryKey: ['therapist-clients-for-conversation'],
    queryFn: async () => {
      console.log('Fetching clients for conversation...');
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
      
      if (error) {
        console.error('Error fetching clients:', error);
        throw error;
      }
      
      console.log('Fetched clients:', data);
      return data;
    },
  });

  const createConversationMutation = useMutation({
    mutationFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');

      const { data: userRecord } = await supabase
        .from('users')
        .select('id')
        .eq('auth_user_id', userData.user.id)
        .single();
      
      if (!userRecord) throw new Error('User record not found');

      // Check if conversation already exists
      const { data: existingConversation } = await supabase
        .from('conversations')
        .select('id')
        .eq('client_id', selectedClientId)
        .eq('therapist_id', userRecord.id)
        .maybeSingle();

      if (existingConversation) {
        throw new Error('A conversation with this client already exists');
      }

      // Create the conversation
      const { data: conversation, error: conversationError } = await supabase
        .from('conversations')
        .insert({
          title: title || 'New Conversation',
          client_id: selectedClientId,
          therapist_id: userRecord.id,
          category,
          priority,
          created_by: userRecord.id,
        })
        .select()
        .single();

      if (conversationError) throw conversationError;
      return conversation;
    },
    onSuccess: () => {
      toast({
        title: "Conversation Created",
        description: "The conversation has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      onOpenChange(false);
      resetForm();
    },
    onError: (error: any) => {
      const errorMessage = error.message === 'A conversation with this client already exists' 
        ? error.message 
        : "Failed to create conversation. Please try again.";
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      console.error('Create conversation error:', error);
    },
  });

  const resetForm = () => {
    setTitle('');
    setSelectedClientId('');
    setCategory('general');
    setPriority('normal');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientId) {
      toast({
        title: "Validation Error",
        description: "Please select a client.",
        variant: "destructive",
      });
      return;
    }
    createConversationMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-xl">
            <Users className="h-5 w-5 text-blue-600" />
            <span>New Client Conversation</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client Selection */}
          <div className="space-y-2">
            <Label htmlFor="client" className="text-sm font-medium">
              Client *
            </Label>
            {clientsLoading ? (
              <div className="text-sm text-gray-500">Loading clients...</div>
            ) : (
              <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent className="z-[60] bg-white border border-gray-200 shadow-lg max-h-60">
                  {clients && clients.length > 0 ? (
                    clients.map((client) => (
                      <SelectItem key={client.id} value={client.id} className="cursor-pointer hover:bg-gray-100">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4" />
                          <span>{client.first_name} {client.last_name}</span>
                          {client.email && <span className="text-sm text-gray-500">({client.email})</span>}
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-clients" disabled>
                      No clients available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Conversation Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter conversation title (optional)"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium">
              Category
            </Label>
            <Select value={category} onValueChange={(value: any) => setCategory(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="z-[60] bg-white border border-gray-200 shadow-lg">
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="clinical">Clinical</SelectItem>
                <SelectItem value="administrative">Administrative</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label htmlFor="priority" className="text-sm font-medium">
              Priority
            </Label>
            <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent className="z-[60] bg-white border border-gray-200 shadow-lg">
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createConversationMutation.isPending}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createConversationMutation.isPending}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              {createConversationMutation.isPending ? 'Creating...' : 'Create Conversation'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewConversationModal;
