# Test Data Seeds

**Oracle baseline data for E2E testing**

---

## Purpose

Baseline test data ensures consistent, repeatable E2E tests.

**Strategy:**
- Minimal reference data (vendors, styles, POs)
- Test-specific data created via API (dynamic)
- Cleanup after each test run

---

## Files

### 01-baseline-vendors.sql
Seed 5-10 baseline vendors for lookup/search tests

### 02-baseline-styles.sql
Seed 10-15 baseline styles for PO line items

### 03-reference-data.sql
Seed reference data (countries, currencies, etc.)

---

## Loading Seeds

**Automatic (Docker startup):**
```bash
cd docker
docker-compose up -d
# Seeds load automatically on first start
```

**Manual:**
```bash
docker exec -i merchplus-qa-oracle sqlplus TEST_MERCH/testmerch123@//localhost:1521/FREEPDB1 < database/seeds/01-baseline-vendors.sql
```

---

## Creating New Seeds

```sql
-- Example: baseline-vendors.sql
INSERT INTO VENDORS (CODE, NAME, ACTIVE, CREATED_DATE)
VALUES ('BASELINE-001', 'Baseline Vendor 1', 'Y', SYSDATE);

INSERT INTO VENDORS (CODE, NAME, ACTIVE, CREATED_DATE)
VALUES ('BASELINE-002', 'Baseline Vendor 2', 'Y', SYSDATE);

COMMIT;
```

**Rules:**
- Use PREFIX `BASELINE-` for seed data
- Never delete (tests may depend on)
- Keep minimal (5-15 records per entity)

---

## See Also

- scripts/create-baseline.ps1 - Snapshot current state
- scripts/restore-baseline.ps1 - Restore to snapshot
- PAT-E2E-TEST-DATA-STRATEGY (MusaOS KB)

