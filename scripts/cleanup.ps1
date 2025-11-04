# MerchPlusQA Cleanup Script
# Clean test artifacts, Docker containers, and dependencies

param(
    [switch]$All,
    [switch]$Docker,
    [switch]$Artifacts,
    [switch]$Dependencies
)

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  MerchPlusQA Cleanup" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Clean test artifacts
if ($All -or $Artifacts) {
    Write-Host "Cleaning test artifacts..." -ForegroundColor Yellow
    
    Remove-Item -Path "e2e\test-results" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "e2e\playwright-report" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "e2e\junit-results" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "e2e\.cache" -Recurse -Force -ErrorAction SilentlyContinue
    
    Write-Host "  ✅ Test artifacts cleaned" -ForegroundColor Green
}

# Clean Docker
if ($All -or $Docker) {
    Write-Host ""
    Write-Host "Stopping Docker containers..." -ForegroundColor Yellow
    
    Set-Location docker
    docker-compose down -v 2>$null
    Set-Location ..
    
    Write-Host "  ✅ Docker containers stopped and removed" -ForegroundColor Green
}

# Clean dependencies
if ($All -or $Dependencies) {
    Write-Host ""
    Write-Host "Removing dependencies..." -ForegroundColor Yellow
    
    Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "e2e\node_modules" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "package-lock.json" -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "e2e\package-lock.json" -Force -ErrorAction SilentlyContinue
    
    Write-Host "  ✅ Dependencies removed" -ForegroundColor Green
}

# Show help if no options
if (-not ($All -or $Docker -or $Artifacts -or $Dependencies)) {
    Write-Host "No cleanup option specified!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Usage:" -ForegroundColor Cyan
    Write-Host "  .\scripts\cleanup.ps1 -All           # Clean everything"
    Write-Host "  .\scripts\cleanup.ps1 -Artifacts     # Clean test results only"
    Write-Host "  .\scripts\cleanup.ps1 -Docker        # Stop Docker containers"
    Write-Host "  .\scripts\cleanup.ps1 -Dependencies  # Remove node_modules"
    exit 0
}

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  Cleanup Complete!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Cyan

