
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ClientDetailView from "./components/ClientDetailView";
import IntakeAssessmentForm from "./components/documentation/intake/IntakeAssessmentForm";
import IntakeAssessmentView from "./components/documentation/intake/IntakeAssessmentView";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";

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
                <IntakeAssessmentForm />
              </ProtectedRoute>
            } />
            <Route path="/documentation/note/:noteId" element={
              <ProtectedRoute>
                <IntakeAssessmentView />
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
