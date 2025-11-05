# Check for Duplicate data-testid Values
# Searches entire solution for conflicts

param(
    [Parameter(Mandatory=$true)]
    [string]$SolutionPath,
    
    [Parameter(Mandatory=$true)]
    [string]$TestId
)

if (-not (Test-Path $SolutionPath)) {
    Write-Host "❌ Path not found: $SolutionPath" -ForegroundColor Red
    exit 1
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Duplicate testid Check" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Searching for: data-testid=`"$TestId`"" -ForegroundColor Yellow
Write-Host "Path: $SolutionPath" -ForegroundColor Yellow
Write-Host ""

# Search for testid in .razor files
$searchPattern = "data-testid\s*=\s*`"$TestId`""
$matches = Get-ChildItem -Path $SolutionPath -Recurse -Filter "*.razor" | 
    Select-String -Pattern $searchPattern

if ($matches.Count -eq 0) {
    Write-Host "✅ No matches found - testid is unique!" -ForegroundColor Green
    Write-Host "   Safe to use: data-testid=`"$TestId`"" -ForegroundColor Cyan
    return $true
} elseif ($matches.Count -eq 1) {
    Write-Host "Found 1 occurrence:" -ForegroundColor Green
    foreach ($match in $matches) {
        $relativePath = $match.Path -replace [regex]::Escape($SolutionPath), ''
        Write-Host "  $relativePath (line $($match.LineNumber))" -ForegroundColor Cyan
    }
    Write-Host ""
    Write-Host "✅ No duplicates - safe to use!" -ForegroundColor Green
    return $true
} else {
    Write-Host "⚠️  DUPLICATE FOUND! ($($matches.Count) occurrences)" -ForegroundColor Red
    foreach ($match in $matches) {
        $relativePath = $match.Path -replace [regex]::Escape($SolutionPath), ''
        Write-Host "  $relativePath (line $($match.LineNumber))" -ForegroundColor Yellow
        Write-Host "    $($match.Line.Trim())" -ForegroundColor Gray
    }
    Write-Host ""
    Write-Host "❌ Choose a different testid (must be unique across solution)" -ForegroundColor Red
    return $false
}

