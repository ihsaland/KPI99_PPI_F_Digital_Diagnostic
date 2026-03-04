FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create necessary directories
RUN mkdir -p uploads reports data

# PORT is set by Railway/Render at runtime
EXPOSE 8000

# Use start.py so PORT env var is read correctly (avoids "$PORT" literal error)
CMD ["python", "start.py"]




