
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, X, Plus } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { clientService } from '@/services/clientService';
import { messageService } from '@/services/messageService';
import { useToast } from '@/hooks/use-toast';

interface NewConversationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedClientId?: string;
}

const NewConversationModal: React.FC<NewConversationModalProps> = ({ 
  open, 
  onOpenChange,
  preselectedClientId 
}) => {
  const [title, setTitle] = useState('');
  const [selectedClientId, setSelectedClientId] = useState('');
  const [category, setCategory] = useState<'clinical' | 'administrative' | 'urgent' | 'general'>('general');
  const [priority, setPriority] = useState<'low' | 'normal' | 'high' | 'urgent'>('normal');

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Set preselected client when modal opens
  useEffect(() => {
    if (open && preselectedClientId) {
      setSelectedClientId(preselectedClientId);
    }
  }, [open, preselectedClientId]);

  const { data: clients, isLoading: clientsLoading, error: clientsError } = useQuery({
    queryKey: ['therapist-clients-for-conversation'],
    queryFn: async () => {
      console.log('Fetching clients for new conversation...');
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

  const createConversationMutation = useMutation({
    mutationFn: async () => {
      return messageService.createConversation({
        title: title || 'New Conversation',
        clientId: selectedClientId,
        category,
        priority,
      });
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
    if (!preselectedClientId) {
      setSelectedClientId('');
    }
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
          {/* Client Selection */}
          <div className="space-y-2">
            <Label htmlFor="client" className="text-sm font-medium">
              Client *
            </Label>
            <Select 
              value={selectedClientId} 
              onValueChange={setSelectedClientId}
              disabled={!!preselectedClientId}
            >
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
                    {clientsLoading ? 'Loading clients...' : 'No clients available'}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
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
              disabled={createConversationMutation.isPending || !selectedClientId}
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
