import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render, mockClient, mockUser } from '../utils/test-utils';
import ClientDetailView from '@/components/ClientDetailView';
import { supabase } from '@/integrations/supabase/client';

// Mock the router params
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: mockClient.id }),
    useNavigate: () => vi.fn(),
  };
});

// Mock the security service
vi.mock('@/services/securityService', () => ({
  securityService: {
    logHIPAAAccess: vi.fn(),
    checkPatientAccess: vi.fn(() => Promise.resolve(true)),
    anonymizeData: vi.fn((data) => data),
  }
}));

describe('ClientDetailView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock successful client fetch
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: mockClient,
            error: null
          })
        })
      })
    } as any);
  });

  it('should render client information correctly', async () => {
    render(<ClientDetailView />);
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
    });
  });

  it('should handle loading state', () => {
    // Mock loading state
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockImplementation(() => new Promise(() => {})) // Never resolves
        })
      })
    } as any);

    render(<ClientDetailView />);
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('should handle error state when client not found', async () => {
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: null,
            error: { message: 'Client not found' }
          })
        })
      })
    } as any);

    render(<ClientDetailView />);
    
    await waitFor(() => {
      expect(screen.getByText(/error loading client/i)).toBeInTheDocument();
    });
  });

  it('should display client tabs correctly', async () => {
    render(<ClientDetailView />);
    
    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /info/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /notes/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /billing/i })).toBeInTheDocument();
    });
  });

  it('should switch between tabs', async () => {
    const user = userEvent.setup();
    render(<ClientDetailView />);
    
    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /info/i })).toBeInTheDocument();
    });

    const notesTab = screen.getByRole('tab', { name: /notes/i });
    await user.click(notesTab);
    
    expect(notesTab).toHaveAttribute('aria-selected', 'true');
  });

  it('should not expose sensitive data in DOM attributes', async () => {
    render(<ClientDetailView />);
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Verify no SSN, DOB, or other sensitive data in data attributes
    const container = screen.getByTestId('client-detail-container');
    expect(container).not.toHaveAttribute('data-ssn');
    expect(container).not.toHaveAttribute('data-dob');
    expect(container).not.toHaveAttribute('data-insurance');
  });

  it('should be accessible', async () => {
    const { container } = render(<ClientDetailView />);
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Check for proper ARIA labels
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('tablist')).toBeInTheDocument();
    
    // Check for keyboard navigation support
    const tabs = screen.getAllByRole('tab');
    tabs.forEach(tab => {
      expect(tab).toHaveAttribute('tabindex');
    });
  });
});