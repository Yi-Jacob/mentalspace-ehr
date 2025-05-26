
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/ProtectedRoute';
import EnhancedErrorBoundary from '@/components/EnhancedErrorBoundary';
import Sidebar from '@/components/Sidebar';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Documentation from '@/pages/Documentation';
import Scheduling from '@/pages/Scheduling';
import AddStaffPage from '@/pages/AddStaffPage';
import StaffManagementPage from '@/components/staff/StaffManagementPage';
import NotFound from '@/pages/NotFound';
import './App.css';

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
                      <div className="flex h-screen">
                        <Sidebar />
                        <main className="flex-1 overflow-auto">
                          <Routes>
                            <Route path="/" element={<Index />} />
                            <Route path="/documentation" element={<Documentation />} />
                            <Route path="/scheduling" element={<Scheduling />} />
                            <Route path="/staff" element={<StaffManagementPage />} />
                            <Route path="/staff/add" element={<AddStaffPage />} />
                            <Route path="*" element={<NotFound />} />
                          </Routes>
                        </main>
                      </div>
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

export default App;
