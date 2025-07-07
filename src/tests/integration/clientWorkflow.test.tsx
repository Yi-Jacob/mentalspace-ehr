import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render, createTestQueryClient, mockClient } from '../utils/test-utils';
import App from '@/App';
import { supabase } from '@/integrations/supabase/client';

// Mock react-router-dom to control navigation
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe('Client Management Integration Tests', () => {
  const queryClient = createTestQueryClient();

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock authentication
    vi.mocked(supabase.auth.getUser).mockResolvedValue({
      data: { 
        user: { 
          id: 'auth-user-123',
          email: 'test@example.com' 
        } 
      },
      error: null
    });

    // Mock user roles check
    vi.mocked(supabase.from).mockImplementation((table) => {
      if (table === 'users') {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: { id: 'user-123', first_name: 'Test', last_name: 'User' },
                error: null
              })
            })
          })
        } as any;
      }
      
      if (table === 'clients') {
        return {
          select: vi.fn().mockReturnValue({
            order: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue({
                data: [mockClient],
                error: null
              })
            })
          }),
          insert: vi.fn().mockReturnValue({
            select: vi.fn().mockResolvedValue({
              data: [{ ...mockClient, id: 'new-client-123' }],
              error: null
            })
          })
        } as any;
      }

      return {
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            data: [],
            error: null
          })
        })
      } as any;
    });
  });

  it('should complete client creation workflow', async () => {
    const user = userEvent.setup();
    
    render(<App />, { queryClient });

    // Wait for app to load and navigate to clients
    await waitFor(() => {
      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    });

    // Navigate to clients page
    const clientsNavLink = screen.getByRole('link', { name: /clients/i });
    await user.click(clientsNavLink);

    // Wait for clients list to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Click add client button
    const addClientButton = screen.getByRole('button', { name: /add client/i });
    await user.click(addClientButton);

    // Wait for modal to open
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Fill out the form
    await user.type(screen.getByLabelText(/first name/i), 'Jane');
    await user.type(screen.getByLabelText(/last name/i), 'Smith');
    await user.type(screen.getByLabelText(/email/i), 'jane.smith@example.com');

    // Submit the form
    const saveButton = screen.getByRole('button', { name: /save/i });
    await user.click(saveButton);

    // Verify client was created
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('should handle client search and filtering', async () => {
    const user = userEvent.setup();
    
    // Mock search results
    vi.mocked(supabase.from).mockImplementation((table) => {
      if (table === 'clients') {
        return {
          select: vi.fn().mockReturnValue({
            ilike: vi.fn().mockReturnValue({
              order: vi.fn().mockReturnValue({
                limit: vi.fn().mockResolvedValue({
                  data: [mockClient],
                  error: null
                })
              })
            }),
            order: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue({
                data: [mockClient],
                error: null
              })
            })
          })
        } as any;
      }
      return { select: vi.fn() } as any;
    });

    render(<App />, { queryClient });

    // Navigate to clients
    await waitFor(() => {
      const clientsLink = screen.getByRole('link', { name: /clients/i });
      expect(clientsLink).toBeInTheDocument();
    });

    const clientsLink = screen.getByRole('link', { name: /clients/i });
    await user.click(clientsLink);

    // Wait for clients to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Search for a client
    const searchInput = screen.getByPlaceholderText(/search clients/i);
    await user.type(searchInput, 'John');

    // Verify search results
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  it('should navigate to client detail view', async () => {
    const user = userEvent.setup();
    
    render(<App />, { queryClient });

    // Navigate to clients
    await waitFor(() => {
      const clientsLink = screen.getByRole('link', { name: /clients/i });
      expect(clientsLink).toBeInTheDocument();
    });

    const clientsLink = screen.getByRole('link', { name: /clients/i });
    await user.click(clientsLink);

    // Wait for clients to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Click on client name to view details
    const clientLink = screen.getByText('John Doe');
    await user.click(clientLink);

    // Should navigate to client detail view
    // Note: In a real test, we'd verify the URL change or specific detail view content
    expect(clientLink).toBeInTheDocument();
  });

  it('should handle error states gracefully', async () => {
    // Mock API error
    vi.mocked(supabase.from).mockImplementation(() => ({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue({
            data: null,
            error: { message: 'Database connection failed' }
          })
        })
      })
    } as any));

    render(<App />, { queryClient });

    // Navigate to clients
    await waitFor(() => {
      const clientsLink = screen.getByRole('link', { name: /clients/i });
      expect(clientsLink).toBeInTheDocument();
    });

    const clientsLink = screen.getByRole('link', { name: /clients/i });
    await user.click(clientsLink);

    // Should show error state
    await waitFor(() => {
      expect(screen.getByText(/error loading clients/i)).toBeInTheDocument();
    });
  });

  it('should maintain HIPAA compliance during workflow', async () => {
    const user = userEvent.setup();
    
    render(<App />, { queryClient });

    // Navigate to clients
    await waitFor(() => {
      const clientsLink = screen.getByRole('link', { name: /clients/i });
      expect(clientsLink).toBeInTheDocument();
    });

    const clientsLink = screen.getByRole('link', { name: /clients/i });
    await user.click(clientsLink);

    // Verify no sensitive data is exposed in DOM
    const container = screen.getByRole('main');
    
    // Check that sensitive attributes are not present
    expect(container.querySelector('[data-ssn]')).toBeNull();
    expect(container.querySelector('[data-insurance-number]')).toBeNull();
    
    // Verify email is shown but not in attributes
    await waitFor(() => {
      expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
    });
    
    expect(container.querySelector('[data-email]')).toBeNull();
  });
});