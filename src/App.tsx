
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
                            <Route path="/" element={<Index />} />
                            <Route path="/add-staff" element={<AddStaffPage />} />
                            <Route path="/scheduling" element={<Scheduling />} />
                            <Route path="/documentation" element={<Documentation />} />
                            <Route path="/billing" element={<Billing />} />
                            <Route path="/message" element={<Message />} />
                            <Route path="/compliance" element={<Compliance />} />
                            <Route path="/crm" element={<CRM />} />
                            <Route path="/reports" element={<Reports />} />
                            <Route path="/settings" element={<Settings />} />
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
