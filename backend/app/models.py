"""
Database models for KPI99 PPI-F Digital Diagnostic Tool
"""
from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey, Boolean, JSON, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum

class Dimension(str, enum.Enum):
    PERFORMANCE = "performance"
    PRODUCTION_READINESS = "production_readiness"
    INFRASTRUCTURE_EFFICIENCY = "infrastructure_efficiency"
    FAILURE_RESILIENCE = "failure_resilience"

class QuestionType(str, enum.Enum):
    SINGLE_SELECT = "single_select"
    MULTI_SELECT = "multi_select"
    NUMERIC = "numeric"
    FREE_TEXT = "free_text"

class Organization(Base):
    __tablename__ = "organizations"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    domain = Column(String(255))
    subdomain = Column(String(255), unique=True, nullable=True, index=True)  # For subdomain routing
    api_key = Column(String(255), unique=True, nullable=True, index=True)  # API key for access
    api_key_created_at = Column(DateTime(timezone=True), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    assessments = relationship("Assessment", back_populates="organization")
    webhooks = relationship("Webhook", back_populates="organization")
    notifications = relationship("Notification", back_populates="organization")

class Assessment(Base):
    __tablename__ = "assessments"
    
    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=False)
    name = Column(String(255), nullable=False)
    version = Column(String(50), default="1.0")
    status = Column(String(50), default="draft")  # draft, in_progress, completed
    notes = Column(Text, nullable=True)  # Assessment notes/comments
    tags = Column(JSON, nullable=True)  # Custom tags for categorization
    custom_fields = Column(JSON, nullable=True)  # Custom key-value fields
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)
    
    organization = relationship("Organization", back_populates="assessments")
    answers = relationship("Answer", back_populates="assessment", cascade="all, delete-orphan")
    scores = relationship("Score", back_populates="assessment", cascade="all, delete-orphan")
    findings = relationship("Finding", back_populates="assessment", cascade="all, delete-orphan")
    recommendations = relationship("Recommendation", back_populates="assessment", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="assessment")

class Question(Base):
    __tablename__ = "questions"
    
    id = Column(Integer, primary_key=True, index=True)
    dimension = Column(Enum(Dimension), nullable=False, index=True)
    question_type = Column(Enum(QuestionType), nullable=False)
    question_text = Column(Text, nullable=False)
    options = Column(JSON)  # For single/multi-select questions
    weight = Column(Float, default=1.0)  # Weight for scoring
    order = Column(Integer, default=0)  # Display order
    is_critical = Column(Boolean, default=False)  # Critical blocker flag
    maturity_mapping = Column(JSON)  # Maps answers to maturity scores (0-5)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    answers = relationship("Answer", back_populates="question")

class Answer(Base):
    __tablename__ = "answers"
    
    id = Column(Integer, primary_key=True, index=True)
    assessment_id = Column(Integer, ForeignKey("assessments.id"), nullable=False)
    question_id = Column(Integer, ForeignKey("questions.id"), nullable=False)
    answer_value = Column(Text)  # JSON string for complex answers
    maturity_score = Column(Float)  # Calculated maturity score (0-5)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    assessment = relationship("Assessment", back_populates="answers")
    question = relationship("Question", back_populates="answers")

class Score(Base):
    __tablename__ = "scores"
    
    id = Column(Integer, primary_key=True, index=True)
    assessment_id = Column(Integer, ForeignKey("assessments.id"), nullable=False)
    dimension = Column(Enum(Dimension), nullable=False)
    maturity_score = Column(Float, nullable=False)  # 0-5
    weighted_score = Column(Float, nullable=False)
    max_possible_score = Column(Float, nullable=False)
    percentage = Column(Float, nullable=False)  # Percentage of max score
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    assessment = relationship("Assessment", back_populates="scores")

class Finding(Base):
    __tablename__ = "findings"
    
    id = Column(Integer, primary_key=True, index=True)
    assessment_id = Column(Integer, ForeignKey("assessments.id"), nullable=False)
    dimension = Column(Enum(Dimension), nullable=False)
    severity = Column(String(50))  # critical, high, medium, low
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    question_id = Column(Integer, ForeignKey("questions.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    assessment = relationship("Assessment", back_populates="findings")

class Recommendation(Base):
    __tablename__ = "recommendations"
    
    id = Column(Integer, primary_key=True, index=True)
    assessment_id = Column(Integer, ForeignKey("assessments.id"), nullable=False)
    dimension = Column(Enum(Dimension), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    effort = Column(String(50))  # low, medium, high
    impact = Column(String(50))  # low, medium, high
    kpi = Column(String(255))  # Key performance indicator
    prerequisites = Column(JSON)  # List of prerequisite recommendation IDs
    timeline = Column(String(50))  # 30, 60, 90 days
    priority = Column(Integer, default=0)  # Higher = more priority
    status = Column(String(50), default="pending")  # pending, in_progress, completed, skipped
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    assessment = relationship("Assessment", back_populates="recommendations")

class Artifact(Base):
    __tablename__ = "artifacts"
    
    id = Column(Integer, primary_key=True, index=True)
    assessment_id = Column(Integer, ForeignKey("assessments.id"), nullable=False)
    filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_type = Column(String(100))
    file_size = Column(Integer)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())

class Webhook(Base):
    __tablename__ = "webhooks"
    
    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=False)
    url = Column(String(500), nullable=False)
    events = Column(JSON, nullable=False)  # List of events to subscribe to
    secret = Column(String(255), nullable=True)  # Webhook secret for verification
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    organization = relationship("Organization", back_populates="webhooks")

class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=True)
    assessment_id = Column(Integer, ForeignKey("assessments.id"), nullable=True)
    type = Column(String(50), nullable=False)  # assessment_completed, recommendation_updated, etc.
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    organization = relationship("Organization", back_populates="notifications")
    assessment = relationship("Assessment", back_populates="notifications")

