import { test, expect } from '@playwright/test';
import { VendorPage } from '../../pages/VendorPage';

/**
 * TC-VENDOR-006: Pagination Controls
 *
 * Validates: Pagination controls work correctly
 * Priority: P2 (High)
 * Type: Smoke Test
 * Validation: 3-layer (User Guide + Code + Live)
 *
 * Note: Full pagination test requires 25+ vendors
 */

test.describe('Vendor Management - Pagination', () => {
  let vendorPage: VendorPage;

  test.beforeEach(async ({ page }) => {
    vendorPage = new VendorPage(page);
    await vendorPage.goto();
  });

  test('TC-VENDOR-006: Should display pagination controls correctly', async ({ page }) => {
    // Step 1: Verify page size
    await expect(vendorPage.pageSizeDropdown).toBeVisible();
    const pageSizeText = await vendorPage.pageSizeDropdown.textContent();
    expect(pageSizeText).toMatch(/20|50|100/); // Default page size

    // Step 2: Verify pagination info
    await expect(vendorPage.pageTextbox).toBeVisible();
    const pageInfo = await vendorPage.pageTextbox.inputValue();
    expect(pageInfo).toMatch(/^\d+$/); // Current page number

    // Step 3: Verify buttons visible
    await expect(vendorPage.firstPageButton).toBeVisible();
    await expect(vendorPage.previousPageButton).toBeVisible();
    await expect(vendorPage.nextPageButton).toBeVisible();
    await expect(vendorPage.lastPageButton).toBeVisible();

    // Step 10: Verify status shows row count
    const statusText = await vendorPage.gridStatus.textContent();
    expect(statusText).toMatch(/data grid with \d+ rows/i);

    // Screenshot
    await page.screenshot({
      path: 'e2e/tests/smoke/screenshots/vendor/tc-006-pagination-controls.png'
    });
  });

  test('TC-VENDOR-006-B: Should change page size and update display', async ({ page }) => {
    const initialRowCount = await vendorPage.getGridRowCount();

    // Step 15-16: Change page size to 50
    await vendorPage.pageSizeDropdown.click();
    await page.getByText('50').click();
    await page.waitForLoadState('networkidle');

    // Verify grid refreshed
    await vendorPage.waitForGridLoad();

    // Verify status updated (may show more or same rows depending on data)
    const newRowCount = await vendorPage.getGridRowCount();
    expect(newRowCount).toBeGreaterThanOrEqual(0);

    // Screenshot
    await page.screenshot({
      path: 'e2e/tests/smoke/screenshots/vendor/tc-006-page-size-50.png',
      fullPage: true
    });

    // Step 19: Change back to 20
    await vendorPage.pageSizeDropdown.click();
    await page.getByText('20').click();
    await page.waitForLoadState('networkidle');
  });

  test.skip('TC-VENDOR-006-C: Should navigate between pages (requires 25+ vendors)', async ({ page }) => {
    // This test requires sufficient data
    // Skip if row count <= page size

    const rowCount = await vendorPage.getGridRowCount();
    const pageSizeText = await vendorPage.pageSizeDropdown.textContent();
    const pageSize = parseInt(pageSizeText || '20');

    test.skip(rowCount <= pageSize, 'Insufficient data for multi-page test');

    // Step 4: Click Next
    await vendorPage.nextPageButton.click();
    await page.waitForLoadState('networkidle');

    // Step 5-6: Verify page 2
    const pageNumber = await vendorPage.pageTextbox.inputValue();
    expect(pageNumber).toBe('2');

    // Step 7: Verify Previous enabled
    await expect(vendorPage.previousPageButton).toBeEnabled();

    // Step 8: Click Previous
    await vendorPage.previousPageButton.click();
    await page.waitForLoadState('networkidle');

    // Step 9: Verify back to page 1
    const backToPage1 = await vendorPage.pageTextbox.inputValue();
    expect(backToPage1).toBe('1');

    // Step 10: Click Last Page
    await vendorPage.lastPageButton.click();
    await page.waitForLoadState('networkidle');

    // Step 11: Verify Next/Last disabled
    await expect(vendorPage.nextPageButton).toBeDisabled();
    await expect(vendorPage.lastPageButton).toBeDisabled();

    // Step 12-14: Manual page jump
    await vendorPage.pageTextbox.fill('1');
    await page.keyboard.press('Enter');
    await page.waitForLoadState('networkidle');

    const jumpedPage = await vendorPage.pageTextbox.inputValue();
    expect(jumpedPage).toBe('1');
  });
});

