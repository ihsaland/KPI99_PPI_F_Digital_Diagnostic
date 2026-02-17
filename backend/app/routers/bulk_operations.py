"""
Bulk operations router for batch processing
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel

from app.database import get_db
from app import models

router = APIRouter()

class BulkStatusUpdate(BaseModel):
    recommendation_ids: List[int]
    status: str

class BulkDeleteRequest(BaseModel):
    assessment_ids: List[int]

@router.post("/recommendations/bulk-status")
def bulk_update_recommendation_status(
    update: BulkStatusUpdate,
    db: Session = Depends(get_db)
):
    """Bulk update recommendation statuses"""
    if update.status not in ["pending", "in_progress", "completed", "skipped"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    updated_count = 0
    for rec_id in update.recommendation_ids:
        recommendation = db.query(models.Recommendation).filter(
            models.Recommendation.id == rec_id
        ).first()
        
        if recommendation:
            recommendation.status = update.status
            updated_count += 1
    
    db.commit()
    
    return {
        "message": f"Updated {updated_count} recommendations",
        "updated_count": updated_count,
        "total_requested": len(update.recommendation_ids)
    }

@router.post("/assessments/bulk-delete")
def bulk_delete_assessments(
    request: BulkDeleteRequest,
    db: Session = Depends(get_db)
):
    """Bulk delete assessments"""
    deleted_count = 0
    for assessment_id in request.assessment_ids:
        assessment = db.query(models.Assessment).filter(
            models.Assessment.id == assessment_id
        ).first()
        
        if assessment:
            db.delete(assessment)
            deleted_count += 1
    
    db.commit()
    
    return {
        "message": f"Deleted {deleted_count} assessments",
        "deleted_count": deleted_count,
        "total_requested": len(request.assessment_ids)
    }

@router.get("/assessments/bulk-summary")
def get_bulk_assessment_summary(
    assessment_ids: str,  # Comma-separated IDs
    db: Session = Depends(get_db)
):
    """Get summary for multiple assessments"""
    ids = [int(id.strip()) for id in assessment_ids.split(',') if id.strip().isdigit()]
    
    if not ids:
        raise HTTPException(status_code=400, detail="No valid assessment IDs provided")
    
    assessments = db.query(models.Assessment).filter(
        models.Assessment.id.in_(ids)
    ).all()
    
    summaries = []
    for assessment in assessments:
        scores = db.query(models.Score).filter(
            models.Score.assessment_id == assessment.id
        ).all()
        
        overall_maturity = sum(s.maturity_score for s in scores) / len(scores) if scores else 0.0
        recommendations = db.query(models.Recommendation).filter(
            models.Recommendation.assessment_id == assessment.id
        ).all()
        
        summaries.append({
            "assessment_id": assessment.id,
            "name": assessment.name,
            "status": assessment.status,
            "overall_maturity": overall_maturity,
            "total_recommendations": len(recommendations),
            "completed_at": assessment.completed_at.isoformat() if assessment.completed_at else None
        })
    
    return {
        "summaries": summaries,
        "count": len(summaries)
    }




