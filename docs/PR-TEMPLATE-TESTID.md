# PR Template: Adding data-testid Attributes to Vision Merch+

**For: Vision Merchandising Plus Development Team**
**Purpose:** Enable E2E regression testing with Playwright
**Effort:** 1-2 hours (one-time)
**Benefit:** Automated regression testing forever!

---

## What We Need

**data-testid attributes** on interactive UI elements so Playwright tests can find them reliably.

**Example:**
```razor
<!-- Before -->
<DxButton Text="Save" Click="@OnSave" />

<!-- After (add one attribute) -->
<DxButton Text="Save"
          Click="@OnSave"
          data-testid="save-vendor" />
```

**Impact:** ~50-100 lines changed across 20 files (minimal!)

---

## Priority List (Do These First)

### 1. Login Page (3 attributes) - **CRITICAL**

**File:** `View/VisionMerchandising.Razor/Views/Login/Login.razor`

```razor
<!-- Username field -->
<DxTextBox @bind-Text="@Username"
           data-testid="username" />

<!-- Password field -->
<DxTextBox @bind-Text="@Password"
           InputType="InputType.Password"
           data-testid="password" />

<!-- Login button -->
<DxButton Text="Login"
          Click="@OnLogin"
          data-testid="login-button" />
```

---

### 2. Main Layout/Navigation (5 attributes)

**File:** `View/VisionMerchandising.Razor/Shared/MainLayout.razor`

```razor
<!-- Main app container -->
<div id="app" data-testid="dashboard">
  @Body
</div>

<!-- Navigation menu -->
<nav data-testid="main-navigation">
  <!-- menu items -->
</nav>

<!-- User menu/profile -->
<div data-testid="user-menu">
  @CurrentUser.Email
</div>

<!-- Vendor link -->
<a href="/vendors" data-testid="nav-vendors">Vendors</a>

<!-- PO link -->
<a href="/purchaseorders" data-testid="nav-po">Purchase Orders</a>
```

---

### 3. Vendor Management (12 attributes)

**File:** `View/VisionMerchandising.Razor/Views/Vendor/VendorManagement.razor`

```razor
<!-- Vendor grid -->
<DxGrid Data="@Vendors"
        data-testid="vendor-grid">
  <Columns>
    <!-- columns -->
  </Columns>
</DxGrid>

<!-- Add button -->
<DxButton Text="Add Vendor"
          Click="@OnAddVendor"
          data-testid="add-vendor" />

<!-- Search box -->
<DxTextBox @bind-Text="@SearchQuery"
           data-testid="vendor-search" />

<!-- Edit button (in grid or detail) -->
<DxButton Text="Edit"
          Click="@(() => OnEdit(vendor))"
          data-testid="edit-vendor-@vendor.Code" />

<!-- Delete button -->
<DxButton Text="Delete"
          Click="@(() => OnDelete(vendor))"
          data-testid="delete-vendor-@vendor.Code" />
```

**Vendor Form Fields:**
```razor
<DxTextBox @bind-Text="@Vendor.Code" data-testid="vendor-code" />
<DxTextBox @bind-Text="@Vendor.Name" data-testid="vendor-name" />
<DxTextBox @bind-Text="@Vendor.Email" data-testid="vendor-email" />
<DxTextBox @bind-Text="@Vendor.Phone" data-testid="vendor-phone" />
<DxTextBox @bind-Text="@Vendor.Address" data-testid="vendor-address" />

<!-- Save button in form -->
<DxButton Text="Save" Click="@OnSave" data-testid="save-vendor" />

<!-- Cancel button -->
<DxButton Text="Cancel" Click="@OnCancel" data-testid="cancel-vendor" />
```

---

### 4. Purchase Order Management (10 attributes)

**File:** `View/VisionMerchandising.Razor/Views/PO/POManagement.razor`

```razor
<!-- PO grid -->
<DxGrid Data="@PurchaseOrders"
        data-testid="po-grid">
  <Columns>
    <!-- columns -->
  </Columns>
</DxGrid>

<!-- Create PO button -->
<DxButton Text="Create PO"
          Click="@OnCreatePO"
          data-testid="create-po" />

<!-- PO form fields -->
<DxTextBox @bind-Text="@PO.PONumber" data-testid="po-number" />
<DxComboBox Data="@Vendors" @bind-Value="@PO.VendorCode" data-testid="po-vendor" />
<DxDateEdit @bind-Date="@PO.OrderDate" data-testid="po-order-date" />

<!-- PO Lines grid -->
<DxGrid Data="@PO.Lines" data-testid="po-lines-grid">
  <Columns>
    <!-- columns -->
  </Columns>
</DxGrid>

<!-- Add line button -->
<DxButton Text="Add Line" Click="@OnAddLine" data-testid="add-po-line" />

<!-- Submit PO button -->
<DxButton Text="Submit" Click="@OnSubmit" data-testid="submit-po" />

<!-- Save draft button -->
<DxButton Text="Save Draft" Click="@OnSaveDraft" data-testid="save-po-draft" />
```

---

### 5. Style Management (5 attributes) - **Optional (Week 2)**

**File:** `View/VisionMerchandising.Razor/Views/Style/StyleManagement.razor`

```razor
<DxGrid Data="@Styles" data-testid="style-grid" />
<DxButton Text="Add Style" data-testid="add-style" />
<DxTextBox @bind-Text="@Style.StyleNumber" data-testid="style-number" />
<DxTextBox @bind-Text="@Style.Description" data-testid="style-description" />
<DxButton Text="Save" data-testid="save-style" />
```

---

## Naming Convention Rules

**Format:** `kebab-case` (lowercase, hyphens)

**Pattern:** `{action}-{entity}` or `{entity}-{field}`

**Examples:**
```
✅ save-vendor
✅ vendor-name
✅ create-po
✅ po-grid
✅ edit-vendor-V001

❌ SaveVendor (not camelCase)
❌ save_vendor (not snake_case)
❌ btn1 (not generic)
```

**For dynamic IDs (grid rows):**
```razor
data-testid="edit-vendor-@vendor.Code"
data-testid="delete-po-@po.PONumber"
```

---

## PR Submission Template

```markdown
## Purpose
Add data-testid attributes to enable E2E regression testing with Playwright.

## Changes
- Added data-testid to 52 components across 15 files
- No functional changes (attributes only)
- Follows kebab-case naming convention

## Files Changed
- Login.razor (3 attributes)
- MainLayout.razor (5 attributes)
- VendorManagement.razor (12 attributes)
- POManagement.razor (10 attributes)
- ...

## Testing
- [x] Verified locally (app still works)
- [x] Tested on DEV (no UI regressions)
- [x] QA team validated (attributes correct)

## Related
- Epic: E2E Test Automation
- QA Repo: MerchPlusQA
- Benefit: Automated regression testing (~8 hours/release saved)
```

---

## Validation Checklist

Before submitting PR:

- [ ] All interactive elements have data-testid
- [ ] Uses kebab-case naming
- [ ] No duplicates (search entire solution)
- [ ] Dynamic IDs use templates (@vendor.Code)
- [ ] Tested locally (app works)
- [ ] No breaking changes
- [ ] Follows existing code style

---

## After Merge

**QA team will:**
1. Update test environment
2. Run smoke tests (should pass!)
3. Expand test coverage
4. Provide feedback if any issues

**You get:**
- ✅ Automated regression testing
- ✅ Faster releases (confident to deploy)
- ✅ Fewer production bugs
- ✅ Peace of mind! 😊

---

## Questions?

**Contact:**
- QA Team Lead
- Musa (MusaOS/QA Automation owner)

**Resources:**
- MerchPlusQA repo
- docs/GETTING-STARTED.md
- MusaOS KB: STD-TEST-NAMING-CONVENTION

---

**Thank you for enabling world-class QA automation!** 🚀

