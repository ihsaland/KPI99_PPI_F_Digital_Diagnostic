"""
Questions router
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app import models, schemas
from app.models import Dimension

router = APIRouter()

@router.get("/", response_model=List[schemas.Question])
def list_questions(
    dimension: Dimension = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """List all questions, optionally filtered by dimension"""
    query = db.query(models.Question)
    if dimension:
        query = query.filter(models.Question.dimension == dimension)
    questions = query.order_by(models.Question.order).offset(skip).limit(limit).all()
    return questions

@router.get("/{question_id}", response_model=schemas.Question)
def get_question(question_id: int, db: Session = Depends(get_db)):
    """Get question by ID"""
    question = db.query(models.Question).filter(models.Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    return question

@router.post("/", response_model=schemas.Question)
def create_question(question: schemas.QuestionCreate, db: Session = Depends(get_db)):
    """Create a new question (admin function)"""
    db_question = models.Question(**question.dict())
    db.add(db_question)
    db.commit()
    db.refresh(db_question)
    return db_question




