
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface CreateNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  noteType: string | null;
}

const CreateNoteModal = ({ isOpen, onClose, noteType }: CreateNoteModalProps) => {
  const [title, setTitle] = useState('');
  const [selectedClientId, setSelectedClientId] = useState('');
  const [description, setDescription] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: clients } = useQuery({
    queryKey: ['clients-for-notes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('id, first_name, last_name')
        .eq('is_active', true)
        .order('last_name');
      if (error) throw error;
      return data;
    },
    enabled: isOpen,
  });

  const createNoteMutation = useMutation({
    mutationFn: async (noteData: any) => {
      const { data, error } = await supabase
        .from('clinical_notes')
        .insert([noteData])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: 'Note created successfully',
        description: 'Your clinical note has been created and saved as a draft.',
      });
      queryClient.invalidateQueries({ queryKey: ['clinical-notes'] });
      onClose();
      navigate(`/documentation/note/${data.id}/edit`);
    },
    onError: (error) => {
      toast({
        title: 'Error creating note',
        description: 'There was an error creating your note. Please try again.',
        variant: 'destructive',
      });
      console.error('Error creating note:', error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !selectedClientId || !noteType) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const noteData = {
      title,
      client_id: selectedClientId,
      note_type: noteType,
      provider_id: user?.id,
      content: { description },
      status: 'draft',
    };

    createNoteMutation.mutate(noteData);
  };

  const formatNoteType = (type: string) => {
    return type?.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const resetForm = () => {
    setTitle('');
    setSelectedClientId('');
    setDescription('');
  };

  React.useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            Create New {noteType ? formatNoteType(noteType) : 'Note'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="client">Client *</Label>
            <Select value={selectedClientId} onValueChange={setSelectedClientId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a client" />
              </SelectTrigger>
              <SelectContent>
                {clients?.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.last_name}, {client.first_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={`Enter ${noteType ? formatNoteType(noteType).toLowerCase() : 'note'} title`}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Initial Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a brief description or initial notes..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createNoteMutation.isPending}
            >
              {createNoteMutation.isPending ? 'Creating...' : 'Create Note'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNoteModal;
