"""
Reports router for generating PDF, JSON, and CSV exports
"""
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app import models, schemas
from app.services.report_generator import ReportGenerator

router = APIRouter()

@router.get("/{assessment_id}/pdf")
def generate_pdf_report(assessment_id: int, report_type: str = "full", db: Session = Depends(get_db)):
    """Generate PDF report for assessment"""
    assessment = db.query(models.Assessment).filter(models.Assessment.id == assessment_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    generator = ReportGenerator()
    file_path = generator.generate_pdf(assessment_id, report_type, db)
    
    return FileResponse(
        file_path,
        media_type="application/pdf",
        filename=f"kpi99_assessment_{assessment_id}_{report_type}.pdf"
    )

@router.get("/{assessment_id}/json")
def generate_json_report(assessment_id: int, db: Session = Depends(get_db)):
    """Generate JSON export for assessment"""
    assessment = db.query(models.Assessment).filter(models.Assessment.id == assessment_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    generator = ReportGenerator()
    data = generator.generate_json(assessment_id, db)
    
    return JSONResponse(content=data)

@router.get("/{assessment_id}/csv")
def generate_csv_backlog(assessment_id: int, db: Session = Depends(get_db)):
    """Generate CSV backlog export for recommendations"""
    assessment = db.query(models.Assessment).filter(models.Assessment.id == assessment_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    generator = ReportGenerator()
    file_path = generator.generate_csv(assessment_id, db)
    
    return FileResponse(
        file_path,
        media_type="text/csv",
        filename=f"kpi99_backlog_{assessment_id}.csv"
    )

@router.get("/{assessment_id}/excel")
def generate_excel_report(assessment_id: int, db: Session = Depends(get_db)):
    """Generate Excel-compatible export for assessment"""
    assessment = db.query(models.Assessment).filter(models.Assessment.id == assessment_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    generator = ReportGenerator()
    file_path = generator.generate_excel(assessment_id, db)
    
    return FileResponse(
        file_path,
        media_type="application/vnd.ms-excel",
        filename=f"kpi99_assessment_{assessment_id}.csv"
    )

