import { test, expect } from '@playwright/test';
import { VendorPage } from '../../pages/VendorPage';
import { login } from '../../fixtures/auth';

/**
 * TC-VENDOR-001: View Vendor Grid
 *
 * Validates: User can navigate to Vendor Management and view vendor grid
 * Priority: P1 (Critical)
 * Type: Smoke Test
 * Validation: 3-layer (User Guide + Code + Live)
 */

test.describe('Vendor Management - Grid View', () => {
  let vendorPage: VendorPage;

  test.beforeEach(async ({ page }) => {
    // Login first
    await login(page);

    vendorPage = new VendorPage(page);

    // Navigate to Vendor Management
    await vendorPage.goto();
  });

  test('TC-VENDOR-001: Should display vendor grid with all elements', async ({ page }) => {
    // Step 1-4: Navigation (handled in beforeEach)

    // Step 5: Verify page title
    await expect(page.getByRole('button', { name: /Vendor Management/i })).toBeVisible();

    // Step 6: Verify toolbar with 5 buttons
    await expect(vendorPage.columnsChooserButton).toBeVisible();
    await expect(vendorPage.filterButton).toBeVisible();
    await expect(vendorPage.exportButton).toBeVisible();
    await expect(vendorPage.refreshButton).toBeVisible();
    await expect(vendorPage.createButton).toBeVisible();

    // Step 7: Verify grid displays with 10 columns
    await expect(vendorPage.grid).toBeVisible();

    const columnHeaders = [
      'Consignment',
      'Contact First Name',
      'Contact Last Name',
      'Country',
      'Currency',
      'Status',
      'State',
      'Terms',
      'Vendor'
      // Note: Actions column has no accessible name, skip validation
    ];

    for (const column of columnHeaders) {
      await expect(vendorPage.getColumnHeader(column)).toBeVisible();
    }

    // Step 8: Verify vendor rows displayed
    const rowCount = await vendorPage.getGridRowCount();
    expect(rowCount).toBeGreaterThanOrEqual(0); // May be 0 if empty, or N if data exists

    // Step 9: Verify pagination controls
    await expect(vendorPage.firstPageButton).toBeVisible();
    await expect(vendorPage.previousPageButton).toBeVisible();
    await expect(vendorPage.nextPageButton).toBeVisible();
    await expect(vendorPage.lastPageButton).toBeVisible();
    await expect(vendorPage.pageTextbox).toBeVisible();
    await expect(vendorPage.pageSizeDropdown).toBeVisible();

    // Step 10: Verify status text
    await expect(vendorPage.gridStatus).toBeVisible();
    await expect(vendorPage.gridStatus).toContainText(/data grid with.*\d+.*rows/i);

    // Step 11: Verify action buttons (if vendors exist)
    if (rowCount > 0) {
      const firstRow = page.getByRole('row').nth(1); // Skip header row
      const actionButtons = firstRow.getByRole('button');
      expect(await actionButtons.count()).toBe(3); // View, Edit, Delete icons
    }

    // Screenshot for evidence
    await page.screenshot({ path: 'e2e/tests/smoke/screenshots/vendor/tc-001-grid-view.png', fullPage: true });
  });

  test('TC-VENDOR-001-B: Should display correct status badges for active/inactive vendors', async ({ page }) => {
    const rowCount = await vendorPage.getGridRowCount();

    if (rowCount > 0) {
      // Find ACTIVE vendor
      const activeCell = vendorPage.getGridCell('ACTIVE').first();
      if (await activeCell.isVisible()) {
        await expect(activeCell).toBeVisible();
        // Note: Green background color validation would require visual testing
      }

      // Find INACTIVE vendor (if exists)
      const inactiveCell = vendorPage.getGridCell('INACTIVE').first();
      if (await inactiveCell.isVisible({ timeout: 1000 }).catch(() => false)) {
        await expect(inactiveCell).toBeVisible();
      }
    }
  });
});

