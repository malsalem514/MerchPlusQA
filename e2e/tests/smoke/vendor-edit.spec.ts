import { test, expect } from '@playwright/test';
import { VendorPage } from '../../pages/VendorPage';

/**
 * TC-VENDOR-004: Edit Vendor (Basic)
 *
 * Validates: User can edit existing vendor and update fields
 * Priority: P1 (Critical)
 * Type: Smoke Test
 * Validation: 3-layer (User Guide + Code + Live)
 *
 * Prerequisites: Vendor TEST-VENDOR-001 must exist (created in vendor-create.spec.ts)
 */

test.describe('Vendor Management - Edit', () => {
  let vendorPage: VendorPage;
  const testVendorId = 'TEST-VENDOR-EDIT-' + Date.now();

  test.beforeEach(async ({ page }) => {
    vendorPage = new VendorPage(page);
    await vendorPage.goto();

    // Create test vendor for editing
    await vendorPage.clickCreate();
    await vendorPage.fillMinimalVendor({
      vendorId: testVendorId,
      vendorName: 'QA Test - Before Edit',
      status: 'ACTIVE'
    });
    await vendorPage.save();
    await vendorPage.verifySuccessNotification();
    await vendorPage.waitForGridLoad();
  });

  test('TC-VENDOR-004: Should edit vendor and update contact information', async ({ page }) => {
    // Step 1-2: Click Edit icon
    await vendorPage.editVendor(testVendorId);

    // Step 3-5: Verify form pre-populated
    await expect(vendorPage.vendorIdField).toHaveValue(testVendorId);
    await expect(vendorPage.vendorNameField).toHaveValue('QA Test - Before Edit');

    // Step 6: Verify Vendor ID is disabled
    await expect(vendorPage.vendorIdField).toBeDisabled();

    // Step 7-10: Fill contact information
    await vendorPage.fillExtendedVendor({
      contactFirstName: 'QA',
      contactLastName: 'Tester'
    });

    // Screenshot before save
    await page.screenshot({
      path: 'e2e/tests/smoke/screenshots/vendor/tc-004-before-save.png',
      fullPage: true
    });

    // Step 11: Save
    await vendorPage.save();

    // Step 12: Verify success notification
    await vendorPage.verifySuccessNotification();

    // Step 13-15: Verify in grid
    await vendorPage.verifyVendorInGrid(testVendorId, {
      status: 'ACTIVE'
    });

    // Verify Contact First Name column updated
    const vendorRow = vendorPage.getVendorRow(testVendorId);
    await expect(vendorRow.getByRole('gridcell', { name: 'QA' })).toBeVisible();

    // Step 16: Re-open to verify persistence
    await vendorPage.editVendor(testVendorId);
    await expect(vendorPage.contactFirstNameField).toHaveValue('QA');
    await expect(vendorPage.contactLastNameField).toHaveValue('Tester');

    // Screenshot final state
    await page.screenshot({
      path: 'e2e/tests/smoke/screenshots/vendor/tc-004-after-edit.png',
      fullPage: true
    });
  });

  test('TC-VENDOR-004-B: Should not allow editing vendor ID (primary key)', async ({ page }) => {
    await vendorPage.editVendor(testVendorId);

    // Verify Vendor ID field is disabled
    await expect(vendorPage.vendorIdField).toBeDisabled();

    // Attempt to type (should not work)
    await vendorPage.vendorIdField.click({ force: true });
    await page.keyboard.type('SHOULD-NOT-WORK');

    // Verify value unchanged
    await expect(vendorPage.vendorIdField).toHaveValue(testVendorId);
  });
});

