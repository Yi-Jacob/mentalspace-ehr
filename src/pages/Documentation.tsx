
import React from 'react';
import { Outlet } from 'react-router-dom';
import EnhancedErrorBoundary from '@/components/EnhancedErrorBoundary';
import DocumentationTabs from '@/components/documentation/DocumentationTabs';
import CreateNoteModal from '@/components/documentation/CreateNoteModal';
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <div className="flex-1 space-y-8 p-6">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <div className="flex justify-center items-center space-x-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                Clinical Documentation
              </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Create and manage clinical notes, assessments, and documentation with ease and accountability
            </p>
          </div>

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
        </div>
      </div>
    </EnhancedErrorBoundary>
  );
};

export default Documentation;
