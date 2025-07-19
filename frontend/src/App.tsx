
import React, { Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { SidebarProvider } from "@/hooks/useSidebarContext";
import BaseRoutes from "./routes";
import LoadingSpinner from "@/pages/documentation/components/notes/LoadingSpinner";

const queryClient = new QueryClient();
const router = createBrowserRouter(BaseRoutes);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <SidebarProvider>
            <Suspense fallback={<LoadingSpinner />}>
              <RouterProvider router={router} />
            </Suspense>
          </SidebarProvider>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
