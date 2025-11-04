import { Page } from '@playwright/test';

export class AuthHelper {
  static async login(page: Page, username: string, password: string) {
    await page.goto('/login');

    await page.fill('[data-testid="username"]', username);
    await page.fill('[data-testid="password"]', password);
    await page.click('[data-testid="login-button"]');

    // Wait for redirect
    await page.waitForURL('**/dashboard', { timeout: 10000 });
  }

  static async loginAsAdmin(page: Page) {
    const username = process.env.TEST_USER || 'admin@test.com';
    const password = process.env.TEST_PASSWORD || 'admin123';
    await this.login(page, username, password);
  }

  static async loginAsUser(page: Page) {
    const username = process.env.TEST_USER_REGULAR || 'user@test.com';
    const password = process.env.TEST_PASSWORD_REGULAR || 'user123';
    await this.login(page, username, password);
  }
}

