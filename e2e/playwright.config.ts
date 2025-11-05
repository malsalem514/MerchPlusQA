import { defineConfig, devices } from '@playwright/test';

/**
 * Vision Merchandising Plus - Playwright Configuration
 * Optimized for Blazor WebAssembly + DevExpress components
 */

const BASE_URL = process.env.BASE_URL || 'https://localhost:9443';

export default defineConfig({
  testDir: './tests',

  // Run tests in parallel
  fullyParallel: true,

  // Fail build if test.only in CI
  forbidOnly: !!process.env.CI,

  // Retries on CI (flaky test protection)
  retries: process.env.CI ? 2 : 0,

  // Parallel workers (CI optimized)
  workers: process.env.CI ? 4 : undefined,

  // Reporters
  reporter: [
    ['list'],  // Console output
    ['html', { open: process.env.CI ? 'never' : 'on-failure' }],
    ['junit', { outputFile: 'test-results/junit-results.xml' }]
  ],

  // Global test timeout (Blazor WebAssembly can be slow)
  timeout: 60000,  // 60s per test

  // Shared settings
  use: {
    baseURL: BASE_URL,

    // Blazor WebAssembly needs longer timeouts
    actionTimeout: 15000,      // 15s for actions
    navigationTimeout: 30000,  // 30s for navigation

    // Traces and videos (on-demand)
    trace: process.env.CI ? 'on-first-retry' : 'retain-on-failure',
    video: process.env.CI ? 'on-first-retry' : 'retain-on-failure',
    screenshot: 'only-on-failure',

    // Ignore HTTPS errors (self-signed certs in test environments)
    ignoreHTTPSErrors: true,
  },

  // Expect timeout
  expect: {
    timeout: 10000  // 10s for assertions
  },

  // Browser configurations
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 }
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 }
      },
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1920, height: 1080 }
      },
    },
  ],

  // Local dev server (disabled - app runs on remote server)
  // webServer: undefined,
});

