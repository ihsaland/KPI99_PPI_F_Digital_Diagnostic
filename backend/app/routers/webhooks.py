"""
Webhooks router for managing webhook subscriptions
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel, field_validator

from app.database import get_db
from app import models, schemas

router = APIRouter()

class WebhookCreate(BaseModel):
    organization_id: int
    url: str
    events: List[str]  # e.g., ["assessment.completed", "recommendation.updated"]
    secret: Optional[str] = None
    
    @field_validator('url')
    @classmethod
    def validate_url(cls, v):
        if not v.startswith(('http://', 'https://')):
            raise ValueError('URL must start with http:// or https://')
        return v

class WebhookUpdate(BaseModel):
    url: Optional[str] = None
    events: Optional[List[str]] = None
    secret: Optional[str] = None
    is_active: Optional[bool] = None
    
    @field_validator('url')
    @classmethod
    def validate_url(cls, v):
        if v is not None and not v.startswith(('http://', 'https://')):
            raise ValueError('URL must start with http:// or https://')
        return v

class WebhookResponse(BaseModel):
    id: int
    organization_id: int
    url: str
    events: List[str]
    is_active: bool
    created_at: str
    
    class Config:
        from_attributes = True

@router.post("/", response_model=WebhookResponse)
def create_webhook(webhook: WebhookCreate, db: Session = Depends(get_db)):
    """Create a new webhook subscription"""
    # Verify organization exists
    org = db.query(models.Organization).filter(
        models.Organization.id == webhook.organization_id
    ).first()
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")
    
    db_webhook = models.Webhook(
        organization_id=webhook.organization_id,
        url=str(webhook.url),
        events=webhook.events,
        secret=webhook.secret
    )
    db.add(db_webhook)
    db.commit()
    db.refresh(db_webhook)
    
    return db_webhook

@router.get("/organization/{organization_id}", response_model=List[WebhookResponse])
def list_webhooks(organization_id: int, db: Session = Depends(get_db)):
    """List webhooks for an organization"""
    webhooks = db.query(models.Webhook).filter(
        models.Webhook.organization_id == organization_id
    ).all()
    return webhooks

@router.get("/{webhook_id}", response_model=WebhookResponse)
def get_webhook(webhook_id: int, db: Session = Depends(get_db)):
    """Get webhook by ID"""
    webhook = db.query(models.Webhook).filter(models.Webhook.id == webhook_id).first()
    if not webhook:
        raise HTTPException(status_code=404, detail="Webhook not found")
    return webhook

@router.patch("/{webhook_id}", response_model=WebhookResponse)
def update_webhook(webhook_id: int, update: WebhookUpdate, db: Session = Depends(get_db)):
    """Update webhook"""
    webhook = db.query(models.Webhook).filter(models.Webhook.id == webhook_id).first()
    if not webhook:
        raise HTTPException(status_code=404, detail="Webhook not found")
    
    if update.url is not None:
        webhook.url = str(update.url)
    if update.events is not None:
        webhook.events = update.events
    if update.secret is not None:
        webhook.secret = update.secret
    if update.is_active is not None:
        webhook.is_active = update.is_active
    
    db.commit()
    db.refresh(webhook)
    return webhook

@router.delete("/{webhook_id}")
def delete_webhook(webhook_id: int, db: Session = Depends(get_db)):
    """Delete webhook"""
    webhook = db.query(models.Webhook).filter(models.Webhook.id == webhook_id).first()
    if not webhook:
        raise HTTPException(status_code=404, detail="Webhook not found")
    
    db.delete(webhook)
    db.commit()
    return {"message": "Webhook deleted successfully"}

