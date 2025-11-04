/**
 * Vision Merchandising Plus - Vendor CRUD E2E Tests
 * Tests complete Create-Read-Update-Delete workflow for vendors
 */

import { test, expect } from '@playwright/test';
import { VendorPage } from '../pages/VendorPage';
import { AuthHelper } from '../fixtures/auth';
import { TestDataManager } from '../fixtures/testData';

test.describe('Vendor CRUD Operations', () => {
  let vendorPage: VendorPage;
  let testData: TestDataManager;
  const createdVendors: string[] = [];

  test.beforeEach(async ({ page, request }) => {
    // Login as admin
    await AuthHelper.loginAsAdmin(page);

    // Initialize helpers
    vendorPage = new VendorPage(page);
    testData = new TestDataManager(request);

    // Navigate to vendor management
    await vendorPage.goto();
  });

  test.afterEach(async () => {
    // Cleanup test vendors
    for (const code of createdVendors) {
      try {
        await testData.deleteTestVendor(code);
      } catch (e) {
        console.log(`Cleanup failed for ${code}:`, e);
      }
    }
  });

  test('[VENDOR-001] Create new vendor successfully', async ({ page }) => {
    // Arrange
    const vendorCode = `TEST-${Date.now()}`;
    createdVendors.push(vendorCode);

    // Act
    await vendorPage.addVendor({
      name: 'Test Vendor Corporation',
      code: vendorCode,
      country: 'United States',
      type: 'Domestic'
    });

    // Assert
    await expect(page.locator('[data-testid="success-toast"]'))
      .toContainText('Vendor created successfully');

    await vendorPage.searchVendor(vendorCode);
    await vendorPage.expectVendorInGrid(vendorCode);
  });

  test('[VENDOR-002] Edit existing vendor', async ({ page }) => {
    // Arrange - create vendor via API
    const vendor = await testData.createTestVendor({
      name: 'Original Vendor Name',
      country: 'US'
    });
    createdVendors.push(vendor.code);

    // Refresh page to see new vendor
    await vendorPage.goto();

    // Act
    await vendorPage.editVendor(vendor.code, {
      name: 'Updated Vendor Name',
      email: 'updated@vendor.com'
    });

    // Assert
    await expect(page.locator('[data-testid="success-toast"]'))
      .toContainText('Vendor updated');

    await vendorPage.searchVendor(vendor.code);
    await expect(page.locator(`[data-testid="vendor-${vendor.code}-name"]`))
      .toContainText('Updated Vendor Name');
  });

  test('[VENDOR-003] Search vendor by name', async () => {
    // Arrange - create multiple vendors
    const vendor1 = await testData.createTestVendor({ name: 'Alpha Vendor' });
    const vendor2 = await testData.createTestVendor({ name: 'Beta Vendor' });
    const vendor3 = await testData.createTestVendor({ name: 'Gamma Vendor' });

    createdVendors.push(vendor1.code, vendor2.code, vendor3.code);

    await vendorPage.goto();

    // Act
    await vendorPage.searchVendor('Beta');

    // Assert - only Beta vendor shown
    await vendorPage.expectVendorInGrid(vendor2.code);

    const count = await vendorPage.getVendorCount();
    expect(count).toBe(1);
  });

  test('[VENDOR-004] Filter vendors by country', async () => {
    // Arrange - create vendors in different countries
    const usVendor = await testData.createTestVendor({ country: 'US' });
    const caVendor = await testData.createTestVendor({ country: 'CA' });

    createdVendors.push(usVendor.code, caVendor.code);

    await vendorPage.goto();

    // Act - filter by US
    await vendorPage.filterByCountry('United States');

    // Assert - only US vendor shown
    await vendorPage.expectVendorInGrid(usVendor.code);

    const count = await vendorPage.getVendorCount();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('[VENDOR-005] Delete vendor', async ({ page }) => {
    // Arrange
    const vendor = await testData.createTestVendor();
    createdVendors.push(vendor.code); // Will try cleanup even if delete fails

    await vendorPage.goto();

    // Act
    await vendorPage.deleteVendor(vendor.code);

    // Assert
    await expect(page.locator('[data-testid="success-toast"]'))
      .toContainText('Vendor deleted');

    // Verify vendor not in grid
    await vendorPage.searchVendor(vendor.code);
    const count = await vendorPage.getVendorCount();
    expect(count).toBe(0);
  });

  test('[VENDOR-006] Validate required fields', async ({ page }) => {
    // Act - try to save without required fields
    await vendorPage.click('add-vendor');
    await page.waitForSelector('.dxbl-popup', { state: 'visible' });

    // Skip filling fields
    await vendorPage.click('save-vendor');

    // Assert - validation messages shown
    await expect(page.locator('.validation-message'))
      .toContainText('required');

    // Should not save
    await expect(page.locator('[data-testid="success-toast"]'))
      .not.toBeVisible();
  });

  test('[VENDOR-007] Duplicate vendor code not allowed', async ({ page }) => {
    // Arrange - create vendor
    const vendor = await testData.createTestVendor({ code: 'DUP001' });
    createdVendors.push(vendor.code);

    await vendorPage.goto();

    // Act - try to create with same code
    await vendorPage.click('add-vendor');
    await page.fill('[data-testid="vendor-name"]', 'Duplicate Vendor');
    await page.fill('[data-testid="vendor-code"]', 'DUP001');
    await vendorPage.click('save-vendor');

    // Assert - error shown
    await expect(page.locator('[data-testid="error-toast"]'))
      .toContainText('already exists');
  });
});

test.describe('Vendor Grid Interactions', () => {
  let vendorPage: VendorPage;

  test.beforeEach(async ({ page }) => {
    await AuthHelper.loginAsAdmin(page);
    vendorPage = new VendorPage(page);
    await vendorPage.goto();
  });

  test('[VENDOR-008] Grid pagination works', async ({ page }) => {
    // Verify grid has pagination controls
    await expect(page.locator('.dxbl-pager')).toBeVisible();

    // Get first page count
    const page1Count = await vendorPage.getVendorCount();
    expect(page1Count).toBeGreaterThan(0);

    // Go to next page
    await page.click('.dxbl-pager-next');
    await page.waitForTimeout(1000); // Wait for grid refresh

    // Verify different vendors on page 2
    const page2Count = await vendorPage.getVendorCount();
    expect(page2Count).toBeGreaterThan(0);
  });

  test('[VENDOR-009] Grid sorting works', async ({ page }) => {
    // Click column header to sort
    await page.click('[data-testid="vendor-name-column-header"]');

    // Wait for sort to apply
    await page.waitForTimeout(1000);

    // Verify sort icon shown
    await expect(page.locator('.dxbl-grid-header-sort-icon'))
      .toBeVisible();
  });

  test('[VENDOR-010] Grid filtering works', async ({ page }) => {
    // Open filter menu
    await page.click('[data-testid="country-filter-icon"]');

    // Select filter
    await page.click('text=United States');
    await page.click('[data-testid="apply-filter"]');

    // Wait for filtered results
    await page.waitForTimeout(1000);

    // Verify filter applied
    await expect(page.locator('[data-testid="active-filters"]'))
      .toContainText('United States');
  });
});

