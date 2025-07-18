import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  // Navigate to login page
  await page.goto('/auth');

  // Fill in login credentials
  await page.fill('[data-testid="email"]', 'test@example.com');
  await page.fill('[data-testid="password"]', 'testpassword123');

  // Click login button
  await page.click('[data-testid="login-button"]');

  // Wait for successful login (redirect to dashboard)
  await page.waitForURL('/');
  await expect(page.locator('[data-testid="dashboard"]')).toBeVisible();

  // Save authentication state
  await page.context().storageState({ path: authFile });
});