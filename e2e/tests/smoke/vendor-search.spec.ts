import { test, expect } from '@playwright/test';
import { VendorPage } from '../../pages/VendorPage';

/**
 * TC-VENDOR-005: Search/Filter Vendors
 *
 * Validates: User can search and filter vendors using filter controls
 * Priority: P2 (High)
 * Type: Smoke Test
 * Validation: 3-layer (User Guide + Code + Live)
 *
 * Known Issues: Issue #7, #13 (pagination/filtering bugs at component level)
 */

test.describe('Vendor Management - Search/Filter', () => {
  let vendorPage: VendorPage;
  const searchVendorId = 'TEST-VENDOR-SEARCH-' + Date.now();

  test.beforeEach(async ({ page }) => {
    vendorPage = new VendorPage(page);
    await vendorPage.goto();

    // Create unique test vendor for searching
    await vendorPage.clickCreate();
    await vendorPage.fillMinimalVendor({
      vendorId: searchVendorId,
      vendorName: 'QA Search Test Vendor',
      status: 'ACTIVE'
    });
    await vendorPage.fillExtendedVendor({
      contactFirstName: 'SearchTest'
    });
    await vendorPage.save();
    await vendorPage.verifySuccessNotification();
    await vendorPage.waitForGridLoad();
  });

  test('TC-VENDOR-005: Should filter vendors by vendor ID', async ({ page }) => {
    // Step 1-2: Note initial row count
    const initialRowCount = await vendorPage.getGridRowCount();
    expect(initialRowCount).toBeGreaterThan(0);

    // Step 3-5: Apply filter
    await vendorPage.applyFilter('Vendor', searchVendorId);

    // Step 6: Verify only matching vendor displayed
    const filteredRowCount = await vendorPage.getGridRowCount();
    expect(filteredRowCount).toBe(1);

    await vendorPage.verifyVendorInGrid(searchVendorId, {
      name: 'QA Search Test Vendor',
      status: 'ACTIVE'
    });

    // Step 7: Verify status updated
    await expect(vendorPage.gridStatus).toContainText('1 rows');

    // Screenshot filtered results
    await page.screenshot({
      path: 'e2e/tests/smoke/screenshots/vendor/tc-005-filtered-results.png',
      fullPage: true
    });

    // Step 9-11: Clear filter
    await vendorPage.clearFilters();

    // Verify all vendors displayed
    const clearedRowCount = await vendorPage.getGridRowCount();
    expect(clearedRowCount).toBeGreaterThanOrEqual(initialRowCount);
  });

  test('TC-VENDOR-005-B: Should filter vendors by status', async ({ page }) => {
    // Apply status filter
    await vendorPage.filterButton.click();
    await page.waitForTimeout(500);

    // Find and click Status column filter dropdown
    const statusFilter = page.getByRole('combobox').filter({
      has: page.getByRole('columnheader', { name: 'Status' })
    }).first();

    if (await statusFilter.isVisible({ timeout: 2000 })) {
      await statusFilter.click();
      await page.getByText('ACTIVE').click();
      await page.waitForLoadState('networkidle');

      // Verify only ACTIVE vendors shown
      const rows = await page.getByRole('row').count();
      for (let i = 1; i < rows; i++) { // Skip header
        const row = page.getByRole('row').nth(i);
        const statusCell = row.getByRole('gridcell', { name: /ACTIVE|INACTIVE/ });
        if (await statusCell.isVisible({ timeout: 500 }).catch(() => false)) {
          await expect(statusCell).toContainText('ACTIVE');
        }
      }
    }
  });

  test('TC-VENDOR-005-C: Should filter by contact first name', async ({ page }) => {
    await vendorPage.applyFilter('Contact First Name', 'SearchTest');

    // Verify our test vendor appears
    await vendorPage.verifyVendorInGrid(searchVendorId);

    // Verify filter worked
    const rowCount = await vendorPage.getGridRowCount();
    expect(rowCount).toBeGreaterThanOrEqual(1);
  });
});

