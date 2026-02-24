"""
Authentication middleware for API key and organization-based access control
"""
from fastapi import Depends, HTTPException, Header, Request
from sqlalchemy.orm import Session
from typing import Optional
import secrets
import hashlib
from datetime import datetime

from app.database import get_db
from app import models


def generate_api_key() -> str:
    """Generate a secure API key"""
    return secrets.token_urlsafe(32)


def hash_api_key(api_key: str) -> str:
    """Hash an API key for storage (optional - can store plain if needed)"""
    return hashlib.sha256(api_key.encode()).hexdigest()


async def get_organization_from_api_key(
    x_api_key: Optional[str] = Header(None, alias="X-API-Key"),
    db: Session = Depends(get_db)
) -> models.Organization:
    """
    Verify API key and return the associated organization.
    Raises 401 if API key is invalid or organization is inactive.
    """
    if not x_api_key:
        raise HTTPException(
            status_code=401,
            detail="API key required. Please provide X-API-Key header."
        )
    
    org = db.query(models.Organization).filter(
        models.Organization.api_key == x_api_key,
        models.Organization.is_active == True
    ).first()
    
    if not org:
        raise HTTPException(
            status_code=401,
            detail="Invalid or inactive API key"
        )
    
    return org


async def get_organization_from_subdomain(
    request: Request,
    db: Session = Depends(get_db)
) -> Optional[models.Organization]:
    """
    Extract organization from subdomain in request host.
    Returns None if no subdomain match found.
    """
    host = request.headers.get("host", "")
    
    # Extract subdomain (e.g., "diagnostic" from "diagnostic.kpi99.co")
    if "." in host:
        subdomain = host.split(".")[0]
        
        # Skip common subdomains that aren't tenant identifiers
        if subdomain not in ["www", "api", "admin"]:
            org = db.query(models.Organization).filter(
                models.Organization.subdomain == subdomain,
                models.Organization.is_active == True
            ).first()
            
            if org:
                return org
    
    return None


async def get_current_organization(
    request: Request,
    x_api_key: Optional[str] = Header(None, alias="X-API-Key"),
    db: Session = Depends(get_db)
) -> models.Organization:
    """
    Get current organization from either API key or subdomain.
    Priority: API key > subdomain
    """
    # Try API key first
    if x_api_key:
        return await get_organization_from_api_key(x_api_key, db)
    
    # Try subdomain
    org = await get_organization_from_subdomain(request, db)
    if org:
        return org
    
    # No valid authentication found
    raise HTTPException(
        status_code=401,
        detail="Authentication required. Provide X-API-Key header or access via organization subdomain."
    )


def require_organization_access(org_id: int, current_org: models.Organization):
    """
    Verify that the current organization has access to the requested resource.
    Raises 403 if access is denied.
    """
    if current_org.id != org_id:
        raise HTTPException(
            status_code=403,
            detail="Access denied. You do not have permission to access this resource."
        )




