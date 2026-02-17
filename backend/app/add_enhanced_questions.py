"""
Add enhanced questions for more detailed scoring
This script adds additional questions to the existing question set
"""
from sqlalchemy.orm import Session
from app.database import SessionLocal, Base, engine
from app.models import Question, Dimension, QuestionType

# Additional questions for enhanced/detailed assessment
ENHANCED_QUESTIONS = [
    # PERFORMANCE DIMENSION - Additional Questions
    {
        "dimension": Dimension.PERFORMANCE,
        "question_type": QuestionType.NUMERIC,
        "question_text": "What is your average database query response time in milliseconds?",
        "weight": 1.0,
        "order": 8,
        "is_critical": False,
        "maturity_mapping": None
    },
    {
        "dimension": Dimension.PERFORMANCE,
        "question_type": QuestionType.SINGLE_SELECT,
        "question_text": "How do you optimize database queries?",
        "weight": 1.0,
        "order": 9,
        "is_critical": False,
        "options": {"options": ["No optimization", "Manual query review", "Index optimization", "Query analysis tools", "Automated query optimization with AI"]},
        "maturity_mapping": {"No optimization": 0, "Manual query review": 1, "Index optimization": 2, "Query analysis tools": 3, "Automated query optimization with AI": 5}
    },
    {
        "dimension": Dimension.PERFORMANCE,
        "question_type": QuestionType.SINGLE_SELECT,
        "question_text": "What is your database connection pool utilization?",
        "weight": 1.0,
        "order": 10,
        "is_critical": False,
        "options": {"options": ["No connection pooling", "< 50% utilization", "50-80% utilization", "80-95% utilization", "Optimized with dynamic scaling"]},
        "maturity_mapping": {"No connection pooling": 0, "< 50% utilization": 1, "50-80% utilization": 2, "80-95% utilization": 4, "Optimized with dynamic scaling": 5}
    },
    {
        "dimension": Dimension.PERFORMANCE,
        "question_type": QuestionType.MULTI_SELECT,
        "question_text": "What caching layers do you implement?",
        "weight": 1.0,
        "order": 11,
        "is_critical": False,
        "options": {"options": ["Application-level caching", "Database query caching", "CDN caching", "Distributed cache (Redis/Memcached)", "Edge caching", "Browser caching"]}
    },
    {
        "dimension": Dimension.PERFORMANCE,
        "question_type": QuestionType.SINGLE_SELECT,
        "question_text": "What is your cache hit ratio?",
        "weight": 1.0,
        "order": 12,
        "is_critical": False,
        "options": {"options": ["No caching", "< 50%", "50-70%", "70-90%", "> 90%"]},
        "maturity_mapping": {"No caching": 0, "< 50%": 1, "50-70%": 2, "70-90%": 4, "> 90%": 5}
    },
    {
        "dimension": Dimension.PERFORMANCE,
        "question_type": QuestionType.SINGLE_SELECT,
        "question_text": "How do you handle cache invalidation?",
        "weight": 1.0,
        "order": 13,
        "is_critical": False,
        "options": {"options": ["No cache invalidation", "Manual invalidation", "Time-based expiration", "Event-driven invalidation", "Intelligent invalidation with versioning"]},
        "maturity_mapping": {"No cache invalidation": 0, "Manual invalidation": 1, "Time-based expiration": 2, "Event-driven invalidation": 4, "Intelligent invalidation with versioning": 5}
    },
    {
        "dimension": Dimension.PERFORMANCE,
        "question_type": QuestionType.SINGLE_SELECT,
        "question_text": "What is your CPU utilization under normal load?",
        "weight": 1.0,
        "order": 14,
        "is_critical": False,
        "options": {"options": ["No monitoring", "> 90%", "70-90%", "50-70%", "40-60% (optimal)"]},
        "maturity_mapping": {"No monitoring": 0, "> 90%": 1, "70-90%": 2, "50-70%": 3, "40-60% (optimal)": 5}
    },
    {
        "dimension": Dimension.PERFORMANCE,
        "question_type": QuestionType.SINGLE_SELECT,
        "question_text": "What is your memory utilization under normal load?",
        "weight": 1.0,
        "order": 15,
        "is_critical": False,
        "options": {"options": ["No monitoring", "> 90%", "70-90%", "50-70%", "40-60% (optimal)"]},
        "maturity_mapping": {"No monitoring": 0, "> 90%": 1, "70-90%": 2, "50-70%": 3, "40-60% (optimal)": 5}
    },
    {
        "dimension": Dimension.PERFORMANCE,
        "question_type": QuestionType.SINGLE_SELECT,
        "question_text": "Do you track user-perceived performance (Real User Monitoring)?",
        "weight": 1.0,
        "order": 16,
        "is_critical": False,
        "options": {"options": ["No RUM", "Basic page load tracking", "Core Web Vitals tracking", "Comprehensive RUM with user journey", "RUM with AI-powered insights"]},
        "maturity_mapping": {"No RUM": 0, "Basic page load tracking": 1, "Core Web Vitals tracking": 3, "Comprehensive RUM with user journey": 4, "RUM with AI-powered insights": 5}
    },
    {
        "dimension": Dimension.PERFORMANCE,
        "question_type": QuestionType.SINGLE_SELECT,
        "question_text": "How do you measure and optimize frontend performance?",
        "weight": 1.0,
        "order": 17,
        "is_critical": False,
        "options": {"options": ["No frontend optimization", "Basic minification", "Code splitting and lazy loading", "Advanced bundling and optimization", "Automated performance budgets and optimization"]},
        "maturity_mapping": {"No frontend optimization": 0, "Basic minification": 1, "Code splitting and lazy loading": 3, "Advanced bundling and optimization": 4, "Automated performance budgets and optimization": 5}
    },
    
    # PRODUCTION READINESS DIMENSION - Additional Questions
    {
        "dimension": Dimension.PRODUCTION_READINESS,
        "question_type": QuestionType.SINGLE_SELECT,
        "question_text": "What security scanning do you perform in CI/CD?",
        "weight": 1.5,
        "order": 8,
        "is_critical": True,
        "options": {"options": ["No security scanning", "Manual security reviews", "SAST (Static Analysis)", "SAST + DAST", "SAST + DAST + Dependency scanning + Container scanning"]},
        "maturity_mapping": {"No security scanning": 0, "Manual security reviews": 1, "SAST (Static Analysis)": 2, "SAST + DAST": 3, "SAST + DAST + Dependency scanning + Container scanning": 5}
    },
    {
        "dimension": Dimension.PRODUCTION_READINESS,
        "question_type": QuestionType.SINGLE_SELECT,
        "question_text": "How do you manage secrets and credentials?",
        "weight": 1.5,
        "order": 9,
        "is_critical": True,
        "options": {"options": ["Hardcoded in code", "Environment variables", "Secret management service", "Centralized secrets with rotation", "Automated secret rotation with audit"]},
        "maturity_mapping": {"Hardcoded in code": 0, "Environment variables": 1, "Secret management service": 3, "Centralized secrets with rotation": 4, "Automated secret rotation with audit": 5}
    },
    {
        "dimension": Dimension.PRODUCTION_READINESS,
        "question_type": QuestionType.SINGLE_SELECT,
        "question_text": "Do you have compliance certifications?",
        "weight": 1.0,
        "order": 10,
        "is_critical": False,
        "options": {"options": ["No certifications", "SOC 2 Type I", "SOC 2 Type II", "ISO 27001", "Multiple certifications (SOC2, ISO, GDPR, etc.)"]},
        "maturity_mapping": {"No certifications": 0, "SOC 2 Type I": 2, "SOC 2 Type II": 3, "ISO 27001": 4, "Multiple certifications (SOC2, ISO, GDPR, etc.)": 5}
    },
    {
        "dimension": Dimension.PRODUCTION_READINESS,
        "question_type": QuestionType.SINGLE_SELECT,
        "question_text": "How comprehensive is your API documentation?",
        "weight": 1.0,
        "order": 11,
        "is_critical": False,
        "options": {"options": ["No documentation", "Basic comments", "Some API docs", "Comprehensive OpenAPI/Swagger docs", "Interactive API docs with examples"]},
        "maturity_mapping": {"No documentation": 0, "Basic comments": 1, "Some API docs": 2, "Comprehensive OpenAPI/Swagger docs": 4, "Interactive API docs with examples": 5}
    },
    {
        "dimension": Dimension.PRODUCTION_READINESS,
        "question_type": QuestionType.SINGLE_SELECT,
        "question_text": "Do you maintain architecture decision records (ADRs)?",
        "weight": 1.0,
        "order": 12,
        "is_critical": False,
        "options": {"options": ["No ADRs", "Informal documentation", "Some ADRs exist", "Most decisions documented", "All major decisions documented with review process"]},
        "maturity_mapping": {"No ADRs": 0, "Informal documentation": 1, "Some ADRs exist": 2, "Most decisions documented": 3, "All major decisions documented with review process": 5}
    },
    {
        "dimension": Dimension.PRODUCTION_READINESS,
        "question_type": QuestionType.SINGLE_SELECT,
        "question_text": "How do you handle distributed tracing?",
        "weight": 1.0,
        "order": 13,
        "is_critical": False,
        "options": {"options": ["No distributed tracing", "Basic logging", "Request ID tracking", "Full distributed tracing", "Distributed tracing with service mesh"]},
        "maturity_mapping": {"No distributed tracing": 0, "Basic logging": 1, "Request ID tracking": 2, "Full distributed tracing": 4, "Distributed tracing with service mesh": 5}
    },
    {
        "dimension": Dimension.PRODUCTION_READINESS,
        "question_type": QuestionType.SINGLE_SELECT,
        "question_text": "What is your log aggregation and analysis strategy?",
        "weight": 1.0,
        "order": 14,
        "is_critical": False,
        "options": {"options": ["No log aggregation", "Local log files", "Centralized logging", "Centralized logging with search", "Centralized logging with analytics and alerting"]},
        "maturity_mapping": {"No log aggregation": 0, "Local log files": 1, "Centralized logging": 2, "Centralized logging with search": 3, "Centralized logging with analytics and alerting": 5}
    },
    {
        "dimension": Dimension.PRODUCTION_READINESS,
        "question_type": QuestionType.SINGLE_SELECT,
        "question_text": "Do you have structured logging standards?",
        "weight": 1.0,
        "order": 15,
        "is_critical": False,
        "options": {"options": ["No standards", "Informal conventions", "Some services use structured logs", "Most services use structured logs", "All services use standardized structured logging"]},
        "maturity_mapping": {"No standards": 0, "Informal conventions": 1, "Some services use structured logs": 2, "Most services use structured logs": 3, "All services use standardized structured logging": 5}
    },
    {
        "dimension": Dimension.PRODUCTION_READINESS,
        "question_type": QuestionType.SINGLE_SELECT,
        "question_text": "How do you manage third-party dependencies?",
        "weight": 1.0,
        "order": 16,
        "is_critical": False,
        "options": {"options": ["No dependency management", "Manual updates", "Automated dependency updates", "Automated updates with testing", "Automated updates with security scanning and testing"]},
        "maturity_mapping": {"No dependency management": 0, "Manual updates": 1, "Automated dependency updates": 2, "Automated updates with testing": 3, "Automated updates with security scanning and testing": 5}
    },
    {
        "dimension": Dimension.PRODUCTION_READINESS,
        "question_type": QuestionType.SINGLE_SELECT,
        "question_text": "Do you have a vulnerability scanning process?",
        "weight": 1.5,
        "order": 17,
        "is_critical": True,
        "options": {"options": ["No scanning", "Ad-hoc scanning", "Regular manual scanning", "Automated scanning in CI/CD", "Continuous scanning with automated remediation"]},
        "maturity_mapping": {"No scanning": 0, "Ad-hoc scanning": 1, "Regular manual scanning": 2, "Automated scanning in CI/CD": 4, "Continuous scanning with automated remediation": 5}
    },
    
    # INFRASTRUCTURE EFFICIENCY DIMENSION - Additional Questions
    {
        "dimension": Dimension.INFRASTRUCTURE_EFFICIENCY,
        "question_type": QuestionType.SINGLE_SELECT,
        "question_text": "What is your container/pod resource efficiency?",
        "weight": 1.0,
        "order": 7,
        "is_critical": False,
        "options": {"options": ["No resource limits", "Fixed resource allocation", "Basic resource requests/limits", "Optimized resource allocation", "AI-optimized resource allocation"]},
        "maturity_mapping": {"No resource limits": 0, "Fixed resource allocation": 1, "Basic resource requests/limits": 2, "Optimized resource allocation": 4, "AI-optimized resource allocation": 5}
    },
    {
        "dimension": Dimension.INFRASTRUCTURE_EFFICIENCY,
        "question_type": QuestionType.SINGLE_SELECT,
        "question_text": "How do you handle idle resources?",
        "weight": 1.0,
        "order": 8,
        "is_critical": False,
        "options": {"options": ["No management", "Manual cleanup", "Scheduled cleanup", "Automated cleanup", "Intelligent resource lifecycle management"]},
        "maturity_mapping": {"No management": 0, "Manual cleanup": 1, "Scheduled cleanup": 2, "Automated cleanup": 4, "Intelligent resource lifecycle management": 5}
    },
    {
        "dimension": Dimension.INFRASTRUCTURE_EFFICIENCY,
        "question_type": QuestionType.SINGLE_SELECT,
        "question_text": "What is your storage utilization and optimization strategy?",
        "weight": 1.0,
        "order": 9,
        "is_critical": False,
        "options": {"options": ["No optimization", "Manual cleanup", "Basic lifecycle policies", "Automated lifecycle policies", "Intelligent storage tiering"]},
        "maturity_mapping": {"No optimization": 0, "Manual cleanup": 1, "Basic lifecycle policies": 2, "Automated lifecycle policies": 4, "Intelligent storage tiering": 5}
    },
    {
        "dimension": Dimension.INFRASTRUCTURE_EFFICIENCY,
        "question_type": QuestionType.SINGLE_SELECT,
        "question_text": "How much of your infrastructure is defined as code?",
        "weight": 1.5,
        "order": 10,
        "is_critical": False,
        "options": {"options": ["< 25%", "25-50%", "50-75%", "75-95%", "> 95% (fully automated)"]},
        "maturity_mapping": {"< 25%": 0, "25-50%": 1, "50-75%": 2, "75-95%": 3, "> 95% (fully automated)": 5}
    },
    {
        "dimension": Dimension.INFRASTRUCTURE_EFFICIENCY,
        "question_type": QuestionType.SINGLE_SELECT,
        "question_text": "Do you use infrastructure versioning and change tracking?",
        "weight": 1.0,
        "order": 11,
        "is_critical": False,
        "options": {"options": ["No versioning", "Manual tracking", "Basic version control", "Git-based IaC with PR reviews", "Git-based IaC with automated testing and compliance"]},
        "maturity_mapping": {"No versioning": 0, "Manual tracking": 1, "Basic version control": 2, "Git-based IaC with PR reviews": 4, "Git-based IaC with automated testing and compliance": 5}
    },
    {
        "dimension": Dimension.INFRASTRUCTURE_EFFICIENCY,
        "question_type": QuestionType.SINGLE_SELECT,
        "question_text": "How do you test infrastructure changes?",
        "weight": 1.0,
        "order": 12,
        "is_critical": False,
        "options": {"options": ["No testing", "Manual testing", "Basic validation", "Automated testing in CI/CD", "Comprehensive testing with compliance checks"]},
        "maturity_mapping": {"No testing": 0, "Manual testing": 1, "Basic validation": 2, "Automated testing in CI/CD": 4, "Comprehensive testing with compliance checks": 5}
    },
    {
        "dimension": Dimension.INFRASTRUCTURE_EFFICIENCY,
        "question_type": QuestionType.SINGLE_SELECT,
        "question_text": "How do you optimize network costs (data transfer)?",
        "weight": 1.0,
        "order": 13,
        "is_critical": False,
        "options": {"options": ["No optimization", "Basic awareness", "CDN usage", "Multi-region optimization", "Intelligent routing and edge computing"]},
        "maturity_mapping": {"No optimization": 0, "Basic awareness": 1, "CDN usage": 2, "Multi-region optimization": 3, "Intelligent routing and edge computing": 5}
    },
    {
        "dimension": Dimension.INFRASTRUCTURE_EFFICIENCY,
        "question_type": QuestionType.SINGLE_SELECT,
        "question_text": "What is your network latency between services?",
        "weight": 1.0,
        "order": 14,
        "is_critical": False,
        "options": {"options": ["No monitoring", "> 100ms", "50-100ms", "10-50ms", "< 10ms"]},
        "maturity_mapping": {"No monitoring": 0, "> 100ms": 1, "50-100ms": 2, "10-50ms": 3, "< 10ms": 5}
    },
    {
        "dimension": Dimension.INFRASTRUCTURE_EFFICIENCY,
        "question_type": QuestionType.SINGLE_SELECT,
        "question_text": "Do you use edge computing/CDN for content delivery?",
        "weight": 1.0,
        "order": 15,
        "is_critical": False,
        "options": {"options": ["No CDN", "Basic CDN for static assets", "CDN for all static content", "Edge computing for dynamic content", "Intelligent edge routing with optimization"]},
        "maturity_mapping": {"No CDN": 0, "Basic CDN for static assets": 1, "CDN for all static content": 3, "Edge computing for dynamic content": 4, "Intelligent edge routing with optimization": 5}
    },
    
    # FAILURE RESILIENCE DIMENSION - Additional Questions
    {
        "dimension": Dimension.FAILURE_RESILIENCE,
        "question_type": QuestionType.SINGLE_SELECT,
        "question_text": "What is your data replication strategy?",
        "weight": 1.5,
        "order": 9,
        "is_critical": True,
        "options": {"options": ["No replication", "Single replica", "Multi-AZ replication", "Multi-region replication", "Global replication with intelligent routing"]},
        "maturity_mapping": {"No replication": 0, "Single replica": 1, "Multi-AZ replication": 2, "Multi-region replication": 4, "Global replication with intelligent routing": 5}
    },
    {
        "dimension": Dimension.FAILURE_RESILIENCE,
        "question_type": QuestionType.SINGLE_SELECT,
        "question_text": "How do you handle data consistency across regions?",
        "weight": 1.0,
        "order": 10,
        "is_critical": False,
        "options": {"options": ["No multi-region", "Eventual consistency", "Strong consistency", "Configurable consistency", "Intelligent consistency with conflict resolution"]},
        "maturity_mapping": {"No multi-region": 0, "Eventual consistency": 1, "Strong consistency": 3, "Configurable consistency": 4, "Intelligent consistency with conflict resolution": 5}
    },
    {
        "dimension": Dimension.FAILURE_RESILIENCE,
        "question_type": QuestionType.SINGLE_SELECT,
        "question_text": "What is your data retention and archival strategy?",
        "weight": 1.0,
        "order": 11,
        "is_critical": False,
        "options": {"options": ["No retention policy", "Manual archival", "Basic lifecycle policies", "Automated archival", "Intelligent tiering with compliance"]},
        "maturity_mapping": {"No retention policy": 0, "Manual archival": 1, "Basic lifecycle policies": 2, "Automated archival": 4, "Intelligent tiering with compliance": 5}
    },
    {
        "dimension": Dimension.FAILURE_RESILIENCE,
        "question_type": QuestionType.SINGLE_SELECT,
        "question_text": "How do you handle external service dependencies?",
        "weight": 1.5,
        "order": 12,
        "is_critical": True,
        "options": {"options": ["No handling", "Basic error handling", "Retry logic", "Circuit breakers for external services", "Comprehensive resilience patterns"]},
        "maturity_mapping": {"No handling": 0, "Basic error handling": 1, "Retry logic": 2, "Circuit breakers for external services": 4, "Comprehensive resilience patterns": 5}
    },
    {
        "dimension": Dimension.FAILURE_RESILIENCE,
        "question_type": QuestionType.SINGLE_SELECT,
        "question_text": "What is your strategy for third-party service failures?",
        "weight": 1.0,
        "order": 13,
        "is_critical": False,
        "options": {"options": ["No strategy", "Manual fallback", "Basic fallback mechanisms", "Automated fallback with caching", "Intelligent fallback with multiple strategies"]},
        "maturity_mapping": {"No strategy": 0, "Manual fallback": 1, "Basic fallback mechanisms": 2, "Automated fallback with caching": 4, "Intelligent fallback with multiple strategies": 5}
    },
    {
        "dimension": Dimension.FAILURE_RESILIENCE,
        "question_type": QuestionType.SINGLE_SELECT,
        "question_text": "Do you implement retry and backoff strategies?",
        "weight": 1.0,
        "order": 14,
        "is_critical": False,
        "options": {"options": ["No retry logic", "Simple retries", "Exponential backoff", "Intelligent retry with jitter", "Adaptive retry with circuit breakers"]},
        "maturity_mapping": {"No retry logic": 0, "Simple retries": 1, "Exponential backoff": 2, "Intelligent retry with jitter": 4, "Adaptive retry with circuit breakers": 5}
    },
    {
        "dimension": Dimension.FAILURE_RESILIENCE,
        "question_type": QuestionType.SINGLE_SELECT,
        "question_text": "How quickly do you detect failures?",
        "weight": 1.5,
        "order": 15,
        "is_critical": True,
        "options": {"options": ["> 1 hour", "15-60 minutes", "5-15 minutes", "1-5 minutes", "< 1 minute"]},
        "maturity_mapping": {"> 1 hour": 0, "15-60 minutes": 1, "5-15 minutes": 2, "1-5 minutes": 4, "< 1 minute": 5}
    },
    {
        "dimension": Dimension.FAILURE_RESILIENCE,
        "question_type": QuestionType.SINGLE_SELECT,
        "question_text": "What is your alert fatigue management strategy?",
        "weight": 1.0,
        "order": 16,
        "is_critical": False,
        "options": {"options": ["No strategy", "Manual filtering", "Basic alert grouping", "Intelligent alerting with ML", "Automated alert correlation and prioritization"]},
        "maturity_mapping": {"No strategy": 0, "Manual filtering": 1, "Basic alert grouping": 2, "Intelligent alerting with ML": 4, "Automated alert correlation and prioritization": 5}
    },
    {
        "dimension": Dimension.FAILURE_RESILIENCE,
        "question_type": QuestionType.SINGLE_SELECT,
        "question_text": "How do you handle traffic spikes?",
        "weight": 1.5,
        "order": 17,
        "is_critical": True,
        "options": {"options": ["No handling", "Manual scaling", "Reactive auto-scaling", "Predictive scaling", "Intelligent scaling with load prediction"]},
        "maturity_mapping": {"No handling": 0, "Manual scaling": 1, "Reactive auto-scaling": 3, "Predictive scaling": 4, "Intelligent scaling with load prediction": 5}
    },
    {
        "dimension": Dimension.FAILURE_RESILIENCE,
        "question_type": QuestionType.SINGLE_SELECT,
        "question_text": "What is your rate limiting and throttling strategy?",
        "weight": 1.0,
        "order": 18,
        "is_critical": False,
        "options": {"options": ["No rate limiting", "Basic rate limiting", "Per-user rate limiting", "Intelligent rate limiting", "Adaptive rate limiting with ML"]},
        "maturity_mapping": {"No rate limiting": 0, "Basic rate limiting": 1, "Per-user rate limiting": 3, "Intelligent rate limiting": 4, "Adaptive rate limiting with ML": 5}
    },
    {
        "dimension": Dimension.FAILURE_RESILIENCE,
        "question_type": QuestionType.SINGLE_SELECT,
        "question_text": "Do you implement graceful degradation under load?",
        "weight": 1.5,
        "order": 19,
        "is_critical": True,
        "options": {"options": ["No degradation strategy", "Manual intervention", "Basic feature flags", "Automated feature degradation", "Intelligent degradation with user impact minimization"]},
        "maturity_mapping": {"No degradation strategy": 0, "Manual intervention": 1, "Basic feature flags": 2, "Automated feature degradation": 4, "Intelligent degradation with user impact minimization": 5}
    }
]

def add_enhanced_questions():
    """Add enhanced questions to the database"""
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Get existing questions to check for duplicates
        existing_questions = db.query(Question).all()
        existing_texts = {q.question_text for q in existing_questions}
        
        added_count = 0
        skipped_count = 0
        
        for q_data in ENHANCED_QUESTIONS:
            # Check if question already exists
            if q_data["question_text"] in existing_texts:
                print(f"Skipping duplicate question: {q_data['question_text'][:50]}...")
                skipped_count += 1
                continue
            
            # Check if question with same order and dimension exists
            existing = db.query(Question).filter(
                Question.dimension == q_data["dimension"],
                Question.order == q_data["order"]
            ).first()
            
            if existing:
                print(f"Question with order {q_data['order']} already exists for {q_data['dimension']}. Skipping.")
                skipped_count += 1
                continue
            
            question = Question(**q_data)
            db.add(question)
            added_count += 1
            existing_texts.add(q_data["question_text"])
        
        db.commit()
        print(f"\n✅ Successfully added {added_count} enhanced questions.")
        if skipped_count > 0:
            print(f"⚠️  Skipped {skipped_count} duplicate questions.")
        
        # Print summary by dimension
        total_by_dim = {}
        for dim in Dimension:
            count = db.query(Question).filter(Question.dimension == dim).count()
            total_by_dim[dim.value] = count
        
        print(f"\n📊 Total questions by dimension:")
        for dim, count in total_by_dim.items():
            print(f"   {dim}: {count} questions")
        
    except Exception as e:
        print(f"❌ Error adding enhanced questions: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    add_enhanced_questions()


