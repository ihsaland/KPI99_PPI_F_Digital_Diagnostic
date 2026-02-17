"""
KPI99 PPI-F Digital Diagnostic Tool - FastAPI Backend
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.database import engine, Base
from app.routers import assessments, questions, organizations, reports, uploads, recommendations, analytics, bulk_operations, webhooks, notifications, roi

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="KPI99 PPI-F Digital Diagnostic Tool API",
    description="Digital diagnostic tool for Performance, Production Readiness, Infrastructure Efficiency, and Failure Resilience. Complete API documentation with webhook support and integrations.",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

# CORS middleware - allow main domain and subdomain
allowed_origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://kpi99.co",
    "https://www.kpi99.co",
    "https://diagnostic.kpi99.co",  # Subdomain for diagnostic tool
]

# Add environment variable for additional origins
env_origins = os.getenv("CORS_ORIGINS", "").split(",")
allowed_origins.extend([origin.strip() for origin in env_origins if origin.strip()])

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(organizations.router, prefix="/api/organizations", tags=["organizations"])
app.include_router(assessments.router, prefix="/api/assessments", tags=["assessments"])
app.include_router(questions.router, prefix="/api/questions", tags=["questions"])
app.include_router(reports.router, prefix="/api/reports", tags=["reports"])
app.include_router(uploads.router, prefix="/api/uploads", tags=["uploads"])
app.include_router(recommendations.router, prefix="/api/recommendations", tags=["recommendations"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["analytics"])
app.include_router(bulk_operations.router, prefix="/api/bulk", tags=["bulk-operations"])
app.include_router(webhooks.router, prefix="/api/webhooks", tags=["webhooks"])
app.include_router(notifications.router, prefix="/api/notifications", tags=["notifications"])
app.include_router(roi.router, prefix="/api/roi", tags=["roi"])

# Create directories for uploads and reports
os.makedirs("uploads", exist_ok=True)
os.makedirs("reports", exist_ok=True)

# Mount static files
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
app.mount("/reports", StaticFiles(directory="reports"), name="reports")

@app.get("/")
async def root():
    return {
        "message": "KPI99 PPI-F Digital Diagnostic Tool API",
        "version": "1.0.0"
    }

@app.get("/api/health")
async def health():
    return {"status": "healthy"}

