
import { useDocumentationTabs } from '@/hooks/useDocumentationTabs';
import { useDocumentationModal } from '@/hooks/useDocumentationModal';
import { useNoteCreation } from '@/hooks/useNoteCreation';

export const useDocumentation = () => {
  const { activeTab, setActiveTab } = useDocumentationTabs();
  const { 
    showCreateModal, 
    selectedNoteType, 
    handleCreateNote, 
    handleCloseModal 
  } = useDocumentationModal();
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
