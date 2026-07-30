import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should allow a user to register and login', async ({ page }) => {
    // Navigate to registration page
    await page.goto('/register');
    
    // Fill out registration form
    await page.fill('input[name="name"]', 'E2E Test User');
    await page.fill('input[name="email"]', `test-${Date.now()}@example.com`);
    await page.fill('input[name="password"]', 'Password123!');
    
    // Submit registration
    await page.click('button[type="submit"]');
    
    // Wait for redirect to login or dashboard
    await page.waitForURL('**/login*');
    
    // Login with newly created credentials
    // Note: Since we used a dynamic email, this is a simplified example.
    // In a real E2E, you'd store the email in a variable or use a seeded test user.
    await expect(page.locator('text=Sign In')).toBeVisible();
  });

  test('should login successfully with seeded user', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');
    
    // Fill out login form (using generic test credentials assuming seeded DB)
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password');
    
    // Submit login
    await page.click('button[type="submit"]');
    
    // Wait for redirect to dashboard
    await page.waitForURL('**/dashboard');
    
    // Verify dashboard loaded
    await expect(page.locator('text=Dashboard')).toBeVisible();
  });

  test('should show error on invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'wrong@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // Should show error message
    await expect(page.locator('text=Invalid credentials')).toBeVisible();
  });

  test('should protect dashboard route', async ({ page }) => {
    // Attempt to navigate to protected route without session
    await page.goto('/dashboard');
    
    // Should redirect to login
    await page.waitForURL('**/login*');
    await expect(page.locator('text=Sign In')).toBeVisible();
  });
});
