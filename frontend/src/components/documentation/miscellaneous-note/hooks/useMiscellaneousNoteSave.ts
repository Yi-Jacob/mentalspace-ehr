
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { MiscellaneousNoteFormData } from '../types/MiscellaneousNoteFormData';

export const useMiscellaneousNoteSave = (noteId?: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSave = async (
    formData: MiscellaneousNoteFormData,
    isDraft: boolean,
    validateForm: () => boolean
  ) => {
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
        status: (isDraft ? 'draft' : 'signed') as 'draft' | 'signed',
        ...(isDraft ? {} : {
          signed_at: new Date().toISOString(),
          signed_by: formData.signature
        })
      };

      const { error } = await supabase
        .from('clinical_notes')
        .update(updateData)
        .eq('id', noteId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Miscellaneous note ${isDraft ? 'saved as draft' : 'finalized'} successfully.`,
      });

      if (!isDraft) {
        navigate('/documentation');
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
