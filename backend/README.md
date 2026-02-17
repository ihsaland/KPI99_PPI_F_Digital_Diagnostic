# Backend - KPI99 PPI-F Digital Diagnostic Tool

FastAPI backend for the KPI99 PPI-F Digital Diagnostic Tool.

## Setup

1. Create virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Initialize database and questions:
```bash
python -m app.init_questions
```

4. Run the server:
```bash
python run.py
```

Or with uvicorn directly:
```bash
uvicorn app.main:app --reload
```

## Environment Variables

Create a `.env` file:
```env
DATABASE_URL=sqlite:///./kpi99_diagnostic.db
SECRET_KEY=your-secret-key-here
UPLOAD_DIR=./uploads
REPORT_DIR=./reports
```

## API Documentation

Once the server is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc




