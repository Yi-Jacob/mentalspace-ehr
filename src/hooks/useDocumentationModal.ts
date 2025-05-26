
import { useState } from 'react';

export const useDocumentationModal = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedNoteType, setSelectedNoteType] = useState<string | null>(null);

  const handleCreateNote = (noteType: string) => {
    console.log('=== HANDLE CREATE NOTE CALLED ===');
    console.log('Note type:', noteType);
    setSelectedNoteType(noteType);
    setShowCreateModal(true);
    console.log('Modal state set to open');
  };

  const handleCloseModal = () => {
    console.log('=== CLOSING MODAL ===');
    setShowCreateModal(false);
    setSelectedNoteType(null);
  };

  return {
    showCreateModal,
    selectedNoteType,
    handleCreateNote,
    handleCloseModal,
  };
};
