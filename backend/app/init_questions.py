"""
Initialize questions database with PPI-F framework questions
"""
from sqlalchemy.orm import Session
from app.database import SessionLocal, Base, engine
from app.models import Question, Dimension, QuestionType

QUESTIONS = [
    # PERFORMANCE DIMENSION
    {
        "dimension": Dimension.PERFORMANCE,
        "question_type": QuestionType.NUMERIC,
        "question_text": "What is your average API response time (P95 latency) in milliseconds?",
        "weight": 1.5,
        "order": 1,
        "is_critical": False,
        "maturity_mapping": None
    },
    {
        "dimension": Dimension.PERFORMANCE,
        "question_type": QuestionType.SINGLE_SELECT,
        "question_text": "How do you monitor application performance?",
        "weight": 1.0,
        "order": 2,
        "is_critical": False,
        "options": {"options": ["No monitoring", "Basic logging", "APM tools (e.g., New Relic, Datadog)", "Comprehensive observability platform"]},
        "maturity_mapping": {"No monitoring": 0, "Basic logging": 1, "APM tools (e.g., New Relic, Datadog)": 3, "Comprehensive observability platform": 5}
    },
    {
        "dimension": Dimension.PERFORMANCE,
        "question_type": QuestionType.SINGLE_SELECT,
        "question_text": "How do you identify performance bottlenecks?",
        "weight": 1.0,
        "order": 3,
        "is_critical": False,
        "options": {"options": ["Manual investigation", "Basic profiling tools", "Automated profiling and tracing", "Continuous performance analysis with AI/ML"]},
        "maturity_mapping": {"Manual investigation": 1, "Basic profiling tools": 2, "Automated profiling and tracing": 4, "Continuous performance analysis with AI/ML": 5}
    },
    {
        "dimension": Dimension.PERFORMANCE,
        "question_type": QuestionType.NUMERIC,
        "question_text": "What is your system throughput (requests per second)?",
        "weight": 1.0,
        "order": 4,
        "is_critical": False
    },
    {
        "dimension": Dimension.PERFORMANCE,
        "question_type": QuestionType.SINGLE_SELECT,
        "question_text": "Do you have performance budgets or SLAs defined?",
        "weight": 1.5,
        "order": 5,
        "is_critical": True,
        "options": {"options": ["No", "Informal/verbal agreements", "Documented but not enforced", "Enforced with automated alerts", "Enforced with automated remediation"]},
        "maturity_mapping": {"No": 0, "Informal/verbal agreements": 1, "Documented but not enforced": 2, "Enforced with automated alerts": 4, "Enforced with automated remediation": 5}
    },
    {
        "dimension": Dimension.PERFORMANCE,
        "question_type": QuestionType.MULTI_SELECT,
        "question_text": "Which performance optimization techniques do you use?",
        "weight": 1.0,
        "order": 6,
        "is_critical": False,
        "options": {"options": ["Caching", "CDN", "Database query optimization", "Load balancing", "Async processing", "Connection pooling"]}
    },
    {
        "dimension": Dimension.PERFORMANCE,
        "question_type": QuestionType.SINGLE_SELECT,
        "question_text": "How often do you conduct performance testing?",
        "weight": 1.0,
        "order": 7,
        "is_critical": False,
        "options": {"options": ["Never", "Ad-hoc when issues arise", "Before major releases", "As part of CI/CD pipeline", "Continuous performance testing"]},
        "maturity_mapping": {"Never": 0, "Ad-hoc when issues arise": 1, "Before major releases": 2, "As part of CI/CD pipeline": 4, "Continuous performance testing": 5}
    },
    
    # PRODUCTION READINESS DIMENSION
    {
        "dimension": Dimension.PRODUCTION_READINESS,
        "question_type": QuestionType.SINGLE_SELECT,
        "question_text": "Do you have Service Level Objectives (SLOs) defined?",
        "weight": 1.5,
        "order": 1,
        "is_critical": True,
        "options": {"options": ["No", "Some services have SLOs", "Most services have SLOs", "All services have SLOs", "All services have SLOs with error budgets"]},
        "maturity_mapping": {"No": 0, "Some services have SLOs": 1, "Most services have SLOs": 2, "All services have SLOs": 4, "All services have SLOs with error budgets": 5}
    },
    {
        "dimension": Dimension.PRODUCTION_READINESS,
        "question_type": QuestionType.SINGLE_SELECT,
        "question_text": "What is your deployment strategy?",
        "weight": 1.5,
        "order": 2,
        "is_critical": False,
        "options": {"options": ["Big bang deployments", "Blue-green deployments", "Canary deployments", "Feature flags with gradual rollout", "Automated progressive delivery"]},
        "maturity_mapping": {"Big bang deployments": 1, "Blue-green deployments": 2, "Canary deployments": 3, "Feature flags with gradual rollout": 4, "Automated progressive delivery": 5}
    },
    {
        "dimension": Dimension.PRODUCTION_READINESS,
        "question_type": QuestionType.SINGLE_SELECT,
        "question_text": "Do you have automated rollback capabilities?",
        "weight": 1.5,
        "order": 3,
        "is_critical": True,
        "options": {"options": ["No", "Manual rollback process", "Semi-automated rollback", "Automated rollback on failure", "Automated rollback with health checks"]},
        "maturity_mapping": {"No": 0, "Manual rollback process": 1, "Semi-automated rollback": 2, "Automated rollback on failure": 4, "Automated rollback with health checks": 5}
    },
    {
        "dimension": Dimension.PRODUCTION_READINESS,
        "question_type": QuestionType.SINGLE_SELECT,
        "question_text": "How comprehensive are your runbooks?",
        "weight": 1.0,
        "order": 4,
        "is_critical": False,
        "options": {"options": ["No runbooks", "Basic documentation", "Some runbooks exist", "Comprehensive runbooks for common tasks", "Automated runbook execution"]},
        "maturity_mapping": {"No runbooks": 0, "Basic documentation": 1, "Some runbooks exist": 2, "Comprehensive runbooks for common tasks": 4, "Automated runbook execution": 5}
    },
    {
        "dimension": Dimension.PRODUCTION_READINESS,
        "question_type": QuestionType.SINGLE_SELECT,
        "question_text": "What is your change management process?",
        "weight": 1.0,
        "order": 5,
        "is_critical": False,
        "options": {"options": ["No formal process", "Ad-hoc approvals", "Manual change requests", "Automated change approval workflow", "GitOps with automated governance"]},
        "maturity_mapping": {"No formal process": 0, "Ad-hoc approvals": 1, "Manual change requests": 2, "Automated change approval workflow": 3, "GitOps with automated governance": 5}
    },
    {
        "dimension": Dimension.PRODUCTION_READINESS,
        "question_type": QuestionType.SINGLE_SELECT,
        "question_text": "How do you handle configuration management?",
        "weight": 1.0,
        "order": 6,
        "is_critical": False,
        "options": {"options": ["Hardcoded in code", "Environment variables", "Configuration files", "Centralized config service", "GitOps-based configuration"]},
        "maturity_mapping": {"Hardcoded in code": 0, "Environment variables": 1, "Configuration files": 2, "Centralized config service": 4, "GitOps-based configuration": 5}
    },
    {
        "dimension": Dimension.PRODUCTION_READINESS,
        "question_type": QuestionType.SINGLE_SELECT,
        "question_text": "What is your testing coverage before production?",
        "weight": 1.5,
        "order": 7,
        "is_critical": True,
        "options": {"options": ["No testing", "Manual testing only", "Unit tests", "Unit + integration tests", "Full test suite (unit, integration, e2e, performance)"]},
        "maturity_mapping": {"No testing": 0, "Manual testing only": 1, "Unit tests": 2, "Unit + integration tests": 3, "Full test suite (unit, integration, e2e, performance)": 5}
    },
    
    # INFRASTRUCTURE EFFICIENCY DIMENSION
    {
        "dimension": Dimension.INFRASTRUCTURE_EFFICIENCY,
        "question_type": QuestionType.SINGLE_SELECT,
        "question_text": "How do you manage infrastructure capacity?",
        "weight": 1.5,
        "order": 1,
        "is_critical": False,
        "options": {"options": ["Manual provisioning", "Scheduled scaling", "Reactive auto-scaling", "Predictive auto-scaling", "AI-driven capacity optimization"]},
        "maturity_mapping": {"Manual provisioning": 0, "Scheduled scaling": 1, "Reactive auto-scaling": 3, "Predictive auto-scaling": 4, "AI-driven capacity optimization": 5}
    },
    {
        "dimension": Dimension.INFRASTRUCTURE_EFFICIENCY,
        "question_type": QuestionType.SINGLE_SELECT,
        "question_text": "Do you have cost monitoring and controls?",
        "weight": 1.5,
        "order": 2,
        "is_critical": False,
        "options": {"options": ["No cost tracking", "Monthly billing review", "Cost dashboards", "Cost alerts and budgets", "Automated cost optimization"]},
        "maturity_mapping": {"No cost tracking": 0, "Monthly billing review": 1, "Cost dashboards": 2, "Cost alerts and budgets": 4, "Automated cost optimization": 5}
    },
    {
        "dimension": Dimension.INFRASTRUCTURE_EFFICIENCY,
        "question_type": QuestionType.NUMERIC,
        "question_text": "What is your average infrastructure utilization percentage?",
        "weight": 1.0,
        "order": 3,
        "is_critical": False
    },
    {
        "dimension": Dimension.INFRASTRUCTURE_EFFICIENCY,
        "question_type": QuestionType.SINGLE_SELECT,
        "question_text": "How do you handle resource allocation?",
        "weight": 1.0,
        "order": 4,
        "is_critical": False,
        "options": {"options": ["Fixed allocation", "Manual adjustment", "Basic resource limits", "Dynamic resource allocation", "Optimized resource allocation with ML"]},
        "maturity_mapping": {"Fixed allocation": 1, "Manual adjustment": 2, "Basic resource limits": 2, "Dynamic resource allocation": 4, "Optimized resource allocation with ML": 5}
    },
    {
        "dimension": Dimension.INFRASTRUCTURE_EFFICIENCY,
        "question_type": QuestionType.MULTI_SELECT,
        "question_text": "Which cost optimization strategies do you employ?",
        "weight": 1.0,
        "order": 5,
        "is_critical": False,
        "options": {"options": ["Reserved instances", "Spot instances", "Right-sizing", "Container optimization", "Serverless where applicable", "Multi-cloud optimization"]}
    },
    {
        "dimension": Dimension.INFRASTRUCTURE_EFFICIENCY,
        "question_type": QuestionType.SINGLE_SELECT,
        "question_text": "How do you track infrastructure costs per service/team?",
        "weight": 1.0,
        "order": 6,
        "is_critical": False,
        "options": {"options": ["No tracking", "Manual allocation", "Basic tagging", "Automated cost allocation", "Chargeback/showback with detailed reporting"]},
        "maturity_mapping": {"No tracking": 0, "Manual allocation": 1, "Basic tagging": 2, "Automated cost allocation": 4, "Chargeback/showback with detailed reporting": 5}
    },
    
    # FAILURE RESILIENCE DIMENSION
    {
        "dimension": Dimension.FAILURE_RESILIENCE,
        "question_type": QuestionType.SINGLE_SELECT,
        "question_text": "What is your high availability strategy?",
        "weight": 1.5,
        "order": 1,
        "is_critical": True,
        "options": {"options": ["Single region, single AZ", "Single region, multiple AZs", "Multi-region active-passive", "Multi-region active-active", "Global distribution with intelligent routing"]},
        "maturity_mapping": {"Single region, single AZ": 0, "Single region, multiple AZs": 2, "Multi-region active-passive": 3, "Multi-region active-active": 4, "Global distribution with intelligent routing": 5}
    },
    {
        "dimension": Dimension.FAILURE_RESILIENCE,
        "question_type": QuestionType.SINGLE_SELECT,
        "question_text": "Do you have a disaster recovery plan?",
        "weight": 1.5,
        "order": 2,
        "is_critical": True,
        "options": {"options": ["No DR plan", "Informal plan", "Documented plan, not tested", "Regularly tested DR plan", "Automated DR with defined RTO/RPO"]},
        "maturity_mapping": {"No DR plan": 0, "Informal plan": 1, "Documented plan, not tested": 2, "Regularly tested DR plan": 4, "Automated DR with defined RTO/RPO": 5}
    },
    {
        "dimension": Dimension.FAILURE_RESILIENCE,
        "question_type": QuestionType.SINGLE_SELECT,
        "question_text": "What is your Recovery Time Objective (RTO)?",
        "weight": 1.0,
        "order": 3,
        "is_critical": False,
        "options": {"options": ["No RTO defined", "> 24 hours", "4-24 hours", "1-4 hours", "< 1 hour"]},
        "maturity_mapping": {"No RTO defined": 0, "> 24 hours": 1, "4-24 hours": 2, "1-4 hours": 4, "< 1 hour": 5}
    },
    {
        "dimension": Dimension.FAILURE_RESILIENCE,
        "question_type": QuestionType.SINGLE_SELECT,
        "question_text": "What is your Recovery Point Objective (RPO)?",
        "weight": 1.0,
        "order": 4,
        "is_critical": False,
        "options": {"options": ["No RPO defined", "> 24 hours", "4-24 hours", "1-4 hours", "< 1 hour"]},
        "maturity_mapping": {"No RPO defined": 0, "> 24 hours": 1, "4-24 hours": 2, "1-4 hours": 4, "< 1 hour": 5}
    },
    {
        "dimension": Dimension.FAILURE_RESILIENCE,
        "question_type": QuestionType.SINGLE_SELECT,
        "question_text": "How do you prevent cascading failures?",
        "weight": 1.5,
        "order": 5,
        "is_critical": True,
        "options": {"options": ["No protection", "Basic timeouts", "Circuit breakers", "Circuit breakers + bulkheads", "Comprehensive fault isolation with graceful degradation"]},
        "maturity_mapping": {"No protection": 0, "Basic timeouts": 1, "Circuit breakers": 3, "Circuit breakers + bulkheads": 4, "Comprehensive fault isolation with graceful degradation": 5}
    },
    {
        "dimension": Dimension.FAILURE_RESILIENCE,
        "question_type": QuestionType.SINGLE_SELECT,
        "question_text": "How do you handle data backup and recovery?",
        "weight": 1.5,
        "order": 6,
        "is_critical": True,
        "options": {"options": ["No backups", "Manual backups", "Automated backups, untested", "Regular automated backups with testing", "Continuous backup with point-in-time recovery"]},
        "maturity_mapping": {"No backups": 0, "Manual backups": 1, "Automated backups, untested": 2, "Regular automated backups with testing": 4, "Continuous backup with point-in-time recovery": 5}
    },
    {
        "dimension": Dimension.FAILURE_RESILIENCE,
        "question_type": QuestionType.SINGLE_SELECT,
        "question_text": "How do you test for failure scenarios?",
        "weight": 1.0,
        "order": 7,
        "is_critical": False,
        "options": {"options": ["No testing", "Ad-hoc testing", "Regular chaos engineering", "Automated chaos testing", "Continuous resilience testing"]},
        "maturity_mapping": {"No testing": 0, "Ad-hoc testing": 1, "Regular chaos engineering": 3, "Automated chaos testing": 4, "Continuous resilience testing": 5}
    },
    {
        "dimension": Dimension.FAILURE_RESILIENCE,
        "question_type": QuestionType.SINGLE_SELECT,
        "question_text": "What is your incident response process?",
        "weight": 1.0,
        "order": 8,
        "is_critical": False,
        "options": {"options": ["No formal process", "Ad-hoc response", "Documented process", "Automated alerting and escalation", "Full incident management with post-mortems"]},
        "maturity_mapping": {"No formal process": 0, "Ad-hoc response": 1, "Documented process": 2, "Automated alerting and escalation": 4, "Full incident management with post-mortems": 5}
    }
]

def init_questions():
    """Initialize questions in the database"""
    # Create all tables first
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Check if questions already exist
        existing_count = db.query(Question).count()
        if existing_count > 0:
            print(f"Questions already exist ({existing_count} questions). Skipping initialization.")
            return
        
        # Create questions
        for q_data in QUESTIONS:
            question = Question(**q_data)
            db.add(question)
        
        db.commit()
        print(f"Successfully initialized {len(QUESTIONS)} questions.")
    except Exception as e:
        print(f"Error initializing questions: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    init_questions()

