
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { noteService } from '@/services/noteService';
import { MiscellaneousNoteFormData } from '@/types/noteType';

export const useMiscellaneousNoteSave = (noteId?: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSave = async (
    formData: MiscellaneousNoteFormData,
    isDraft: boolean,
    validateForm: () => boolean
  ) => {
    if (!noteId) {
      toast({
        title: 'Error',
        description: 'No note ID provided.',
        variant: 'destructive',
      });
      return;
    }

    if (!isDraft && !validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    if (!isDraft && !formData.signature) {
      toast({
        title: 'Signature Required',
        description: 'Please provide your signature to finalize the note.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const updateData = {
        content: formData as any,
        sign: !isDraft, // Sign if not a draft
      };

      await noteService.updateNote(noteId, updateData);

      toast({
        title: 'Success',
        description: `Miscellaneous note ${isDraft ? 'saved as draft' : 'finalized'} successfully.`,
      });

      if (!isDraft) {
        navigate('/notes');
      }
    } catch (error) {
      console.error('Error saving note:', error);
      toast({
        title: 'Error',
        description: 'Failed to save note. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleSave,
  };
};
