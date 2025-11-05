# Semantic Locator Discovery - Execution Plan

**Date:** November 4, 2025  
**Status:** ✅ Test created, ready to run  
**Purpose:** Discover what works WITHOUT code changes (0 hours!)

---

## 🎯 **What We're Testing**

**Hypothesis:** 40-60% of UI elements are findable using semantic locators (no testid needed)

**Locators to test:**
- `getByRole()` - Buttons, links, textboxes
- `getByLabel()` - Form fields with labels
- `getByPlaceholder()` - Inputs with placeholders
- `getByText()` - Elements with visible text

**If they work → NO CODE CHANGES NEEDED!** ✅

---

## 📋 **Test Created**

**File:** `e2e/tests/discovery/semantic-locators-test.spec.ts`

**Tests (4):**
1. [DISCOVERY-001] Login page semantic locators
2. [DISCOVERY-002] Navigation semantic locators
3. [DISCOVERY-003] Vendor page (grid + actions)
4. [DISCOVERY-004] PO page (buttons + forms)

**Each test tries multiple locator strategies and logs results!**

---

## 🚀 **How to Run**

### **Prerequisites:**

**YOU NEED TO DO THIS FIRST:**

```bash
cd C:\musa\Merch\MerchPlusQA\e2e

# Edit .env with REAL credentials
code .env

# Update these values:
# BASE_URL=https://srv-fm-102.jestais.local:9444
# TEST_USER=<your_actual_test_user>
# TEST_PASSWORD=<your_actual_password>
```

---

### **Run Discovery Tests:**

```bash
cd C:\musa\Merch\MerchPlusQA\e2e

# Install if needed
npm install

# Run discovery tests with visible browser
npx playwright test tests/discovery/ --headed

# Or headless (faster)
npx playwright test tests/discovery/
```

**Expected output:**
```
=== LOGIN PAGE DISCOVERY ===
✅ Username field: getByPlaceholder() WORKS
✅ Password field: getByPlaceholder() WORKS
✅ Login button: getByRole() WORKS
=== END LOGIN DISCOVERY ===

=== NAVIGATION DISCOVERY ===
❌ Hamburger menu: NO SEMANTIC LOCATOR - NEEDS aria-label
✅ Vendor link: getByRole() WORKS
=== END NAVIGATION DISCOVERY ===

...
```

---

## 📊 **Results Interpretation**

### **Scenario A: 60%+ work** ✅ **BEST CASE**

**Action:**
1. Use semantic locators for 60% (no changes!)
2. Add aria-label for 20% (~15 hours)
3. Add data-testid for 20% (~8 hours)

**Total time:** ~23 hours (vs 63 hours!)  
**Code changes:** ~101 elements (vs 252!)

---

### **Scenario B: 40-50% work** ✅ **GOOD**

**Action:**
1. Use semantic locators for 40% (no changes!)
2. Add aria-label for 30% (~20 hours)
3. Add data-testid for 30% (~15 hours)

**Total time:** ~35 hours (vs 63 hours!)  
**Code changes:** ~151 elements (vs 252!)

---

### **Scenario C: <30% work** ⚠️ **NEEDS MORE TESTID**

**Action:**
1. Use semantic locators for 30%
2. Add aria-label for 20%
3. Add data-testid for 50% (~30 hours)

**Total time:** ~50 hours (vs 63 hours!)  
**Still saves 13 hours!**

---

## 🎯 **What to Look For**

**In console output:**

**✅ WORKS = No changes needed!**
```
✅ Login button: getByRole() WORKS
```

**❌ FAILED = Needs attribute**
```
❌ Username field: NO SEMANTIC LOCATOR - NEEDS data-testid
```

**Count ratio:**
- If 60% ✅ → Minimal changes needed!
- If 40% ✅ → Moderate changes
- If 20% ✅ → Need most testids

---

## 📋 **After Discovery - Categorization**

**Create 3 lists:**

**Tier 1: Semantic Locators Work** (No changes)
```
- Login button (getByRole)
- Vendor link (getByRole)
- Username field (getByPlaceholder)
... (list all ✅)
```

**Tier 2: Need aria-label** (Accessibility improvement)
```
- Hamburger menu (icon button, no text)
- Edit button (icon only)
- Delete button (icon only)
... (list icon buttons, ambiguous elements)
```

**Tier 3: Need data-testid** (Last resort)
```
- Vendor grid (no semantic role)
- PO grid (no semantic role)
- Dynamic row actions
... (list grids, custom components)
```

---

## 🎊 **Expected Outcome**

**Best case:**
- 60% work NOW (151 elements) ✅
- 20% need aria-label (50 elements) - 15 hours
- 20% need data-testid (51 elements) - 8 hours
- **Total: 23 hours vs 63 hours = 40-hour savings!**

**Bonus:**
- ✅ Better accessibility (WCAG 2.1)
- ✅ Follows Playwright best practices
- ✅ More maintainable tests
- ✅ Better quality (9/10 vs 6/10)

---

## 🚀 **READY TO RUN?**

**Step 1:** Update .env with real credentials (2 min)

**Step 2:** Run discovery tests (5 min)
```bash
cd C:\musa\Merch\MerchPlusQA\e2e
npx playwright test tests/discovery/ --headed
```

**Step 3:** Review console output (see what works!)

**Step 4:** Categorize elements (Tier 1/2/3)

**Step 5:** Execute based on results!

---

**Update .env now, then let me know and I'll help you run the tests!** 🚀

Or if you want, give me the credentials and I'll update .env and run the discovery immediately! 💪

