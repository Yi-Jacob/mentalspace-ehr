
import { useState } from 'react';

export const useNotesTabs = () => {
  const [activeTab, setActiveTab] = useState('all-notes');

  return {
    activeTab,
    setActiveTab,
  };
};
