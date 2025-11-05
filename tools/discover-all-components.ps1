# Discover ALL Interactive Elements Across Entire Application
# Comprehensive scan for 100% UI coverage

param(
    [Parameter(Mandatory=$true)]
    [string]$ViewsPath,

    [string]$OutputCsv = "testid-complete-inventory.csv",
    [switch]$GroupByModule
)

# Interactive element patterns
$patterns = @{
    'DxButton' = 'Button'
    'DxTextBox' = 'Text Input'
    'DxComboBox' = 'Dropdown'
    'DxDateEdit' = 'Date Picker'
    'DxGrid' = 'Data Grid'
    'DxCheckBox' = 'Checkbox'
    'DxSpinEdit' = 'Number Input'
    'DxMemo' = 'Text Area'
    'DxRadioGroup' = 'Radio Group'
    'DxFormLayout' = 'Form'
    'DxPopup' = 'Modal/Popup'
    'DxTabPage' = 'Tab'
    'DxDropDown' = 'Dropdown'
    'DxTagBox' = 'Tag Selector'
    'DxTreeView' = 'Tree View'
    'DxListBox' = 'List Box'
    '<button' = 'HTML Button'
    '<input' = 'HTML Input'
    '<select' = 'HTML Select'
    '<textarea' = 'HTML TextArea'
    '<a href' = 'Link'
}

if (-not (Test-Path $ViewsPath)) {
    Write-Host "❌ Path not found: $ViewsPath" -ForegroundColor Red
    exit 1
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Complete UI Element Discovery" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Scanning: $ViewsPath" -ForegroundColor Yellow
Write-Host "Output: $OutputCsv" -ForegroundColor Yellow
Write-Host ""

# Get all .razor files
$razorFiles = Get-ChildItem -Path $ViewsPath -Recurse -Filter "*.razor" -File

Write-Host "Found $($razorFiles.Count) Razor components" -ForegroundColor Green
Write-Host ""

$allResults = @()
$totalHasTestId = 0
$totalNeedsTestId = 0

foreach ($file in $razorFiles) {
    Write-Host "Scanning: $($file.Name)" -ForegroundColor Cyan

    $lines = Get-Content -Path $file.FullName
    $lineNum = 1
    $fileHasTestId = 0
    $fileNeedsTestId = 0

    foreach ($line in $lines) {
        foreach ($pattern in $patterns.Keys) {
            if ($line -match [regex]::Escape($pattern)) {
                $hasTestId = $line -match 'data-testid\s*='

                if ($hasTestId) {
                    $fileHasTestId++
                    $totalHasTestId++
                } else {
                    $fileNeedsTestId++
                    $totalNeedsTestId++

                    # Determine module from path
                    $relativePath = $file.FullName -replace [regex]::Escape($ViewsPath), ''
                    $module = "General"
                    if ($relativePath -match '\\([^\\]+)\\') {
                        $module = $Matches[1]
                    }

                    $allResults += [PSCustomObject]@{
                        Module = $module
                        File = $file.Name
                        FilePath = $file.FullName
                        Line = $lineNum
                        ElementType = $patterns[$pattern]
                        Pattern = $pattern
                        CodeSnippet = $line.Trim().Substring(0, [Math]::Min(100, $line.Trim().Length))
                        HasTestId = $false
                    }
                }
            }
        }
        $lineNum++
    }

    if ($fileNeedsTestId -gt 0) {
        Write-Host "  ⚠️  $fileNeedsTestId elements need testid" -ForegroundColor Yellow
    } else {
        Write-Host "  ✅ All elements have testid" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Complete Inventory Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Total Razor files scanned: $($razorFiles.Count)" -ForegroundColor White
Write-Host "  Elements WITH testid: $totalHasTestId" -ForegroundColor Green
Write-Host "  Elements NEEDING testid: $totalNeedsTestId" -ForegroundColor Yellow
Write-Host "  Coverage: $([Math]::Round(($totalHasTestId / ($totalHasTestId + $totalNeedsTestId)) * 100, 1))%" -ForegroundColor Cyan
Write-Host ""

# Export to CSV
$allResults | Export-Csv -Path $OutputCsv -NoTypeInformation -Encoding UTF8
Write-Host "✅ Exported to: $OutputCsv" -ForegroundColor Green

# Group by module
if ($GroupByModule) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "  Breakdown by Module" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan

    $groupedResults = $allResults | Group-Object -Property Module | Sort-Object Count -Descending

    foreach ($group in $groupedResults) {
        $percentage = [Math]::Round(($group.Count / $totalNeedsTestId) * 100, 1)
        Write-Host "  $($group.Name): $($group.Count) elements ($percentage%)" -ForegroundColor Yellow
    }

    Write-Host ""

    # Export module summary
    $moduleSummary = $groupedResults | Select-Object @{Name='Module';Expression={$_.Name}}, Count, @{Name='Percentage';Expression={[Math]::Round(($_.Count / $totalNeedsTestId) * 100, 1)}}
    $moduleSummary | Export-Csv -Path "testid-by-module.csv" -NoTypeInformation -Encoding UTF8
    Write-Host "✅ Module summary: testid-by-module.csv" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Review $OutputCsv (prioritize by module)" -ForegroundColor White
Write-Host "  2. Estimate effort: ~$([Math]::Ceiling($totalNeedsTestId / 3.5)) hours ($totalNeedsTestId testids @ ~15 min each)" -ForegroundColor White
Write-Host "  3. Create phased plan (by module)" -ForegroundColor White
Write-Host "  4. Start with highest priority modules" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan

return $allResults

