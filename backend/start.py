#!/usr/bin/env python3
"""
Railway startup script that properly handles PORT environment variable
"""
import os
import subprocess
import sys

# Get PORT from environment, default to 8000 if not set
port = os.getenv('PORT', '8000')

# Start uvicorn with the port
cmd = [
    'uvicorn',
    'app.main:app',
    '--host', '0.0.0.0',
    '--port', port
]

print(f"Starting server on port {port}...")
sys.exit(subprocess.run(cmd).returncode)

