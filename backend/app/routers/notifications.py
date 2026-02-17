"""
Notifications router for managing notifications
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List, Optional
from pydantic import BaseModel, ConfigDict
from datetime import datetime

from app.database import get_db
from app import models

router = APIRouter()

class NotificationResponse(BaseModel):
    id: int
    organization_id: Optional[int] = None
    assessment_id: Optional[int] = None
    type: str
    title: str
    message: str
    is_read: bool
    created_at: str
    
    model_config = ConfigDict(from_attributes=True)

@router.get("/organization/{organization_id}", response_model=List[NotificationResponse])
def get_notifications(
    organization_id: int,
    unread_only: bool = False,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """Get notifications for an organization"""
    try:
        query = db.query(models.Notification).filter(
            models.Notification.organization_id == organization_id
        )
        
        if unread_only:
            query = query.filter(models.Notification.is_read == False)
        
        notifications = query.order_by(desc(models.Notification.created_at)).limit(limit).all()
        
        # Convert to response models - Pydantic v2 will handle datetime serialization
        result = []
        for n in notifications:
            # Convert datetime to ISO string for JSON serialization
            notification_dict = {
                "id": n.id,
                "organization_id": n.organization_id,
                "assessment_id": n.assessment_id,
                "type": n.type,
                "title": n.title,
                "message": n.message,
                "is_read": n.is_read,
                "created_at": n.created_at.isoformat() if isinstance(n.created_at, datetime) else str(n.created_at)
            }
            result.append(NotificationResponse(**notification_dict))
        return result
    except Exception as e:
        import traceback
        print(f"Error getting notifications: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.patch("/{notification_id}/read")
def mark_as_read(notification_id: int, db: Session = Depends(get_db)):
    """Mark notification as read"""
    try:
        notification = db.query(models.Notification).filter(
            models.Notification.id == notification_id
        ).first()
        
        if not notification:
            raise HTTPException(status_code=404, detail="Notification not found")
        
        notification.is_read = True
        db.commit()
        return {"message": "Notification marked as read"}
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        print(f"Error marking notification as read: {str(e)}")
        print(traceback.format_exc())
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.post("/mark-all-read")
def mark_all_as_read(
    organization_id: int = Query(..., description="Organization ID"),
    db: Session = Depends(get_db)
):
    """Mark all notifications as read for an organization"""
    try:
        updated_count = db.query(models.Notification).filter(
            models.Notification.organization_id == organization_id,
            models.Notification.is_read == False
        ).update({"is_read": True})
        db.commit()
        return {"message": "All notifications marked as read", "updated_count": updated_count}
    except Exception as e:
        import traceback
        print(f"Error marking all notifications as read: {str(e)}")
        print(traceback.format_exc())
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/organization/{organization_id}/unread-count")
def get_unread_count(organization_id: int, db: Session = Depends(get_db)):
    """Get count of unread notifications"""
    try:
        count = db.query(models.Notification).filter(
            models.Notification.organization_id == organization_id,
            models.Notification.is_read == False
        ).count()
        return {"unread_count": count}
    except Exception as e:
        import traceback
        print(f"Error getting unread count: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

