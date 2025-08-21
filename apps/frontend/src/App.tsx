
import React, { Suspense } from 'react';
import { Toaster } from "@/components/basic/toaster";
import { Toaster as Sonner } from "@/components/basic/sonner";
import { TooltipProvider } from "@/components/basic/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { SidebarProvider } from "@/hooks/useSidebarContext";
import BaseRoutes from "./routes";
import LoadingSpinner from "@/components/LoadingSpinner";
import { AIChatbot } from "@/components/ai-chatbot";

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
          <AIChatbot />
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
