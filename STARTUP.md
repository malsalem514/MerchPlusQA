# MerchPlusQA - Startup Guide

**MusaOS-Managed Project**

---

## Quick Info

**Project:** MerchPlusQA
**Type:** E2E Regression Testing
**Framework:** Playwright + TypeScript
**Target:** Vision Merchandising Plus (Blazor WebAssembly)
**MusaOS Integration:** ✅ Active

---

## 1. First Time Setup

```bash
# Install dependencies
npm install

# Setup E2E environment
cd e2e
npm install
npx playwright install --with-deps

# Start Oracle test database
cd ../docker
docker-compose up -d

# Wait for Oracle healthy status (~90 seconds)
docker ps | findstr merchplus-qa-oracle
# Should show: (healthy)
```

---

## 2. Configure Environment

```bash
# Create .env file
cd ../e2e
cp .env.example .env

# Edit .env with test credentials
code .env
```

**Required:**
- BASE_URL (test environment URL)
- TEST_USER (test account)
- TEST_PASSWORD (password)

---

## 3. Run Tests

```bash
# Smoke tests (7 critical paths, ~2 min)
npm run test:smoke

# All tests (27 tests, ~13 min)
npm test

# UI mode (interactive)
npm run test:ui

# Specific browser
npm run test:chromium
```

---

## 4. MusaOS Integration

**Bootstrap Agent:**
```bash
cd C:\musa\dev\MusaOS
set MUSA_PROJECT=merchplus-qa
npm run bootstrap:agent
```

**Knowledge Base Access:**
- Patterns: http://localhost:7000/dashboard/knowledge
- Incidents: Search for "playwright", "blazor", "e2e"
- Standards: STD-TEST-NAMING-CONVENTION

---

## 5. Development Workflow

### Adding New Tests

1. Create test file in `e2e/tests/{entity}/`
2. Follow naming: `[ENTITY-XXX] GIVEN-WHEN-THEN`
3. Use Page Objects (no selectors in tests)
4. Add cleanup in `afterEach`
5. Run 3 times locally (verify stability)
6. Submit PR

### Example Test

```typescript
test('[VENDOR-001] GIVEN logged-in admin WHEN creating vendor THEN saved successfully', async ({ page }) => {
  // Arrange
  const vendor = {
    code: `TEST-${Date.now()}`,
    name: 'Test Vendor'
  };

  // Act
  await vendorPage.createVendor(vendor);

  // Assert
  await expect(page.locator('[data-testid="success-toast"]'))
    .toBeVisible({ timeout: 5000 });
});
```

---

## 6. Troubleshooting

**Tests fail with "Locator not found":**
→ Add missing `data-testid` to Vision Merch+ component

**Oracle unhealthy:**
→ Wait 90 seconds, check `docker logs merchplus-qa-oracle`

**Authentication fails:**
→ Verify TEST_USER/TEST_PASSWORD in .env

**Full guide:** `docs/TROUBLESHOOTING.md`

---

## 7. Documentation

- **README.md** - Project overview
- **docs/GETTING-STARTED.md** - Detailed setup
- **docs/TEST-STRATEGY.md** - Testing approach
- **docs/PR-TEMPLATE-TESTID.md** - For Vision Merch+ dev team

---

## 8. MusaOS Knowledge Base

**Relevant Patterns:**
- DEVKIT-PLAYWRIGHT-BLAZOR-E2E
- PAT-PAGE-OBJECT-MODEL-BLAZOR
- PAT-E2E-FAILURE-TAXONOMY
- STD-TEST-NAMING-CONVENTION

**Query KB:**
```bash
curl "http://localhost:7000/search?q=playwright+blazor&k=5"
```

---

## 9. CI/CD

**Azure DevOps Pipeline:**
- Runs on: Push to main, PRs, nightly (2 AM)
- Results: Azure DevOps → Pipelines → Tests tab
- Artifacts: HTML reports, videos on failure

---

**Status:** ✅ Ready for Testing
**Next:** Run smoke tests to validate setup!

```bash
cd e2e
npm run test:smoke
```

