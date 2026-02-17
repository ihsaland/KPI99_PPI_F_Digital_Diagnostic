# KPI99 PPI-F Digital Diagnostic Tool

A comprehensive digital diagnostic tool for assessing organizational maturity across four key dimensions:
- **Performance**: Latency, throughput, bottlenecks
- **Production Readiness**: SLOs, deploy safety, runbooks
- **Infrastructure Efficiency**: Capacity, elasticity, cost control
- **Failure Resilience**: HA, DR, fault isolation

## Features

- **Structured Assessment**: 40-60 questions across 4 PPI-F dimensions
- **Automated Scoring**: Maturity scores (0-5) with weighted calculations
- **Intelligent Recommendations**: Rule-based recommendations with effort, impact, and KPI tracking
- **Comprehensive Reports**: 
  - Engineering report with heatmaps and findings
  - Executive summary with risk assessment
  - PDF, JSON, and CSV exports
- **30/60/90 Day Roadmaps**: Prioritized action plans

## Architecture

- **Backend**: FastAPI (Python) with SQLAlchemy ORM
- **Frontend**: Next.js 14 with TypeScript and Tailwind CSS
- **Database**: SQLite (default) or PostgreSQL
- **Report Generation**: ReportLab for PDF generation

## Quick Start

### Prerequisites

- Python 3.9+
- Node.js 18+
- (Optional) PostgreSQL for production

### Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Initialize database and questions
python -m app.init_questions

# Run the server
python run.py
```

The API will be available at `http://localhost:8001`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Project Structure

```
.
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI application
│   │   ├── database.py          # Database configuration
│   │   ├── models.py            # SQLAlchemy models
│   │   ├── schemas.py           # Pydantic schemas
│   │   ├── init_questions.py    # Question initialization
│   │   ├── routers/             # API routes
│   │   │   ├── organizations.py
│   │   │   ├── assessments.py
│   │   │   ├── questions.py
│   │   │   ├── reports.py
│   │   │   └── uploads.py
│   │   └── services/            # Business logic
│   │       ├── scoring.py       # Scoring engine
│   │       ├── recommendations.py
│   │       └── report_generator.py
│   ├── requirements.txt
│   └── run.py
├── frontend/
│   ├── app/                     # Next.js app directory
│   │   ├── page.tsx            # Home page
│   │   ├── organizations/      # Organization pages
│   │   ├── assessments/         # Assessment pages
│   │   └── layout.tsx
│   ├── lib/
│   │   └── api.ts              # API client
│   └── package.json
└── README.md
```

## API Endpoints

### Organizations
- `GET /api/organizations` - List organizations
- `POST /api/organizations` - Create organization
- `GET /api/organizations/{id}` - Get organization

### Assessments
- `GET /api/assessments` - List assessments
- `POST /api/assessments` - Create assessment
- `GET /api/assessments/{id}` - Get assessment
- `POST /api/assessments/{id}/answers` - Submit answer
- `POST /api/assessments/{id}/complete` - Complete assessment
- `GET /api/assessments/{id}/summary` - Get assessment summary

### Questions
- `GET /api/questions` - List questions
- `GET /api/questions/{id}` - Get question

### Reports
- `GET /api/reports/{id}/pdf` - Generate PDF report
- `GET /api/reports/{id}/json` - Generate JSON export
- `GET /api/reports/{id}/csv` - Generate CSV backlog

## Usage Flow

1. **Create Organization**: Start by creating an organization
2. **Create Assessment**: Create a new assessment for the organization
3. **Answer Questions**: Go through questions organized by dimension
4. **Complete Assessment**: Submit answers and generate scores
5. **View Results**: Review scores, findings, and recommendations
6. **Export Reports**: Download PDF, JSON, or CSV reports

## Configuration

Create a `.env` file in the `backend` directory:

```env
DATABASE_URL=sqlite:///./kpi99_diagnostic.db
SECRET_KEY=your-secret-key-here
UPLOAD_DIR=./uploads
REPORT_DIR=./reports
```

For PostgreSQL:
```env
DATABASE_URL=postgresql://user:password@localhost/kpi99_diagnostic
```

## Development

### Backend Development

```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload
```

### Frontend Development

```bash
cd frontend
npm run dev
```

## Production Deployment

1. Set up PostgreSQL database
2. Update `DATABASE_URL` in `.env`
3. Run migrations: `alembic upgrade head`
4. Build frontend: `npm run build`
5. Deploy with a production server (e.g., Gunicorn for backend, Vercel/Netlify for frontend)

## License

This project is proprietary software.



