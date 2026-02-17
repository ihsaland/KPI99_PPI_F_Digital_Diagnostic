"""
Recommendation service for generating actionable recommendations
"""
from sqlalchemy.orm import Session
from typing import List
from app import models
from app.models import Dimension
from app.services.ai_diagnostics import AIDiagnosticsService

class RecommendationService:
    """Service for generating recommendations based on scores"""
    
    RECOMMENDATION_RULES = {
        Dimension.PERFORMANCE: {
            "low": [
                {
                    "title": "Implement Performance Monitoring",
                    "description": "Set up comprehensive performance monitoring with latency and throughput metrics. Establish baseline measurements and alerting thresholds.",
                    "effort": "medium",
                    "impact": "high",
                    "kpi": "P95 latency reduction, throughput increase",
                    "timeline": "30"
                },
                {
                    "title": "Identify and Resolve Bottlenecks",
                    "description": "Conduct performance profiling to identify bottlenecks. Focus on database queries, API calls, and resource-intensive operations.",
                    "effort": "high",
                    "impact": "high",
                    "kpi": "Response time improvement, resource utilization",
                    "timeline": "60"
                }
            ],
            "medium": [
                {
                    "title": "Optimize Critical Paths",
                    "description": "Review and optimize critical user-facing paths. Implement caching strategies and optimize database queries.",
                    "effort": "medium",
                    "impact": "medium",
                    "kpi": "User-perceived latency, conversion rates",
                    "timeline": "60"
                }
            ]
        },
        Dimension.PRODUCTION_READINESS: {
            "low": [
                {
                    "title": "Define and Implement SLOs",
                    "description": "Establish Service Level Objectives (SLOs) for key services. Define error budgets and implement monitoring.",
                    "effort": "medium",
                    "impact": "high",
                    "kpi": "SLO compliance rate, error budget consumption",
                    "timeline": "30"
                },
                {
                    "title": "Create Deployment Safety Mechanisms",
                    "description": "Implement canary deployments, feature flags, and automated rollback capabilities. Establish deployment runbooks.",
                    "effort": "high",
                    "impact": "high",
                    "kpi": "Deployment success rate, rollback frequency",
                    "timeline": "90"
                },
                {
                    "title": "Document Runbooks and Procedures",
                    "description": "Create comprehensive runbooks for common operational tasks, incident response, and troubleshooting procedures.",
                    "effort": "low",
                    "impact": "medium",
                    "kpi": "MTTR reduction, incident resolution time",
                    "timeline": "30"
                }
            ]
        },
        Dimension.INFRASTRUCTURE_EFFICIENCY: {
            "low": [
                {
                    "title": "Implement Auto-scaling",
                    "description": "Set up horizontal and vertical auto-scaling based on demand. Optimize resource allocation and capacity planning.",
                    "effort": "medium",
                    "impact": "high",
                    "kpi": "Cost per transaction, resource utilization",
                    "timeline": "60"
                },
                {
                    "title": "Establish Cost Monitoring and Controls",
                    "description": "Implement cost tracking, budgeting, and alerting. Set up cost allocation and chargeback mechanisms.",
                    "effort": "low",
                    "impact": "medium",
                    "kpi": "Infrastructure cost, cost per unit of work",
                    "timeline": "30"
                }
            ]
        },
        Dimension.FAILURE_RESILIENCE: {
            "low": [
                {
                    "title": "Implement High Availability Architecture",
                    "description": "Design and implement multi-region, multi-AZ deployments. Set up load balancing and failover mechanisms.",
                    "effort": "high",
                    "impact": "high",
                    "kpi": "Uptime, availability percentage",
                    "timeline": "90"
                },
                {
                    "title": "Establish Disaster Recovery Plan",
                    "description": "Create and test disaster recovery procedures. Implement backup and restore mechanisms with defined RTO/RPO.",
                    "effort": "high",
                    "impact": "high",
                    "kpi": "RTO, RPO, recovery test success rate",
                    "timeline": "90"
                },
                {
                    "title": "Implement Fault Isolation",
                    "description": "Use circuit breakers, bulkheads, and timeouts to prevent cascading failures. Implement graceful degradation.",
                    "effort": "medium",
                    "impact": "high",
                    "kpi": "Failure containment rate, cascade prevention",
                    "timeline": "60"
                }
            ]
        }
    }
    
    def generate_recommendations(self, assessment_id: int, db: Session) -> List[models.Recommendation]:
        """Generate recommendations based on assessment scores"""
        # Delete existing recommendations
        db.query(models.Recommendation).filter(models.Recommendation.assessment_id == assessment_id).delete()
        
        recommendations = []
        scores = db.query(models.Score).filter(models.Score.assessment_id == assessment_id).all()
        
        for score in scores:
            # Determine score band
            if score.maturity_score < 2.5:
                band = "low"
            elif score.maturity_score < 3.5:
                band = "medium"
            else:
                band = "high"
            
            # Get recommendations for this dimension and band
            dimension_rules = self.RECOMMENDATION_RULES.get(score.dimension, {})
            band_recommendations = dimension_rules.get(band, [])
            
            # Also include low-band recommendations if score is medium/high
            if band != "low":
                band_recommendations.extend(dimension_rules.get("low", []))
            
            priority = 0
            for rec_data in band_recommendations:
                rec = models.Recommendation(
                    assessment_id=assessment_id,
                    dimension=score.dimension,
                    title=rec_data["title"],
                    description=rec_data["description"],
                    effort=rec_data["effort"],
                    impact=rec_data["impact"],
                    kpi=rec_data.get("kpi"),
                    timeline=rec_data["timeline"],
                    priority=priority,
                    status="pending"
                )
                recommendations.append(rec)
                db.add(rec)
                priority += 1
        
        db.commit()
        
        # Apply AI-powered prioritization
        ai_service = AIDiagnosticsService(db)
        recommendations = ai_service.prioritize_recommendations_ai(assessment_id, recommendations)
        
        # Update priorities in database
        for rec in recommendations:
            db.merge(rec)
        db.commit()
        
        return recommendations

