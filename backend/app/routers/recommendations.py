"""
Recommendations router for tracking and managing recommendations
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app import models, schemas

router = APIRouter()

@router.patch("/{recommendation_id}/status")
def update_recommendation_status(
    recommendation_id: int,
    status_update: schemas.RecommendationUpdate,
    db: Session = Depends(get_db)
):
    """Update the status of a recommendation"""
    recommendation = db.query(models.Recommendation).filter(
        models.Recommendation.id == recommendation_id
    ).first()
    
    if not recommendation:
        raise HTTPException(status_code=404, detail="Recommendation not found")
    
    if status_update.status not in ["pending", "in_progress", "completed", "skipped"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    recommendation.status = status_update.status
    db.commit()
    db.refresh(recommendation)
    
    return recommendation

@router.get("/{assessment_id}", response_model=List[schemas.Recommendation])
def get_assessment_recommendations(
    assessment_id: int,
    status: str = None,
    db: Session = Depends(get_db)
):
    """Get recommendations for an assessment, optionally filtered by status"""
    query = db.query(models.Recommendation).filter(
        models.Recommendation.assessment_id == assessment_id
    )
    
    if status:
        query = query.filter(models.Recommendation.status == status)
    
    recommendations = query.order_by(models.Recommendation.priority.desc()).all()
    return recommendations




