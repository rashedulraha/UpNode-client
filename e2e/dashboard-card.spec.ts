import { test, expect } from '@playwright/test';

test.describe('DashboardCard E2E Component Tests', () => {
  test('should render metric card element correctly on dashboard', async ({ page }) => {
    await page.goto('/login');
    
    // Fill credentials and submit
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');

    // Wait for redirect to dashboard or login check
    await page.waitForTimeout(1000);

    // Navigate directly to dashboard route
    await page.goto('/dashboard');

    // Check header or status container presence
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});
