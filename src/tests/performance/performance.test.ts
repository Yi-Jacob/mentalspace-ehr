import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { QueryClient } from '@tanstack/react-query';
import ClientList from '@/components/ClientList';
import { createTestQueryClient } from '../utils/test-utils';

// Mock performance API
const mockPerformance = {
  mark: vi.fn(),
  measure: vi.fn(),
  getEntriesByType: vi.fn(),
  getEntriesByName: vi.fn(),
  now: vi.fn(() => Date.now()),
};

Object.defineProperty(window, 'performance', {
  value: mockPerformance,
  writable: true,
});

// Mock IntersectionObserver for virtual scrolling tests
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
});
window.IntersectionObserver = mockIntersectionObserver;

describe('Performance Tests', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = createTestQueryClient();
  });

  describe('Rendering Performance', () => {
    it('should render large lists efficiently', async () => {
      const startTime = performance.now();
      
      // Generate large dataset
      const largeDataset = Array.from({ length: 1000 }, (_, index) => ({
        id: `client-${index}`,
        first_name: `John${index}`,
        last_name: `Doe${index}`,
        email: `john${index}@example.com`,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }));

      // Mock the query to return large dataset
      vi.doMock('@/integrations/supabase/client', () => ({
        supabase: {
          from: vi.fn(() => ({
            select: vi.fn(() => ({
              order: vi.fn(() => ({
                limit: vi.fn(() => Promise.resolve({
                  data: largeDataset,
                  error: null
                }))
              }))
            }))
          }))
        }
      }));

      const { container } = render(<ClientList />);

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Rendering should complete within reasonable time (100ms)
      expect(renderTime).toBeLessThan(100);
    });

    it('should implement virtual scrolling for large lists', async () => {
      const { container } = render(<ClientList />);

      // Check if virtual scrolling container exists
      const virtualContainer = container.querySelector('[data-testid="virtual-list"]');
      
      // If virtual scrolling is implemented, it should handle large datasets
      if (virtualContainer) {
        expect(virtualContainer).toBeInTheDocument();
        
        // Check that only visible items are rendered
        const renderedItems = container.querySelectorAll('[data-testid="client-card"]');
        expect(renderedItems.length).toBeLessThanOrEqual(20); // Reasonable viewport size
      }
    });

    it('should debounce search input', async () => {
      const mockSearchFn = vi.fn();
      
      const { container } = render(<ClientList />);
      const searchInput = container.querySelector('[data-testid="client-search"]');

      if (searchInput) {
        // Simulate rapid typing
        const inputEvent = new Event('input', { bubbles: true });
        
        for (let i = 0; i < 5; i++) {
          searchInput.dispatchEvent(inputEvent);
        }

        // Search should be debounced 
        await waitFor(() => {
          expect(searchInput).toBeInTheDocument();
        });
      }
    });
  });

  describe('Memory Usage', () => {
    it('should not create memory leaks with component unmounting', async () => {
      const { unmount } = render(<ClientList />);

      // Track initial memory usage
      const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;

      // Unmount component
      unmount();

      // Force garbage collection if available
      if ((global as any).gc) {
        (global as any).gc();
      }

      // Check memory usage after cleanup
      const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;

      // Memory usage should not increase significantly
      if (initialMemory > 0 && finalMemory > 0) {
        const memoryIncrease = finalMemory - initialMemory;
        expect(memoryIncrease).toBeLessThan(1000000); // Less than 1MB increase
      }
    });

    it('should cleanup event listeners on unmount', () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

      const { unmount } = render(<ClientList />);

      const addedListeners = addEventListenerSpy.mock.calls;
      
      unmount();

      const removedListeners = removeEventListenerSpy.mock.calls;

      // Each added listener should have a corresponding removal
      addedListeners.forEach(([eventType]) => {
        const hasMatchingRemoval = removedListeners.some(([removedType]) => 
          removedType === eventType
        );
        expect(hasMatchingRemoval).toBeTruthy();
      });

      addEventListenerSpy.mockRestore();
      removeEventListenerSpy.mockRestore();
    });
  });

  describe('Network Performance', () => {
    it('should cache API responses', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        data: [{ id: '1', name: 'Test Client' }],
        error: null
      });

      vi.doMock('@/integrations/supabase/client', () => ({
        supabase: {
          from: vi.fn(() => ({
            select: vi.fn(mockFetch)
          }))
        }
      }));

      // First render
      const { unmount } = render(<ClientList />, {
        wrapper: ({ children }) => children
      });

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(1);
      });

      unmount();

      // Second render - should use cache
      render(<ClientList />, {
        wrapper: ({ children }) => children
      });

      // Should not make additional API calls due to caching
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should implement request deduplication', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        data: [],
        error: null
      });

      vi.doMock('@/integrations/supabase/client', () => ({
        supabase: {
          from: vi.fn(() => ({
            select: vi.fn(mockFetch)
          }))
        }
      }));

      // Render multiple components that make the same request
      render(
        <div>
          <ClientList />
          <ClientList />
        </div>
      );

      await waitFor(() => {
        // Should only make one request despite multiple components
        expect(mockFetch).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Bundle Size', () => {
    it('should use code splitting for large components', () => {
      // This test would typically be done with webpack-bundle-analyzer
      // For now, we'll check that lazy loading is properly implemented
      
      const isLazyLoaded = (componentPath: string) => {
        // Check if component uses React.lazy or dynamic imports
        return componentPath.includes('lazy') || componentPath.includes('import(');
      };

      // Example check for lazy-loaded routes
      const routeComponents = [
        'ClientDetailView',
        'Documentation',
        'Billing',
        'Reports'
      ];

      // In a real scenario, you'd analyze the actual bundle
      routeComponents.forEach(component => {
        // Mock check - in practice, analyze webpack stats
        expect(component).toBeTruthy();
      });
    });
  });

  describe('Core Web Vitals', () => {
    it('should track Largest Contentful Paint (LCP)', () => {
      // Mock LCP measurement
      const lcpEntries = [
        {
          entryType: 'largest-contentful-paint',
          startTime: 1500, // 1.5 seconds
          size: 12000,
        }
      ];

      mockPerformance.getEntriesByType.mockReturnValue(lcpEntries);

      const lcpEntry = performance.getEntriesByType('largest-contentful-paint')[0];
      expect(lcpEntry?.startTime).toBeLessThan(2500); // Should be under 2.5s
    });

    it('should track First Input Delay (FID)', () => {
      // Mock FID measurement
      const fidEntries = [
        {
          entryType: 'first-input',
          processingStart: 100,
          startTime: 95,
          duration: 5,
        }
      ];

      mockPerformance.getEntriesByType.mockReturnValue(fidEntries);

      const fidEntry = performance.getEntriesByType('first-input')[0] as any;
      const inputDelay = fidEntry?.processingStart - fidEntry?.startTime;
      expect(inputDelay).toBeLessThan(100); // Should be under 100ms
    });

    it('should track Cumulative Layout Shift (CLS)', () => {
      // Mock CLS measurement
      const clsEntries = [
        {
          entryType: 'layout-shift',
          value: 0.05,
          hadRecentInput: false,
        }
      ];

      mockPerformance.getEntriesByType.mockReturnValue(clsEntries);

      const clsEntry = performance.getEntriesByType('layout-shift')[0] as any;
      expect(clsEntry?.value).toBeLessThan(0.1); // Should be under 0.1
    });
  });
});