import { Page, expect } from '@playwright/test';

export class BasePage {
  constructor(protected page: Page) {}

  async waitForBlazorReady() {
    await this.page.waitForSelector('#app', { state: 'visible' });
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForFunction(() => {
      const app = document.querySelector('#app');
      return app && app.childElementCount > 0;
    });
  }

  async fill(testId: string, value: string) {
    await this.page.fill(`[data-testid="${testId}"]`, value);
  }

  async click(testId: string) {
    await this.page.click(`[data-testid="${testId}"]`);
  }

  async expectVisible(testId: string) {
    await expect(this.page.locator(`[data-testid="${testId}"]`))
      .toBeVisible();
  }

  async expectText(testId: string, text: string) {
    await expect(this.page.locator(`[data-testid="${testId}"]`))
      .toContainText(text);
  }

  async expectSuccess(message?: string) {
    const toast = this.page.locator('[data-testid="success-toast"]');
    await expect(toast).toBeVisible({ timeout: 5000 });

    if (message) {
      await expect(toast).toContainText(message);
    }
  }
}

