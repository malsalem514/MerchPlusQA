# Discover ALL Interactive UI Elements in Vision Merch+
# Complete inventory for 100% testid coverage

param(
    [Parameter(Mandatory=$true)]
    [string]$ViewsPath,

    [switch]$ExportToCSV,
    [string]$OutputPath = ".\testid-complete-inventory.csv"
)

# Interactive element patterns (comprehensive)
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
    'DxTagBox' = 'Tag Box'
    'DxDropDownButton' = 'Dropdown Button'
    'DxToolbar' = 'Toolbar'
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
Write-Host ""

# Get all .razor files
$razorFiles = Get-ChildItem -Path $ViewsPath -Recurse -Filter "*.razor" |
    Where-Object { $_.FullName -notmatch 'obj\\|bin\\|wwwroot\\' }

Write-Host "Found $($razorFiles.Count) Razor components" -ForegroundColor Green
Write-Host ""

$allResults = @()
$totalElements = 0
$totalWithTestId = 0
$totalNeedingTestId = 0

foreach ($file in $razorFiles) {
    $relativePath = $file.FullName -replace [regex]::Escape($ViewsPath), ''
    $lines = Get-Content -Path $file.FullName
    $lineNum = 1

    foreach ($line in $lines) {
        foreach ($pattern in $patterns.Keys) {
            if ($line -match [regex]::Escape($pattern)) {
                $totalElements++

                # Check if has data-testid
                $hasTestId = $line -match 'data-testid\s*='

                if ($hasTestId) {
                    $totalWithTestId++
                } else {
                    $totalNeedingTestId++

                    # Extract more context
                    $codeSnippet = $line.Trim()
                    if ($codeSnippet.Length > 100) {
                        $codeSnippet = $codeSnippet.Substring(0, 100) + "..."
                    }

                    $allResults += [PSCustomObject]@{
                        File = $relativePath
                        Line = $lineNum
                        ElementType = $patterns[$pattern]
                        Pattern = $pattern
                        CodeSnippet = $codeSnippet
                        Priority = 'TBD'
                        SuggestedTestId = ''
                    }
                }
            }
        }
        $lineNum++
    }
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Complete Inventory Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Total interactive elements: $totalElements" -ForegroundColor Yellow
Write-Host "  ✅ Has testid: $totalWithTestId" -ForegroundColor Green
Write-Host "  ⚠️  Needs testid: $totalNeedingTestId" -ForegroundColor Red
Write-Host ""

if ($totalNeedingTestId -gt 0) {
    # Group by file
    $byFile = $allResults | Group-Object File | Sort-Object Count -Descending

    Write-Host "Top 20 files needing testid:" -ForegroundColor Yellow
    $byFile | Select-Object -First 20 | ForEach-Object {
        Write-Host "  $($_.Count) elements - $($_.Name)" -ForegroundColor Gray
    }

    Write-Host ""
    Write-Host "Breakdown by element type:" -ForegroundColor Yellow
    $byType = $allResults | Group-Object ElementType | Sort-Object Count -Descending
    $byType | ForEach-Object {
        Write-Host "  $($_.Count) $($_.Name)" -ForegroundColor Gray
    }
}

# Export to CSV
if ($ExportToCSV) {
    $allResults | Export-Csv -Path $OutputPath -NoTypeInformation -Encoding UTF8
    Write-Host ""
    Write-Host "✅ Exported to: $OutputPath" -ForegroundColor Green
    Write-Host "   Open in Excel to review and prioritize" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Next: Review inventory, prioritize by module, create phased plan" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan

return $allResults

