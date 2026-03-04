"""
Optional telemetry connectors (e.g. CSV upload) for assessments.
"""
import csv
import io
from typing import List

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File

from sqlalchemy.orm import Session

from app.database import get_db
from app import models

router = APIRouter()

# Limits for CSV processing
MAX_CSV_BYTES = 10 * 1024 * 1024  # 10 MB
MAX_CSV_ROWS = 50_000
SAMPLE_ROWS_STORED = 100  # Store first N rows in parsed_data for preview


def _parse_csv(content: bytes) -> tuple[List[str], List[dict], int]:
    """Parse CSV bytes into headers, list of row dicts, and total row count."""
    try:
        text = content.decode("utf-8-sig").strip()
    except UnicodeDecodeError:
        raise ValueError("CSV must be UTF-8 encoded")
    reader = csv.DictReader(io.StringIO(text))
    headers = reader.fieldnames or []
    rows: List[dict] = []
    for i, row in enumerate(reader):
        if i >= MAX_CSV_ROWS:
            break
        # Normalize: strip keys/values
        clean = {k.strip(): (v.strip() if isinstance(v, str) else v) for k, v in row.items() if k}
        if clean:
            rows.append(clean)
    return headers, rows, len(rows)


@router.get("/{assessment_id}/telemetry")
def list_telemetry_uploads(
    assessment_id: int,
    db: Session = Depends(get_db),
):
    """List telemetry uploads for an assessment."""
    assessment = db.query(models.Assessment).filter(models.Assessment.id == assessment_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    uploads = (
        db.query(models.TelemetryUpload)
        .filter(models.TelemetryUpload.assessment_id == assessment_id)
        .order_by(models.TelemetryUpload.created_at.desc())
        .all()
    )
    return [
        {
            "id": u.id,
            "assessment_id": u.assessment_id,
            "source_type": u.source_type,
            "filename": u.filename,
            "row_count": u.row_count,
            "columns": u.columns,
            "created_at": u.created_at.isoformat() if u.created_at else None,
        }
        for u in uploads
    ]


@router.post("/{assessment_id}/telemetry/upload")
def upload_telemetry_csv(
    assessment_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    """Upload a CSV file as optional telemetry for an assessment. Parsed data is stored for display/analytics."""
    assessment = db.query(models.Assessment).filter(models.Assessment.id == assessment_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")

    if not file.filename or not file.filename.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="File must be a CSV")

    content = b""
    while True:
        chunk = file.file.read(1024 * 1024)
        if not chunk:
            break
        content += chunk
        if len(content) > MAX_CSV_BYTES:
            raise HTTPException(
                status_code=400,
                detail=f"CSV must be under {MAX_CSV_BYTES // (1024*1024)} MB",
            )

    if not content.strip():
        raise HTTPException(status_code=400, detail="CSV file is empty")

    try:
        headers, rows, total_count = _parse_csv(content)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    if not headers:
        raise HTTPException(status_code=400, detail="CSV has no headers")

    sample = rows[:SAMPLE_ROWS_STORED]
    upload = models.TelemetryUpload(
        assessment_id=assessment_id,
        source_type="csv",
        filename=file.filename or "upload.csv",
        row_count=total_count,
        columns=headers,
        parsed_data=sample,
        summary=None,
    )
    db.add(upload)
    db.commit()
    db.refresh(upload)

    return {
        "id": upload.id,
        "assessment_id": upload.assessment_id,
        "source_type": upload.source_type,
        "filename": upload.filename,
        "row_count": upload.row_count,
        "columns": upload.columns,
        "sample_row_count": len(sample),
        "created_at": upload.created_at.isoformat() if upload.created_at else None,
    }


@router.get("/{assessment_id}/telemetry/{upload_id}")
def get_telemetry_upload(
    assessment_id: int,
    upload_id: int,
    db: Session = Depends(get_db),
):
    """Get one telemetry upload including sample parsed data."""
    upload = (
        db.query(models.TelemetryUpload)
        .filter(
            models.TelemetryUpload.id == upload_id,
            models.TelemetryUpload.assessment_id == assessment_id,
        )
        .first()
    )
    if not upload:
        raise HTTPException(status_code=404, detail="Telemetry upload not found")
    return {
        "id": upload.id,
        "assessment_id": upload.assessment_id,
        "source_type": upload.source_type,
        "filename": upload.filename,
        "row_count": upload.row_count,
        "columns": upload.columns,
        "parsed_data": upload.parsed_data,
        "summary": upload.summary,
        "created_at": upload.created_at.isoformat() if upload.created_at else None,
    }


@router.delete("/{assessment_id}/telemetry/{upload_id}")
def delete_telemetry_upload(
    assessment_id: int,
    upload_id: int,
    db: Session = Depends(get_db),
):
    """Delete a telemetry upload."""
    upload = (
        db.query(models.TelemetryUpload)
        .filter(
            models.TelemetryUpload.id == upload_id,
            models.TelemetryUpload.assessment_id == assessment_id,
        )
        .first()
    )
    if not upload:
        raise HTTPException(status_code=404, detail="Telemetry upload not found")
    db.delete(upload)
    db.commit()
    return {"deleted": True, "id": upload_id}
