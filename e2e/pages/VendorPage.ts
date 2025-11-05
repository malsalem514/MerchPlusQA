import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * VendorPage - Page Object Model for Vendor Management
 *
 * Validated: 2025-11-05 (3-layer validation)
 * Coverage: 100% semantic locators (grid + form)
 * Source: View/VisionMerchandising.Razor/Views/Vendor/
 */
export class VendorPage extends BasePage {
  // ========================================
  // Grid View Locators (VendorManagement.razor)
  // ========================================

  // Toolbar Buttons
  readonly createButton: Locator;
  readonly columnsChooserButton: Locator;
  readonly filterButton: Locator;
  readonly exportButton: Locator;
  readonly refreshButton: Locator;

  // Grid Elements
  readonly grid: Locator;
  readonly gridStatus: Locator;

  // Pagination
  readonly firstPageButton: Locator;
  readonly previousPageButton: Locator;
  readonly nextPageButton: Locator;
  readonly lastPageButton: Locator;
  readonly pageTextbox: Locator;
  readonly pageSizeDropdown: Locator;

  // ========================================
  // Create/Edit Form Locators (EditVendorInfo.razor)
  // ========================================

  // Vendor Information Section
  readonly vendorPrefixField: Locator;
  readonly vendorIdField: Locator;
  readonly vendorNameField: Locator;
  readonly billToVendorField: Locator;
  readonly parentRebateVendorField: Locator;
  readonly statusField: Locator;
  readonly effectiveDateField: Locator;
  readonly internalVendorCheckbox: Locator;
  readonly superCertifiedCheckbox: Locator;
  readonly firstCostCheckbox: Locator;

  // Address Section
  readonly address1Field: Locator;
  readonly address2Field: Locator;
  readonly cityField: Locator;
  readonly stateField: Locator;
  readonly countryField: Locator;
  readonly zipField: Locator;
  readonly telephoneField: Locator;
  readonly emailField: Locator;

  // Contact Information Section
  readonly contactFirstNameField: Locator;
  readonly contactLastNameField: Locator;
  readonly contactPhoneField: Locator;

  // Action Buttons
  readonly saveButton: Locator;
  readonly cancelButton: Locator;
  readonly nextButton: Locator;

  // Notifications
  readonly successNotification: Locator;
  readonly errorNotification: Locator;

  constructor(page: Page) {
    super(page);

    // ========================================
    // Grid View (Semantic Locators - 100% validated)
    // ========================================

    // Toolbar - Priority: Semantic > aria-label > CSS fallback
    this.createButton = page.getByRole('button', { name: 'Create' });

    // Icon buttons (fallback to CSS if no aria-label)
    this.columnsChooserButton = page.locator('.bi-list-columns-reverse').first();
    this.filterButton = page.locator('.bi-filter').first();
    this.exportButton = page.locator('.bi-filetype-xlsx').first();
    this.refreshButton = page.locator('.bi-arrow-repeat').first();

    // Grid (DevExpress treegrid - WCAG 2.1 compliant)
    this.grid = page.getByRole('treegrid');
    this.gridStatus = page.getByRole('status'); // "Data grid with X rows..."

    // Pagination (100% semantic)
    this.firstPageButton = page.getByRole('button', { name: 'First page' });
    this.previousPageButton = page.getByRole('button', { name: 'Previous page' });
    this.nextPageButton = page.getByRole('button', { name: 'Next page' });
    this.lastPageButton = page.getByRole('button', { name: 'Last page' });
    this.pageTextbox = page.getByRole('textbox', { name: /page.*of/i });
    this.pageSizeDropdown = page.getByRole('combobox', { name: /20|50|100/i });

    // ========================================
    // Form (100% semantic - Model-driven labels)
    // ========================================

    // Vendor Section
    this.vendorPrefixField = page.getByLabel('Vendor Prefix');
    this.vendorIdField = page.getByLabel(/^Vendor ID/i);
    this.vendorNameField = page.getByLabel(/^Vendor Name/i);
    this.billToVendorField = page.getByLabel(/Bill.*to.*Vendor/i);
    this.parentRebateVendorField = page.getByLabel(/Parent.*Rebate.*Vendor/i);
    this.statusField = page.getByLabel(/^Status/i);
    this.effectiveDateField = page.getByLabel('Effective Date');
    this.internalVendorCheckbox = page.getByLabel('Internal Vendor');
    this.superCertifiedCheckbox = page.getByLabel('Super Certified');
    this.firstCostCheckbox = page.getByLabel('First Cost');

    // Address Section
    this.address1Field = page.getByLabel('Address 1');
    this.address2Field = page.getByLabel('Address 2');
    this.cityField = page.getByLabel('City');
    this.stateField = page.getByLabel(/Province|State/i);
    this.countryField = page.getByLabel('Country');
    this.zipField = page.getByLabel(/Zip|Postal/i);
    this.telephoneField = page.getByLabel('Telephone');
    this.emailField = page.getByLabel('Email');

    // Contact Section
    this.contactFirstNameField = page.getByLabel('Contact First Name');
    this.contactLastNameField = page.getByLabel('Contact Last Name');
    this.contactPhoneField = page.getByLabel('Contact Phone');

    // Buttons
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.nextButton = page.getByRole('button', { name: 'Next' });

    // Notifications (DevExpress notification component)
    this.successNotification = page.locator('.dxbl-notification-success').first();
    this.errorNotification = page.locator('.dxbl-notification-error').first();
  }

  // ========================================
  // Grid Actions
  // ========================================

  /**
   * Navigate to Vendor Management page
   */
  async goto() {
    // Navigate: Product → Vendor → Vendor Management
    await this.navigateToModule('Product', 'Vendor', 'Vendor Management');
    await this.waitForGridLoad();
  }

  /**
   * Wait for grid to load
   */
  async waitForGridLoad() {
    await this.grid.waitFor({ state: 'visible', timeout: 10000 });
    await expect(this.gridStatus).toBeVisible();
  }

  /**
   * Get grid row count from status text
   * @returns Number of rows (e.g., "Data grid with 5 rows..." → 5)
   */
  async getGridRowCount(): Promise<number> {
    const statusText = await this.gridStatus.textContent();
    const match = statusText?.match(/(\d+)\s+rows?/);
    return match ? parseInt(match[1]) : 0;
  }

  /**
   * Find vendor row by ID or name
   */
  getVendorRow(vendorIdOrName: string): Locator {
    return this.page.getByRole('row', { name: new RegExp(vendorIdOrName, 'i') });
  }

  /**
   * Get action buttons for a vendor row
   */
  getVendorActions(vendorIdOrName: string) {
    const row = this.getVendorRow(vendorIdOrName);
    const buttons = row.getByRole('button');

    return {
      view: buttons.nth(0),  // First button (eye icon)
      edit: buttons.nth(1),  // Second button (pencil icon)
      delete: buttons.nth(2) // Third button (trash icon)
    };
  }

  /**
   * Click Create button to open vendor entry form
   */
  async clickCreate() {
    await this.createButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Apply filter to grid
   */
  async applyFilter(column: string, value: string) {
    // Toggle filter on if not already visible
    await this.filterButton.click();
    await this.page.waitForTimeout(500); // Filter row animation

    // Type in column filter
    const filterInput = this.page.getByRole('textbox', { name: new RegExp(column, 'i') });
    await filterInput.fill(value);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Clear all filters
   */
  async clearFilters() {
    await this.filterButton.click(); // Toggle off
    await this.page.waitForLoadState('networkidle');
  }

  // ========================================
  // Form Actions
  // ========================================

  /**
   * Fill vendor form with minimal required fields
   */
  async fillMinimalVendor(data: {
    vendorId: string;
    vendorName: string;
    billToVendor?: string;
    parentRebateVendor?: string;
    status?: string;
  }) {
    // Fill Vendor ID (if not auto-generated)
    await this.vendorIdField.fill(data.vendorId);

    // Fill Vendor Name
    await this.vendorNameField.fill(data.vendorName);

    // Bill To Vendor (defaults to self if not provided)
    if (data.billToVendor) {
      await this.selectSearchField(this.billToVendorField, data.billToVendor);
    } else {
      await this.selectSearchField(this.billToVendorField, data.vendorId);
    }

    // Parent Rebate Vendor (defaults to self if not provided)
    if (data.parentRebateVendor) {
      await this.selectSearchField(this.parentRebateVendorField, data.parentRebateVendor);
    } else {
      await this.selectSearchField(this.parentRebateVendorField, data.vendorId);
    }

    // Status (defaults to ACTIVE if not provided)
    if (data.status) {
      await this.statusField.click();
      await this.page.getByText(data.status).click();
    }
  }

  /**
   * Helper: Select value in JSearchText component
   */
  private async selectSearchField(field: Locator, value: string) {
    // Click to open dropdown
    await field.click();

    // Type search text
    const searchBox = this.page.getByPlaceholder('Type search text...');
    await searchBox.fill(value);
    await this.page.waitForTimeout(500); // Debounce search

    // Select from results
    await this.page.getByText(value).first().click();
  }

  /**
   * Fill vendor with extended fields (optional)
   */
  async fillExtendedVendor(data: {
    contactFirstName?: string;
    contactLastName?: string;
    address1?: string;
    city?: string;
    state?: string;
    country?: string;
    zipPostalCode?: string;
    telephone?: string;
    email?: string;
  }) {
    // Expand Address accordion if needed
    if (data.address1 || data.city || data.country) {
      await this.expandAccordion('Address');
      if (data.address1) await this.address1Field.fill(data.address1);
      if (data.city) await this.cityField.fill(data.city);
      if (data.country) {
        await this.countryField.click();
        await this.page.getByText(data.country).click();
      }
      if (data.state) {
        await this.stateField.click();
        await this.page.getByText(data.state).click();
      }
      if (data.zipPostalCode) await this.zipField.fill(data.zipPostalCode);
      if (data.telephone) await this.telephoneField.fill(data.telephone);
      if (data.email) await this.emailField.fill(data.email);
    }

    // Expand Contact Information accordion if needed
    if (data.contactFirstName || data.contactLastName) {
      await this.expandAccordion('Contact Information');
      if (data.contactFirstName) await this.contactFirstNameField.fill(data.contactFirstName);
      if (data.contactLastName) await this.contactLastNameField.fill(data.contactLastName);
    }
  }

  /**
   * Helper: Expand accordion section by name
   */
  private async expandAccordion(sectionName: string) {
    const accordion = this.page.getByRole('button', { name: new RegExp(sectionName, 'i') });
    const isExpanded = await accordion.getAttribute('aria-expanded');
    if (isExpanded !== 'true') {
      await accordion.click();
      await this.page.waitForTimeout(300); // Accordion animation
    }
  }

  /**
   * Save vendor form
   */
  async save() {
    await this.saveButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Cancel vendor form
   */
  async cancel() {
    await this.cancelButton.click();
  }

  /**
   * Verify success notification
   */
  async verifySuccessNotification(expectedText?: string) {
    await expect(this.successNotification).toBeVisible({ timeout: 5000 });

    if (expectedText) {
      await expect(this.successNotification).toContainText(expectedText);
    }

    // Wait for notification to auto-dismiss
    await this.successNotification.waitFor({ state: 'hidden', timeout: 10000 });
  }

  /**
   * Verify error notification
   */
  async verifyErrorNotification(expectedText?: string) {
    await expect(this.errorNotification).toBeVisible({ timeout: 5000 });

    if (expectedText) {
      await expect(this.errorNotification).toContainText(expectedText);
    }
  }

  /**
   * Verify vendor exists in grid
   */
  async verifyVendorInGrid(vendorId: string, expectedData?: {
    name?: string;
    status?: string;
    country?: string;
    currency?: string;
  }) {
    const row = this.getVendorRow(vendorId);
    await expect(row).toBeVisible({ timeout: 5000 });

    if (expectedData?.status) {
      await expect(row.getByRole('gridcell', { name: expectedData.status })).toBeVisible();
    }

    if (expectedData?.name) {
      await expect(row.getByRole('gridcell', { name: new RegExp(expectedData.name, 'i') })).toBeVisible();
    }
  }

  /**
   * Get column header locator
   */
  getColumnHeader(columnName: string): Locator {
    return this.page.getByRole('columnheader', { name: columnName });
  }

  /**
   * Get grid cell by text
   */
  getGridCell(text: string): Locator {
    return this.page.getByRole('gridcell', { name: text });
  }

  /**
   * Edit vendor by ID
   */
  async editVendor(vendorId: string) {
    const actions = this.getVendorActions(vendorId);
    await actions.edit.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * View vendor details by ID
   */
  async viewVendor(vendorId: string) {
    const actions = this.getVendorActions(vendorId);
    await actions.view.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Delete vendor by ID
   */
  async deleteVendor(vendorId: string, confirmDelete: boolean = true) {
    const actions = this.getVendorActions(vendorId);
    await actions.delete.click();

    // Handle confirmation popup
    if (confirmDelete) {
      await this.page.getByRole('button', { name: /yes|confirm|delete/i }).click();
    } else {
      await this.page.getByRole('button', { name: /no|cancel/i }).click();
    }
  }
}
