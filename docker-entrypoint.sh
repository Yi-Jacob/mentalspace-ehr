#!/bin/sh

# Debug: Print environment variables
echo "Debug: Environment variables:"
echo "DATABASE_URL: $DATABASE_URL"
echo "NODE_ENV: $NODE_ENV"

# Copy backend .env file to app directory if it exists
if [ -f "/app/apps/backend/.env" ]; then
  echo "Copying backend .env file..."
  cp /app/apps/backend/.env /app/.env
fi

# Skip database setup for production (using AWS RDS)
echo "Using AWS RDS - skipping database initialization..."

# Check if dist/main.js exists, if not try apps/backend/dist/main.js
if [ -f "/app/dist/main.js" ]; then
  echo "Found main.js in /app/dist/main.js"
  MAIN_PATH="/app/dist/main.js"
elif [ -f "/app/dist/src/main.js" ]; then
  echo "Found main.js in /app/dist/src/main.js"
  MAIN_PATH="/app/dist/src/main.js"
elif [ -f "/app/apps/backend/dist/main.js" ]; then
  echo "Found main.js in /app/apps/backend/dist/main.js"
  MAIN_PATH="/app/apps/backend/dist/main.js"
elif [ -f "/app/apps/backend/dist/src/main.js" ]; then
  echo "Found main.js in /app/apps/backend/dist/src/main.js"
  MAIN_PATH="/app/apps/backend/dist/src/main.js"
else
  echo "ERROR: main.js not found in expected locations!"
  echo "Available files in /app:"
  ls -la /app/
  echo "Available files in /app/dist:"
  ls -la /app/dist/ 2>/dev/null || echo "dist directory not found"
  echo "Available files in /app/apps/backend/dist:"
  ls -la /app/apps/backend/dist/ 2>/dev/null || echo "apps/backend/dist directory not found"
  echo "Searching for main.js files recursively:"
  find /app -name "main.js" -type f 2>/dev/null || echo "No main.js files found"
  exit 1
fi

# Start the application
echo "Starting application with: $MAIN_PATH"
exec node "$MAIN_PATH"
