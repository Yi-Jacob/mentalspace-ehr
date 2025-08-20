
import React, { useState } from 'react';

export const useMessageManagementState = () => {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [showComposeModal, setShowComposeModal] = useState(false);

  return {
    selectedConversationId,
    setSelectedConversationId,
    showComposeModal,
    setShowComposeModal,
  };
};
