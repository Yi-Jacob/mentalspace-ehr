
import { useState } from 'react';

export const useDocumentationTabs = () => {
  const [activeTab, setActiveTab] = useState('all-notes');

  return {
    activeTab,
    setActiveTab,
  };
};
