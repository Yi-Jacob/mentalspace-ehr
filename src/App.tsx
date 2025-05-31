
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/ProtectedRoute';
import Sidebar from '@/components/Sidebar';
import Index from '@/pages/Index';
import ClientList from '@/components/ClientList';
import Scheduling from '@/pages/Scheduling';
import Documentation from '@/pages/Documentation';
import Message from '@/pages/Message';
import StaffPage from '@/pages/StaffPage';
import AddStaffPage from '@/pages/AddStaffPage';
import NotFound from '@/pages/NotFound';
import Billing from '@/pages/Billing';
import Auth from '@/pages/Auth';

function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster />
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/auth" element={<Auth />} />
            
            {/* Protected routes */}
            <Route path="/*" element={
              <ProtectedRoute>
                <div className="flex min-h-screen bg-gray-50">
                  <Sidebar isCollapsed={sidebarCollapsed} onToggle={handleSidebarToggle} />
                  <main className="flex-1 overflow-auto">
                    <div className="container mx-auto p-6">
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/clients" element={<ClientList />} />
                        <Route path="/scheduling" element={<Scheduling />} />
                        <Route path="/documentation" element={<Documentation />} />
                        <Route path="/messages" element={<Message />} />
                        <Route path="/billing" element={<Billing />} />
                        <Route path="/staff" element={<StaffPage />} />
                        <Route path="/add-staff" element={<AddStaffPage />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </div>
                  </main>
                </div>
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
