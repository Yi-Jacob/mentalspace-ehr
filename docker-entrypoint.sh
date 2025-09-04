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
touch /app/.db-initialized

# Start the application
echo "Starting application..."
exec node dist/main
