#!/usr/bin/env bash
set -e

# ForbrugerAgenten restart script
# This script safely restarts the development server

# Safety check: prevent running on production/staging
if [[ "$HOST" =~ (production|staging) ]] || [[ "$PORT" =~ ^(80|443|8080|8443)$ ]]; then
  echo "❌ ERROR: Refusing to start server on production/staging environment"
  echo "   HOST=$HOST, PORT=$PORT"
  exit 1
fi

# Default to port 3000 if not set
export PORT="${PORT:-3000}"

echo "🔄 Restarting ForbrugerAgenten development server..."
echo "   Target: localhost:$PORT"

# Kill any existing Next.js dev server on this port
echo "🛑 Stopping any existing servers on port $PORT..."
lsof -ti:$PORT | xargs kill -9 2>/dev/null || true

# Navigate to the web directory (public-facing website)
cd "$(dirname "$0")/web"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
fi

# Start the dev server
echo "🚀 Starting Next.js development server on port $PORT..."
npm run dev -- -p $PORT

