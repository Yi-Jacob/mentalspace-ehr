
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import EnhancedErrorBoundary from '@/components/EnhancedErrorBoundary';
import NotesList from '@/pages/documentation/components/NotesList';
import CreateNoteGrid from '@/pages/documentation/components/CreateNoteGrid';
import PendingApprovals from '@/pages/documentation/components/PendingApprovals';
import ComplianceTracker from '@/pages/documentation/components/ComplianceTracker';
import { FileText, Plus, Clock, Shield } from 'lucide-react';

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
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-xl p-6 shadow-lg">
      <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-8">
        <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm border border-gray-200 shadow-md rounded-xl p-2">
          <TabsTrigger 
            value="all-notes" 
            className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-lg transition-all duration-200"
          >
            <FileText className="w-4 h-4" />
            <span>All Notes</span>
          </TabsTrigger>
          <TabsTrigger 
            value="create"
            className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white rounded-lg transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>Create New</span>
          </TabsTrigger>
          <TabsTrigger 
            value="approvals"
            className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white rounded-lg transition-all duration-200"
          >
            <Clock className="w-4 h-4" />
            <span>Pending</span>
            <Badge variant="secondary" className="ml-1 bg-orange-100 text-orange-800">3</Badge>
          </TabsTrigger>
          <TabsTrigger 
            value="compliance"
            className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg transition-all duration-200"
          >
            <Shield className="w-4 h-4" />
            <span>Compliance</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all-notes" className="space-y-6 mt-8">
          <NotesList />
        </TabsContent>

        <TabsContent value="create" className="space-y-6 mt-8">
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
        </TabsContent>

        <TabsContent value="approvals" className="space-y-6 mt-8">
          <EnhancedErrorBoundary componentName="PendingApprovals">
            <PendingApprovals />
          </EnhancedErrorBoundary>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6 mt-8">
          <EnhancedErrorBoundary componentName="ComplianceTracker">
            <ComplianceTracker />
          </EnhancedErrorBoundary>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DocumentationTabs;
