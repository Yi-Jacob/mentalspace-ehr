
import React from 'react';
import { FileText, Plus, Clock, Shield } from 'lucide-react';
import { Badge } from '@/components/basic/badge';
import PageTabs from '@/components/basic/PageTabs';
import NotesList from '../AllNotesPage';
import CreateNoteGrid from '../CreateNotePage';
import PendingApprovals from '../PendingApprovalPage';
import ComplianceTracker from '../NoteCompliancePage';
import EnhancedErrorBoundary from '@/components/EnhancedErrorBoundary';

interface NotesTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onCreateNote: (noteType: string) => void;
  isCreatingIntake: boolean;
}

const NotesTabs: React.FC<NotesTabsProps> = ({
  activeTab,
  onTabChange,
  onCreateNote,
  isCreatingIntake
}) => {
  return (
    <PageTabs
      value={activeTab}
      onValueChange={onTabChange}
      items={[
        {
          id: 'all-notes',
          label: 'All Notes',
          icon: FileText,
          content: <NotesList />
        },
        {
          id: 'create',
          label: 'Create New',
          icon: Plus,
          content: (
            <EnhancedErrorBoundary 
              componentName="CreateNoteGrid"
              fallback={
                <div className="p-6 border border-red-200 rounded-xl bg-red-50/50 backdrop-blur-sm">
                  <p className="text-sm text-red-600">Failed to load note creation options</p>
                </div>
              }
            >
              <CreateNoteGrid 
                onCreateNote={onCreateNote}
                isCreatingIntake={isCreatingIntake}
              />
            </EnhancedErrorBoundary>
          )
        },
        {
          id: 'approvals',
          label: 'Pending',
          icon: Clock,
          badge: <Badge variant="secondary" className="ml-1 bg-orange-100 text-orange-800">3</Badge>,
          content: (
            <EnhancedErrorBoundary componentName="PendingApprovals">
              <PendingApprovals />
            </EnhancedErrorBoundary>
          )
        },
        {
          id: 'compliance',
          label: 'Compliance',
          icon: Shield,
          content: (
            <EnhancedErrorBoundary componentName="ComplianceTracker">
              <ComplianceTracker />
            </EnhancedErrorBoundary>
          )
        }
      ]}
    />
  );
};

export default NotesTabs;
