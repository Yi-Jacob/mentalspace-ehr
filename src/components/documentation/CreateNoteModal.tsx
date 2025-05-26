
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CreateNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  noteType: string | null;
  createNoteMutation?: any;
}

const CreateNoteModal = ({ isOpen, onClose, noteType, createNoteMutation }: CreateNoteModalProps) => {
  const [title, setTitle] = useState('');
  const [selectedClientId, setSelectedClientId] = useState('');
  const [description, setDescription] = useState('');
  const { toast } = useToast();

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('=== MODAL SUBMIT ===');
    console.log('Selected client ID:', selectedClientId);
    console.log('Note type:', noteType);
    console.log('Create mutation available:', !!createNoteMutation);
    
    if (!selectedClientId || !noteType) {
      toast({
        title: 'Missing information',
        description: 'Please select a client.',
        variant: 'destructive',
      });
      return;
    }

    // Handle structured notes (intake, progress_note, treatment_plan) with special routing
    if ((noteType === 'intake' || noteType === 'progress_note' || noteType === 'treatment_plan') && createNoteMutation) {
      console.log('Creating structured note type:', noteType, 'for client:', selectedClientId);
      createNoteMutation.mutate({ clientId: selectedClientId, noteType });
      return;
    }

    // Handle other note types
    if (!title) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    console.log('Creating unstructured note type:', noteType, 'for client:', selectedClientId);
    createNoteMutation?.mutate({ clientId: selectedClientId, noteType });
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

  // Set default title for structured notes
  React.useEffect(() => {
    if (noteType === 'intake') {
      setTitle('New Intake Assessment');
    } else if (noteType === 'progress_note') {
      setTitle('New Progress Note');
    } else if (noteType === 'treatment_plan') {
      setTitle('New Treatment Plan');
    } else {
      setTitle('');
    }
  }, [noteType]);

  const isStructuredNote = noteType === 'intake' || noteType === 'progress_note' || noteType === 'treatment_plan';
  const isLoading = createNoteMutation?.isPending;

  console.log('Modal render - isOpen:', isOpen, 'noteType:', noteType, 'isLoading:', isLoading);

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

          {!isStructuredNote && (
            <>
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
            </>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Note'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNoteModal;
