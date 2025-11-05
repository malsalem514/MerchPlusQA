---
title: "30 Smoke Tests - Execution Plan"
created: 2025-11-05
updated: 2025-11-05
author: musa + ai-assistant
project: MerchPlusQA
area: qa
feature: smoke-tests
doc_type: plan
status: active
tags: [smoke-tests, playwright, validation, quality]
---

# 30 Smoke Tests - High-Quality Execution Plan

**Goal:** Create 30 production-ready smoke tests with 3-layer validation
**Timeline:** 5 days (Week 1)
**Quality Standard:** Each test validated via User Guide → Code → Live Execution

---

## 🎯 Test Categories (Based on Project Plan)

### Category 1: Authentication & Navigation (5 tests)
**Module:** Core Application Access
**Priority:** P1 (Critical)
**User Guide:** None (fundamental functionality)
**Code Location:** `View/VisionMerchandising.Razor/Pages/Login.razor`

| # | Test Name | Operations | User Guide | Code | Live |
|---|-----------|-----------|------------|------|------|
| 1 | `smoke-01-login-successful` | Open, View, Create (session) | ⏳ | ⏳ | ⏳ |
| 2 | `smoke-02-navigation-dashboard` | Open, View, Navigate | ⏳ | ⏳ | ⏳ |
| 3 | `smoke-03-menu-expand-collapse` | Open, View, Close | ⏳ | ⏳ | ⏳ |
| 4 | `smoke-04-search-menu` | View, Filter | ⏳ | ⏳ | ⏳ |
| 5 | `smoke-05-logout-successful` | Delete (session), Close | ⏳ | ⏳ | ⏳ |

---

### Category 2: Vendor Management (6 tests)
**Module:** Master Data → Product → Vendor
**Priority:** P1 (Critical - 60% complete in their testing!)
**User Guide:** `C:\musa\Merch\UserGuides\11 Jesta IS - Merch - Master Tables.pdf`
**Code Location:** `View/VisionMerchandising.Razor/Pages/Product/Vendor/VendorManagement.razor`

| # | Test Name | Operations | User Guide | Code | Live |
|---|-----------|-----------|------------|------|------|
| 6 | `smoke-06-vendor-open-view` | Open, View | ⏳ | ⏳ | ⏳ |
| 7 | `smoke-07-vendor-create-minimal` | Create (minimal required fields) | ⏳ | ⏳ | ⏳ |
| 8 | `smoke-08-vendor-view-details` | View (detail page) | ⏳ | ⏳ | ⏳ |
| 9 | `smoke-09-vendor-edit-basic` | Modify (contact info) | ⏳ | ⏳ | ⏳ |
| 10 | `smoke-10-vendor-search-filter` | View (with filters) | ⏳ | ⏳ | ⏳ |
| 11 | `smoke-11-vendor-close-page` | Close | ⏳ | ⏳ | ⏳ |

**Test Data Strategy:**
- Vendor ID: `TEST-VENDOR-001` to `TEST-VENDOR-999`
- Contact: `QA Test User`
- Country: `US - UNITED STATES`
- Currency: `USD - US Dollar`
- Status: `ACTIVE`

---

### Category 3: Site Management (6 tests)
**Module:** Master Data → Site
**Priority:** P1 (Critical - 95% complete)
**User Guide:** `C:\musa\Merch\UserGuides\11 Jesta IS- Merch- Master Tables - Site Management V25.pdf`
**Code Location:** `View/VisionMerchandising.Razor/Pages/MasterData/Site/SiteManagement.razor`

| # | Test Name | Operations | User Guide | Code | Live |
|---|-----------|-----------|------------|------|------|
| 12 | `smoke-12-site-open-view` | Open, View | ⏳ | ⏳ | ⏳ |
| 13 | `smoke-13-site-create-minimal` | Create (minimal required fields) | ⏳ | ⏳ | ⏳ |
| 14 | `smoke-14-site-view-details` | View (detail page) | ⏳ | ⏳ | ⏳ |
| 15 | `smoke-15-site-edit-basic` | Modify (site info) | ⏳ | ⏳ | ⏳ |
| 16 | `smoke-16-site-search-filter` | View (with filters) | ⏳ | ⏳ | ⏳ |
| 17 | `smoke-17-site-close-page` | Close | ⏳ | ⏳ | ⏳ |

**Test Data Strategy:**
- Site ID: `9900` to `9999` (test range)
- Site Name: `QA Test Site 001`
- Site Type: `STORE`
- Status: `ACTIVE`

---

### Category 4: Currency Management (5 tests)
**Module:** Master Data → General → Currency
**Priority:** P2 (High - 90% complete)
**User Guide:** `C:\musa\Merch\UserGuides\11 Jesta IS - Merch - Master Tables.pdf`
**Code Location:** `View/VisionMerchandising.Razor/Pages/MasterData/General/CurrencyManagement.razor`

| # | Test Name | Operations | User Guide | Code | Live |
|---|-----------|-----------|------------|------|------|
| 18 | `smoke-18-currency-open-view` | Open, View | ⏳ | ⏳ | ⏳ |
| 19 | `smoke-19-currency-create` | Create | ⏳ | ⏳ | ⏳ |
| 20 | `smoke-20-currency-edit` | Modify | ⏳ | ⏳ | ⏳ |
| 21 | `smoke-21-currency-pagination` | View (pagination) | ⏳ | ⏳ | ⏳ |
| 22 | `smoke-22-currency-close-page` | Close | ⏳ | ⏳ | ⏳ |

**Test Data Strategy:**
- Currency Code: `QAT` (QA Test Currency)
- Description: `QA Test Currency`
- Symbol: `Ƭ`

---

### Category 5: UOM Management (5 tests)
**Module:** Master Data → General → UOM
**Priority:** P2 (High - 100% complete)
**User Guide:** `C:\musa\Merch\UserGuides\11 Jesta IS - Merch - Master Tables.pdf`
**Code Location:** `View/VisionMerchandising.Razor/Pages/MasterData/General/UOMMeasureManagement.razor`

| # | Test Name | Operations | User Guide | Code | Live |
|---|-----------|-----------|------------|------|------|
| 23 | `smoke-23-uom-open-view` | Open, View | ⏳ | ⏳ | ⏳ |
| 24 | `smoke-24-uom-create` | Create | ⏳ | ⏳ | ⏳ |
| 25 | `smoke-25-uom-edit` | Modify | ⏳ | ⏳ | ⏳ |
| 26 | `smoke-26-uom-delete` | Delete | ⏳ | ⏳ | ⏳ |
| 27 | `smoke-27-uom-close-page` | Close | ⏳ | ⏳ | ⏳ |

**Test Data Strategy:**
- UOM Code: `QATEST`
- Description: `QA Test Unit`
- Type: `WEIGHT`

---

### Category 6: Dashboard (3 tests)
**Module:** Dashboard
**Priority:** P1 (Critical - 70% complete!)
**User Guide:** None (overview page)
**Code Location:** `View/VisionMerchandising.Razor/Pages/Dashboard.razor`

| # | Test Name | Operations | User Guide | Code | Live |
|---|-----------|-----------|------------|------|------|
| 28 | `smoke-28-dashboard-widgets-load` | Open, View | ⏳ | ⏳ | ⏳ |
| 29 | `smoke-29-dashboard-navigate-module` | Navigate | ⏳ | ⏳ | ⏳ |
| 30 | `smoke-30-dashboard-refresh-data` | View (refresh) | ⏳ | ⏳ | ⏳ |

---

## 🔍 Validation Workflow (Per Test)

### Phase 1: User Guide Research (15-30 min per category)

**Files to Read:**
1. **Vendor:** `11 Jesta IS - Merch - Master Tables.pdf` (Section: Vendor)
2. **Site:** `11 Jesta IS- Merch- Master Tables - Site Management V25.pdf` (Complete)
3. **Currency:** `11 Jesta IS - Merch - Master Tables.pdf` (Section: Currency)
4. **UOM:** `11 Jesta IS - Merch - Master Tables.pdf` (Section: UOM)

**Extract:**
- Required fields (mandatory vs optional)
- Field validation rules (max length, format, constraints)
- Business rules (e.g., "Vendor ID must be unique")
- Expected error messages
- Screenshots from guide (compare with live app)

**Output:** `docs/validation/userguide-{module}.md`

---

### Phase 2: Code Reverse Engineering (15-30 min per category)

**Razor Files to Analyze:**
1. **Vendor:**
   - `View/VisionMerchandising.Razor/Pages/Product/Vendor/VendorManagement.razor`
   - `View/VisionMerchandising.Razor/Pages/Product/Vendor/VendorEntry.razor`
2. **Site:**
   - `View/VisionMerchandising.Razor/Pages/MasterData/Site/SiteManagement.razor`
   - `View/VisionMerchandising.Razor/Pages/MasterData/Site/SiteEntry.razor`
3. **Currency:**
   - `View/VisionMerchandising.Razor/Pages/MasterData/General/CurrencyManagement.razor`
4. **UOM:**
   - `View/VisionMerchandising.Razor/Pages/MasterData/General/UOMMeasureManagement.razor`

**Extract:**
- Component names and IDs
- Semantic locators (roles, labels, placeholders)
- Validation attributes (`required`, `maxlength`, `pattern`)
- Data binding (`@bind-Value`)
- Event handlers (`OnClick`, `OnValidSubmit`)
- Required `aria-label` attributes for icons

**Output:** `docs/validation/codeanalysis-{module}.md`

---

### Phase 3: Live Execution & Screenshot (30-60 min per category)

**Process:**
1. **Navigate to page** (capture URL, timing)
2. **Execute each step** (record observations)
3. **Screenshot key states:**
   - Grid view (empty)
   - Grid view (with data)
   - Create form (empty)
   - Create form (validation errors)
   - Create form (success)
   - Edit form (pre-filled)
   - Edit form (after changes)
4. **Document deviations** (if any)
5. **Record actual locators** (if different from code analysis)

**Output:**
- `e2e/tests/smoke/screenshots/{test-name}/`
- `docs/validation/live-{module}.md`

---

## 📊 Quality Gates

Each test MUST pass:

✅ **User Guide Match:**
- Workflow matches official documentation (90%+ accuracy)
- Field labels match guide (100%)
- Validation rules match guide (100%)

✅ **Code Verification:**
- Semantic locators confirmed in code (95%+ coverage)
- Required fields match code attributes (100%)
- No `data-testid` needed (target: 95%)

✅ **Live Validation:**
- Test runs successfully (100%)
- No false positives/negatives (100%)
- Screenshots captured (100%)
- Execution time <5 minutes (per test)

---

## 📅 5-Day Execution Schedule

### **Day 1: Foundation + Vendor (Mon)**
- ✅ Set up validation docs structure
- ✅ Analyze Vendor user guide
- ✅ Reverse engineer Vendor code
- ✅ Create Tests 1-11 (Login + Vendor)
- ✅ Live validation + screenshots
- **Deliverable:** 11 tests ready

### **Day 2: Site Management (Tue)**
- ✅ Analyze Site user guide
- ✅ Reverse engineer Site code
- ✅ Create Tests 12-17 (Site)
- ✅ Live validation + screenshots
- **Deliverable:** 17 tests total

### **Day 3: Currency + UOM (Wed)**
- ✅ Analyze Currency + UOM user guides
- ✅ Reverse engineer Currency + UOM code
- ✅ Create Tests 18-27 (Currency + UOM)
- ✅ Live validation + screenshots
- **Deliverable:** 27 tests total

### **Day 4: Dashboard + Stabilization (Thu)**
- ✅ Create Tests 28-30 (Dashboard)
- ✅ Run full suite 3 times
- ✅ Fix flaky tests (if any)
- ✅ Optimize execution time
- **Deliverable:** 30 stable tests

### **Day 5: Documentation + Demo (Fri)**
- ✅ Complete validation docs
- ✅ Create test execution guide
- ✅ Record demo video
- ✅ Prepare handoff materials
- **Deliverable:** Demo to Musa + team!

---

## 🎯 Success Metrics

**Quality:**
- ✅ 100% tests match user guide workflows
- ✅ 95%+ semantic locators (no `data-testid`)
- ✅ 0 hard-coded waits (only smart waits)
- ✅ All tests pass 3 consecutive times

**Coverage:**
- ✅ 30 smoke tests (100% of plan)
- ✅ 5 critical modules covered
- ✅ All CRUD operations tested

**Documentation:**
- ✅ User guide validation docs
- ✅ Code analysis docs
- ✅ Live execution reports
- ✅ Screenshots for all key states

**Team Readiness:**
- ✅ Musa can run tests independently
- ✅ Clear execution guide
- ✅ Troubleshooting documented

---

## 🚀 Next Steps

**After 30 Smoke Tests Complete:**
1. Integrate with Kiwi TCMS (auto-sync from MusaOS)
2. Set up Azure DevOps pipeline
3. Schedule nightly runs
4. Expand to 150+ full regression tests (Excel scenarios)

---

## 📝 Notes

- **Test Data:** All test data uses `TEST-` prefix for easy cleanup
- **Cleanup:** Not required per Musa (keep test data)
- **Browser:** Chromium (default), Firefox + WebKit (later)
- **Execution:** Headed mode for development, headless for CI
- **Reporting:** Playwright HTML report + Allure (later)

---

**Status:** Ready to execute! 🔥
**Owner:** AI Assistant + Musa
**Start Date:** 2025-11-05
**Target Completion:** 2025-11-08

