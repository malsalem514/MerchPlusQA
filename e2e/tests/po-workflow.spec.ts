/**
 * Vision Merchandising Plus - Purchase Order Workflow E2E Tests
 * Tests complete PO creation, submission, and approval workflow
 */

import { expect, test } from '@playwright/test';
import { AuthHelper } from '../fixtures/auth';
import { TestDataManager } from '../fixtures/testData';
import { POPage } from '../pages/POPage';

test.describe('Purchase Order Workflow', () => {
  let poPage: POPage;
  let testData: TestDataManager;
  const createdPOs: string[] = [];

  test.beforeEach(async ({ page, request }) => {
    await AuthHelper.loginAsAdmin(page);
    poPage = new POPage(page);
    testData = new TestDataManager(request);
    await poPage.goto();
  });

  test.afterEach(async () => {
    for (const poNumber of createdPOs) {
      try {
        await testData.deleteTestPO(poNumber);
      } catch (e) {
        console.log(`Cleanup failed for ${poNumber}`);
      }
    }
  });

  test('[PO-001] Create PO with single line', async ({ page }) => {
    // Arrange
    const vendor = await testData.createTestVendor();
    const poNumber = `PO-TEST-${Date.now()}`;
    createdPOs.push(poNumber);

    // Act
    await poPage.createPO({
      vendor: vendor.name,
      orderDate: new Date().toISOString().split('T')[0],
      lines: [
        { style: 'TEST-STYLE-A', quantity: 10, unitPrice: 50.00 }
      ]
    });

    // Assert
    await expect(page.locator('[data-testid="success-toast"]'))
      .toContainText('Purchase order created');

    await poPage.searchPO(poNumber);
    await expect(page.locator(`[data-testid="po-${poNumber}"]`))
      .toBeVisible();
  });

  test('[PO-002] Create PO with multiple lines', async ({ page }) => {
    // Arrange
    const vendor = await testData.createTestVendor();
    const poNumber = `PO-TEST-${Date.now()}`;
    createdPOs.push(poNumber);

    // Act - create PO with 3 lines
    await poPage.createPO({
      vendor: vendor.name,
      orderDate: new Date().toISOString().split('T')[0],
      lines: [
        { style: 'TEST-STYLE-A', quantity: 10, unitPrice: 50.00 },
        { style: 'TEST-STYLE-B', quantity: 20, unitPrice: 75.00 },
        { style: 'TEST-STYLE-C', quantity: 5, unitPrice: 100.00 }
      ]
    });

    // Assert - verify all lines
    await expect(page.locator('[data-testid="po-lines-count"]'))
      .toContainText('3');

    // Verify total calculation
    const expectedTotal = (10 * 50) + (20 * 75) + (5 * 100);
    await expect(page.locator('[data-testid="po-total"]'))
      .toContainText(expectedTotal.toString());
  });

  test('[PO-003] Submit PO for approval', async ({ page }) => {
    // Arrange - create PO via API
    const po = await testData.createTestPO({ status: 'DRAFT' });
    createdPOs.push(po.poNumber);

    await poPage.goto();

    // Act
    await poPage.submitPO(po.poNumber);

    // Assert
    await expect(page.locator('[data-testid="success-toast"]'))
      .toContainText('submitted for approval');

    await poPage.searchPO(po.poNumber);
    await expect(page.locator(`[data-testid="po-${po.poNumber}-status"]`))
      .toContainText('SUBMITTED');
  });

  test('[PO-004] Approve PO workflow', async ({ page }) => {
    // Arrange
    const po = await testData.createTestPO({ status: 'SUBMITTED' });
    createdPOs.push(po.poNumber);

    await poPage.goto();

    // Act
    await poPage.approvePO(po.poNumber);

    // Assert
    await expect(page.locator('[data-testid="success-toast"]'))
      .toContainText('approved');

    await expect(page.locator(`[data-testid="po-${po.poNumber}-status"]`))
      .toContainText('APPROVED');
  });

  test('[PO-005] Search PO by number', async () => {
    // Arrange
    const po1 = await testData.createTestPO({ poNumber: 'PO-ALPHA-001' });
    const po2 = await testData.createTestPO({ poNumber: 'PO-BETA-002' });

    createdPOs.push(po1.poNumber, po2.poNumber);

    await poPage.goto();

    // Act
    await poPage.searchPO('ALPHA');

    // Assert - only ALPHA PO shown
    await expect(page.locator(`[data-testid="po-${po1.poNumber}"]`))
      .toBeVisible();

    const count = await poPage.getPOCount();
    expect(count).toBe(1);
  });

  test('[PO-006] Add line to existing PO', async ({ page }) => {
    // Arrange
    const po = await testData.createTestPO({
      lines: [{ style: 'TEST-STYLE-A', quantity: 10, unitPrice: 50 }]
    });
    createdPOs.push(po.poNumber);

    await poPage.goto();
    await poPage.openPO(po.poNumber);

    // Act - add another line
    await page.click('[data-testid="add-line"]');
    await page.fill('[data-testid="line-style"]', 'TEST-STYLE-B');
    await page.fill('[data-testid="line-quantity"]', '20');
    await page.fill('[data-testid="line-unit-price"]', '75.00');
    await page.click('[data-testid="save-line"]');

    // Assert
    await expect(page.locator('[data-testid="po-lines-count"]'))
      .toContainText('2');
  });

  test('[PO-007] Delete PO line', async ({ page }) => {
    // Arrange
    const po = await testData.createTestPO({
      lines: [
        { style: 'TEST-STYLE-A', quantity: 10, unitPrice: 50 },
        { style: 'TEST-STYLE-B', quantity: 20, unitPrice: 75 }
      ]
    });
    createdPOs.push(po.poNumber);

    await poPage.goto();
    await poPage.openPO(po.poNumber);

    // Act - delete first line
    await page.click('[data-testid="delete-line-1"]');
    await page.click('[data-testid="confirm-delete"]');

    // Assert
    await expect(page.locator('[data-testid="po-lines-count"]'))
      .toContainText('1');
  });

  test('[PO-008] PO total calculates correctly', async ({ page }) => {
    // Arrange
    const lines = [
      { style: 'TEST-STYLE-A', quantity: 10, unitPrice: 50.00 },
      { style: 'TEST-STYLE-B', quantity: 20, unitPrice: 75.00 }
    ];

    const expectedTotal = (10 * 50.00) + (20 * 75.00); // 2000.00

    // Act
    await poPage.createPO({
      vendor: 'TEST-VENDOR-US',
      orderDate: new Date().toISOString().split('T')[0],
      lines
    });

    // Assert
    await expect(page.locator('[data-testid="po-total"]'))
      .toContainText('2000.00');
  });
});

test.describe('PO Validation Rules', () => {
  let poPage: POPage;

  test.beforeEach(async ({ page }) => {
    await AuthHelper.loginAsAdmin(page);
    poPage = new POPage(page);
    await poPage.goto();
  });

  test('[PO-009] Cannot submit PO without lines', async ({ page }) => {
    // Act - create PO without lines
    await page.click('[data-testid="create-po"]');
    await page.fill('[data-testid="po-vendor"]', 'TEST-VENDOR-US');
    await page.click('[data-testid="save-po"]');

    // Try to submit
    await page.click('[data-testid="submit-po"]');

    // Assert - error shown
    await expect(page.locator('[data-testid="error-toast"]'))
      .toContainText('at least one line');
  });

  test('[PO-010] Cannot edit approved PO', async ({ page }) => {
    // Arrange
    const po = await testData.createTestPO({ status: 'APPROVED' });

    await poPage.goto();
    await poPage.searchPO(po.poNumber);

    // Assert - edit button disabled
    await expect(page.locator(`[data-testid="edit-po-${po.poNumber}"]`))
      .toBeDisabled();
  });
});

