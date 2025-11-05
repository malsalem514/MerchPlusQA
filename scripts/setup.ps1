# MerchPlusQA Setup Script
# Automated setup for first-time installation

param(
    [switch]$SkipDocker
)

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  MerchPlusQA - Automated Setup" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check prerequisites
Write-Host "[1/6] Checking prerequisites..." -ForegroundColor Yellow

# Check Node.js
$nodeVersion = node --version 2>$null
if ($null -eq $nodeVersion) {
    Write-Host "  ❌ Node.js not found. Install from https://nodejs.org/" -ForegroundColor Red
    exit 1
}
Write-Host "  ✅ Node.js: $nodeVersion" -ForegroundColor Green

# Check Docker (if not skipped)
if (-not $SkipDocker) {
    $dockerVersion = docker --version 2>$null
    if ($null -eq $dockerVersion) {
        Write-Host "  ❌ Docker not found. Install Docker Desktop." -ForegroundColor Red
        exit 1
    }
    Write-Host "  ✅ Docker: $dockerVersion" -ForegroundColor Green
}

# Step 2: Install root dependencies
Write-Host ""
Write-Host "[2/6] Installing root dependencies..." -ForegroundColor Yellow
npm install
Write-Host "  ✅ Root dependencies installed" -ForegroundColor Green

# Step 3: Install E2E dependencies
Write-Host ""
Write-Host "[3/6] Installing E2E test dependencies..." -ForegroundColor Yellow
Set-Location e2e
npm install
Write-Host "  ✅ E2E dependencies installed" -ForegroundColor Green

# Step 4: Install Playwright browsers
Write-Host ""
Write-Host "[4/6] Installing Playwright browsers..." -ForegroundColor Yellow
npx playwright install --with-deps
Write-Host "  ✅ Playwright browsers installed" -ForegroundColor Green

Set-Location ..

# Step 5: Start Docker environment (if not skipped)
if (-not $SkipDocker) {
    Write-Host ""
    Write-Host "[5/6] Starting Oracle test database..." -ForegroundColor Yellow
    Set-Location docker
    docker-compose up -d
    Write-Host "  ⏳ Waiting for Oracle to be healthy (~90 seconds)..." -ForegroundColor Yellow

    Start-Sleep -Seconds 30
    $healthy = $false
    for ($i = 1; $i -le 6; $i++) {
        $status = docker ps --filter "name=merchplus-qa-oracle" --format "{{.Status}}"
        if ($status -match "healthy") {
            $healthy = $true
            break
        }
        Write-Host "  ⏳ Attempt $i/6: $status" -ForegroundColor Yellow
        Start-Sleep -Seconds 10
    }

    if ($healthy) {
        Write-Host "  ✅ Oracle test database is healthy" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  Oracle still starting. Check: docker ps" -ForegroundColor Yellow
    }

    Set-Location ..
} else {
    Write-Host ""
    Write-Host "[5/6] Skipping Docker setup (--SkipDocker flag)" -ForegroundColor Yellow
}

# Step 6: Configure environment
Write-Host ""
Write-Host "[6/6] Configuring environment..." -ForegroundColor Yellow

if (-not (Test-Path "e2e\.env")) {
    Copy-Item "e2e\.env.example" "e2e\.env"
    Write-Host "  ✅ Created e2e\.env from template" -ForegroundColor Green
    Write-Host "  ⚠️  IMPORTANT: Edit e2e\.env with your test credentials!" -ForegroundColor Yellow
} else {
    Write-Host "  ℹ️  e2e\.env already exists (skipping)" -ForegroundColor Cyan
}

# Summary
Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  Setup Complete!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Edit e2e\.env with test credentials" -ForegroundColor White
Write-Host "  2. Run smoke tests: cd e2e && npm run test:smoke" -ForegroundColor White
Write-Host "  3. View results in terminal" -ForegroundColor White
Write-Host ""
Write-Host "For help: See docs\GETTING-STARTED.md" -ForegroundColor Cyan

