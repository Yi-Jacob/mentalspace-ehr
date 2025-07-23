import { useNotesTabs } from '@/hooks/useNotesTabs';
import { useNotesModal } from '@/hooks/useNotesModal';
import { useNoteCreation } from '@/hooks/useNoteCreation';

export const useNotes = () => {
  const { activeTab, setActiveTab } = useNotesTabs();
  const { 
    showCreateModal, 
    selectedNoteType, 
    handleCreateNote, 
    handleCloseModal 
  } = useNotesModal();
  const { createNoteMutation } = useNoteCreation();

  return {
    activeTab,
    setActiveTab,
    showCreateModal,
    selectedNoteType,
    createNoteMutation,
    handleCreateNote,
    handleCloseModal,
  };
};
