#!/bin/bash

# Find available Python command
if command -v python3 &>/dev/null; then
    PYTHON_CMD="python3"
elif command -v python &>/dev/null; then
    PYTHON_CMD="python"
else
    echo "❌ Python is not installed. Please install Python 3.10+."
    exit 1
fi

echo "🐍 Using $PYTHON_CMD to create the virtual environment..."

# Create the virtual environment
$PYTHON_CMD -m venv .venv

# Activate it (Note: the path is .venv/bin/activate)
source .venv/bin/activate

# Install uv and sync
pip install uv
uv sync