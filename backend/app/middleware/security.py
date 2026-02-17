"""
Security middleware for input validation and rate limiting preparation
"""
from fastapi import Request, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
import re

security = HTTPBearer(auto_error=False)

def validate_email(email: str) -> bool:
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_input_string(value: str, max_length: int = 255, min_length: int = 1) -> bool:
    """Validate string input"""
    if not isinstance(value, str):
        return False
    if len(value) < min_length or len(value) > max_length:
        return False
    # Check for potentially dangerous characters
    dangerous_chars = ['<', '>', 'script', 'javascript:', 'onerror=']
    value_lower = value.lower()
    for char in dangerous_chars:
        if char in value_lower:
            return False
    return True

def sanitize_string(value: str) -> str:
    """Sanitize string input"""
    if not isinstance(value, str):
        return ""
    # Remove potentially dangerous characters
    value = value.replace('<', '&lt;').replace('>', '&gt;')
    value = value.replace('"', '&quot;').replace("'", '&#x27;')
    return value.strip()

def validate_assessment_name(name: str) -> bool:
    """Validate assessment name"""
    return validate_input_string(name, max_length=255, min_length=1)

def validate_organization_name(name: str) -> bool:
    """Validate organization name"""
    return validate_input_string(name, max_length=255, min_length=1)

def get_client_ip(request: Request) -> str:
    """Get client IP address from request"""
    if request.client:
        return request.client.host
    return "unknown"




