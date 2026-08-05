import { test, expect } from '@playwright/test';

test.describe('AuthForm E2E Component Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should render sign in form inputs and submit button', async ({ page }) => {
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should show client-side validation error when submitting empty fields', async ({ page }) => {
    // Click submit without entering email or password
    await page.locator('button[type="submit"]').click();
    
    // Check if error message is displayed
    await expect(page.locator('text=Email is required')).toBeVisible();
  });

  test('should navigate between login and register pages', async ({ page }) => {
    // Click link to create account
    await page.click('text=[CREATE_ACCOUNT]');
    
    // URL should change to /register
    await page.waitForURL('**/register*');
    await expect(page.locator('input[name="name"]')).toBeVisible();
  });
});
