import { test, expect } from '@playwright/test';
import { VendorPage } from '../../pages/VendorPage';

/**
 * TC-VENDOR-002: Create Vendor (Minimal Fields)
 *
 * Validates: User can create new vendor with minimum required fields
 * Priority: P1 (Critical)
 * Type: Smoke Test
 * Validation: 3-layer (User Guide + Code + Live)
 */

test.describe('Vendor Management - Create', () => {
  let vendorPage: VendorPage;
  const testVendorId = `TEST-VENDOR-${Date.now()}`; // Unique ID

  test.beforeEach(async ({ page }) => {
    vendorPage = new VendorPage(page);
    await vendorPage.goto();
  });

  test('TC-VENDOR-002: Should create vendor with minimal required fields', async ({ page }) => {
    // Step 1: Click Create button
    await vendorPage.clickCreate();

    // Step 2-4: Verify form opened
    await expect(page).toHaveTitle(/Vision Merchandising/);
    // TODO: Verify exact page title when known

    // Step 5: Verify Vendor section expanded
    await expect(vendorPage.vendorIdField).toBeVisible();

    // Step 6-14: Fill required fields
    await vendorPage.fillMinimalVendor({
      vendorId: testVendorId,
      vendorName: 'QA Test Vendor - Automated',
      billToVendor: testVendorId,
      parentRebateVendor: testVendorId,
      status: 'ACTIVE'
    });

    // Screenshot before save
    await page.screenshot({
      path: 'e2e/tests/smoke/screenshots/vendor/tc-002-before-save.png',
      fullPage: true
    });

    // Step 16: Save vendor
    await vendorPage.save();

    // Step 17: Verify success notification
    await vendorPage.verifySuccessNotification();
    // TODO: Add exact message text after first run

    // Screenshot success message
    await page.screenshot({
      path: 'e2e/tests/smoke/screenshots/vendor/tc-002-success-notification.png'
    });

    // Step 18: Verify return to grid
    await vendorPage.waitForGridLoad();

    // Step 19-20: Verify vendor in grid
    await vendorPage.verifyVendorInGrid(testVendorId, {
      name: 'QA Test Vendor - Automated',
      status: 'ACTIVE'
    });

    // Screenshot vendor in grid
    await page.screenshot({
      path: 'e2e/tests/smoke/screenshots/vendor/tc-002-vendor-in-grid.png',
      fullPage: true
    });
  });

  test('TC-VENDOR-002-B: Should show validation error when required fields missing', async ({ page }) => {
    // Open create form
    await vendorPage.clickCreate();

    // Try to save without filling required fields
    await vendorPage.save();

    // Verify error notification or validation messages
    await vendorPage.verifyErrorNotification();
    // TODO: Add exact validation message text after first run

    // Verify still on form (not navigated away)
    await expect(vendorPage.saveButton).toBeVisible();
  });
});

