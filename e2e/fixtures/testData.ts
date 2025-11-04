import { APIRequestContext } from '@playwright/test';

export interface Vendor {
  id?: number;
  code: string;
  name: string;
  country: string;
  status: string;
}

export class TestDataManager {
  constructor(private request: APIRequestContext) {}

  async createTestVendor(data?: Partial<Vendor>): Promise<Vendor> {
    const vendor = {
      code: `TEST-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: data?.name || 'Test Vendor Corporation',
      country: data?.country || 'US',
      status: data?.status || 'ACTIVE',
      ...data
    };

    const response = await this.request.post('/api/vendors', {
      data: vendor
    });

    if (!response.ok()) {
      throw new Error(`Failed to create test vendor: ${response.statusText()}`);
    }

    return await response.json();
  }

  async deleteTestVendor(code: string) {
    await this.request.delete(`/api/vendors/${code}`);
  }

  async createTestPO(data?: any): Promise<any> {
    const po = {
      poNumber: `PO-TEST-${Date.now()}`,
      status: data?.status || 'DRAFT',
      orderDate: data?.orderDate || new Date().toISOString(),
      lines: data?.lines || [],
      ...data
    };

    const response = await this.request.post('/api/purchase-orders', {
      data: po
    });

    return await response.json();
  }

  async deleteTestPO(poNumber: string) {
    await this.request.delete(`/api/purchase-orders/${poNumber}`);
  }

  async cleanupAllTestData() {
    // Delete all TEST- prefixed data
    const vendors = await this.request.get('/api/vendors?code=TEST-*');
    const vendorList = await vendors.json();

    for (const vendor of vendorList) {
      await this.deleteTestVendor(vendor.code);
    }

    const pos = await this.request.get('/api/purchase-orders?number=PO-TEST-*');
    const poList = await pos.json();

    for (const po of poList) {
      await this.deleteTestPO(po.poNumber);
    }
  }
}

