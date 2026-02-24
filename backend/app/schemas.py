"""
Pydantic schemas for request/response validation
"""
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime
from app.models import Dimension, QuestionType

class OrganizationBase(BaseModel):
    name: str
    domain: Optional[str] = None

class OrganizationCreate(OrganizationBase):
    pass

class Organization(OrganizationBase):
    id: int
    subdomain: Optional[str] = None
    is_active: bool = True
    created_at: datetime
    updated_at: Optional[datetime] = None
    # Note: api_key is intentionally excluded from response for security
    
    model_config = ConfigDict(from_attributes=True)

class AssessmentBase(BaseModel):
    name: str
    version: Optional[str] = "1.0"

class AssessmentCreate(AssessmentBase):
    organization_id: int
    tags: Optional[List[str]] = None
    custom_fields: Optional[Dict[str, Any]] = None

class Assessment(AssessmentBase):
    id: int
    organization_id: int
    status: str
    notes: Optional[str] = None
    tags: Optional[List[str]] = None
    custom_fields: Optional[Dict[str, Any]] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)

class QuestionBase(BaseModel):
    dimension: Dimension
    question_type: QuestionType
    question_text: str
    options: Optional[Dict[str, Any]] = None
    weight: float = 1.0
    order: int = 0
    is_critical: bool = False
    maturity_mapping: Optional[Dict[str, Any]] = None

class QuestionCreate(QuestionBase):
    pass

class Question(QuestionBase):
    id: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class AnswerBase(BaseModel):
    question_id: int
    answer_value: str

class AnswerCreate(AnswerBase):
    assessment_id: int

class Answer(AnswerBase):
    id: int
    assessment_id: int
    maturity_score: Optional[float] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)

class ScoreBase(BaseModel):
    dimension: Dimension
    maturity_score: float
    weighted_score: float
    max_possible_score: float
    percentage: float

class Score(ScoreBase):
    id: int
    assessment_id: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class FindingBase(BaseModel):
    dimension: Dimension
    severity: str
    title: str
    description: str
    question_id: Optional[int] = None

class Finding(FindingBase):
    id: int
    assessment_id: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class RecommendationBase(BaseModel):
    dimension: Dimension
    title: str
    description: str
    effort: str
    impact: str
    kpi: Optional[str] = None
    prerequisites: Optional[List[int]] = None
    timeline: str
    priority: int = 0
    status: Optional[str] = "pending"

class Recommendation(RecommendationBase):
    id: int
    assessment_id: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class RecommendationUpdate(BaseModel):
    status: str  # pending, in_progress, completed, skipped

class AssessmentSummary(BaseModel):
    assessment: Assessment
    scores: List[Score]
    findings: List[Finding]
    recommendations: List[Recommendation]
    overall_maturity: float
    risk_level: str
    cost_leakage_estimate: Optional[float] = None

class ReportRequest(BaseModel):
    assessment_id: int
    report_type: str = "full"  # full, executive, engineering

