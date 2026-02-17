"""
Organization router
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app import models, schemas
from app.middleware.security import validate_organization_name, sanitize_string
from app.middleware.auth import generate_api_key
from datetime import datetime

router = APIRouter()

@router.post("/", response_model=schemas.Organization)
def create_organization(
    organization: schemas.OrganizationCreate,
    db: Session = Depends(get_db)
):
    """Create a new organization with input validation"""
    # Validate organization name
    if not validate_organization_name(organization.name):
        raise HTTPException(
            status_code=400,
            detail="Invalid organization name. Name must be between 1 and 255 characters and contain no dangerous characters."
        )
    
    # Sanitize inputs
    sanitized_name = sanitize_string(organization.name)
    sanitized_domain = sanitize_string(organization.domain) if organization.domain else None
    
    db_org = models.Organization(
        name=sanitized_name,
        domain=sanitized_domain
    )
    db.add(db_org)
    db.commit()
    db.refresh(db_org)
    return db_org

@router.get("/", response_model=List[schemas.Organization])
def list_organizations(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """List all organizations"""
    try:
        orgs = db.query(models.Organization).offset(skip).limit(limit).all()
        return orgs
    except Exception as e:
        import traceback
        print(f"Error listing organizations: {str(e)}")
        print(traceback.format_exc())
        # If there's a database error (e.g., missing tables), try to create them
        try:
            from app.database import Base, engine
            Base.metadata.create_all(bind=engine)
            # Retry the query
            orgs = db.query(models.Organization).offset(skip).limit(limit).all()
            return orgs
        except Exception as e2:
            import traceback
            print(f"Database error after retry: {str(e2)}")
            print(traceback.format_exc())
            raise HTTPException(status_code=500, detail=f"Database error: {str(e2)}")

@router.get("/{organization_id}", response_model=schemas.Organization)
def get_organization(organization_id: int, db: Session = Depends(get_db)):
    """Get organization by ID"""
    org = db.query(models.Organization).filter(models.Organization.id == organization_id).first()
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")
    return org

@router.post("/{organization_id}/generate-api-key")
def generate_organization_api_key(organization_id: int, db: Session = Depends(get_db)):
    """Generate a new API key for an organization"""
    org = db.query(models.Organization).filter(models.Organization.id == organization_id).first()
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")
    
    # Generate new API key
    new_api_key = generate_api_key()
    org.api_key = new_api_key
    org.api_key_created_at = datetime.utcnow()
    db.commit()
    db.refresh(org)
    
    return {
        "organization_id": org.id,
        "api_key": new_api_key,  # Only returned once - store securely!
        "api_key_created_at": org.api_key_created_at.isoformat() if org.api_key_created_at else None,
        "message": "API key generated successfully. Store this key securely - it will not be shown again."
    }

@router.post("/{organization_id}/set-subdomain")
def set_organization_subdomain(
    organization_id: int,
    subdomain: str,
    db: Session = Depends(get_db)
):
    """Set subdomain for an organization (for subdomain-based routing)"""
    org = db.query(models.Organization).filter(models.Organization.id == organization_id).first()
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")
    
    # Validate subdomain format
    if not subdomain or len(subdomain) < 3 or len(subdomain) > 63:
        raise HTTPException(
            status_code=400,
            detail="Subdomain must be between 3 and 63 characters"
        )
    
    # Check if subdomain is already taken
    existing = db.query(models.Organization).filter(
        models.Organization.subdomain == subdomain,
        models.Organization.id != organization_id
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=400,
            detail="Subdomain already in use"
        )
    
    org.subdomain = subdomain.lower()
    db.commit()
    db.refresh(org)
    
    return {
        "organization_id": org.id,
        "subdomain": org.subdomain,
        "message": f"Subdomain set to {org.subdomain}. Configure DNS to point this subdomain to your server."
    }

