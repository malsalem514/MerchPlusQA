import { Page, Locator } from '@playwright/test';

/**
 * BasePage - Base class for all Page Object Models
 *
 * Provides common functionality for Vision Merch+ navigation and interactions
 */
export class BasePage {
  readonly page: Page;

  // Common elements
  readonly hamburgerMenu: Locator;
  readonly searchMenu: Locator;
  readonly homeButton: Locator;
  readonly userInfo: Locator;

  constructor(page: Page) {
    this.page = page;

    // Common navigation elements
    this.hamburgerMenu = page.getByRole('button', { name: '☰' });
    this.searchMenu = page.getByPlaceholder('Search menu...');
    this.homeButton = page.getByRole('button', { name: 'Home' });
    this.userInfo = page.locator('text=MUSERQA');
  }

  /**
   * Navigate to a module via tree navigation
   * Example: navigateToModule('Product', 'Vendor', 'Vendor Management')
   */
  async navigateToModule(...menuPath: string[]) {
    for (const menuItem of menuPath) {
      // Click the paragraph text inside treeitem (more reliable than treeitem role)
      const menuParagraph = this.page.locator(`p:has-text("${menuItem}")`).first();
      await menuParagraph.click({ timeout: 15000 });
      await this.page.waitForTimeout(500); // Menu expansion animation
    }
  }

  /**
   * Close current tab
   */
  async closeTab(tabName: string) {
    const tab = this.page.getByRole('button', { name: new RegExp(tabName, 'i') });
    const closeButton = tab.locator('..').getByRole('button').last(); // X button
    await closeButton.click();
  }

  /**
   * Wait for page to be ready
   */
  async waitForReady() {
    await this.page.waitForLoadState('networkidle');
  }
}
