#!/bin/sh

echo "Starting backend service..."
echo "Backend will run on PORT=$PORT"
echo "Using DB: $MONGO_URI"

# You can add extra pre-start commands here, e.g.:
# npx prisma migrate deploy
# node scripts/init-db.js

exec "$@"
