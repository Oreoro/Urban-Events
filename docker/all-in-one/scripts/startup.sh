#!/bin/sh

# The environment variables 'DATABASE_URL' and 'REDIS_URL'
# are expected to be set in Azure App Service Configuration.

cd /app/backend

# Check for the existence of the DATABASE_URL environment variable
if [ -z "$DATABASE_URL" ]; then
    echo "============================================"
    echo "ERROR: The DATABASE_URL environment variable is not set."
    echo "Cannot connect to a database to run migrations."
    echo "============================================"
    exit 1
fi

echo "Running database migrations..."
if ! php artisan migrate --force; then
    echo "============================================"
    echo "ERROR: Migrations could not complete. Check the error above."
    echo "============================================"
    exit 1
fi

echo "Clearing caches and linking storage..."
# The following commands will use the Redis configuration provided via environment variables.
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan storage:link

echo "Setting file permissions..."
chown -R www-data:www-data /app/backend
chmod -R 775 /app/backend/storage /app/backend/bootstrap/cache

echo "Starting Supervisor to run Nginx and PHP-FPM..."
exec /usr/bin/supervisord -c /etc/supervisord.conf
