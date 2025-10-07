
import { useState } from 'react';

export const useNotesModal = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedNoteType, setSelectedNoteType] = useState<string | null>(null);

  const handleCreateNote = (noteType: string) => {
    setSelectedNoteType(noteType);
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
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
