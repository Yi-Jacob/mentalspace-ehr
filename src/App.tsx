import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import Auth from '@/pages/Auth';
import Index from '@/pages/Index';
import Documentation from '@/pages/Documentation';
import ProtectedRoute from '@/components/ProtectedRoute';
import Sidebar from '@/components/Sidebar';
import IntakeAssessmentForm from '@/components/documentation/intake-assessment/IntakeAssessmentForm';
import ProgressNoteForm from '@/components/documentation/progress-note/ProgressNoteForm';
import TreatmentPlanForm from '@/components/documentation/treatment-plan/TreatmentPlanForm';
import CancellationNoteForm from '@/components/documentation/cancellation-note/CancellationNoteForm';
import ContactNoteForm from '@/components/documentation/contact-note/ContactNoteForm';
import ConsultationNoteForm from '@/components/documentation/consultation-note/ConsultationNoteForm';
import MiscellaneousNoteForm from '@/components/documentation/miscellaneous-note/MiscellaneousNoteForm';
import ClientDetailView from '@/components/clients/ClientDetailView';
import NotFound from '@/pages/NotFound';
import EnhancedErrorBoundary from './components/EnhancedErrorBoundary';

import Scheduling from '@/pages/Scheduling';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <EnhancedErrorBoundary>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <div className="flex">
                    <Sidebar />
                    <main className="flex-1 ml-64">
                      <Index />
                    </main>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/documentation" element={
                <ProtectedRoute>
                  <div className="flex">
                    <Sidebar />
                    <main className="flex-1 ml-64">
                      <Documentation />
                    </main>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/scheduling" element={
                <ProtectedRoute>
                  <div className="flex">
                    <Sidebar />
                    <main className="flex-1 ml-64">
                      <Scheduling />
                    </main>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/documentation/intake/:clientId" element={
                <ProtectedRoute>
                  <div className="flex">
                    <Sidebar />
                    <main className="flex-1 ml-64">
                      <IntakeAssessmentForm />
                    </main>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/documentation/progress-note/:clientId" element={
                <ProtectedRoute>
                  <div className="flex">
                    <Sidebar />
                    <main className="flex-1 ml-64">
                      <ProgressNoteForm />
                    </main>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/documentation/treatment-plan/:clientId" element={
                <ProtectedRoute>
                  <div className="flex">
                    <Sidebar />
                    <main className="flex-1 ml-64">
                      <TreatmentPlanForm />
                    </main>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/documentation/cancellation-note/:clientId" element={
                <ProtectedRoute>
                  <div className="flex">
                    <Sidebar />
                    <main className="flex-1 ml-64">
                      <CancellationNoteForm />
                    </main>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/documentation/contact-note/:clientId" element={
                <ProtectedRoute>
                  <div className="flex">
                    <Sidebar />
                    <main className="flex-1 ml-64">
                      <ContactNoteForm />
                    </main>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/documentation/consultation-note/:clientId" element={
                <ProtectedRoute>
                  <div className="flex">
                    <Sidebar />
                    <main className="flex-1 ml-64">
                      <ConsultationNoteForm />
                    </main>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/documentation/miscellaneous-note/:clientId" element={
                <ProtectedRoute>
                  <div className="flex">
                    <Sidebar />
                    <main className="flex-1 ml-64">
                      <MiscellaneousNoteForm />
                    </main>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/client/:clientId" element={
                <ProtectedRoute>
                  <div className="flex">
                    <Sidebar />
                    <main className="flex-1 ml-64">
                      <ClientDetailView />
                    </main>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
        <Toaster />
      </EnhancedErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;
