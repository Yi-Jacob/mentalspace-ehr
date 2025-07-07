import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render, createTestQueryClient } from '../utils/test-utils';
import AddClientModal from '@/components/AddClientModal';
import { supabase } from '@/integrations/supabase/client';

// Mock the toast
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

describe('AddClientModal', () => {
  const mockOnSuccess = vi.fn();
  const queryClient = createTestQueryClient();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render form fields correctly', () => {
    render(
      <AddClientModal 
        isOpen={true} 
        onClose={vi.fn()} 
        onSuccess={mockOnSuccess} 
      />,
      { queryClient }
    );
    
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date of birth/i)).toBeInTheDocument();
  });

  it('should validate required fields', async () => {
    const user = userEvent.setup();
    render(
      <AddClientModal 
        isOpen={true} 
        onClose={vi.fn()} 
        onSuccess={mockOnSuccess} 
      />,
      { queryClient }
    );
    
    const saveButton = screen.getByRole('button', { name: /save/i });
    await user.click(saveButton);
    
    await waitFor(() => {
      expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/last name is required/i)).toBeInTheDocument();
    });
  });

  it('should submit form with valid data', async () => {
    const user = userEvent.setup();
    
    // Mock successful client creation
    vi.mocked(supabase.from).mockReturnValue({
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockResolvedValue({
          data: [{ id: '123', first_name: 'John', last_name: 'Doe' }],
          error: null
        })
      })
    } as any);

    render(
      <AddClientModal 
        isOpen={true} 
        onClose={vi.fn()} 
        onSuccess={mockOnSuccess} 
      />,
      { queryClient }
    );
    
    // Fill out form
    await user.type(screen.getByLabelText(/first name/i), 'John');
    await user.type(screen.getByLabelText(/last name/i), 'Doe');
    await user.type(screen.getByLabelText(/email/i), 'john.doe@example.com');
    
    const saveButton = screen.getByRole('button', { name: /save/i });
    await user.click(saveButton);
    
    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('should handle API errors gracefully', async () => {
    const user = userEvent.setup();
    
    // Mock API error
    vi.mocked(supabase.from).mockReturnValue({
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'Database error' }
        })
      })
    } as any);

    render(
      <AddClientModal 
        isOpen={true} 
        onClose={vi.fn()} 
        onSuccess={mockOnSuccess} 
      />,
      { queryClient }
    );
    
    // Fill out form
    await user.type(screen.getByLabelText(/first name/i), 'John');
    await user.type(screen.getByLabelText(/last name/i), 'Doe');
    await user.type(screen.getByLabelText(/email/i), 'john.doe@example.com');
    
    const saveButton = screen.getByRole('button', { name: /save/i });
    await user.click(saveButton);
    
    await waitFor(() => {
      expect(screen.getByText(/error creating client/i)).toBeInTheDocument();
    });
  });

  it('should validate email format', async () => {
    const user = userEvent.setup();
    render(
      <AddClientModal 
        isOpen={true} 
        onClose={vi.fn()} 
        onSuccess={mockOnSuccess} 
      />,
      { queryClient }
    );
    
    await user.type(screen.getByLabelText(/email/i), 'invalid-email');
    await user.click(screen.getByRole('button', { name: /save/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/valid email address/i)).toBeInTheDocument();
    });
  });

  it('should close modal when cancel is clicked', async () => {
    const user = userEvent.setup();
    const mockOnClose = vi.fn();
    
    render(
      <AddClientModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onSuccess={mockOnSuccess} 
      />,
      { queryClient }
    );
    
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should be accessible', () => {
    render(
      <AddClientModal 
        isOpen={true} 
        onClose={vi.fn()} 
        onSuccess={mockOnSuccess} 
      />,
      { queryClient }
    );
    
    // Check for proper ARIA attributes
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    
    // Check form labels are properly associated
    const firstNameInput = screen.getByLabelText(/first name/i);
    expect(firstNameInput).toHaveAttribute('aria-required', 'true');
  });
});