"""
Analytics router for data analysis and trends
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import List, Dict, Any
from datetime import datetime, timedelta

from app.database import get_db
from app import models

router = APIRouter()

@router.get("/organization/{organization_id}/trends")
def get_organization_trends(organization_id: int, db: Session = Depends(get_db)):
    """Get maturity trends for an organization over time"""
    assessments = db.query(models.Assessment).filter(
        models.Assessment.organization_id == organization_id,
        models.Assessment.status == "completed"
    ).order_by(models.Assessment.completed_at).all()
    
    if not assessments:
        return {
            "organization_id": organization_id,
            "trends": [],
            "message": "No completed assessments found"
        }
    
    trends = []
    for assessment in assessments:
        scores = db.query(models.Score).filter(
            models.Score.assessment_id == assessment.id
        ).all()
        
        if scores:
            overall_maturity = sum(s.maturity_score for s in scores) / len(scores)
            trends.append({
                "assessment_id": assessment.id,
                "assessment_name": assessment.name,
                "completed_at": assessment.completed_at.isoformat() if assessment.completed_at else None,
                "overall_maturity": overall_maturity,
                "dimension_scores": {
                    str(s.dimension.value): s.maturity_score for s in scores
                }
            })
    
    return {
        "organization_id": organization_id,
        "trends": trends,
        "total_assessments": len(trends)
    }

@router.get("/organization/{organization_id}/metrics")
def get_organization_metrics(organization_id: int, db: Session = Depends(get_db)):
    """Get aggregated metrics for an organization"""
    assessments = db.query(models.Assessment).filter(
        models.Assessment.organization_id == organization_id
    ).all()
    
    completed_assessments = [a for a in assessments if a.status == "completed"]
    
    if not completed_assessments:
        return {
            "organization_id": organization_id,
            "total_assessments": len(assessments),
            "completed_assessments": 0,
            "average_maturity": 0.0,
            "total_recommendations": 0,
            "completed_recommendations": 0,
            "dimension_averages": {}
        }
    
    # Calculate average maturity
    all_maturities = []
    dimension_totals = {}
    dimension_counts = {}
    
    total_recommendations = 0
    completed_recommendations = 0
    
    for assessment in completed_assessments:
        scores = db.query(models.Score).filter(
            models.Score.assessment_id == assessment.id
        ).all()
        
        if scores:
            overall = sum(s.maturity_score for s in scores) / len(scores)
            all_maturities.append(overall)
            
            for score in scores:
                dim_key = str(score.dimension.value)
                if dim_key not in dimension_totals:
                    dimension_totals[dim_key] = 0
                    dimension_counts[dim_key] = 0
                dimension_totals[dim_key] += score.maturity_score
                dimension_counts[dim_key] += 1
        
        # Count recommendations
        recommendations = db.query(models.Recommendation).filter(
            models.Recommendation.assessment_id == assessment.id
        ).all()
        total_recommendations += len(recommendations)
        completed_recommendations += len([r for r in recommendations if r.status == "completed"])
    
    dimension_averages = {
        dim: dimension_totals[dim] / dimension_counts[dim]
        for dim in dimension_totals
    }
    
    return {
        "organization_id": organization_id,
        "total_assessments": len(assessments),
        "completed_assessments": len(completed_assessments),
        "average_maturity": sum(all_maturities) / len(all_maturities) if all_maturities else 0.0,
        "total_recommendations": total_recommendations,
        "completed_recommendations": completed_recommendations,
        "recommendation_completion_rate": (completed_recommendations / total_recommendations * 100) if total_recommendations > 0 else 0.0,
        "dimension_averages": dimension_averages,
        "latest_assessment_date": max([a.completed_at for a in completed_assessments if a.completed_at]).isoformat() if completed_assessments and any(a.completed_at for a in completed_assessments) else None
    }

@router.get("/organization/{organization_id}/benchmark")
def get_organization_benchmark(organization_id: int, db: Session = Depends(get_db)):
    """Get benchmark comparison for an organization"""
    # Get organization's latest assessment
    latest_assessment = db.query(models.Assessment).filter(
        models.Assessment.organization_id == organization_id,
        models.Assessment.status == "completed"
    ).order_by(desc(models.Assessment.completed_at)).first()
    
    if not latest_assessment:
        return {
            "organization_id": organization_id,
            "message": "No completed assessments found"
        }
    
    latest_scores = db.query(models.Score).filter(
        models.Score.assessment_id == latest_assessment.id
    ).all()
    
    if not latest_scores:
        return {
            "organization_id": organization_id,
            "message": "No scores found for latest assessment"
        }
    
    # Calculate industry averages (simplified - in production, this would use real benchmark data)
    # For now, we'll use a baseline of 3.0 as "industry average"
    industry_average = 3.0
    
    organization_scores = {
        str(s.dimension.value): s.maturity_score for s in latest_scores
    }
    overall_maturity = sum(s.maturity_score for s in latest_scores) / len(latest_scores)
    
    return {
        "organization_id": organization_id,
        "assessment_id": latest_assessment.id,
        "assessment_name": latest_assessment.name,
        "overall_maturity": overall_maturity,
        "industry_average": industry_average,
        "vs_industry": overall_maturity - industry_average,
        "dimension_scores": organization_scores,
        "dimension_benchmarks": {
            dim: {"score": organization_scores.get(dim, 0), "industry_avg": industry_average}
            for dim in organization_scores.keys()
        }
    }

@router.get("/assessment/{assessment_id}/insights")
def get_assessment_insights(assessment_id: int, db: Session = Depends(get_db)):
    """Get insights and analytics for a specific assessment"""
    assessment = db.query(models.Assessment).filter(models.Assessment.id == assessment_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    scores = db.query(models.Score).filter(models.Score.assessment_id == assessment_id).all()
    findings = db.query(models.Finding).filter(models.Finding.assessment_id == assessment_id).all()
    recommendations = db.query(models.Recommendation).filter(
        models.Recommendation.assessment_id == assessment_id
    ).all()
    
    overall_maturity = sum(s.maturity_score for s in scores) / len(scores) if scores else 0.0
    
    # Calculate insights
    critical_findings = len([f for f in findings if f.severity == "critical"])
    high_priority_recs = len([r for r in recommendations if r.priority >= 8])
    quick_wins = len([r for r in recommendations if r.effort == "low" and r.impact == "high"])
    
    # Dimension strengths and weaknesses
    dimension_scores = {str(s.dimension.value): s.maturity_score for s in scores}
    strongest_dimension = max(dimension_scores.items(), key=lambda x: x[1]) if dimension_scores else None
    weakest_dimension = min(dimension_scores.items(), key=lambda x: x[1]) if dimension_scores else None
    
    return {
        "assessment_id": assessment_id,
        "overall_maturity": overall_maturity,
        "total_findings": len(findings),
        "critical_findings": critical_findings,
        "total_recommendations": len(recommendations),
        "high_priority_recommendations": high_priority_recs,
        "quick_wins": quick_wins,
        "strongest_dimension": {
            "dimension": strongest_dimension[0] if strongest_dimension else None,
            "score": strongest_dimension[1] if strongest_dimension else None
        },
        "weakest_dimension": {
            "dimension": weakest_dimension[0] if weakest_dimension else None,
            "score": weakest_dimension[1] if weakest_dimension else None
        },
        "recommendation_status_breakdown": {
            "pending": len([r for r in recommendations if (r.status or "pending") == "pending"]),
            "in_progress": len([r for r in recommendations if r.status == "in_progress"]),
            "completed": len([r for r in recommendations if r.status == "completed"]),
            "skipped": len([r for r in recommendations if r.status == "skipped"])
        }
    }




