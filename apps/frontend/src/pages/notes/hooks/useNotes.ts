import { useNotesTabs } from '@/pages/notes/hooks/useNotesTabs';
import { useNotesModal } from '@/pages/notes/hooks/useNotesModal';
import { useNoteCreation } from '@/pages/notes/hooks/useNoteCreation';

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
