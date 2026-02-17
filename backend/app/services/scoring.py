"""
Scoring service for calculating maturity scores and generating findings
"""
from sqlalchemy.orm import Session
from typing import List
import json

from app import models
from app.models import Dimension

class ScoringService:
    """Service for calculating assessment scores"""
    
    def calculate_maturity_score(self, question: models.Question, answer_value: str) -> float:
        """Calculate maturity score (0-5) for a single answer"""
        if question.maturity_mapping:
            # Use explicit mapping if available
            try:
                answer_data = json.loads(answer_value) if answer_value.startswith('{') else answer_value
                if isinstance(answer_data, dict):
                    # For structured answers, check mapping
                    for key, score in question.maturity_mapping.items():
                        if key in str(answer_data):
                            return float(score)
                else:
                    # Direct value mapping
                    score = question.maturity_mapping.get(str(answer_data), 0.0)
                    return float(score)
            except:
                pass
        
        # Default scoring logic based on question type
        if question.question_type.value == "numeric":
            try:
                value = float(answer_value)
                # Normalize to 0-5 scale (adjust based on expected ranges)
                return min(5.0, max(0.0, value / 20.0 * 5.0))
            except:
                return 0.0
        elif question.question_type.value in ["single_select", "multi_select"]:
            # For select questions, assume higher index = higher maturity
            try:
                options = question.options or {}
                if isinstance(options, dict) and "options" in options:
                    options_list = options["options"]
                    answer_data = json.loads(answer_value) if answer_value.startswith('[') else [answer_value]
                    if isinstance(answer_data, list) and answer_data:
                        selected = answer_data[0] if answer_data else None
                        if selected in options_list:
                            index = options_list.index(selected)
                            return (index / len(options_list)) * 5.0
            except:
                pass
            return 2.5  # Default middle score
        
        return 0.0
    
    def calculate_all_scores(self, assessment_id: int, db: Session) -> List[models.Score]:
        """Calculate scores for all dimensions"""
        assessment = db.query(models.Assessment).filter(models.Assessment.id == assessment_id).first()
        if not assessment:
            return []
        
        # Delete existing scores
        db.query(models.Score).filter(models.Score.assessment_id == assessment_id).delete()
        
        scores = []
        for dimension in Dimension:
            dimension_scores = self._calculate_dimension_score(assessment_id, dimension, db)
            if dimension_scores:
                scores.append(dimension_scores)
        
        db.commit()
        return scores
    
    def _calculate_dimension_score(self, assessment_id: int, dimension: Dimension, db: Session) -> models.Score:
        """Calculate score for a specific dimension"""
        # Get all answers for questions in this dimension
        answers = db.query(models.Answer).join(models.Question).filter(
            models.Answer.assessment_id == assessment_id,
            models.Question.dimension == dimension
        ).all()
        
        if not answers:
            return None
        
        # Calculate weighted average
        total_weighted_score = 0.0
        total_weight = 0.0
        max_possible_score = 0.0
        
        for answer in answers:
            if answer.maturity_score is not None:
                weight = answer.question.weight
                total_weighted_score += answer.maturity_score * weight
                total_weight += weight
                max_possible_score += 5.0 * weight  # Max score is 5
        
        if total_weight == 0:
            return None
        
        weighted_score = total_weighted_score / total_weight if total_weight > 0 else 0.0
        average_maturity = total_weighted_score / total_weight if total_weight > 0 else 0.0
        percentage = (weighted_score / 5.0) * 100.0 if max_possible_score > 0 else 0.0
        
        # Check for critical blockers
        critical_questions = db.query(models.Question).filter(
            models.Question.dimension == dimension,
            models.Question.is_critical == True
        ).all()
        
        for crit_q in critical_questions:
            answer = next((a for a in answers if a.question_id == crit_q.id), None)
            if answer and answer.maturity_score is not None and answer.maturity_score < 2.0:
                # Critical blocker - cap the score
                weighted_score = min(weighted_score, 2.0)
                average_maturity = min(average_maturity, 2.0)
                percentage = min(percentage, 40.0)
        
        score = models.Score(
            assessment_id=assessment_id,
            dimension=dimension,
            maturity_score=average_maturity,
            weighted_score=weighted_score,
            max_possible_score=max_possible_score,
            percentage=percentage
        )
        db.add(score)
        return score
    
    def generate_findings(self, assessment_id: int, db: Session) -> List[models.Finding]:
        """Generate findings based on scores and answers"""
        # Delete existing findings
        db.query(models.Finding).filter(models.Finding.assessment_id == assessment_id).delete()
        
        findings = []
        
        # Get scores
        scores = db.query(models.Score).filter(models.Score.assessment_id == assessment_id).all()
        
        for score in scores:
            if score.maturity_score < 2.0:
                findings.append(models.Finding(
                    assessment_id=assessment_id,
                    dimension=score.dimension,
                    severity="critical",
                    title=f"Critical Gap in {score.dimension.value.replace('_', ' ').title()}",
                    description=f"Maturity score of {score.maturity_score:.1f}/5.0 indicates critical gaps requiring immediate attention."
                ))
            elif score.maturity_score < 3.0:
                findings.append(models.Finding(
                    assessment_id=assessment_id,
                    dimension=score.dimension,
                    severity="high",
                    title=f"Significant Gap in {score.dimension.value.replace('_', ' ').title()}",
                    description=f"Maturity score of {score.maturity_score:.1f}/5.0 indicates significant improvement opportunities."
                ))
        
        # Check for low-scoring answers
        answers = db.query(models.Answer).filter(models.Answer.assessment_id == assessment_id).all()
        for answer in answers:
            if answer.maturity_score is not None and answer.maturity_score < 2.0:
                findings.append(models.Finding(
                    assessment_id=assessment_id,
                    dimension=answer.question.dimension,
                    severity="high",
                    title=f"Low Score on: {answer.question.question_text[:50]}...",
                    description=f"This question received a maturity score of {answer.maturity_score:.1f}/5.0, indicating areas for improvement.",
                    question_id=answer.question_id
                ))
        
        for finding in findings:
            db.add(finding)
        
        db.commit()
        return findings




