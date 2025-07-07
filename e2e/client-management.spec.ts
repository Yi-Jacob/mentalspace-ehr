import { test, expect } from '@playwright/test';

test.describe('Client Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/auth');
    await page.fill('[data-testid="email"]', 'test@example.com');
    await page.fill('[data-testid="password"]', 'testpassword123');
    await page.click('[data-testid="login-button"]');
    await page.waitForURL('/');
  });

  test('should display clients list', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to clients
    await page.click('[data-testid="clients-nav"]');
    await expect(page).toHaveURL('/');
    
    // Verify clients list is displayed
    await expect(page.locator('[data-testid="clients-grid"]')).toBeVisible();
  });

  test('should search for clients', async ({ page }) => {
    await page.goto('/');
    
    // Use search functionality
    const searchInput = page.locator('[data-testid="client-search"]');
    await searchInput.fill('John');
    
    // Wait for search results
    await page.waitForTimeout(500);
    
    // Verify search results are filtered
    const clientCards = page.locator('[data-testid="client-card"]');
    await expect(clientCards.first()).toBeVisible();
  });

  test('should open add client modal', async ({ page }) => {
    await page.goto('/');
    
    // Click add client button
    await page.click('[data-testid="add-client-button"]');
    
    // Verify modal is open
    await expect(page.locator('[data-testid="add-client-modal"]')).toBeVisible();
    await expect(page.locator('role=dialog')).toBeVisible();
  });

  test('should create a new client', async ({ page }) => {
    await page.goto('/');
    
    // Open add client modal
    await page.click('[data-testid="add-client-button"]');
    
    // Fill out form
    await page.fill('[data-testid="first-name-input"]', 'Jane');
    await page.fill('[data-testid="last-name-input"]', 'Doe');
    await page.fill('[data-testid="email-input"]', 'jane.doe@example.com');
    await page.fill('[data-testid="date-of-birth-input"]', '1985-06-15');
    
    // Submit form
    await page.click('[data-testid="save-client-button"]');
    
    // Verify success
    await expect(page.locator('[data-testid="success-toast"]')).toContainText('Client created successfully');
    
    // Verify modal is closed
    await expect(page.locator('[data-testid="add-client-modal"]')).not.toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/');
    
    // Open add client modal
    await page.click('[data-testid="add-client-button"]');
    
    // Try to submit without required fields
    await page.click('[data-testid="save-client-button"]');
    
    // Verify validation errors
    await expect(page.locator('[data-testid="first-name-error"]')).toContainText('First name is required');
    await expect(page.locator('[data-testid="last-name-error"]')).toContainText('Last name is required');
  });

  test('should view client details', async ({ page }) => {
    await page.goto('/');
    
    // Click on a client card
    const firstClient = page.locator('[data-testid="client-card"]').first();
    await firstClient.click();
    
    // Verify navigation to client detail
    await expect(page).toHaveURL(/\/client\/[a-f0-9-]+/);
    
    // Verify client detail view is displayed
    await expect(page.locator('[data-testid="client-detail-view"]')).toBeVisible();
    await expect(page.locator('[data-testid="client-tabs"]')).toBeVisible();
  });

  test('should switch between client detail tabs', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to client detail
    const firstClient = page.locator('[data-testid="client-card"]').first();
    await firstClient.click();
    
    // Wait for detail view to load
    await expect(page.locator('[data-testid="client-detail-view"]')).toBeVisible();
    
    // Click on different tabs
    await page.click('[data-testid="notes-tab"]');
    await expect(page.locator('[data-testid="notes-tab-content"]')).toBeVisible();
    
    await page.click('[data-testid="billing-tab"]');
    await expect(page.locator('[data-testid="billing-tab-content"]')).toBeVisible();
    
    await page.click('[data-testid="info-tab"]');
    await expect(page.locator('[data-testid="info-tab-content"]')).toBeVisible();
  });

  test('should handle client not found', async ({ page }) => {
    // Navigate to non-existent client
    await page.goto('/client/non-existent-id');
    
    // Should show error state
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Client not found');
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    
    // Verify mobile layout
    await expect(page.locator('[data-testid="mobile-client-grid"]')).toBeVisible();
    
    // Test mobile navigation
    await page.click('[data-testid="mobile-menu-button"]');
    await expect(page.locator('[data-testid="mobile-nav"]')).toBeVisible();
  });

  test('should maintain HIPAA compliance', async ({ page }) => {
    await page.goto('/');
    
    // Verify no sensitive data in URLs
    const url = page.url();
    expect(url).not.toMatch(/ssn|social|insurance|dob/);
    
    // Check that sensitive data is not in DOM attributes
    const clientCards = page.locator('[data-testid="client-card"]');
    const firstCard = clientCards.first();
    
    // Verify no sensitive attributes
    const attributes = await firstCard.evaluate(el => {
      const attrs = {};
      for (const attr of el.attributes) {
        attrs[attr.name] = attr.value;
      }
      return attrs;
    });
    
    expect(Object.keys(attributes).some(key => 
      key.includes('ssn') || key.includes('dob') || key.includes('insurance')
    )).toBe(false);
  });
});