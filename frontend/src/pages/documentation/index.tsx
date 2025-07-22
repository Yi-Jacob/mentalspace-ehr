
import React from 'react';
import { Outlet } from 'react-router-dom';
import EnhancedErrorBoundary from '@/components/EnhancedErrorBoundary';
import PageLayout from '@/components/ui/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import DocumentationTabs from '@/pages/documentation/components/DocumentationTabs';
import CreateNoteModal from '@/pages/documentation/components/CreateNoteModal';
import { useDocumentation } from '@/hooks/useDocumentation';
import { FileText, TrendingUp, Users, Clock } from 'lucide-react';

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
      <PageLayout variant="gradient">
        <PageHeader
          icon={FileText}
          title="Clinical Documentation"
          description="Create and manage clinical notes, assessments, and documentation with ease and accountability"
  
        />

          {/* Quick Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-blue-100 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Notes</p>
                  <p className="text-xl font-bold text-gray-900">247</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-green-100 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">This Week</p>
                  <p className="text-xl font-bold text-gray-900">23</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-purple-100 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Clients</p>
                  <p className="text-xl font-bold text-gray-900">142</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-orange-100 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-xl font-bold text-gray-900">7</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <DocumentationTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onCreateNote={handleCreateNote}
            isCreatingIntake={createNoteMutation.isPending}
          />

          {/* Render nested routes */}
          <Outlet />

          <CreateNoteModal 
            isOpen={showCreateModal}
            onClose={handleCloseModal}
            noteType={selectedNoteType}
            createNoteMutation={createNoteMutation}
          />
      </PageLayout>
    </EnhancedErrorBoundary>
  );
};

export default Documentation;
