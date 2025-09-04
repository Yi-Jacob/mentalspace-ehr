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

# Run database setup if needed
if [ ! -f /app/.db-initialized ]; then
  echo "Running database initialization..."
  node apps/backend/scripts/setup-db.js
  if [ $? -eq 0 ]; then
    touch /app/.db-initialized
    echo "Database initialization completed!"
  else
    echo "Database initialization failed!"
    exit 1
  fi
else
  echo "Database already initialized, skipping setup."
fi

# Start the application
echo "Starting application..."
exec node dist/main
