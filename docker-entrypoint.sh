#!/bin/sh

# Wait for database to be ready
echo "Waiting for database to be ready..."
while ! nc -z $DB_HOST $DB_PORT; do
  sleep 1
done
echo "Database is ready!"

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
