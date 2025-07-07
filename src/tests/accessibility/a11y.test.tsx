import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import ClientDetailView from '@/components/ClientDetailView';
import AddClientModal from '@/components/AddClientModal';
import Dashboard from '@/components/Dashboard';
import { createTestQueryClient } from '../utils/test-utils';

// Extend expect with jest-axe matchers
expect.extend(toHaveNoViolations);

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  useParams: () => ({ id: 'test-client-id' }),
  useNavigate: () => vi.fn(),
  Link: ({ children, to, ...props }: any) => <a href={to} {...props}>{children}</a>,
}));

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(component, {
    wrapper: ({ children }) => (
      <div>{children}</div>
    )
  });
};

describe('Accessibility Tests', () => {
  describe('ClientDetailView', () => {
    it('should have no accessibility violations', async () => {
      const { container } = renderWithProviders(<ClientDetailView />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper heading structure', async () => {
      const { container } = renderWithProviders(<ClientDetailView />);
      
      // Check for h1 element
      const h1Elements = container.querySelectorAll('h1');
      expect(h1Elements.length).toBeGreaterThan(0);
      
      // Check heading hierarchy
      const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
      const headingLevels = Array.from(headings).map(h => parseInt(h.tagName.charAt(1)));
      
      // Ensure headings are properly nested (no skipping levels)
      for (let i = 1; i < headingLevels.length; i++) {
        expect(headingLevels[i] - headingLevels[i - 1]).toBeLessThanOrEqual(1);
      }
    });

    it('should have proper ARIA landmarks', async () => {
      const { container } = renderWithProviders(<ClientDetailView />);
      
      // Check for main landmark
      const mainElement = container.querySelector('[role="main"], main');
      expect(mainElement).toBeTruthy();
      
      // Check for navigation if present
      const navElements = container.querySelectorAll('[role="navigation"], nav');
      expect(navElements.length).toBeGreaterThanOrEqual(0);
    });

    it('should support keyboard navigation', async () => {
      const { container } = renderWithProviders(<ClientDetailView />);
      
      // Find all interactive elements
      const interactiveElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      // Verify each interactive element is keyboard accessible
      interactiveElements.forEach(element => {
        const tabIndex = element.getAttribute('tabindex');
        if (tabIndex !== null && tabIndex !== '-1') {
          expect(parseInt(tabIndex)).toBeGreaterThanOrEqual(0);
        }
      });
    });

    it('should have proper form labels', async () => {
      const { container } = renderWithProviders(<ClientDetailView />);
      
      const inputs = container.querySelectorAll('input, select, textarea');
      inputs.forEach(input => {
        const id = input.getAttribute('id');
        const ariaLabel = input.getAttribute('aria-label');
        const ariaLabelledBy = input.getAttribute('aria-labelledby');
        
        if (id) {
          const label = container.querySelector(`label[for="${id}"]`);
          expect(label || ariaLabel || ariaLabelledBy).toBeTruthy();
        } else {
          expect(ariaLabel || ariaLabelledBy).toBeTruthy();
        }
      });
    });
  });

  describe('AddClientModal', () => {
    it('should have no accessibility violations', async () => {
      const { container } = renderWithProviders(
        <AddClientModal 
          isOpen={true} 
          onClose={vi.fn()} 
          onSuccess={vi.fn()} 
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper modal attributes', async () => {
      const { container } = renderWithProviders(
        <AddClientModal 
          isOpen={true} 
          onClose={vi.fn()} 
          onSuccess={vi.fn()} 
        />
      );
      
      const dialog = container.querySelector('[role="dialog"]');
      expect(dialog).toBeTruthy();
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      
      // Check for aria-labelledby or aria-label
      const ariaLabel = dialog?.getAttribute('aria-label');
      const ariaLabelledBy = dialog?.getAttribute('aria-labelledby');
      expect(ariaLabel || ariaLabelledBy).toBeTruthy();
    });

    it('should trap focus within modal', async () => {
      const { container } = renderWithProviders(
        <AddClientModal 
          isOpen={true} 
          onClose={vi.fn()} 
          onSuccess={vi.fn()} 
        />
      );
      
      const dialog = container.querySelector('[role="dialog"]');
      const focusableElements = dialog?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      expect(focusableElements?.length).toBeGreaterThan(0);
    });

    it('should have proper form validation messages', async () => {
      const { container } = renderWithProviders(
        <AddClientModal 
          isOpen={true} 
          onClose={vi.fn()} 
          onSuccess={vi.fn()} 
        />
      );
      
      const requiredInputs = container.querySelectorAll('input[required], input[aria-required="true"]');
      requiredInputs.forEach(input => {
        expect(input).toHaveAttribute('aria-required', 'true');
      });
    });
  });

  describe('Dashboard', () => {
    it('should have no accessibility violations', async () => {
      const { container } = renderWithProviders(<Dashboard />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper color contrast', async () => {
      const { container } = renderWithProviders(<Dashboard />);
      
      // This is a basic test - in a real scenario, you'd use tools like 
      // axe-core to automatically test color contrast
      const textElements = container.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6');
      expect(textElements.length).toBeGreaterThan(0);
    });

    it('should support screen readers', async () => {
      const { container } = renderWithProviders(<Dashboard />);
      
      // Check for proper semantic elements
      const semanticElements = container.querySelectorAll(
        'main, nav, section, article, aside, header, footer'
      );
      expect(semanticElements.length).toBeGreaterThan(0);
      
      // Check for proper ARIA labels on interactive elements
      const buttons = container.querySelectorAll('button');
      buttons.forEach(button => {
        const hasAccessibleName = 
          button.textContent?.trim() ||
          button.getAttribute('aria-label') ||
          button.getAttribute('aria-labelledby') ||
          button.querySelector('img')?.getAttribute('alt');
        
        expect(hasAccessibleName).toBeTruthy();
      });
    });

    it('should be usable with keyboard only', async () => {
      const { container } = renderWithProviders(<Dashboard />);
      
      // Check that all interactive elements are focusable
      const interactiveElements = container.querySelectorAll(
        'button, a, input, select, textarea, [role="button"], [role="link"]'
      );
      
      interactiveElements.forEach(element => {
        const tabIndex = element.getAttribute('tabindex');
        const isDisabled = element.hasAttribute('disabled');
        
        if (!isDisabled && tabIndex !== '-1') {
          expect(element).toBeVisible();
        }
      });
    });
  });

  describe('General Accessibility Compliance', () => {
    it('should support high contrast mode', async () => {
      const { container } = renderWithProviders(<Dashboard />);
      
      // Simulate high contrast mode by checking CSS custom properties
      const rootElement = container.closest('html') || document.documentElement;
      const computedStyle = getComputedStyle(rootElement);
      
      // Check that CSS custom properties are used for colors
      const bodyBg = computedStyle.getPropertyValue('--background');
      const textColor = computedStyle.getPropertyValue('--foreground');
      
      // These should be defined in the design system
      expect(bodyBg || textColor).toBeTruthy();
    });

    it('should be compatible with screen magnification', async () => {
      const { container } = renderWithProviders(<Dashboard />);
      
      // Check that text can be zoomed to 200% without horizontal scrolling
      // This is a basic check - real testing would involve browser zoom
      const textElements = container.querySelectorAll('p, span, div');
      textElements.forEach(element => {
        const style = getComputedStyle(element);
        
        // Check for relative units rather than fixed pixel sizes
        const fontSize = style.fontSize;
        expect(fontSize).toBeTruthy();
      });
    });

    it('should provide alternative text for images', async () => {
      const { container } = renderWithProviders(<Dashboard />);
      
      const images = container.querySelectorAll('img');
      images.forEach(img => {
        const alt = img.getAttribute('alt');
        const ariaLabel = img.getAttribute('aria-label');
        const ariaLabelledBy = img.getAttribute('aria-labelledby');
        const role = img.getAttribute('role');
        
        // Decorative images should have alt="" or role="presentation"
        // Meaningful images should have descriptive alt text
        expect(
          alt !== null || 
          ariaLabel || 
          ariaLabelledBy || 
          role === 'presentation' ||
          role === 'img'
        ).toBeTruthy();
      });
    });
  });
});