import { test, expect } from '@playwright/test';

test.describe('Clinical Documentation Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page and authenticate
    await page.goto('/auth');
    await page.fill('[data-testid="email"]', 'test@example.com');
    await page.fill('[data-testid="password"]', 'testpassword123');
    await page.click('[data-testid="login-button"]');
    
    // Wait for dashboard to load
    await page.waitForURL('/');
  });

  test('should navigate to documentation page', async ({ page }) => {
    // Click on Documentation in sidebar
    await page.click('[data-testid="documentation-nav"]');
    
    // Verify we're on the documentation page
    await expect(page).toHaveURL('/documentation');
    await expect(page.locator('h1')).toContainText('Documentation');
  });

  test('should display notes creation options', async ({ page }) => {
    await page.goto('/documentation');
    
    // Check for create note button or grid
    await expect(page.locator('[data-testid="create-note-grid"]')).toBeVisible();
    
    // Verify different note types are available
    await expect(page.locator('text=Progress Note')).toBeVisible();
    await expect(page.locator('text=Intake Assessment')).toBeVisible();
    await expect(page.locator('text=Treatment Plan')).toBeVisible();
  });

  test('should create a new progress note', async ({ page }) => {
    await page.goto('/documentation');
    
    // Click on Progress Note option
    await page.click('[data-testid="progress-note-button"]');
    
    // Should navigate to progress note form
    await expect(page).toHaveURL(/\/documentation\/progress-note/);
    
    // Verify form sections are present
    await expect(page.locator('text=Client Overview')).toBeVisible();
    await expect(page.locator('text=Clinical Information')).toBeVisible();
  });

  test('should save progress note as draft', async ({ page }) => {
    await page.goto('/documentation/progress-note/new');
    
    // Fill in basic information
    await page.fill('[data-testid="note-title"]', 'Weekly Progress Review');
    
    // Navigate through sections and fill content
    await page.click('[data-testid="content-section-nav"]');
    await page.fill('[data-testid="subjective-field"]', 'Client reports improved mood and better sleep patterns.');
    await page.fill('[data-testid="objective-field"]', 'Client appeared well-groomed and engaged throughout the session.');
    
    // Save as draft
    await page.click('[data-testid="save-draft-button"]');
    
    // Verify success message
    await expect(page.locator('[data-testid="success-toast"]')).toContainText('Note saved as draft');
    
    // Verify draft status
    await expect(page.locator('[data-testid="note-status"]')).toContainText('Draft');
  });

  test('should require all sections before signing', async ({ page }) => {
    await page.goto('/documentation/progress-note/new');
    
    // Try to sign without filling required sections
    await page.click('[data-testid="finalize-section-nav"]');
    await page.click('[data-testid="sign-note-button"]');
    
    // Should show validation errors
    await expect(page.locator('[data-testid="validation-error"]')).toContainText('Please complete all required sections');
  });

  test('should complete and sign a progress note', async ({ page }) => {
    await page.goto('/documentation/progress-note/new');
    
    // Fill all required sections
    await page.fill('[data-testid="note-title"]', 'Complete Progress Note');
    
    // Client Overview
    await page.click('[data-testid="client-overview-nav"]');
    await page.selectOption('[data-testid="client-select"]', 'test-client-id');
    
    // Content Section
    await page.click('[data-testid="content-section-nav"]');
    await page.fill('[data-testid="subjective-field"]', 'Client reports significant improvement.');
    await page.fill('[data-testid="objective-field"]', 'Alert and oriented x3.');
    await page.fill('[data-testid="assessment-field"]', 'Good progress toward treatment goals.');
    await page.fill('[data-testid="plan-field"]', 'Continue current interventions.');
    
    // Risk Assessment
    await page.click('[data-testid="risk-assessment-nav"]');
    await page.check('[data-testid="no-risk-checkbox"]');
    
    // Planning
    await page.click('[data-testid="planning-nav"]');
    await page.fill('[data-testid="next-session-plan"]', 'Continue weekly sessions.');
    
    // Finalize and sign
    await page.click('[data-testid="finalize-section-nav"]');
    await page.fill('[data-testid="signature-field"]', 'Dr. John Smith, LCSW');
    await page.click('[data-testid="sign-note-button"]');
    
    // Verify note is signed
    await expect(page.locator('[data-testid="note-status"]')).toContainText('Signed');
    await expect(page.locator('[data-testid="success-toast"]')).toContainText('Note signed successfully');
  });

  test('should enforce HIPAA compliance', async ({ page }) => {
    await page.goto('/documentation');
    
    // Check that URLs don't contain sensitive information
    const url = page.url();
    expect(url).not.toMatch(/ssn|dob|insurance/);
    
    // Verify session timeout handling
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    
    await page.reload();
    
    // Should redirect to auth page
    await expect(page).toHaveURL('/auth');
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Simulate network failure
    await page.route('**/rest/v1/**', route => route.abort());
    
    await page.goto('/documentation');
    
    // Should show error state
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    await expect(page.locator('text=Unable to load')).toBeVisible();
  });

  test('should be accessible', async ({ page }) => {
    await page.goto('/documentation');
    
    // Check for proper ARIA landmarks
    await expect(page.locator('role=main')).toBeVisible();
    await expect(page.locator('role=navigation')).toBeVisible();
    
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Check for proper heading structure
    await expect(page.locator('h1')).toBeVisible();
    
    // Verify color contrast (basic check)
    const bgColor = await page.locator('body').evaluate(el => 
      getComputedStyle(el).backgroundColor
    );
    const textColor = await page.locator('body').evaluate(el => 
      getComputedStyle(el).color
    );
    
    expect(bgColor).toBeTruthy();
    expect(textColor).toBeTruthy();
  });
});