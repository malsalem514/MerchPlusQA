# Create Baseline Snapshot
# Export current Oracle test database state

param(
    [string]$SnapshotName = "baseline-$(Get-Date -Format 'yyyyMMdd-HHmm')"
)

Write-Host "Creating baseline snapshot: $SnapshotName" -ForegroundColor Cyan

# Export data using expdp
docker exec merchplus-qa-oracle bash -c "expdp TEST_MERCH/testmerch123 DIRECTORY=DATA_PUMP_DIR DUMPFILE=$SnapshotName.dmp SCHEMAS=TEST_MERCH"

# Copy dump file out of container
docker cp merchplus-qa-oracle:/opt/oracle/admin/FREE/dpdump/$SnapshotName.dmp ../database/seeds/

Write-Host "✅ Snapshot created: database/seeds/$SnapshotName.dmp" -ForegroundColor Green
Write-Host "   To restore: .\scripts\restore-baseline.ps1 -Snapshot $SnapshotName" -ForegroundColor Yellow

