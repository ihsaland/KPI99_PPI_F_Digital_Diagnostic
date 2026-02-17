"""
AI-Enhanced Diagnostics Service
Implements AI-Augmented Performance Engineering capabilities per KPI99 AI Integration Guidance
"""
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from app import models
from app.models import Dimension
import statistics
import math


class AIDiagnosticsService:
    """
    AI-Assisted Performance Diagnostics service
    Provides anomaly detection, predictive insights, and workload behavior modeling
    """
    
    def __init__(self, db: Session):
        self.db = db
    
    def detect_anomalies(self, assessment_id: int) -> List[Dict[str, Any]]:
        """
        Detect anomalies in assessment results using statistical analysis
        Identifies unusual patterns, regressions, and outliers
        """
        anomalies = []
        
        # Get current assessment scores
        current_scores = self.db.query(models.Score).filter(
            models.Score.assessment_id == assessment_id
        ).all()
        
        if not current_scores:
            return anomalies
        
        # Get historical scores for the same organization
        assessment = self.db.query(models.Assessment).filter(
            models.Assessment.id == assessment_id
        ).first()
        
        if not assessment:
            return anomalies
        
        # Get previous assessments for comparison
        previous_assessments = self.db.query(models.Assessment).filter(
            models.Assessment.organization_id == assessment.organization_id,
            models.Assessment.id != assessment_id,
            models.Assessment.status == 'completed'
        ).order_by(models.Assessment.created_at.desc()).limit(5).all()
        
        # Build score history
        score_history = {}
        for prev_assessment in previous_assessments:
            prev_scores = self.db.query(models.Score).filter(
                models.Score.assessment_id == prev_assessment.id
            ).all()
            for score in prev_scores:
                dim_key = score.dimension.value
                if dim_key not in score_history:
                    score_history[dim_key] = []
                score_history[dim_key].append(score.maturity_score)
        
        # Detect anomalies for each dimension
        for current_score in current_scores:
            dim_key = current_score.dimension.value
            current_value = current_score.maturity_score
            
            if dim_key in score_history and len(score_history[dim_key]) >= 2:
                historical_values = score_history[dim_key]
                mean = statistics.mean(historical_values)
                stdev = statistics.stdev(historical_values) if len(historical_values) > 1 else 0
                
                # Detect significant regression (>2 standard deviations below mean)
                if current_value < mean - (2 * stdev) and stdev > 0:
                    anomalies.append({
                        "type": "regression",
                        "dimension": dim_key,
                        "severity": "high" if current_value < mean - (3 * stdev) else "medium",
                        "message": f"Significant regression detected in {dim_key}. Current score ({current_value:.2f}) is {((mean - current_value) / mean * 100):.1f}% below historical average ({mean:.2f}).",
                        "recommendation": "Immediate investigation recommended. Review recent changes and operational incidents.",
                        "confidence": min(0.95, 0.7 + (abs(mean - current_value) / (stdev + 0.1)) * 0.1)
                    })
                
                # Detect unusual improvement (potential data quality issue)
                elif current_value > mean + (2 * stdev) and stdev > 0:
                    anomalies.append({
                        "type": "unusual_improvement",
                        "dimension": dim_key,
                        "severity": "low",
                        "message": f"Unusually large improvement in {dim_key}. Current score ({current_value:.2f}) is {((current_value - mean) / mean * 100):.1f}% above historical average ({mean:.2f}).",
                        "recommendation": "Verify assessment accuracy. Such rapid improvements may indicate assessment inconsistencies.",
                        "confidence": 0.6
                    })
        
        # Detect dimension imbalance anomalies
        dimension_scores = {s.dimension.value: s.maturity_score for s in current_scores}
        if len(dimension_scores) >= 2:
            scores_list = list(dimension_scores.values())
            max_score = max(scores_list)
            min_score = min(scores_list)
            
            # Detect severe imbalance (>2.0 point difference)
            if max_score - min_score > 2.0:
                anomalies.append({
                    "type": "dimension_imbalance",
                    "dimension": "all",
                    "severity": "medium",
                    "message": f"Significant dimension imbalance detected. Score range: {min_score:.2f} - {max_score:.2f} (difference: {max_score - min_score:.2f}).",
                    "recommendation": "Focus on bringing weaker dimensions to parity with stronger ones for balanced engineering maturity.",
                    "confidence": 0.85
                })
        
        return anomalies
    
    def generate_predictive_insights(self, assessment_id: int) -> Dict[str, Any]:
        """
        Generate predictive insights based on current assessment and historical patterns
        Forecasts capacity curves, cost trajectories, and maturity progression
        """
        assessment = self.db.query(models.Assessment).filter(
            models.Assessment.id == assessment_id
        ).first()
        
        if not assessment:
            return {}
        
        # Get current scores
        current_scores = self.db.query(models.Score).filter(
            models.Score.assessment_id == assessment_id
        ).all()
        
        if not current_scores:
            return {}
        
        # Get historical assessments
        historical_assessments = self.db.query(models.Assessment).filter(
            models.Assessment.organization_id == assessment.organization_id,
            models.Assessment.status == 'completed'
        ).order_by(models.Assessment.created_at.asc()).all()
        
        insights = {
            "maturity_projection": {},
            "risk_forecast": {},
            "capacity_insights": [],
            "cost_insights": []
        }
        
        # Calculate maturity progression trends
        if len(historical_assessments) >= 2:
            historical_overall = []
            for hist_assessment in historical_assessments:
                hist_scores = self.db.query(models.Score).filter(
                    models.Score.assessment_id == hist_assessment.id
                ).all()
                if hist_scores:
                    overall = sum(s.maturity_score for s in hist_scores) / len(hist_scores)
                    historical_overall.append({
                        "date": hist_assessment.created_at,
                        "score": overall
                    })
            
            if len(historical_overall) >= 2:
                # Calculate trend
                recent_trend = historical_overall[-1]["score"] - historical_overall[-2]["score"]
                current_overall = sum(s.maturity_score for s in current_scores) / len(current_scores)
                
                # Project 6 months ahead
                projected_score = current_overall + (recent_trend * 3)  # 3 assessment cycles
                projected_score = max(0, min(5.0, projected_score))
                
                insights["maturity_projection"] = {
                    "current": round(current_overall, 2),
                    "projected_6mo": round(projected_score, 2),
                    "trend": "improving" if recent_trend > 0 else "declining" if recent_trend < 0 else "stable",
                    "velocity": round(recent_trend, 2),
                    "confidence": min(0.85, 0.5 + (len(historical_overall) * 0.05))
                }
        
        # Generate dimension-specific capacity insights
        for score in current_scores:
            if score.dimension == Dimension.INFRASTRUCTURE_EFFICIENCY:
                if score.maturity_score < 3.0:
                    insights["capacity_insights"].append({
                        "dimension": "infrastructure_efficiency",
                        "type": "capacity_risk",
                        "message": "Low infrastructure efficiency maturity indicates potential capacity planning challenges. Predictive capacity modeling recommended.",
                        "recommendation": "Implement AI-driven capacity forecasting to optimize resource allocation and reduce costs.",
                        "priority": "high"
                    })
            
            elif score.dimension == Dimension.PERFORMANCE:
                if score.maturity_score < 2.5:
                    insights["capacity_insights"].append({
                        "dimension": "performance",
                        "type": "workload_modeling",
                        "message": "Performance dimension requires workload behavior modeling to identify optimization opportunities.",
                        "recommendation": "Deploy ML-based anomaly detection and workload clustering to understand performance patterns.",
                        "priority": "medium"
                    })
        
        # Cost trajectory insights
        if any(s.dimension == Dimension.INFRASTRUCTURE_EFFICIENCY for s in current_scores):
            infra_score = next(s for s in current_scores if s.dimension == Dimension.INFRASTRUCTURE_EFFICIENCY)
            if infra_score.maturity_score < 3.0:
                insights["cost_insights"].append({
                    "type": "cost_optimization",
                    "message": "Infrastructure efficiency gaps suggest significant cost optimization opportunities.",
                    "estimated_savings_potential": "15-30%",
                    "recommendation": "Implement AI-driven cost modeling and tier multiplier simulations to identify savings.",
                    "priority": "high"
                })
        
        return insights
    
    def prioritize_recommendations_ai(self, assessment_id: int, recommendations: List[models.Recommendation]) -> List[models.Recommendation]:
        """
        AI-powered recommendation prioritization based on workload patterns and impact analysis
        """
        if not recommendations:
            return recommendations
        
        # Get assessment context
        assessment = self.db.query(models.Assessment).filter(
            models.Assessment.id == assessment_id
        ).first()
        
        if not assessment:
            return recommendations
        
        # Get scores for context
        scores = self.db.query(models.Score).filter(
            models.Score.assessment_id == assessment_id
        ).all()
        score_map = {s.dimension: s.maturity_score for s in scores}
        
        # Get historical data for pattern analysis
        historical_assessments = self.db.query(models.Assessment).filter(
            models.Assessment.organization_id == assessment.organization_id,
            models.Assessment.status == 'completed'
        ).order_by(models.Assessment.created_at.desc()).limit(3).all()
        
        # AI-enhanced prioritization scoring
        for rec in recommendations:
            base_priority = rec.priority
            
            # Adjust priority based on dimension maturity
            dim_score = score_map.get(rec.dimension, 0)
            
            # Critical dimensions get higher priority
            if dim_score < 2.0:
                rec.priority = base_priority - 10  # Higher priority (lower number)
            elif dim_score < 2.5:
                rec.priority = base_priority - 5
            
            # Impact-effort optimization
            impact_score = {"low": 1, "medium": 2, "high": 3}.get(rec.impact, 1)
            effort_score = {"low": 3, "medium": 2, "high": 1}.get(rec.effort, 2)
            
            # AI score = impact/effort ratio weighted by dimension criticality
            ai_score = (impact_score / effort_score) * (3.0 - dim_score)
            rec.priority = int(base_priority - (ai_score * 5))
        
        # Sort by priority
        recommendations.sort(key=lambda r: r.priority)
        
        return recommendations
    
    def generate_workload_insights(self, assessment_id: int) -> List[Dict[str, Any]]:
        """
        Generate workload behavior modeling insights
        Identifies patterns in distributed systems (Spark, EMR, JVM platforms)
        """
        insights = []
        
        assessment = self.db.query(models.Assessment).filter(
            models.Assessment.id == assessment_id
        ).first()
        
        if not assessment:
            return insights
        
        # Get answers to identify workload characteristics
        answers = self.db.query(models.Answer).filter(
            models.Answer.assessment_id == assessment_id
        ).all()
        
        # Check for distributed systems indicators
        distributed_system_questions = [
            "spark", "emr", "eks", "kubernetes", "distributed", "cluster", "executor"
        ]
        
        has_distributed_systems = False
        for answer in answers:
            answer_text = (answer.answer_value or "").lower()
            if any(keyword in answer_text for keyword in distributed_system_questions):
                has_distributed_systems = True
                break
        
        if has_distributed_systems:
            insights.append({
                "type": "workload_optimization",
                "title": "Distributed Workload Optimization Opportunity",
                "message": "Your assessment indicates distributed systems usage (Spark, EMR, EKS). AI-powered workload clustering and executor skew detection can significantly improve efficiency.",
                "recommendation": "Implement ML-based workload behavior modeling to identify optimization patterns and reduce resource waste.",
                "priority": "high",
                "applicable_dimensions": ["performance", "infrastructure_efficiency"]
            })
        
        # Performance dimension insights
        perf_score = self.db.query(models.Score).filter(
            models.Score.assessment_id == assessment_id,
            models.Score.dimension == Dimension.PERFORMANCE
        ).first()
        
        if perf_score and perf_score.maturity_score < 3.0:
            insights.append({
                "type": "anomaly_detection",
                "title": "ML-Based Anomaly Detection Recommended",
                "message": "Low performance maturity suggests benefit from automated anomaly detection and regression detection systems.",
                "recommendation": "Deploy AI-assisted performance diagnostics to proactively identify issues before they impact users.",
                "priority": "medium",
                "applicable_dimensions": ["performance"]
            })
        
        return insights


