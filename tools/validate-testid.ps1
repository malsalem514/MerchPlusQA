# Validate data-testid Naming Convention
# Ensures testid follows STD-TEST-NAMING-CONVENTION

param(
    [Parameter(Mandatory=$true)]
    [string]$TestId,
    
    [switch]$Strict
)

$errors = @()
$warnings = @()

# Rule 1: Must use kebab-case (lowercase + hyphens)
if ($TestId -notmatch '^[a-z][a-z0-9-]*$') {
    $errors += "Must use kebab-case (lowercase letters, numbers, hyphens only)"
}

# Rule 2: Cannot start or end with hyphen
if ($TestId -match '^-|-$') {
    $errors += "Cannot start or end with hyphen"
}

# Rule 3: No consecutive hyphens
if ($TestId -match '--') {
    $errors += "No consecutive hyphens allowed"
}

# Rule 4: Should include entity prefix (warning in non-strict mode)
$validPrefixes = @(
    'vendor', 'po', 'style', 'transfer', 'inventory', 
    'save', 'cancel', 'delete', 'edit', 'view', 'add', 
    'create', 'search', 'filter', 'grid', 'form',
    'login', 'username', 'password', 'dashboard', 'nav'
)

$hasValidPrefix = $false
foreach ($prefix in $validPrefixes) {
    if ($TestId -match "^$prefix-" -or $TestId -eq $prefix) {
        $hasValidPrefix = $true
        break
    }
}

if (-not $hasValidPrefix) {
    if ($Strict) {
        $errors += "Must start with entity prefix (vendor-, po-, style-, etc.)"
    } else {
        $warnings += "Consider adding entity prefix for clarity (vendor-, po-, etc.)"
    }
}

# Rule 5: Avoid generic names
$genericIds = @('button', 'input', 'field', 'btn', 'txt', 'box', 'element', 'item', 'data')
if ($TestId -in $genericIds) {
    $errors += "Too generic! Use descriptive name (save-vendor not button)"
}

# Rule 6: Max length
if ($TestId.Length > 50) {
    $warnings += "Very long testid (>50 chars). Consider shortening for readability."
}

# Rule 7: Min length
if ($TestId.Length < 3) {
    $errors += "Too short (min 3 chars)"
}

# Display results
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  testid Validation: $TestId" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

if ($errors.Count -eq 0 -and $warnings.Count -eq 0) {
    Write-Host "✅ VALID: '$TestId' follows naming convention!" -ForegroundColor Green
    return $true
}

if ($errors.Count -gt 0) {
    Write-Host "❌ ERRORS:" -ForegroundColor Red
    foreach ($error in $errors) {
        Write-Host "  - $error" -ForegroundColor Red
    }
}

if ($warnings.Count -gt 0) {
    Write-Host "⚠️  WARNINGS:" -ForegroundColor Yellow
    foreach ($warning in $warnings) {
        Write-Host "  - $warning" -ForegroundColor Yellow
    }
}

Write-Host ""

if ($errors.Count -eq 0 -and $warnings.Count -gt 0) {
    Write-Host "Result: Valid (with warnings)" -ForegroundColor Yellow
    return $true
}

Write-Host "Result: INVALID - Fix errors before using" -ForegroundColor Red
return $false

