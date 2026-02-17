"""
File upload router for artifacts
"""
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
import os
import uuid
from datetime import datetime

from app.database import get_db
from app import models

router = APIRouter()

UPLOAD_DIR = os.getenv("UPLOAD_DIR", "./uploads")

@router.post("/{assessment_id}")
async def upload_artifact(
    assessment_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Upload an artifact (log, telemetry, etc.) for an assessment"""
    assessment = db.query(models.Assessment).filter(models.Assessment.id == assessment_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    # Create upload directory if it doesn't exist
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    
    # Generate unique filename
    file_ext = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    # Save file
    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)
    
    # Create artifact record
    artifact = models.Artifact(
        assessment_id=assessment_id,
        filename=file.filename,
        file_path=file_path,
        file_type=file.content_type,
        file_size=len(content)
    )
    db.add(artifact)
    db.commit()
    db.refresh(artifact)
    
    return {
        "id": artifact.id,
        "filename": artifact.filename,
        "file_size": artifact.file_size,
        "uploaded_at": artifact.uploaded_at
    }




