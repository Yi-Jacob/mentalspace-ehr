
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/basic/dialog';
import { Button } from '@/components/basic/button';
import { Input } from '@/components/basic/input';
import { Label } from '@/components/basic/label';
import { Textarea } from '@/components/basic/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/basic/select';
import { useQuery } from '@tanstack/react-query';
import { clientService } from '@/services/clientService';
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
      return clientService.getClientsForNotes();
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

    // Handle all structured notes (including miscellaneous_note) with special routing
    const structuredNotes = ['intake', 'progress_note', 'treatment_plan', 'cancellation_note', 'contact_note', 'consultation_note', 'miscellaneous_note'];
    
    if (structuredNotes.includes(noteType) && createNoteMutation) {
      console.log('Creating structured note type:', noteType, 'for client:', selectedClientId);
      createNoteMutation.mutate({ clientId: selectedClientId, noteType });
      return;
    }

    // Handle other note types that need title
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

  // Close modal on successful creation
  React.useEffect(() => {
    if (createNoteMutation?.isSuccess) {
      onClose();
    }
  }, [createNoteMutation?.isSuccess, onClose]);

  // Set default title for structured notes
  React.useEffect(() => {
    if (noteType === 'intake') {
      setTitle('New Intake Assessment');
    } else if (noteType === 'progress_note') {
      setTitle('New Progress Note');
    } else if (noteType === 'treatment_plan') {
      setTitle('New Treatment Plan');
    } else if (noteType === 'cancellation_note') {
      setTitle('New Cancellation Note');
    } else if (noteType === 'contact_note') {
      setTitle('New Contact Note');
    } else if (noteType === 'consultation_note') {
      setTitle('New Consultation Note');
    } else if (noteType === 'miscellaneous_note') {
      setTitle('New Miscellaneous Note');
    } else {
      setTitle('');
    }
  }, [noteType]);

  const isStructuredNote = ['intake', 'progress_note', 'treatment_plan', 'cancellation_note', 'contact_note', 'consultation_note', 'miscellaneous_note'].includes(noteType || '');
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
                    {client.lastName}, {client.firstName}
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
