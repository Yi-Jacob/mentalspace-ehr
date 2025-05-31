
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/ProtectedRoute';
import EnhancedErrorBoundary from '@/components/EnhancedErrorBoundary';
import { SidebarProvider, useSidebarContext } from '@/hooks/useSidebarContext';
import Sidebar from '@/components/Sidebar';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Documentation from '@/pages/Documentation';
import Scheduling from '@/pages/Scheduling';
import AddStaffPage from '@/pages/AddStaffPage';
import StaffManagementPage from '@/components/staff/StaffManagementPage';
import ClientList from '@/components/ClientList';
import ClientDetailView from '@/components/ClientDetailView';
import ProgressNoteForm from '@/components/documentation/progress-note/ProgressNoteForm';
import ContactNoteForm from '@/components/documentation/contact-note/ContactNoteForm';
import ConsultationNoteForm from '@/components/documentation/consultation-note/ConsultationNoteForm';
import TreatmentPlanForm from '@/components/documentation/treatment-plan/TreatmentPlanForm';
import IntakeAssessmentForm from '@/components/documentation/intake/IntakeAssessmentForm';
import CancellationNoteForm from '@/components/documentation/cancellation-note/CancellationNoteForm';
import MiscellaneousNoteForm from '@/components/documentation/miscellaneous-note/MiscellaneousNoteForm';
import Message from '@/pages/Message';
import NotFound from '@/pages/NotFound';
import './App.css';
import { cn } from '@/lib/utils';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <EnhancedErrorBoundary>
            <div className="min-h-screen bg-gray-50">
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route
                  path="/*"
                  element={
                    <ProtectedRoute>
                      <SidebarProvider>
                        <MainLayout />
                      </SidebarProvider>
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </div>
            <Toaster />
          </EnhancedErrorBoundary>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

const MainLayout: React.FC = () => {
  const { isCollapsed } = useSidebarContext();
  
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className={cn(
        "flex-1 transition-all duration-300 overflow-auto p-6",
        isCollapsed ? "ml-16" : "ml-64"
      )}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/clients" element={<ClientList />} />
          <Route path="/client/:clientId" element={<ClientDetailView />} />
          <Route path="/documentation" element={<Documentation />} />
          <Route path="/documentation/progress-note/:noteId/edit" element={<ProgressNoteForm />} />
          <Route path="/documentation/contact-note/:noteId/edit" element={<ContactNoteForm />} />
          <Route path="/documentation/consultation-note/:noteId/edit" element={<ConsultationNoteForm />} />
          <Route path="/documentation/treatment-plan/:noteId/edit" element={<TreatmentPlanForm />} />
          <Route path="/documentation/intake/:noteId/edit" element={<IntakeAssessmentForm />} />
          <Route path="/documentation/cancellation-note/:noteId/edit" element={<CancellationNoteForm />} />
          <Route path="/documentation/miscellaneous-note/:noteId/edit" element={<MiscellaneousNoteForm />} />
          <Route path="/scheduling" element={<Scheduling />} />
          <Route path="/message" element={<Message />} />
          <Route path="/staff" element={<StaffManagementPage />} />
          <Route path="/staff/add" element={<AddStaffPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
