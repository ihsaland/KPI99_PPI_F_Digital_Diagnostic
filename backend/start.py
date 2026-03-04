#!/usr/bin/env python3
"""
Railway startup script: run DB migrations (industry column), then start uvicorn.
PORT is read from the environment.
"""
import os
import subprocess
import sys

# Run migrations that are safe to run on every start (idempotent).
# This ensures the industry column exists when the app runs inside Railway's network.
try:
    from app.migrate_add_industry import migrate
    migrate()
except Exception as e:
    print(f"Migration failed: {e}", file=sys.stderr)
    sys.exit(1)

port = os.getenv('PORT', '8000')
cmd = ['uvicorn', 'app.main:app', '--host', '0.0.0.0', '--port', port]
print(f"Starting server on port {port}...")
sys.exit(subprocess.run(cmd).returncode)

