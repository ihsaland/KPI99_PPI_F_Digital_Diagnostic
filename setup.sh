#!/bin/bash

echo "Setting up KPI99 PPI-F Digital Diagnostic Tool..."

# Backend setup
echo "Setting up backend..."
cd backend

if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

echo "Activating virtual environment..."
source venv/bin/activate

echo "Installing Python dependencies..."
pip install -r requirements.txt

echo "Initializing database and questions..."
python -m app.init_questions

cd ..

# Frontend setup
echo "Setting up frontend..."
cd frontend

if [ ! -d "node_modules" ]; then
    echo "Installing Node.js dependencies..."
    npm install
fi

cd ..

echo "Setup complete!"
echo ""
echo "To start the backend:"
echo "  cd backend"
echo "  source venv/bin/activate"
echo "  python run.py"
echo ""
echo "To start the frontend (in a new terminal):"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo "Backend will run on http://localhost:8000"
echo "Frontend will run on http://localhost:3000"




