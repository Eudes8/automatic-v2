#!/usr/bin/env bash
set -euo pipefail

# Script to start Postgres via docker-compose, wait for it, then run prisma migrate and seed.
# Usage: ./scripts/dev-db-setup.sh

ROOT_DIR=$(cd "$(dirname "$0")/.." && pwd)
cd "$ROOT_DIR"

echo "Starting Postgres via docker-compose..."
docker compose up -d postgres

# wait for Postgres
echo -n "Waiting for Postgres to accept connections"
for i in {1..60}; do
  if pg_isready -h 127.0.0.1 -p 5432 >/dev/null 2>&1; then
    echo " OK"
    break
  fi
  echo -n "."
  sleep 1
done

# Export DATABASE_URL for prisma commands
export DATABASE_URL="postgresql://automatic:automatic@127.0.0.1:5432/automatic_dev?schema=public"

echo "Generating Prisma client..."
npx prisma generate

echo "Applying migrations..."
npx prisma migrate deploy || npx prisma migrate dev --name init --skip-seed

echo "Running seed script..."
npx prisma db seed

echo "Done. Postgres is ready and Prisma migrations + seed applied."

# Show how to stop the DB
echo "To stop the DB: docker compose down"
