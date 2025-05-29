#!/bin/bash

# Activate virtual environment if needed (optional, uncomment if using venv)
# source venv/bin/activate

# Start the FastAPI app from the backend directory
uvicorn app.main:app --host 0.0.0.0 --port 8000