import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import { toHaveNoViolations } from 'jest-axe';

// Extend expect with jest-axe matchers
expect.extend(toHaveNoViolations);

// Cleanup after each test case
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Mock environment variables
vi.mock('../integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({
            data: null,
            error: null
          })),
          maybeSingle: vi.fn(() => Promise.resolve({
            data: null,
            error: null
          }))
        })),
        order: vi.fn(() => ({
          limit: vi.fn(() => Promise.resolve({
            data: [],
            error: null
          }))
        })),
        limit: vi.fn(() => Promise.resolve({
          data: [],
          error: null
        }))
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => Promise.resolve({
          data: null,
          error: null
        }))
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => Promise.resolve({
            data: null,
            error: null
          }))
        }))
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({
          data: null,
          error: null
        }))
      })),
      rpc: vi.fn(() => Promise.resolve({
        data: null,
        error: null
      }))
    })),
    auth: {
      getUser: vi.fn(() => Promise.resolve({
        data: { user: null },
        error: null
      })),
      signInWithPassword: vi.fn(() => Promise.resolve({
        data: { user: null, session: null },
        error: null
      })),
      signOut: vi.fn(() => Promise.resolve({
        error: null
      })),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } }
      }))
    }
  }
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock HTMLElement.scrollIntoView
HTMLElement.prototype.scrollIntoView = vi.fn();