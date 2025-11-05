# Build Validator - Ensure No Compilation Errors
# Run after adding data-testid to verify no breaks

param(
    [Parameter(Mandatory=$true)]
    [string]$SolutionPath,

    [string]$Configuration = "Debug",
    [switch]$Clean
)

if (-not (Test-Path $SolutionPath)) {
    Write-Host "❌ Solution not found: $SolutionPath" -ForegroundColor Red
    exit 1
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Build Validation" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Solution: $SolutionPath" -ForegroundColor Yellow
Write-Host "Configuration: $Configuration" -ForegroundColor Yellow
Write-Host ""

# Clean if requested
if ($Clean) {
    Write-Host "Cleaning solution..." -ForegroundColor Yellow
    dotnet clean $SolutionPath --configuration $Configuration
    Write-Host ""
}

# Build
Write-Host "Building solution..." -ForegroundColor Yellow
$startTime = Get-Date

$output = dotnet build $SolutionPath --configuration $Configuration 2>&1 | Out-String

$duration = (Get-Date) - $startTime
$durationSeconds = [Math]::Round($duration.TotalSeconds, 1)

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✅ BUILD SUCCESSFUL!" -ForegroundColor Green
    Write-Host "  Duration: $durationSeconds seconds" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "No errors introduced. Safe to proceed!" -ForegroundColor Green
    return $true
} else {
    Write-Host "  ❌ BUILD FAILED!" -ForegroundColor Red
    Write-Host "  Duration: $durationSeconds seconds" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Errors detected:" -ForegroundColor Red
    Write-Host $output -ForegroundColor Red
    Write-Host ""
    Write-Host "Action: Review errors, rollback changes, fix, retry" -ForegroundColor Yellow
    return $false
}

