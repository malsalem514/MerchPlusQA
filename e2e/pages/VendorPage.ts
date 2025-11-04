import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { DevExpressHelpers } from './DevExpressHelpers';

export interface VendorData {
  name: string;
  code: string;
  country: string;
  type?: string;
  email?: string;
}

export class VendorPage extends BasePage {
  private dx: DevExpressHelpers;

  constructor(page: Page) {
    super(page);
    this.dx = new DevExpressHelpers(page);
  }

  async goto() {
    await this.page.goto('/vendors');
    await this.waitForBlazorReady();
    await this.dx.waitForGridLoaded('vendor-grid');
  }

  async addVendor(vendor: VendorData) {
    await this.click('add-vendor');
    await this.dx.waitForPopup();

    await this.fill('vendor-name', vendor.name);
    await this.fill('vendor-code', vendor.code);

    await this.dx.selectComboBoxOption('vendor-country', vendor.country);

    if (vendor.type) {
      await this.dx.selectComboBoxOption('vendor-type', vendor.type);
    }

    if (vendor.email) {
      await this.fill('vendor-email', vendor.email);
    }

    await this.click('save-vendor');
    await this.expectSuccess();
  }

  async editVendor(vendorCode: string, updates: Partial<VendorData>) {
    await this.searchVendor(vendorCode);
    await this.click(`edit-vendor-${vendorCode}`);
    await this.dx.waitForPopup();

    if (updates.name) {
      await this.fill('vendor-name', updates.name);
    }

    if (updates.email) {
      await this.fill('vendor-email', updates.email);
    }

    await this.click('save-vendor');
    await this.expectSuccess();
  }

  async deleteVendor(vendorCode: string) {
    await this.searchVendor(vendorCode);
    await this.click(`delete-vendor-${vendorCode}`);
    await this.click('confirm-delete');
    await this.expectSuccess();
  }

  async searchVendor(query: string) {
    await this.fill('vendor-search', query);
    await this.click('search-button');
    await this.dx.waitForGridLoaded('vendor-grid');
  }

  async filterByCountry(country: string) {
    await this.dx.selectComboBoxOption('country-filter', country);
    await this.dx.waitForGridLoaded('vendor-grid');
  }

  async getVendorCount(): Promise<number> {
    return await this.dx.getGridRowCount('vendor-grid');
  }

  async expectVendorInGrid(vendorCode: string) {
    await this.expectVisible(`vendor-row-${vendorCode}`);
  }
}

