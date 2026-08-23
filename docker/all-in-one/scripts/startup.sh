#!/bin/sh

# DO NOT use set -eu — we need to see which command fails and not crash
# on non-critical steps (e.g. chown). Only migrations are fatal.

cd /app/backend

echo "=== Urban Events startup ==="
echo "PID $$ — $(date)"

# Cloudflare Containers gives the process roughly 20 seconds to accept a TCP
# connection. Database cold starts and first-run migrations can take longer, so
# open port 80 immediately and let the normal readiness route remain unavailable
# until the frontend starts under Supervisor.
mkdir -p /run/nginx
/usr/sbin/nginx
echo "nginx started (daemon mode)"

# Validate Neem settings (warn only, never crash)
case "${NEEM_ENABLED:-false}" in
    1|true|TRUE|yes|YES|on|ON)
        missing_neem_settings=""
        for setting_name in NEEM_BASE_URL NEEM_BASE_TOKEN NEEM_PARTNER_ID NEEM_DECRYPTION_KEY; do
            if [ -z "$(printenv "$setting_name" 2>/dev/null || true)" ]; then
                missing_neem_settings="$missing_neem_settings $setting_name"
            fi
        done
        if [ -n "$missing_neem_settings" ]; then
            echo "WARNING: Neem enabled but missing:$missing_neem_settings. Continuing."
        fi
        ;;
esac

# Validate Stripe settings (warn only, never crash)
case "${STRIPE_ENABLED:-false}" in
    1|true|TRUE|yes|YES|on|ON)
        missing_stripe_settings=""
        for setting_name in STRIPE_PUBLIC_KEY STRIPE_SECRET_KEY STRIPE_WEBHOOK_SECRET; do
            if [ -z "$(printenv "$setting_name" 2>/dev/null || true)" ]; then
                missing_stripe_settings="$missing_stripe_settings $setting_name"
            fi
        done
        if [ -n "$missing_stripe_settings" ]; then
            echo "WARNING: Stripe enabled but missing:$missing_stripe_settings. Continuing."
        fi
        ;;
esac

# Run migrations — this is the only fatal step
echo "Running migrations..."
if ! php artisan migrate --force 2>&1; then
    echo "============================================"
    echo "ERROR: Migrations could not complete."
    echo "Check DATABASE_URL and database connectivity."
    echo "============================================"
    exit 1
fi
echo "Migrations complete."

if [ ! -L /app/backend/public/storage ]; then
    php artisan storage:link 2>&1 || true
fi

# Clear any stale caches, then re-cache for production performance.
# This ensures env-var changes (APP_DEBUG, DATABASE_URL, etc.) take effect.
php artisan config:clear --no-interaction 2>&1 || true
php artisan route:clear --no-interaction 2>&1 || true
php artisan view:clear --no-interaction 2>&1 || true

# Cache config, routes, views, and events for maximum performance
php artisan config:cache --no-interaction 2>&1 || true
php artisan route:cache --no-interaction 2>&1 || true
php artisan view:cache --no-interaction 2>&1 || true
php artisan event:cache --no-interaction 2>&1 || true

chown -R www-data:www-data /app/backend/storage /app/backend/bootstrap/cache 2>&1 || true
chmod -R 775 /app/backend/storage /app/backend/bootstrap/cache 2>&1 || true

echo "Setup complete — starting supervisord"

# Supervisor owns the long-running Nginx process. Stop the temporary listener
# first so Supervisor can bind the same port without racing it.
/usr/sbin/nginx -s quit
nginx_shutdown_checks=0
while [ -f /run/nginx/nginx.pid ]; do
    nginx_shutdown_checks=$((nginx_shutdown_checks + 1))

    if [ "$nginx_shutdown_checks" -ge 50 ]; then
        echo "WARNING: Temporary Nginx listener did not stop cleanly, forcing."
        kill -9 $(cat /run/nginx/nginx.pid) 2>/dev/null || true
        rm -f /run/nginx/nginx.pid
        break
    fi

    sleep 0.1
done

exec /usr/bin/supervisord -c /etc/supervisord.conf
