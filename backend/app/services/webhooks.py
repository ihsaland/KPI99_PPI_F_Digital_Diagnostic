"""
Webhook service for sending events to external systems
"""
import httpx
import hmac
import hashlib
import json
from typing import List, Dict, Any
from datetime import datetime
from sqlalchemy.orm import Session

from app import models

class WebhookService:
    """Service for sending webhook events"""
    
    @staticmethod
    async def send_webhook(webhook: models.Webhook, event_type: str, payload: Dict[str, Any]):
        """Send webhook event to external URL"""
        if not webhook.is_active:
            return False
        
        if event_type not in webhook.events:
            return False
        
        try:
            headers = {
                "Content-Type": "application/json",
                "X-Webhook-Event": event_type,
                "X-Webhook-Timestamp": datetime.utcnow().isoformat(),
            }
            
            # Add signature if secret is set
            if webhook.secret:
                signature = WebhookService._generate_signature(
                    webhook.secret,
                    json.dumps(payload),
                    headers["X-Webhook-Timestamp"]
                )
                headers["X-Webhook-Signature"] = signature
            
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.post(
                    webhook.url,
                    json=payload,
                    headers=headers
                )
                response.raise_for_status()
                return True
        except Exception as e:
            print(f"Webhook delivery failed: {e}")
            return False
    
    @staticmethod
    def _generate_signature(secret: str, payload: str, timestamp: str) -> str:
        """Generate HMAC signature for webhook"""
        message = f"{timestamp}.{payload}"
        signature = hmac.new(
            secret.encode('utf-8'),
            message.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()
        return f"sha256={signature}"
    
    @staticmethod
    def get_webhooks_for_organization(organization_id: int, db: Session) -> List[models.Webhook]:
        """Get active webhooks for an organization"""
        return db.query(models.Webhook).filter(
            models.Webhook.organization_id == organization_id,
            models.Webhook.is_active == True
        ).all()
    
    @staticmethod
    async def trigger_event(
        organization_id: int,
        event_type: str,
        payload: Dict[str, Any],
        db: Session
    ):
        """Trigger webhook event for all matching webhooks"""
        webhooks = WebhookService.get_webhooks_for_organization(organization_id, db)
        
        for webhook in webhooks:
            await WebhookService.send_webhook(webhook, event_type, payload)




