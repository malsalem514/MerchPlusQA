# Discover Interactive Elements in Blazor Components
# Finds all elements that need data-testid attributes

param(
    [Parameter(Mandatory=$true)]
    [string]$ComponentPath,

    [switch]$ShowDetails
)

# Interactive element patterns (Blazor + DevExpress)
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
    '<button' = 'HTML Button'
    '<input' = 'HTML Input'
    '<select' = 'HTML Select'
    '<textarea' = 'HTML TextArea'
    '<a href' = 'Link'
}

if (-not (Test-Path $ComponentPath)) {
    Write-Host "❌ File not found: $ComponentPath" -ForegroundColor Red
    exit 1
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Interactive Element Discovery" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "File: $ComponentPath" -ForegroundColor Yellow
Write-Host ""

$lines = Get-Content -Path $ComponentPath
$lineNum = 1
$results = @()
$hasTestIdCount = 0
$needsTestIdCount = 0

foreach ($line in $lines) {
    foreach ($pattern in $patterns.Keys) {
        if ($line -match [regex]::Escape($pattern)) {
            # Check if already has data-testid
            $hasTestId = $line -match 'data-testid\s*='

            if ($hasTestId) {
                $hasTestIdCount++

                if ($ShowDetails) {
                    # Extract testid value
                    if ($line -match 'data-testid\s*=\s*"([^"]+)"') {
                        $testIdValue = $Matches[1]
                        Write-Host "  ✅ Line $lineNum ($($patterns[$pattern])): $testIdValue" -ForegroundColor Green
                    }
                }
            } else {
                $needsTestIdCount++

                $results += [PSCustomObject]@{
                    Line = $lineNum
                    ElementType = $patterns[$pattern]
                    Pattern = $pattern
                    CodeSnippet = $line.Trim().Substring(0, [Math]::Min(80, $line.Trim().Length))
                }

                Write-Host "  ⚠️  Line $lineNum ($($patterns[$pattern])): NEEDS testid" -ForegroundColor Yellow
                if ($ShowDetails) {
                    Write-Host "      $($line.Trim())" -ForegroundColor Gray
                }
            }
        }
    }
    $lineNum++
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ✅ Has testid: $hasTestIdCount" -ForegroundColor Green
Write-Host "  ⚠️  Needs testid: $needsTestIdCount" -ForegroundColor Yellow
Write-Host ""

if ($needsTestIdCount -eq 0) {
    Write-Host "✅ All interactive elements have data-testid!" -ForegroundColor Green
} else {
    Write-Host "📋 Elements needing testid:" -ForegroundColor Yellow
    $results | Format-Table Line, ElementType, Pattern -AutoSize

    Write-Host ""
    Write-Host "Next: Add data-testid to these $needsTestIdCount elements" -ForegroundColor Cyan
}

# Return results for scripting
return $results

