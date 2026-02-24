"""
Assessment router
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from datetime import datetime

from app.database import get_db
from app import models, schemas
from app.services.scoring import ScoringService
from app.services.recommendations import RecommendationService
from app.services.cache import cache
from app.services.webhooks import WebhookService
from app.services.ai_diagnostics import AIDiagnosticsService

router = APIRouter()

@router.post("/", response_model=schemas.Assessment)
def create_assessment(
    assessment: schemas.AssessmentCreate,
    db: Session = Depends(get_db)
):
    """Create a new assessment"""
    try:
        # Verify organization exists
        org = db.query(models.Organization).filter(models.Organization.id == assessment.organization_id).first()
        if not org:
            raise HTTPException(status_code=404, detail="Organization not found")
        
        # Create assessment with explicit field mapping
        tags = getattr(assessment, "tags", None) or []
        custom_fields = getattr(assessment, "custom_fields", None)
        db_assessment = models.Assessment(
            organization_id=assessment.organization_id,
            name=assessment.name,
            version=assessment.version or "1.0",
            status="draft",
            tags=tags if isinstance(tags, list) else None,
            custom_fields=custom_fields,
        )
        db.add(db_assessment)
        db.commit()
        db.refresh(db_assessment)
        return db_assessment
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        import traceback
        print(f"Error creating assessment: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/", response_model=List[schemas.Assessment])
def list_assessments(
    organization_id: Optional[int] = None,
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """List assessments with advanced filtering"""
    try:
        # Temporarily disable cache to avoid serialization issues
        # cache_key = f"assessments:org_{organization_id}:skip_{skip}:limit_{limit}:status_{status}:search_{search}"
        # cached = cache.get(cache_key)
        # if cached:
        #     return cached
        
        query = db.query(models.Assessment)
        
        if organization_id:
            query = query.filter(models.Assessment.organization_id == organization_id)
        
        if status:
            query = query.filter(models.Assessment.status == status)
        
        if search:
            query = query.filter(models.Assessment.name.ilike(f"%{search}%"))
        
        assessments = query.order_by(models.Assessment.created_at.desc()).offset(skip).limit(limit).all()
        
        # Ensure JSON fields are properly serialized for all assessments
        import json
        for assessment in assessments:
            if assessment.tags is not None and isinstance(assessment.tags, str):
                try:
                    assessment.tags = json.loads(assessment.tags)
                except:
                    assessment.tags = None
            
            if assessment.custom_fields is not None and isinstance(assessment.custom_fields, str):
                try:
                    assessment.custom_fields = json.loads(assessment.custom_fields)
                except:
                    assessment.custom_fields = None
        
        # Cache for 60 seconds - disabled temporarily
        # cache.set(cache_key, assessments, ttl_seconds=60)
        
        return assessments
    except Exception as e:
        import traceback
        print(f"Error listing assessments: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/{assessment_id}", response_model=schemas.Assessment)
def get_assessment(assessment_id: int, db: Session = Depends(get_db)):
    """Get assessment by ID with caching"""
    try:
        # Temporarily disable cache to avoid serialization issues
        # cache_key = f"assessment:{assessment_id}"
        # cached = cache.get(cache_key)
        # if cached:
        #     return cached
        
        assessment = db.query(models.Assessment).filter(models.Assessment.id == assessment_id).first()
        if not assessment:
            raise HTTPException(status_code=404, detail="Assessment not found")
        
        # Ensure JSON fields are properly serialized
        # SQLAlchemy JSON columns might return different types
        if assessment.tags is None:
            assessment.tags = None
        elif isinstance(assessment.tags, str):
            import json
            try:
                assessment.tags = json.loads(assessment.tags)
            except:
                assessment.tags = None
        
        if assessment.custom_fields is None:
            assessment.custom_fields = None
        elif isinstance(assessment.custom_fields, str):
            import json
            try:
                assessment.custom_fields = json.loads(assessment.custom_fields)
            except:
                assessment.custom_fields = None
        
        # Cache for 120 seconds - disabled temporarily
        # cache.set(cache_key, assessment, ttl_seconds=120)
        
        return assessment
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        print(f"Error getting assessment {assessment_id}: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.patch("/{assessment_id}/notes")
def update_assessment_notes(
    assessment_id: int,
    notes: str = None,
    db: Session = Depends(get_db)
):
    """Update assessment notes/comments"""
    from fastapi import Query
    
    assessment = db.query(models.Assessment).filter(models.Assessment.id == assessment_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    assessment.notes = notes
    db.commit()
    db.refresh(assessment)
    
    # Invalidate cache
    cache.delete(f"assessment:{assessment_id}")
    cache.invalidate_pattern(f"assessments:org_{assessment.organization_id}")
    
    return {"message": "Notes updated successfully", "notes": assessment.notes}

@router.patch("/{assessment_id}/tags")
def update_assessment_tags(
    assessment_id: int,
    tags: List[str],
    db: Session = Depends(get_db)
):
    """Update assessment tags"""
    assessment = db.query(models.Assessment).filter(models.Assessment.id == assessment_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    assessment.tags = tags
    db.commit()
    db.refresh(assessment)
    
    # Invalidate cache
    cache.delete(f"assessment:{assessment_id}")
    
    return {"message": "Tags updated successfully", "tags": assessment.tags}

@router.patch("/{assessment_id}/custom-fields")
def update_assessment_custom_fields(
    assessment_id: int,
    custom_fields: Dict[str, Any],
    db: Session = Depends(get_db)
):
    """Update assessment custom fields"""
    assessment = db.query(models.Assessment).filter(models.Assessment.id == assessment_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    assessment.custom_fields = custom_fields
    db.commit()
    db.refresh(assessment)
    
    # Invalidate cache
    cache.delete(f"assessment:{assessment_id}")
    
    return {"message": "Custom fields updated successfully", "custom_fields": assessment.custom_fields}

@router.post("/{assessment_id}/answers", response_model=schemas.Answer)
def submit_answer(
    assessment_id: int,
    answer: schemas.AnswerCreate,
    db: Session = Depends(get_db)
):
    """Submit an answer to a question"""
    # Verify assessment exists
    assessment = db.query(models.Assessment).filter(models.Assessment.id == assessment_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    # Update assessment status to in_progress if it's draft
    if assessment.status == "draft":
        assessment.status = "in_progress"
        db.commit()
        db.refresh(assessment)
    
    # Verify question exists
    question = db.query(models.Question).filter(models.Question.id == answer.question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    # Calculate maturity score
    scoring_service = ScoringService()
    maturity_score = scoring_service.calculate_maturity_score(question, answer.answer_value)
    
    # Check if answer already exists, update it
    existing_answer = db.query(models.Answer).filter(
        models.Answer.assessment_id == assessment_id,
        models.Answer.question_id == answer.question_id
    ).first()
    
    if existing_answer:
        existing_answer.answer_value = answer.answer_value
        existing_answer.maturity_score = maturity_score
        db.commit()
        db.refresh(existing_answer)
        return existing_answer
    else:
        db_answer = models.Answer(
            assessment_id=assessment_id,
            question_id=answer.question_id,
            answer_value=answer.answer_value,
            maturity_score=maturity_score
        )
        db.add(db_answer)
        db.commit()
        db.refresh(db_answer)
        return db_answer

@router.post("/{assessment_id}/complete")
def complete_assessment(assessment_id: int, db: Session = Depends(get_db)):
    """Complete an assessment and generate scores, findings, and recommendations"""
    assessment = db.query(models.Assessment).filter(models.Assessment.id == assessment_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    # Calculate scores
    scoring_service = ScoringService()
    scores = scoring_service.calculate_all_scores(assessment_id, db)
    
    # Generate findings
    findings = scoring_service.generate_findings(assessment_id, db)
    
    # Generate recommendations
    recommendation_service = RecommendationService()
    recommendations = recommendation_service.generate_recommendations(assessment_id, db)
    
    # Update assessment status
    assessment.status = "completed"
    assessment.completed_at = datetime.utcnow()
    db.commit()
    
    # Trigger webhook event (async, non-blocking)
    try:
        import asyncio
        webhook_payload = {
            "assessment_id": assessment_id,
            "organization_id": assessment.organization_id,
            "status": "completed",
            "overall_maturity": sum(s.maturity_score for s in scores) / len(scores) if scores else 0.0,
            "scores_count": len(scores),
            "findings_count": len(findings),
            "recommendations_count": len(recommendations)
        }
        # Run async webhook trigger in background
        loop = asyncio.get_event_loop()
        if loop.is_running():
            asyncio.create_task(WebhookService.trigger_event(
                assessment.organization_id,
                "assessment.completed",
                webhook_payload,
                db
            ))
        else:
            loop.run_until_complete(WebhookService.trigger_event(
                assessment.organization_id,
                "assessment.completed",
                webhook_payload,
                db
            ))
    except Exception as e:
        # Don't fail the request if webhook fails
        print(f"Webhook trigger failed: {e}")
    
    # Create notification
    notification = models.Notification(
        organization_id=assessment.organization_id,
        assessment_id=assessment_id,
        type="assessment_completed",
        title="Assessment Completed",
        message=f"Assessment '{assessment.name}' has been completed with {len(recommendations)} recommendations."
    )
    db.add(notification)
    db.commit()
    
    return {
        "message": "Assessment completed",
        "scores": len(scores),
        "findings": len(findings),
        "recommendations": len(recommendations)
    }

@router.get("/{assessment_id}/answers", response_model=List[schemas.Answer])
def get_assessment_answers(assessment_id: int, db: Session = Depends(get_db)):
    """Get all answers for an assessment"""
    try:
        assessment = db.query(models.Assessment).filter(models.Assessment.id == assessment_id).first()
        if not assessment:
            raise HTTPException(status_code=404, detail="Assessment not found")
        
        answers = db.query(models.Answer).filter(models.Answer.assessment_id == assessment_id).all()
        return answers
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        print(f"Error getting answers for assessment {assessment_id}: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.post("/{assessment_id}/clone", response_model=schemas.Assessment)
def clone_assessment(
    assessment_id: int,
    new_name: str = None,
    db: Session = Depends(get_db)
):
    """Clone an existing assessment with all its answers"""
    from fastapi import Query
    
    source_assessment = db.query(models.Assessment).filter(models.Assessment.id == assessment_id).first()
    if not source_assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    # Create new assessment
    new_assessment = models.Assessment(
        organization_id=source_assessment.organization_id,
        name=new_name or f"{source_assessment.name} (Copy)",
        version=source_assessment.version,
        status="draft"
    )
    db.add(new_assessment)
    db.flush()  # Get the new assessment ID
    
    # Copy all answers
    source_answers = db.query(models.Answer).filter(
        models.Answer.assessment_id == assessment_id
    ).all()
    
    for source_answer in source_answers:
        new_answer = models.Answer(
            assessment_id=new_assessment.id,
            question_id=source_answer.question_id,
            answer_value=source_answer.answer_value,
            maturity_score=source_answer.maturity_score
        )
        db.add(new_answer)
    
    db.commit()
    db.refresh(new_assessment)
    return new_assessment

@router.get("/{assessment_id}/compare/{compare_id}")
def compare_assessments(assessment_id: int, compare_id: int, db: Session = Depends(get_db)):
    """Compare two assessments"""
    assessment1 = db.query(models.Assessment).filter(models.Assessment.id == assessment_id).first()
    assessment2 = db.query(models.Assessment).filter(models.Assessment.id == compare_id).first()
    
    if not assessment1 or not assessment2:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    scores1 = db.query(models.Score).filter(models.Score.assessment_id == assessment_id).all()
    scores2 = db.query(models.Score).filter(models.Score.assessment_id == compare_id).all()
    
    # Create comparison data
    comparison = {
        "assessment1": {
            "id": assessment1.id,
            "name": assessment1.name,
            "completed_at": assessment1.completed_at.isoformat() if assessment1.completed_at else None,
            "scores": {str(s.dimension.value): s.maturity_score for s in scores1}
        },
        "assessment2": {
            "id": assessment2.id,
            "name": assessment2.name,
            "completed_at": assessment2.completed_at.isoformat() if assessment2.completed_at else None,
            "scores": {str(s.dimension.value): s.maturity_score for s in scores2}
        },
        "differences": {}
    }
    
    # Calculate differences
    for score1 in scores1:
        score2 = next((s for s in scores2 if s.dimension == score1.dimension), None)
        if score2:
            dim_key = str(score1.dimension.value)
            comparison["differences"][dim_key] = {
                "dimension": dim_key,
                "score1": score1.maturity_score,
                "score2": score2.maturity_score,
                "difference": score2.maturity_score - score1.maturity_score,
                "percentage_change": ((score2.maturity_score - score1.maturity_score) / score1.maturity_score * 100) if score1.maturity_score > 0 else 0
            }
    
    return comparison

@router.get("/{assessment_id}/summary", response_model=schemas.AssessmentSummary)
def get_assessment_summary(assessment_id: int, db: Session = Depends(get_db)):
    """Get complete assessment summary with scores, findings, and recommendations"""
    assessment = db.query(models.Assessment).filter(models.Assessment.id == assessment_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    scores = db.query(models.Score).filter(models.Score.assessment_id == assessment_id).all()
    findings = db.query(models.Finding).filter(models.Finding.assessment_id == assessment_id).all()
    recommendations = db.query(models.Recommendation).filter(
        models.Recommendation.assessment_id == assessment_id
    ).all()
    
    # Calculate overall maturity
    overall_maturity = sum(s.maturity_score for s in scores) / len(scores) if scores else 0.0
    
    # Determine risk level
    if overall_maturity < 2.0:
        risk_level = "critical"
    elif overall_maturity < 3.0:
        risk_level = "high"
    elif overall_maturity < 4.0:
        risk_level = "medium"
    else:
        risk_level = "low"
    
    return schemas.AssessmentSummary(
        assessment=assessment,
        scores=scores,
        findings=findings,
        recommendations=recommendations,
        overall_maturity=overall_maturity,
        risk_level=risk_level
    )

@router.get("/{assessment_id}/ai/anomalies")
def get_ai_anomalies(assessment_id: int, db: Session = Depends(get_db)):
    """Get AI-detected anomalies in assessment results"""
    try:
        ai_service = AIDiagnosticsService(db)
        anomalies = ai_service.detect_anomalies(assessment_id)
        return {"anomalies": anomalies, "count": len(anomalies)}
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error detecting anomalies: {str(e)}")

@router.get("/{assessment_id}/ai/insights")
def get_ai_insights(assessment_id: int, db: Session = Depends(get_db)):
    """Get AI-generated predictive insights"""
    try:
        ai_service = AIDiagnosticsService(db)
        insights = ai_service.generate_predictive_insights(assessment_id)
        return insights
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error generating insights: {str(e)}")

@router.get("/{assessment_id}/ai/workload")
def get_ai_workload_insights(assessment_id: int, db: Session = Depends(get_db)):
    """Get AI-generated workload behavior insights"""
    try:
        ai_service = AIDiagnosticsService(db)
        insights = ai_service.generate_workload_insights(assessment_id)
        return {"insights": insights, "count": len(insights)}
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error generating workload insights: {str(e)}")

