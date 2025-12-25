#!/bin/sh
set -e

echo "⏳ Waiting for database..."
until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER"; do
  sleep 2
done

echo "📦 Running migrations..."
for file in migrations/0*.sql; do
  echo "Running $file"
  psql "postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME" -f "$file"
done

echo "🌱 Running seeds..."
psql "postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME" \
  -f migrations/100_seed_data.sql

echo "🚀 Starting backend..."
exec node src/server.js
