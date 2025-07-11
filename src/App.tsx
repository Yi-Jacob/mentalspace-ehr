
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { SidebarProvider } from "@/hooks/useSidebarContext";
import Sidebar from "@/components/Sidebar";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AddStaffPage from "./pages/AddStaffPage";
import StaffPage from "./pages/StaffPage";
import Scheduling from "./pages/Scheduling";
import Documentation from "./pages/Documentation";
import Billing from "./pages/Billing";
import Message from "./pages/Message";
import Compliance from "./pages/Compliance";
import CRM from "./pages/CRM";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import ClientDetailView from "./components/ClientDetailView";
import ProgressNoteForm from "./components/documentation/progress-note/ProgressNoteForm";
import ProgressNoteView from "./components/documentation/progress-note/ProgressNoteView";
import IntakeAssessmentForm from "./components/documentation/intake/IntakeAssessmentForm";
import IntakeAssessmentView from "./components/documentation/intake/IntakeAssessmentView";
import TreatmentPlanForm from "./components/documentation/treatment-plan/TreatmentPlanForm";
import CancellationNoteForm from "./components/documentation/cancellation-note/CancellationNoteForm";
import ContactNoteForm from "./components/documentation/contact-note/ContactNoteForm";
import ConsultationNoteForm from "./components/documentation/consultation-note/ConsultationNoteForm";
import MiscellaneousNoteForm from "./components/documentation/miscellaneous-note/MiscellaneousNoteForm";
import GenericNoteView from "./components/documentation/GenericNoteView";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <BrowserRouter>
            <SidebarProvider>
              <div className="min-h-screen flex w-full">
                <Routes>
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/*" element={
                    <ProtectedRoute>
                      <div className="flex w-full">
                        <Sidebar />
                        <main className="flex-1 transition-all duration-300 ml-16 lg:ml-64">
                          <Routes>
                            {/* Main Pages */}
                            <Route path="/" element={<Index />} />
                            <Route path="/clients" element={<Index />} />
                            <Route path="/client/:clientId" element={<ClientDetailView />} />
                            
                            {/* Staff Management */}
                            <Route path="/staff" element={<StaffPage />} />
                            <Route path="/staff/add" element={<AddStaffPage />} />
                            
                            {/* Other Main Modules */}
                            <Route path="/scheduling" element={<Scheduling />} />
                            <Route path="/billing" element={<Billing />} />
                            <Route path="/message" element={<Message />} />
                            <Route path="/compliance" element={<Compliance />} />
                            <Route path="/crm" element={<CRM />} />
                            <Route path="/reports" element={<Reports />} />
                            <Route path="/settings" element={<Settings />} />
                            
                            {/* Documentation Routes */}
                            <Route path="/documentation" element={<Documentation />} />
                            
                            {/* Progress Notes */}
                            <Route path="/documentation/progress-note/:noteId/edit" element={<ProgressNoteForm />} />
                            <Route path="/documentation/progress-note/:noteId" element={<ProgressNoteView />} />
                            
                            {/* Intake Assessments */}
                            <Route path="/documentation/intake/:noteId/edit" element={<IntakeAssessmentForm />} />
                            <Route path="/documentation/intake/:noteId" element={<IntakeAssessmentView />} />
                            
                            {/* Treatment Plans */}
                            <Route path="/documentation/treatment-plan/:noteId/edit" element={<TreatmentPlanForm />} />
                            <Route path="/documentation/treatment-plan/:noteId" element={<GenericNoteView />} />
                            
                            {/* Cancellation Notes */}
                            <Route path="/documentation/cancellation-note/:noteId/edit" element={<CancellationNoteForm />} />
                            <Route path="/documentation/cancellation-note/:noteId" element={<GenericNoteView />} />
                            
                            {/* Contact Notes */}
                            <Route path="/documentation/contact-note/:noteId/edit" element={<ContactNoteForm />} />
                            <Route path="/documentation/contact-note/:noteId" element={<GenericNoteView />} />
                            
                            {/* Consultation Notes */}
                            <Route path="/documentation/consultation-note/:noteId/edit" element={<ConsultationNoteForm />} />
                            <Route path="/documentation/consultation-note/:noteId" element={<GenericNoteView />} />
                            
                            {/* Miscellaneous Notes */}
                            <Route path="/documentation/miscellaneous-note/:noteId/edit" element={<MiscellaneousNoteForm />} />
                            <Route path="/documentation/miscellaneous-note/:noteId" element={<GenericNoteView />} />
                            
                            {/* Generic Note Routes (fallback) */}
                            <Route path="/documentation/note/:noteId/edit" element={<ProgressNoteForm />} />
                            <Route path="/documentation/note/:noteId" element={<GenericNoteView />} />
                            
                            {/* 404 Handler */}
                            <Route path="*" element={<NotFound />} />
                          </Routes>
                        </main>
                      </div>
                    </ProtectedRoute>
                  } />
                </Routes>
              </div>
            </SidebarProvider>
          </BrowserRouter>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
