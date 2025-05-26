
import React from 'react';
import EnhancedErrorBoundary from '@/components/EnhancedErrorBoundary';
import DocumentationTabs from '@/components/documentation/DocumentationTabs';
import CreateNoteModal from '@/components/documentation/CreateNoteModal';
import { useDocumentation } from '@/hooks/useDocumentation';

const Documentation = () => {
  const {
    activeTab,
    setActiveTab,
    showCreateModal,
    selectedNoteType,
    createNoteMutation,
    handleCreateNote,
    handleCloseModal,
  } = useDocumentation();

  return (
    <EnhancedErrorBoundary 
      componentName="Documentation"
      showErrorDetails={process.env.NODE_ENV === 'development'}
    >
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Clinical Documentation</h1>
            <p className="text-gray-600">Create and manage clinical notes, assessments, and documentation</p>
          </div>
        </div>

        <DocumentationTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onCreateNote={handleCreateNote}
          isCreatingIntake={createNoteMutation.isPending}
        />

        <CreateNoteModal 
          isOpen={showCreateModal}
          onClose={handleCloseModal}
          noteType={selectedNoteType}
          createNoteMutation={createNoteMutation}
        />
      </div>
    </EnhancedErrorBoundary>
  );
};

export default Documentation;
