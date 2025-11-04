# MerchPlusQA Test Runner
# Run tests with various options

param(
    [ValidateSet("smoke", "vendor", "po", "all")]
    [string]$Suite = "smoke",
    
    [switch]$Headed,
    [switch]$UI,
    [switch]$Debug,
    
    [ValidateSet("chromium", "firefox", "webkit", "all")]
    [string]$Browser = "chromium"
)

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  MerchPlusQA Test Runner" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Check environment
if (-not (Test-Path "e2e\.env")) {
    Write-Host "❌ e2e\.env not found!" -ForegroundColor Red
    Write-Host "   Run: Copy-Item e2e\.env.example e2e\.env" -ForegroundColor Yellow
    exit 1
}

# Check Oracle health
Write-Host "Checking Oracle test database..." -ForegroundColor Yellow
$oracleStatus = docker ps --filter "name=merchplus-qa-oracle" --format "{{.Status}}" 2>$null

if ($oracleStatus -match "healthy") {
    Write-Host "✅ Oracle healthy" -ForegroundColor Green
} elseif ($oracleStatus -match "starting") {
    Write-Host "⏳ Oracle still starting... wait 30s and retry" -ForegroundColor Yellow
} else {
    Write-Host "⚠️  Oracle not running. Start with: cd docker && docker-compose up -d" -ForegroundColor Yellow
}

Write-Host ""

# Build command
Set-Location e2e
$cmd = "npx playwright test"

# Suite selection
switch ($Suite) {
    "smoke" { $cmd += " tests/smoke/" }
    "vendor" { $cmd += " tests/vendor/" }
    "po" { $cmd += " tests/po/" }
    "all" { }  # No filter = all tests
}

# Browser selection
if ($Browser -ne "all") {
    $cmd += " --project=$Browser"
}

# Mode selection
if ($UI) {
    $cmd += " --ui"
} elseif ($Debug) {
    $cmd += " --debug"
} elseif ($Headed) {
    $cmd += " --headed"
}

Write-Host "Running: $cmd" -ForegroundColor Cyan
Write-Host ""

# Execute
Invoke-Expression $cmd

$exitCode = $LASTEXITCODE

Set-Location ..

Write-Host ""
if ($exitCode -eq 0) {
    Write-Host "✅ All tests passed!" -ForegroundColor Green
} else {
    Write-Host "❌ Some tests failed. Check output above." -ForegroundColor Red
    Write-Host "   View HTML report: cd e2e && npm run report" -ForegroundColor Yellow
}

exit $exitCode

