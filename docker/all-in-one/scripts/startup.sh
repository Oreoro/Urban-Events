#!/bin/sh

# This script prepares the Laravel application and then starts Supervisor.

# Exit immediately if a command exits with a non-zero status.
set -e

echo "Starting application startup process..."

cd /app/backend

# Check for the existence of the DATABASE_URL environment variable
# This check is crucial since you are using an external database.
if [ -z "$DATABASE_URL" ]; then
    echo "============================================"
    echo "ERROR: The DATABASE_URL environment variable is not set."
    echo "Cannot connect to a database."
    echo "============================================"
    exit 1
fi

echo "Running database migrations..."
# The --force flag is used for production environments.
# The `|| true` ensures the script doesn't exit if migrations have already been run.
php artisan migrate --force || true

echo "Clearing caches and linking storage..."
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan storage:link

echo "Starting Supervisor to run Nginx, PHP-FPM, and the queue worker..."
# This command runs Supervisor in the foreground.
# 'exec' replaces the current shell with the supervisord process,
# ensuring the script doesn't exit until Supervisor does.
exec /usr/bin/supervisord -c /etc/supervisord.conf
