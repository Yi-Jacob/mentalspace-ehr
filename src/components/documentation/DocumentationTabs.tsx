
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EnhancedErrorBoundary from '@/components/EnhancedErrorBoundary';
import NotesList from '@/components/documentation/NotesList';
import CreateNoteGrid from '@/components/documentation/CreateNoteGrid';
import PendingApprovals from '@/components/documentation/PendingApprovals';
import ComplianceTracker from '@/components/documentation/ComplianceTracker';

interface DocumentationTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  onCreateNote: (noteType: string) => void;
  isCreatingIntake: boolean;
}

const DocumentationTabs: React.FC<DocumentationTabsProps> = ({
  activeTab,
  onTabChange,
  onCreateNote,
  isCreatingIntake,
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="all-notes">All Notes</TabsTrigger>
        <TabsTrigger value="create">Create New</TabsTrigger>
        <TabsTrigger value="approvals">Pending Approvals</TabsTrigger>
        <TabsTrigger value="compliance">Compliance</TabsTrigger>
      </TabsList>

      <TabsContent value="all-notes" className="space-y-6">
        <NotesList />
      </TabsContent>

      <TabsContent value="create" className="space-y-6">
        <EnhancedErrorBoundary 
          componentName="CreateNoteGrid"
          fallback={
            <div className="p-4 border border-red-200 rounded-lg bg-red-50">
              <p className="text-sm text-red-600">Failed to load note creation options</p>
            </div>
          }
        >
          <CreateNoteGrid 
            onCreateNote={onCreateNote}
            isCreatingIntake={isCreatingIntake}
          />
        </EnhancedErrorBoundary>
      </TabsContent>

      <TabsContent value="approvals" className="space-y-6">
        <EnhancedErrorBoundary componentName="PendingApprovals">
          <PendingApprovals />
        </EnhancedErrorBoundary>
      </TabsContent>

      <TabsContent value="compliance" className="space-y-6">
        <EnhancedErrorBoundary componentName="ComplianceTracker">
          <ComplianceTracker />
        </EnhancedErrorBoundary>
      </TabsContent>
    </Tabs>
  );
};

export default DocumentationTabs;
