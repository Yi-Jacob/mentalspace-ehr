
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { SidebarProvider } from "@/components/ui/sidebar";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ClientDetailView from "./components/ClientDetailView";
import IntakeAssessmentForm from "./components/documentation/intake/IntakeAssessmentForm";
import IntakeAssessmentView from "./components/documentation/intake/IntakeAssessmentView";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import Sidebar from "./components/Sidebar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            <Route path="/documentation" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            <Route path="/client/:clientId" element={
              <ProtectedRoute>
                <ClientDetailView />
              </ProtectedRoute>
            } />
            <Route path="/documentation/note/:noteId/edit" element={
              <ProtectedRoute>
                <SidebarProvider>
                  <div className="min-h-screen flex w-full">
                    <Sidebar activeItem="documentation" onItemClick={() => {}} />
                    <div className="flex-1">
                      <IntakeAssessmentForm />
                    </div>
                  </div>
                </SidebarProvider>
              </ProtectedRoute>
            } />
            <Route path="/documentation/note/:noteId" element={
              <ProtectedRoute>
                <SidebarProvider>
                  <div className="min-h-screen flex w-full">
                    <Sidebar activeItem="documentation" onItemClick={() => {}} />
                    <div className="flex-1">
                      <IntakeAssessmentView />
                    </div>
                  </div>
                </SidebarProvider>
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
