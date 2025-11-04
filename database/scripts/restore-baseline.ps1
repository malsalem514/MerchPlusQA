# Restore Baseline Snapshot
# Import Oracle dump file to reset test database

param(
    [Parameter(Mandatory=$true)]
    [string]$Snapshot
)

Write-Host "Restoring baseline snapshot: $Snapshot" -ForegroundColor Cyan

# Copy dump file into container
docker cp ../database/seeds/$Snapshot.dmp merchplus-qa-oracle:/opt/oracle/admin/FREE/dpdump/

# Drop and recreate schema
docker exec merchplus-qa-oracle sqlplus sys/MerchPlusQATest123@//localhost:1521/FREEPDB1 as sysdba <<EOF
DROP USER TEST_MERCH CASCADE;
CREATE USER TEST_MERCH IDENTIFIED BY testmerch123;
GRANT CONNECT, RESOURCE, DBA TO TEST_MERCH;
EXIT;
EOF

# Import data
docker exec merchplus-qa-oracle bash -c "impdp TEST_MERCH/testmerch123 DIRECTORY=DATA_PUMP_DIR DUMPFILE=$Snapshot.dmp SCHEMAS=TEST_MERCH"

Write-Host "✅ Baseline restored!" -ForegroundColor Green

