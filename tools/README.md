# MerchPlusQA Tools - data-testid Safe Addition

**Purpose:** Automated tools for safely adding data-testid attributes to Vision Merch+ production code.

---

## Tools Included

### 1. discover-interactive-elements.ps1

**Purpose:** Find all interactive UI elements that need data-testid

**Usage:**
```powershell
.\discover-interactive-elements.ps1 -ComponentPath "...\Login.razor"

# With details
.\discover-interactive-elements.ps1 -ComponentPath "...\VendorManagement.razor" -ShowDetails
```

**Output:**
```
Found 12 elements needing testid:
Line 45: Button (DxButton)
Line 52: Data Grid (DxGrid)
Line 78: Text Input (DxTextBox)
...
```

---

### 2. validate-testid.ps1

**Purpose:** Validate testid follows naming convention

**Usage:**
```powershell
.\validate-testid.ps1 -TestId "save-vendor"
# ✅ Valid

.\validate-testid.ps1 -TestId "SaveVendor"
# ❌ Must use kebab-case

.\validate-testid.ps1 -TestId "vendor-name" -Strict
# Strict mode: enforces entity prefix
```

---

### 3. validate-build.ps1

**Purpose:** Ensure solution compiles after changes

**Usage:**
```powershell
.\validate-build.ps1 -SolutionPath "...\VisionMerchandising.sln"

# With clean build
.\validate-build.ps1 -SolutionPath "...\VisionMerchandising.sln" -Clean
```

**Output:**
```
✅ BUILD SUCCESSFUL!
Duration: 45.2 seconds
No errors introduced. Safe to proceed!
```

---

### 4. check-duplicates.ps1

**Purpose:** Search for duplicate testid values across solution

**Usage:**
```powershell
.\check-duplicates.ps1 -SolutionPath "...\VisionMerchandisingPlus" -TestId "vendor-grid"
```

**Output:**
```
Searching for data-testid="vendor-grid"...
Found 1 occurrence:
  View\...\VendorManagement.razor (line 52)

✅ No duplicates - safe to use!
```

---

## Workflow

**Recommended process:**

```powershell
# 1. Discover elements needing testid
.\discover-interactive-elements.ps1 -ComponentPath "...\Login.razor"

# 2. Add testid to file (manual edit)

# 3. Validate each testid name
.\validate-testid.ps1 -TestId "username"
.\validate-testid.ps1 -TestId "password"
.\validate-testid.ps1 -TestId "login-button"

# 4. Check for duplicates
.\check-duplicates.ps1 -SolutionPath "..." -TestId "username"

# 5. Build and validate
.\validate-build.ps1 -SolutionPath "...\VisionMerchandising.sln"

# 6. Visual smoke test
# (Launch app, verify page works)

# 7. Commit
git add Login.razor
git commit -m "feat(qa): add data-testid to Login (3 attributes)"
```

---

## Quality Gates

**All tools must pass before committing:**
- ✅ validate-testid.ps1 (all testids)
- ✅ check-duplicates.ps1 (no conflicts)
- ✅ validate-build.ps1 (compiles)
- ✅ Visual test (manual)

---

## See Also

- DEVKIT-BLAZOR-TESTID-SAFE-ADDITION.md (complete guide)
- STD-TEST-NAMING-CONVENTION.md (naming rules)
- GUIDE-E2E-PR-REVIEW-CHECKLIST.md (code review)

