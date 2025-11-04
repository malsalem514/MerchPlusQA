#!/usr/bin/env bash
###############################################################################
# Oracle 23ai Free Healthcheck - Passwordless & Proven
# Tests: DB open mode (READ WRITE) + listener ready
# Source: PAT-ORACLE-DOCKER-HEALTHCHECK (MusaOS KB)
###############################################################################

set -euo pipefail

# Defaults for Oracle Free
export ORACLE_SID="${ORACLE_SID:-FREE}"
export ORACLE_HOME="${ORACLE_HOME:-/opt/oracle/product/23ai/dbhomeFree}"
export PATH="$ORACLE_HOME/bin:$PATH"

# Quick preflight: binaries present?
command -v sqlplus >/dev/null 2>&1 || exit 1
command -v lsnrctl >/dev/null 2>&1 || exit 1

# Check DB open mode via OS auth (no password)
# ✅ Use echo pipe (NOT heredoc - proven pattern from MusaOS)
OPEN_MODE="$(echo "set heading off feedback off pages 0 verify off echo off
select open_mode from v\$database;
exit;" | sqlplus -s / as sysdba 2>/dev/null | tr -d '[:space:]')"

# Listener must be up too
if ! lsnrctl status 1>/dev/null 2>&1; then
  exit 1
fi

# Healthy when database is READ WRITE
if [[ "$OPEN_MODE" == "READWRITE" ]]; then
  exit 0
fi

# Handle "READ WRITE" with space (some Oracle versions)
[[ "$OPEN_MODE" =~ ^READ.*WRITE$ ]] && exit 0

exit 1

