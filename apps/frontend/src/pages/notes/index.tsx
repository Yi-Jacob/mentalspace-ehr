
import React from 'react';
import { Outlet } from 'react-router-dom';
import EnhancedErrorBoundary from '@/components/EnhancedErrorBoundary';
import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';
import NotesTabs from '@/pages/notes/components/NotesTabs';
import CreateNoteModal from '@/pages/notes/components/CreateNoteModal';
import { useNotes } from '@/hooks/useNotes';
import { FileText, TrendingUp, Users, Clock } from 'lucide-react';

const Notes = () => {
  const {
    activeTab,
    setActiveTab,
    showCreateModal,
    selectedNoteType,
    createNoteMutation,
    handleCreateNote,
    handleCloseModal,
  } = useNotes();

  return (
    <EnhancedErrorBoundary 
      componentName="Notes"
      showErrorDetails={process.env.NODE_ENV === 'development'}
    >
      <PageLayout variant="gradient">
        <PageHeader
          icon={FileText}
          title="Clinical Notes"
          description="Create and manage clinical notes, assessments, and Notes with ease and accountability"
  
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
          <NotesTabs
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

export default Notes;
