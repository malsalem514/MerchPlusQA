import { Page } from '@playwright/test';

export class DevExpressHelpers {
  constructor(private page: Page) {}

  async waitForGridLoaded(gridTestId: string) {
    const grid = this.page.locator(`[data-testid="${gridTestId}"]`);
    await grid.waitFor({ state: 'visible' });

    await this.page.waitForFunction((testId) => {
      const grid = document.querySelector(`[data-testid="${testId}"]`);
      const hasRows = grid?.querySelectorAll('.dxbl-grid-data-row').length > 0;
      const isEmpty = grid?.querySelector('.dxbl-grid-empty-data-row') !== null;
      return hasRows || isEmpty;
    }, gridTestId);
  }

  async getGridRowCount(gridTestId: string): Promise<number> {
    return await this.page
      .locator(`[data-testid="${gridTestId}"] .dxbl-grid-data-row`)
      .count();
  }

  async selectComboBoxOption(comboBoxTestId: string, optionText: string) {
    await this.page.click(`[data-testid="${comboBoxTestId}"]`);
    await this.page.waitForSelector('.dxbl-dropdown-content', { state: 'visible' });
    await this.page.click(`text=${optionText}`);
    await this.page.waitForSelector('.dxbl-dropdown-content', { state: 'hidden' });
  }

  async waitForPopup() {
    await this.page.waitForSelector('.dxbl-popup', { state: 'visible' });
  }
}

