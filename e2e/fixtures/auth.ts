import { Page } from '@playwright/test';

/**
 * Authentication fixture for Vision Merchandising Plus
 * Credentials from .env: TEST_USER, TEST_PASSWORD
 */

export async function login(page: Page) {
  const baseUrl = process.env.BASE_URL || 'https://srv-fm-102.jestais.local:9444';
  const username = process.env.TEST_USER || 'MUSERQA';
  const password = process.env.TEST_PASSWORD || 'MUSERQA';

  // Navigate to login page
  await page.goto(baseUrl);

  // Wait for login page to load
  await page.waitForLoadState('networkidle');

  // Fill credentials
  await page.getByPlaceholder('Enter your username').fill(username);
  await page.getByPlaceholder('Enter your password').fill(password);

  // CRITICAL: Tab out of password field to trigger Business Unit population
  await page.keyboard.press('Tab');

  // Wait for Business Unit to be ready
  await page.getByText('Business unit(s) are ready, please select one.').waitFor({
    state: 'visible',
    timeout: 60000
  });

  // Business Unit does NOT auto-select - we need to select it manually!
  // DevExpress ComboBox has a button next to input to open dropdown
  const businessUnitButton = page.getByRole('button', { name: /open or close.*drop.*down/i });

  // Click dropdown button to open options
  await businessUnitButton.click();

  // Wait for dropdown popup to appear
  await page.waitForTimeout(1000);

  // Select first business unit option
  // Dropdown shows table with "Id" and "Name" columns
  // Look for "MAIN SYS PMTR" text (the name column)
  await page.getByText('MAIN SYS PMTR').click();

  // Wait for login button to enable
  await page.waitForTimeout(1000);

  // Click login
  const loginButton = page.getByRole('button', { name: 'Login' });
  await loginButton.click();

  // Wait for dashboard to load
  await page.waitForURL('**/tabwindow', { timeout: 60000 });
  await page.waitForLoadState('networkidle');

  // Verify logged in (check for user info)
  await page.getByText(/MUSERQA.*\(1\)/).waitFor({ state: 'visible', timeout: 10000 });
}
