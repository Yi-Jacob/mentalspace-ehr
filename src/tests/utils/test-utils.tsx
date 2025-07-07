import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';

// Mock auth context
const MockAuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <div data-testid="mock-auth-provider">
      {children}
    </div>
  );
};

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialEntries?: string[];
  queryClient?: QueryClient;
}

const AllTheProviders = ({ 
  children, 
  initialEntries = ['/'],
  queryClient 
}: { 
  children: React.ReactNode;
  initialEntries?: string[];
  queryClient?: QueryClient;
}) => {
  const defaultQueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  const client = queryClient || defaultQueryClient;

  return (
    <BrowserRouter>
      <QueryClientProvider client={client}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <MockAuthProvider>
            {children}
            <Toaster />
          </MockAuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

const customRender = (
  ui: ReactElement,
  options: CustomRenderOptions = {}
) => {
  const { initialEntries, queryClient, ...renderOptions } = options;
  
  return render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders 
        initialEntries={initialEntries}
        queryClient={queryClient}
      >
        {children}
      </AllTheProviders>
    ),
    ...renderOptions,
  });
};

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };

// Helper to create test query client
export const createTestQueryClient = () => 
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

// Mock data generators
export const mockClient = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  first_name: 'John',
  last_name: 'Doe',
  email: 'john.doe@example.com',
  date_of_birth: '1990-01-01',
  is_active: true,
  assigned_clinician_id: '456e7890-e89b-12d3-a456-426614174001',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
};

export const mockUser = {
  id: '456e7890-e89b-12d3-a456-426614174001',
  first_name: 'Dr. Jane',
  last_name: 'Smith',
  email: 'jane.smith@clinic.com',
  is_active: true,
  auth_user_id: '789e0123-e89b-12d3-a456-426614174002'
};

export const mockClinicalNote = {
  id: '789e0123-e89b-12d3-a456-426614174003',
  title: 'Progress Note',
  content: {
    subjective: 'Client reports improved mood',
    objective: 'Engaged throughout session',
    assessment: 'Making good progress',
    plan: 'Continue current interventions'
  },
  note_type: 'progress_note' as const,
  status: 'draft' as const,
  client_id: mockClient.id,
  provider_id: mockUser.id,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
};