import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/basic/button';
import { ArrowLeft, Save, Bot, LucideIcon } from 'lucide-react';
import ErrorBoundary from '@/components/ErrorBoundary';
import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import SectionNavigation from '../SectionNavigation';
import CurrentSectionCard from '../CurrentSectionCard';
import AINoteFillModal from '@/components/notes/AINoteFillModal';

interface Section {
  id: string;
  title: string;
  component: React.ComponentType<any>;
}

interface NoteEditLayoutProps<T = any> {
  // Page configuration
  title: string;
  description: string;
  icon: LucideIcon;
  
  // Data and state
  sections: Section[];
  currentSection: number;
  formData: T;
  updateFormData: (updates: Partial<T>) => void;
  note: any;
  isLoading: boolean;
  saveNoteMutation: any;
  
  // Event handlers
  onSave: (isDraft: boolean) => Promise<void>;
  onNext: () => void;
  onPrevious: () => void;
  onSectionClick: (index: number) => void;
  onSaveDraft: () => void;
  
  // Optional customization
  customHeaderAction?: React.ReactNode;
}

const SectionStyleNoteEditLayout = <T extends Record<string, any>>({
  title,
  description,
  icon: Icon,
  sections,
  currentSection,
  formData,
  updateFormData,
  note,
  isLoading,
  saveNoteMutation,
  onSave,
  onNext,
  onPrevious,
  onSectionClick,
  onSaveDraft,
  customHeaderAction,
}: NoteEditLayoutProps<T>) => {
  const navigate = useNavigate();
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  if (isLoading) {
    return (
      <PageLayout>
        <LoadingSpinner message={`Loading ${title.toLowerCase()}...`} />
      </PageLayout>
    );
  }

  if (!note) {
    return (
      <PageLayout>
        <EmptyState
          title="Note not found"
          description={`The ${title.toLowerCase()} you're looking for doesn't exist or has been removed.`}
          actionLabel="Back to Notes"
          onAction={() => navigate('/notes')}
          icon={Icon}
        />
      </PageLayout>
    );
  }

  const clientName = note.client 
    ? `${note.client.firstName} ${note.client.lastName}`
    : 'Unknown Client';

  const handleAIFill = (generatedFormData: any) => {
    // Merge the generated data with existing form data, preserving clientId
    const mergedData = {
      ...generatedFormData,
      clientId: formData.clientId, // Preserve the existing clientId
    };
    updateFormData(mergedData);
  };

  const defaultHeaderAction = (
    <div className="flex items-center space-x-3">
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate('/notes')}
        className="flex items-center space-x-2 hover:bg-gray-50 transition-colors border-gray-300 hover:border-gray-400"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Notes</span>
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsAIModalOpen(true)}
        className="flex items-center space-x-2 hover:bg-purple-50 transition-colors border-purple-300 hover:border-purple-400 text-purple-700"
      >
        <Bot className="h-4 w-4" />
        <span>AI Fill</span>
      </Button>
      
      <Button
        onClick={onSaveDraft}
        size='sm'
        disabled={saveNoteMutation.isPending}
        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
      >
        <Save className="h-4 w-4 mr-2" />
        {saveNoteMutation.isPending ? 'Saving...' : 'Save Draft'}
      </Button>
    </div>
  );

  return (
    <ErrorBoundary>
      <PageLayout variant="gradient">
        <PageHeader
          icon={Icon}
          title={title}
          description={`Client: ${clientName}`}
          action={customHeaderAction || defaultHeaderAction}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
          <SectionNavigation
            sections={sections}
            currentSection={currentSection}
            onSectionClick={onSectionClick}
          />

          <div className="lg:col-span-3">
            <CurrentSectionCard
              sections={sections}
              currentSection={currentSection}
              formData={formData}
              updateFormData={updateFormData}
              clientData={note.client}
              onSave={onSave}
              isLoading={saveNoteMutation.isPending}
              onPrevious={onPrevious}
              onNext={onNext}
              onSaveDraft={onSaveDraft}
            />
          </div>
        </div>
      </PageLayout>
      
      <AINoteFillModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        noteType={note.noteType}
        clientName={clientName}
        onFormFill={handleAIFill}
      />
    </ErrorBoundary>
  );
};

export default SectionStyleNoteEditLayout;
