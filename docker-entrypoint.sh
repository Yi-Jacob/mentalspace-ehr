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

# Check if setup script exists
if [ -f "/app/scripts/setup-db.js" ]; then
  echo "Setup script found, running database initialization..."
  node scripts/setup-db.js
  if [ $? -eq 0 ]; then
    touch /app/.db-initialized
    echo "Database initialization completed!"
  else
    echo "Database initialization failed!"
    exit 1
  fi
elif [ -f "/app/apps/backend/scripts/setup-db.js" ]; then
  echo "Setup script found in apps/backend/scripts, running database initialization..."
  node apps/backend/scripts/setup-db.js
  if [ $? -eq 0 ]; then
    touch /app/.db-initialized
    echo "Database initialization completed!"
  else
    echo "Database initialization failed!"
    exit 1
  fi
else
  echo "Setup script not found, skipping database initialization..."
  touch /app/.db-initialized
fi

# Start the application
echo "Starting application..."
exec node dist/main
