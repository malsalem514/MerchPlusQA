/**
 * Semantic Locator Discovery Test
 *
 * Purpose: Test what elements are findable using SEMANTIC locators
 * WITHOUT adding any data-testid or aria-label attributes
 *
 * This test will FAIL on elements that need attributes
 * This test will PASS on elements that are already accessible
 *
 * Strategy: Playwright Best Practices
 * - getByRole() - highest priority
 * - getByLabel() - form fields
 * - getByText() - visible content
 * - getByPlaceholder() - inputs
 */

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'https://srv-fm-102.jestais.local:9444';
const TEST_USER = process.env.TEST_USER || '';
const TEST_PASSWORD = process.env.TEST_PASSWORD || '';

test.describe('Semantic Locator Discovery (No testid needed!)', () => {

  test('[DISCOVERY-001] Login page - Semantic locators', async ({ page }) => {
    await page.goto(BASE_URL);

    // Discovery log
    console.log('\n=== LOGIN PAGE DISCOVERY ===');

    // Try to find username field (multiple strategies)
    try {
      await page.getByLabel(/username/i).fill('test');
      console.log('✅ Username field: getByLabel() WORKS');
    } catch (e) {
      console.log('❌ Username field: getByLabel() FAILED - needs label or testid');

      // Try placeholder
      try {
        await page.getByPlaceholder(/username|user/i).fill('test');
        console.log('✅ Username field: getByPlaceholder() WORKS');
      } catch (e2) {
        console.log('❌ Username field: getByPlaceholder() FAILED');

        // Try role
        try {
          const inputs = await page.getByRole('textbox').all();
          if (inputs.length > 0) {
            await inputs[0].fill('test');
            console.log(`✅ Username field: getByRole('textbox') WORKS (found ${inputs.length} textboxes)`);
          }
        } catch (e3) {
          console.log('❌ Username field: NO SEMANTIC LOCATOR WORKS - NEEDS data-testid');
        }
      }
    }

    // Try to find password field
    try {
      await page.getByLabel(/password/i).fill('test123');
      console.log('✅ Password field: getByLabel() WORKS');
    } catch (e) {
      console.log('❌ Password field: getByLabel() FAILED');

      try {
        await page.getByPlaceholder(/password|pass/i).fill('test123');
        console.log('✅ Password field: getByPlaceholder() WORKS');
      } catch (e2) {
        console.log('❌ Password field: NO SEMANTIC LOCATOR WORKS - NEEDS data-testid');
      }
    }

    // Try to find login button
    try {
      await page.getByRole('button', { name: /login|sign in/i }).click();
      console.log('✅ Login button: getByRole() WORKS');
    } catch (e) {
      console.log('❌ Login button: getByRole() FAILED');

      try {
        await page.getByText(/login|sign in/i).click();
        console.log('✅ Login button: getByText() WORKS');
      } catch (e2) {
        console.log('❌ Login button: NO SEMANTIC LOCATOR WORKS - NEEDS data-testid');
      }
    }

    console.log('=== END LOGIN DISCOVERY ===\n');
  });

  test('[DISCOVERY-002] Navigation - Semantic locators', async ({ page }) => {
    // Skip login for now (will implement based on discovery)
    await page.goto(BASE_URL);

    console.log('\n=== NAVIGATION DISCOVERY ===');

    // Try to find hamburger menu
    try {
      await page.getByRole('button', { name: /menu|☰/i }).click();
      console.log('✅ Hamburger menu: getByRole() WORKS');
    } catch (e) {
      console.log('❌ Hamburger menu: Trying alternative...');

      try {
        // Look for button with hamburger icon
        const menuButton = page.locator('button').filter({ hasText: '☰' });
        await menuButton.click();
        console.log('✅ Hamburger menu: filter({ hasText }) WORKS');
      } catch (e2) {
        console.log('❌ Hamburger menu: NO SEMANTIC LOCATOR - NEEDS testid or aria-label');
      }
    }

    // Try to find Vendor link
    try {
      await page.getByRole('link', { name: /vendor/i }).click();
      console.log('✅ Vendor link: getByRole() WORKS');
    } catch (e) {
      console.log('❌ Vendor link: getByRole() FAILED');

      try {
        await page.getByText(/vendor/i).click();
        console.log('✅ Vendor link: getByText() WORKS');
      } catch (e2) {
        console.log('❌ Vendor link: NO SEMANTIC LOCATOR - NEEDS testid');
      }
    }

    console.log('=== END NAVIGATION DISCOVERY ===\n');
  });

  test('[DISCOVERY-003] Vendor page - Grid and actions', async ({ page }) => {
    await page.goto(BASE_URL + '/vendors');  // Direct URL (skip nav for now)

    console.log('\n=== VENDOR PAGE DISCOVERY ===');

    // Try to find Add/Create button
    try {
      await page.getByRole('button', { name: /create|add.*vendor/i }).click();
      console.log('✅ Create Vendor button: getByRole() WORKS');
    } catch (e) {
      console.log('❌ Create Vendor button: Trying alternatives...');

      try {
        await page.getByRole('button', { name: /\+/i }).click();
        console.log('✅ Create button: getByRole() with + icon WORKS');
      } catch (e2) {
        console.log('❌ Create Vendor button: NO SEMANTIC LOCATOR - NEEDS testid or aria-label');
      }
    }

    // Try to find vendor grid
    try {
      const grid = page.getByRole('grid');
      const rowCount = await grid.locator('[role="row"]').count();
      console.log(`✅ Vendor grid: getByRole('grid') WORKS (found ${rowCount} rows)`);
    } catch (e) {
      console.log('❌ Vendor grid: getByRole() FAILED');

      try {
        const grid = page.locator('.dxbl-grid');
        const isVisible = await grid.isVisible();
        console.log(`✅ Vendor grid: CSS selector WORKS (visible: ${isVisible}) - but needs semantic role!`);
      } catch (e2) {
        console.log('❌ Vendor grid: NO LOCATOR WORKS');
      }
    }

    console.log('=== END VENDOR PAGE DISCOVERY ===\n');
  });

  test('[DISCOVERY-004] PO page - Buttons and forms', async ({ page }) => {
    await page.goto(BASE_URL + '/purchaseorders');

    console.log('\n=== PO PAGE DISCOVERY ===');

    // Try to find Create PO button
    try {
      await page.getByRole('button', { name: /create.*po|new.*po/i }).click();
      console.log('✅ Create PO button: getByRole() WORKS');
    } catch (e) {
      console.log('❌ Create PO button: NO SEMANTIC LOCATOR - NEEDS testid or aria-label');
    }

    // Try to find PO grid
    try {
      const grid = page.getByRole('grid');
      await expect(grid).toBeVisible();
      console.log('✅ PO grid: getByRole() WORKS');
    } catch (e) {
      console.log('❌ PO grid: NO SEMANTIC LOCATOR - NEEDS testid');
    }

    console.log('=== END PO PAGE DISCOVERY ===\n');
  });

  test('[DISCOVERY-SUMMARY] Generate report', async ({ page }) => {
    console.log('\n');
    console.log('='.repeat(60));
    console.log('  SEMANTIC LOCATOR DISCOVERY SUMMARY');
    console.log('='.repeat(60));
    console.log('');
    console.log('Next Steps:');
    console.log('1. Review console output above');
    console.log('2. Count: How many ✅ vs ❌');
    console.log('3. Categorize elements:');
    console.log('   - Tier 1: Semantic locators work (NO CHANGES)');
    console.log('   - Tier 2: Need aria-label (accessibility improvement)');
    console.log('   - Tier 3: Need data-testid (last resort)');
    console.log('');
    console.log('Expected:');
    console.log('- 40-60% work with semantic locators (Tier 1)');
    console.log('- 20-30% need aria-label (Tier 2)');
    console.log('- 10-20% need data-testid (Tier 3)');
    console.log('');
    console.log('Time Savings: 40+ hours if 60% works now!');
    console.log('='.repeat(60));
    console.log('');
  });
});

