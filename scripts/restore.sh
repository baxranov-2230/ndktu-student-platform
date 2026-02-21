#!/bin/bash
#
# Database Restore Script
# Usage: ./scripts/restore.sh backups/backup_2026-02-18_13-00-00.sql.gz
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
DB_CONTAINER="database"
DB_NAME="basic_database"
DB_USER="bekzod"

# ─── Validate input ─────────────────────────────────────
if [ $# -eq 0 ]; then
    echo "Usage: $0 <backup_file.sql.gz>"
    echo ""
    echo "Available backups:"
    ls -lh "$PROJECT_DIR"/backups/backup_*.sql.gz 2>/dev/null | awk '{print "  " $NF " (" $5 ")"}'
    exit 1
fi

BACKUP_FILE="$1"
if [[ "$BACKUP_FILE" != /* ]]; then
    BACKUP_FILE="$PROJECT_DIR/$BACKUP_FILE"
fi

if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ File not found: $BACKUP_FILE"
    exit 1
fi

# ─── Confirm ────────────────────────────────────────────
echo "⚠️  This will REPLACE ALL DATA in '$DB_NAME' with:"
echo "   $BACKUP_FILE"
echo ""
read -p "Are you sure? (y/N): " confirm
if [[ "$confirm" != [yY] ]]; then
    echo "Cancelled."
    exit 0
fi

# ─── Check container ────────────────────────────────────
if ! docker ps --format '{{.Names}}' | grep -q "^${DB_CONTAINER}$"; then
    echo "❌ Container '$DB_CONTAINER' is not running!"
    exit 1
fi

# ─── Restore ────────────────────────────────────────────
echo "🔄 Dropping existing data..."
docker exec -i "$DB_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" -c \
    "DROP SCHEMA public CASCADE; CREATE SCHEMA public; GRANT ALL ON SCHEMA public TO $DB_USER;"

echo "📦 Restoring from backup..."
gunzip -c "$BACKUP_FILE" | docker exec -i "$DB_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" > /dev/null 2>&1

echo "✅ Restore complete!"
echo ""

# Show counts
echo "📊 Table counts:"
docker exec -i "$DB_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" -c \
    "SELECT schemaname, relname AS table, n_live_tup AS rows 
     FROM pg_stat_user_tables 
     ORDER BY relname;" 2>/dev/null


echo "🏷️  Stamping database with current migration head..."

# 1. Update the path to point to 'backend/app' where alembic.ini is located
BACKEND_DIR="$(dirname "$SCRIPT_DIR")/backend"
ALEMBIC_DIR="$BACKEND_DIR/app"

if [ -d "$ALEMBIC_DIR" ]; then
    echo "📂 Checking for .venv in backend..."
    if [ ! -d "$BACKEND_DIR/.venv" ]; then
        echo "⚠️ .venv not found. Running start.sh to create and sync..."
        (cd "$BACKEND_DIR" && bash start.sh)
    fi

    echo "📂 Changing directory to: $ALEMBIC_DIR"
    cd "$ALEMBIC_DIR"
    source "$BACKEND_DIR/.venv/bin/activate"
    
    # 2. OVERRIDE the database URL to use localhost just for this command
    #    (Keep your .env file as 'database:5432' for Docker)
    export APP_CONFIG__DATABASE__URL="postgresql+asyncpg://bekzod:admin123@localhost:5436/basic_database"

    # 3. Run stamp
    alembic stamp head
    
    echo "✅ Stamp complete!"
else
    echo "❌ Could not find alembic directory at $ALEMBIC_DIR"
    exit 1
fi