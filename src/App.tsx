
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/hooks/useAuth';
import Auth from '@/pages/Auth';
import Index from '@/pages/Index';
import Documentation from '@/pages/Documentation';
import ProtectedRoute from '@/components/ProtectedRoute';
import Sidebar from '@/components/Sidebar';
import IntakeAssessmentForm from '@/components/documentation/intake/IntakeAssessmentForm';
import ProgressNoteForm from '@/components/documentation/progress-note/ProgressNoteForm';
import TreatmentPlanForm from '@/components/documentation/treatment-plan/TreatmentPlanForm';
import CancellationNoteForm from '@/components/documentation/cancellation-note/CancellationNoteForm';
import ContactNoteForm from '@/components/documentation/contact-note/ContactNoteForm';
import ConsultationNoteForm from '@/components/documentation/consultation-note/ConsultationNoteForm';
import MiscellaneousNoteForm from '@/components/documentation/miscellaneous-note/MiscellaneousNoteForm';
import ClientDetailView from '@/components/ClientDetailView';
import NotFound from '@/pages/NotFound';
import EnhancedErrorBoundary from './components/EnhancedErrorBoundary';
import Scheduling from '@/pages/Scheduling';

const queryClient = new QueryClient();

const LayoutWithSidebar = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-screen bg-gray-50">
    <Sidebar />
    <main className="flex-1 ml-64 overflow-auto">
      {children}
    </main>
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <EnhancedErrorBoundary>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/" element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                } />
                <Route path="/documentation" element={
                  <ProtectedRoute>
                    <LayoutWithSidebar>
                      <Documentation />
                    </LayoutWithSidebar>
                  </ProtectedRoute>
                } />
                <Route path="/scheduling" element={
                  <ProtectedRoute>
                    <LayoutWithSidebar>
                      <Scheduling />
                    </LayoutWithSidebar>
                  </ProtectedRoute>
                } />
                <Route path="/documentation/intake/:noteId" element={
                  <ProtectedRoute>
                    <IntakeAssessmentForm />
                  </ProtectedRoute>
                } />
                <Route path="/documentation/progress-note/:noteId" element={
                  <ProtectedRoute>
                    <ProgressNoteForm />
                  </ProtectedRoute>
                } />
                <Route path="/documentation/treatment-plan/:noteId" element={
                  <ProtectedRoute>
                    <TreatmentPlanForm />
                  </ProtectedRoute>
                } />
                <Route path="/documentation/cancellation-note/:noteId" element={
                  <ProtectedRoute>
                    <CancellationNoteForm />
                  </ProtectedRoute>
                } />
                <Route path="/documentation/contact-note/:noteId" element={
                  <ProtectedRoute>
                    <ContactNoteForm />
                  </ProtectedRoute>
                } />
                <Route path="/documentation/consultation-note/:noteId" element={
                  <ProtectedRoute>
                    <ConsultationNoteForm />
                  </ProtectedRoute>
                } />
                <Route path="/documentation/miscellaneous-note/:noteId" element={
                  <ProtectedRoute>
                    <MiscellaneousNoteForm />
                  </ProtectedRoute>
                } />
                <Route path="/client/:clientId" element={
                  <ProtectedRoute>
                    <LayoutWithSidebar>
                      <ClientDetailView />
                    </LayoutWithSidebar>
                  </ProtectedRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </Router>
          <Toaster />
        </EnhancedErrorBoundary>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
