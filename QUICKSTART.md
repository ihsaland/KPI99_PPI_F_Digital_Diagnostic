# Quick Start Guide

## Prerequisites

- Python 3.9 or higher
- Node.js 18 or higher
- npm or yarn

## Installation

### Option 1: Automated Setup (Recommended)

Run the setup script:

```bash
./setup.sh
```

### Option 2: Manual Setup

#### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m app.init_questions
```

#### Frontend

```bash
cd frontend
npm install
```

## Running the Application

### Start Backend

```bash
cd backend
source venv/bin/activate
python run.py
```

Backend will be available at: http://localhost:8001
API Documentation: http://localhost:8001/api/docs

### Start Frontend (in a new terminal)

```bash
cd frontend
npm run dev
```

Frontend will be available at: http://localhost:3000

## First Steps

1. **Open the application**: Navigate to http://localhost:3000
2. **Create an Organization**: Click "Create New Organization" and enter details
3. **Create an Assessment**: Click "New Assessment" for your organization
4. **Answer Questions**: Navigate through the 4 dimensions and answer questions
5. **Complete Assessment**: Click "Complete Assessment" when done
6. **View Results**: Review scores, findings, and recommendations
7. **Export Reports**: Download PDF, JSON, or CSV reports

## Troubleshooting

### Backend Issues

- **Database errors**: Make sure you've run `python -m app.init_questions` to initialize the database
- **Port already in use**: Change the port in `run.py` or kill the process using port 8000

### Frontend Issues

- **API connection errors**: Make sure the backend is running on port 8001
- **Build errors**: Delete `node_modules` and `.next` folder, then run `npm install` again

## Next Steps

- Review the full [README.md](README.md) for detailed documentation
- Check API documentation at http://localhost:8001/api/docs
- Customize questions in `backend/app/init_questions.py`
- Modify recommendations in `backend/app/services/recommendations.py`



