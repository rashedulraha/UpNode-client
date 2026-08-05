import { test, expect } from '@playwright/test';

test.describe('UptimeChart E2E Component Tests', () => {
  test('should render telemetry status page or component container', async ({ page }) => {
    await page.goto('/');

    // Check homepage telemetry hero elements
    await expect(page.locator('text=LIVE INCIDENT STREAM ACTIVE')).toBeVisible();
    await expect(page.locator('text=ALL TELEMETRY INGESTION NODES OPERATIONAL')).toBeVisible();
  });
});
