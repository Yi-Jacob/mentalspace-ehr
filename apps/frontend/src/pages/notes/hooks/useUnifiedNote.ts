import { useState, useEffect, useCallback } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useEnhancedErrorHandler } from '@/hooks/useEnhancedErrorHandler';
import { noteService } from '@/services/noteService';
import { Note } from '@/types/noteType';

// Generic form data type that can be extended for specific note types
export interface BaseFormData {
  clientId: string;
  [key: string]: any;
}

// Note type configurations
export interface NoteTypeConfig {
  type: string;
  title: string;
  sections: any[];
  initialFormData: BaseFormData;
  validationRules?: (formData: any) => boolean;
  sectionProgressRules?: (formData: any, sectionId: string) => {
    isComplete: boolean;
    hasRequiredFields: boolean;
    requiredFieldsComplete: boolean;
  };
}

// Unified hook for ALL note types
export const useUnifiedNote = <T extends BaseFormData>(
  noteId: string | undefined,
  noteTypeConfig: NoteTypeConfig
) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | undefined>();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [formData, setFormData] = useState<T>(noteTypeConfig.initialFormData as T);

  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, loading: authLoading } = useAuth();

  const { executeWithRetry, handleAPIError } = useEnhancedErrorHandler({
    component: 'UnifiedNote',
    retryConfig: {
      maxRetries: 2,
      baseDelay: 1000,
      timeoutMs: 15000
    }
  });

  // Fetch note data
  const { data: note, isLoading } = useQuery({
    queryKey: ['note', noteId],
    queryFn: async () => {
      if (!noteId) return null;
      return await noteService.getNote(noteId);
    },
    enabled: !!noteId,
  });

  // Load form data from note content
  useEffect(() => {
    if (note?.content && typeof note.content === 'object') {
      const savedData = note.content as any;
      setFormData(prev => ({
        ...prev,
        clientId: note.clientId || '',
        ...savedData,
      }));
    }
  }, [note]);

  // Auto-save functionality
  useEffect(() => {
    const interval = setInterval(() => {
      if (noteId && !note?.status?.includes('signed') && hasUnsavedChanges) {
        saveNoteMutation.mutate({ data: formData, isDraft: true });
        setLastSaved(new Date());
        setHasUnsavedChanges(false);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [formData, noteId, note?.status, hasUnsavedChanges]);

  // Save mutation
  const saveNoteMutation = useMutation({
    mutationFn: async ({ data, isDraft }: { data: Partial<T>; isDraft: boolean }) => {
      if (!noteId) throw new Error('No note ID');
      
      if (authLoading) {
        throw new Error('Authentication is still loading, please wait');
      }
      
      if (!user) {
        throw new Error('User not authenticated - please log in again');
      }
      
      return await executeWithRetry(async () => {
        const finalData = { ...formData, ...data };
        
        if (!isDraft) {
          // If finalizing, first save the content, then sign the note
          const updateData = {
            content: finalData,
          };
          
          await noteService.saveDraft(noteId, updateData);
          const signedNote = await noteService.signNote(noteId);
          
          return { isDraft: false, isFinalized: true, note: signedNote };
        } else {
          // Regular save (draft or content update)
          const updateData = {
            content: finalData,
          };
          
          const updatedNote = await noteService.saveDraft(noteId, updateData);
          return { isDraft, isFinalized: false, note: updatedNote };
        }
      }, 'Save Note');
    },
    onSuccess: ({ isDraft, isFinalized }) => {
      queryClient.invalidateQueries({ queryKey: ['note', noteId] });
      
      if (isDraft) {
        toast({
          title: 'Draft Saved',
          description: `Your ${noteTypeConfig.title} has been saved as a draft.`,
        });
      } else if (isFinalized) {
        toast({
          title: 'Note Completed',
          description: `Your ${noteTypeConfig.title} has been finalized and signed.`,
        });
      }
      
      // Navigate back to notes list
      if (!isDraft || isFinalized) {
        setTimeout(() => {
          navigate('/notes/all-notes');
        }, 2000);
      }
    },
    onError: (error) => {
      console.error('Error saving note:', error);
      handleAPIError(error, `/notes/${noteId}/save-draft`, 'PATCH');
    },
  });

  const updateFormData = useCallback((updates: Partial<T>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    setHasUnsavedChanges(true);
  }, []);

  // Section navigation
  const handleNext = () => {
    if (currentSection < noteTypeConfig.sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleSectionClick = (index: number) => {
    setCurrentSection(index);
  };

  const handleSave = async (isDraft: boolean) => {
    await saveNoteMutation.mutateAsync({ data: formData, isDraft });
    setLastSaved(new Date());
    setHasUnsavedChanges(false);
  };

  const handleSaveDraft = () => {
    saveNoteMutation.mutate({ data: formData, isDraft: true });
    setLastSaved(new Date());
    setHasUnsavedChanges(false);
  };

  // Form validation
  const validateForm = () => {
    if (noteTypeConfig.validationRules) {
      return noteTypeConfig.validationRules(formData);
    }
    
    // Default validation - check for required fields
    const requiredFields = ['clientId'];
    return requiredFields.every(field => {
      const value = formData[field as keyof T];
      return value !== undefined && value !== '';
    });
  };

  // Section progress calculation
  const getSectionProgress = () => {
    return noteTypeConfig.sections.map((section, index) => {
      if (noteTypeConfig.sectionProgressRules) {
        const progress = noteTypeConfig.sectionProgressRules(formData, section.id);
        return {
          id: section.id,
          title: section.title,
          ...progress
        };
      }

      // Default progress logic
      let isComplete = false;
      let hasRequiredFields = true;
      let requiredFieldsComplete = true;

      switch (section.id) {
        case 'finalize':
          isComplete = !!(formData as any).signature;
          requiredFieldsComplete = isComplete;
          break;
        default:
          hasRequiredFields = false;
      }

      return {
        id: section.id,
        title: section.title,
        isComplete,
        hasRequiredFields,
        requiredFieldsComplete
      };
    });
  };

  return {
    formData,
    updateFormData,
    currentSection,
    setCurrentSection,
    lastSaved,
    hasUnsavedChanges,
    note,
    isLoading,
    saveNoteMutation,
    getSectionProgress,
    handleSave,
    handleNext,
    handlePrevious,
    handleSectionClick,
    handleSaveDraft,
    validateForm,
    noteTypeConfig,
  };
};
