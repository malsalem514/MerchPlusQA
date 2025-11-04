# Getting Started with MerchPlusQA

**Complete setup guide for E2E testing Vision Merchandising Plus**

---

## Prerequisites

**Required:**
- ✅ Node.js 20+ ([Download](https://nodejs.org/))
- ✅ Docker Desktop ([Download](https://www.docker.com/products/docker-desktop/))
- ✅ PowerShell 7+ (Windows)
- ✅ Git

**Recommended:**
- VS Code with Playwright extension
- MusaOS running (http://localhost:7000)

---

## Step-by-Step Setup

### Step 1: Clone Repository

```bash
cd C:\musa\Merch
git clone <REPO_URL> MerchPlusQA
cd MerchPlusQA
```

### Step 2: Install Dependencies

```bash
# Root dependencies
npm install

# E2E test dependencies
cd e2e
npm install

# Install Playwright browsers
npx playwright install --with-deps
```

**Time:** ~5 minutes

---

### Step 3: Start Test Environment

```bash
# Start Oracle test database
cd ../docker
docker-compose up -d

# Verify container status
docker ps | findstr merchplus-qa-oracle
```

**Expected Output:**
```
merchplus-qa-oracle   Up 2 minutes (health: starting)
```

**Wait 90 seconds**, then check again:
```
merchplus-qa-oracle   Up 3 minutes (healthy)  ← Good!
```

**If unhealthy:** Check logs with `docker-compose logs oracle-test`

---

### Step 4: Configure Test Environment

```bash
cd ../e2e

# Copy example config
cp .env.example .env

# Edit with your credentials
code .env
```

**Update these values:**
```bash
BASE_URL=https://srv-fm-102.jestais.local:9444  # Your QA environment
TEST_USER=testadmin@merch.com                    # Test account
TEST_PASSWORD=YourActualPassword                 # Real password
```

---

### Step 5: Run First Test

```bash
# Run smoke tests
npm run test:smoke

# Expected output:
#   7 passed (2m)
```

**If all pass:** ✅ **Setup complete!**

**If some fail:** See Troubleshooting below

---

## Troubleshooting

### Issue: "Locator '[data-testid="username"]' not found"

**Cause:** data-testid attributes not yet added to Vision Merch+ application

**Fix:**
1. See `docs/PR-TEMPLATE-TESTID.md`
2. Create PR to add attributes
3. Wait for merge
4. Re-run tests

---

### Issue: "Target page, context or browser has been closed"

**Cause:** Application not accessible at BASE_URL

**Fix:**
```bash
# Test connection manually
curl -k https://srv-fm-102.jestais.local:9444

# If fails:
# 1. Verify VPN connected
# 2. Check BASE_URL in .env
# 3. Confirm QA environment running
```

---

###Issue: Oracle container "(unhealthy)"

**Cause:** Database still starting OR health check issue

**Fix:**
```bash
# Check logs
docker-compose logs oracle-test

# If shows "DATABASE IS READY TO USE":
# → Wait 30 more seconds

# If shows errors:
# → Recreate container
docker-compose down
docker-compose up -d
```

---

### Issue: Authentication fails (401)

**Cause:** Invalid credentials in .env

**Fix:**
```bash
# Verify credentials work manually
curl -X POST https://srv-fm-102.jestais.local/api/auth/login \
  -d "username=$TEST_USER" \
  -d "password=$TEST_PASSWORD"

# Should return token, not 401

# Update .env with correct credentials
```

---

## What's Next?

### Run Full Test Suite

```bash
# All 27 tests (~13 min)
npm test

# Specific category
npm run test:vendor    # 10 vendor tests
npm run test:po        # 10 PO tests
```

### Interactive Mode

```bash
# UI mode (watch tests run, time-travel debug)
npm run test:ui
```

### Add New Tests

1. Copy existing test as template
2. Update test ID (VENDOR-011, PO-011, etc.)
3. Follow GIVEN-WHEN-THEN naming
4. Use Page Objects
5. Add cleanup
6. Run locally 3 times
7. Submit PR

See: `docs/TEST-STRATEGY.md`

---

## IDE Setup (VS Code)

### Recommended Extensions

- Playwright Test for VSCode (ms-playwright.playwright)
- EditorConfig (editorconfig.editorconfig)
- Prettier (esbenp.prettier-vscode)

### Launch Configuration

**.vscode/launch.json:**
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Playwright Test",
      "type": "node",
      "request": "launch",
      "runtimeExecutable": "npx",
      "runtimeArgs": ["playwright", "test", "--debug"],
      "cwd": "${workspaceFolder}/e2e"
    }
  ]
}
```

---

## MusaOS Integration

### Bootstrap Agent

```bash
cd C:\musa\dev\MusaOS
set MUSA_PROJECT=merchplus-qa
npm run bootstrap:agent
```

### Access KB Patterns

```bash
# Search for relevant patterns
curl "http://localhost:7000/search?q=playwright+blazor&k=10"

# Get specific pattern
curl "http://localhost:7000/rest/v1/docs?doc_id=eq.pat-page-object-model-blazor"
```

### Query Incidents

```bash
# Find similar test failures
POST http://localhost:7000/rest/v1/rpc/find_similar_incidents
{
  "symptoms": "Locator timeout, element not found"
}
```

---

## Helpful Commands

```bash
# Show test list without running
cd e2e && npx playwright test --list

# Run single test file
npx playwright test tests/vendor/vendor-crud.spec.ts

# Run tests matching pattern
npx playwright test -g "VENDOR-001"

# Generate test code
npx playwright codegen https://srv-fm-102.jestais.local:9444

# View last HTML report
npm run report
```

---

## Performance Expectations

| Test Category | Count | Duration | Pass Rate |
|---------------|-------|----------|-----------|
| Smoke | 7 | ~2 min | 100% |
| Vendor | 10 | ~5 min | 100% |
| PO | 10 | ~6 min | 100% |
| **Total** | **27** | **~13 min** | **100%** |

**If slower:** Check network latency, VPN speed, or increase timeouts

---

## Getting Help

**Documentation:**
- README.md - Overview
- TEST-STRATEGY.md - Testing approach
- TROUBLESHOOTING.md - Common issues
- PR-TEMPLATE-TESTID.md - For dev team

**MusaOS KB:**
- DEVKIT-PLAYWRIGHT-BLAZOR-E2E
- PAT-E2E-FAILURE-TAXONOMY
- GUIDE-E2E-REGRESSION-SUITE

**Contact:**
- QA Team
- Musa (MusaOS owner)

---

**Status:** ✅ Setup Complete
**Next:** Start adding new tests and expand coverage! 🚀

