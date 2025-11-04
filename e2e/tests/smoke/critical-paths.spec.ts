/**
 * Vision Merchandising Plus - Smoke Tests
 * Fast critical path validation (runs on every PR)
 */

import { test, expect } from '@playwright/test';
import { AuthHelper } from '../../fixtures/auth';

test.describe('Critical Path Smoke Tests', () => {

  test('[SMOKE-001] Application loads successfully', async ({ page }) => {
    await page.goto('/');

    // Wait for Blazor to load
    await expect(page.locator('#app')).toBeVisible({ timeout: 30000 });

    // Verify main UI elements
    await expect(page.locator('[data-testid="main-navigation"]'))
      .toBeVisible();
  });

  test('[SMOKE-002] Login flow works', async ({ page }) => {
    await page.goto('/login');

    await page.fill('[data-testid="username"]', process.env.TEST_USER!);
    await page.fill('[data-testid="password"]', process.env.TEST_PASSWORD!);
    await page.click('[data-testid="login-button"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('[data-testid="user-menu"]'))
      .toContainText(process.env.TEST_USER!);
  });

  test('[SMOKE-003] Vendor page loads', async ({ page }) => {
    await AuthHelper.loginAsAdmin(page);

    await page.goto('/vendors');

    // Grid should load
    await expect(page.locator('.dxbl-grid')).toBeVisible({ timeout: 10000 });

    // At least one vendor should exist
    await expect(page.locator('.dxbl-grid-data-row').first())
      .toBeVisible({ timeout: 5000 });
  });

  test('[SMOKE-004] PO page loads', async ({ page }) => {
    await AuthHelper.loginAsAdmin(page);

    await page.goto('/purchase-orders');

    await expect(page.locator('[data-testid="po-grid"]'))
      .toBeVisible({ timeout: 10000 });
  });

  test('[SMOKE-005] Style page loads', async ({ page }) => {
    await AuthHelper.loginAsAdmin(page);

    await page.goto('/styles');

    await expect(page.locator('[data-testid="style-grid"]'))
      .toBeVisible({ timeout: 10000 });
  });

  test('[SMOKE-006] API health check', async ({ request }) => {
    const response = await request.get('/api/health');

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
  });

  test('[SMOKE-007] OData endpoint accessible', async ({ request }) => {
    const response = await request.get('/odata/$metadata');

    expect(response.ok()).toBeTruthy();

    const body = await response.text();
    expect(body).toContain('Edm.EntityContainer');
  });
});

