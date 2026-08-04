#!/bin/sh

set -eu

cd /app/backend

# Cloudflare Containers gives the process roughly 20 seconds to accept a TCP
# connection. Database cold starts and first-run migrations can take longer, so
# open port 80 immediately and let the normal readiness route remain unavailable
# until the frontend starts under Supervisor.
mkdir -p /run/nginx
/usr/sbin/nginx

case "${NEEM_ENABLED:-false}" in
    1|true|TRUE|yes|YES|on|ON)
        missing_neem_settings=""

        for setting_name in NEEM_BASE_URL NEEM_BASE_TOKEN NEEM_PARTNER_ID NEEM_DECRYPTION_KEY; do
            if [ -z "$(printenv "$setting_name" 2>/dev/null || true)" ]; then
                missing_neem_settings="$missing_neem_settings $setting_name"
            fi
        done

        if [ -n "$missing_neem_settings" ]; then
            echo "ERROR: Neem is enabled, but required settings are missing:$missing_neem_settings"
            exit 1
        fi
        ;;
esac

case "${STRIPE_ENABLED:-false}" in
    1|true|TRUE|yes|YES|on|ON)
        missing_stripe_settings=""

        for setting_name in STRIPE_PUBLIC_KEY STRIPE_SECRET_KEY STRIPE_WEBHOOK_SECRET; do
            if [ -z "$(printenv "$setting_name" 2>/dev/null || true)" ]; then
                missing_stripe_settings="$missing_stripe_settings $setting_name"
            fi
        done

        if [ -n "$missing_stripe_settings" ]; then
            echo "ERROR: Stripe is enabled, but required settings are missing:$missing_stripe_settings"
            exit 1
        fi
        ;;
esac

if ! php artisan migrate --force; then
    echo "============================================"
    echo "ERROR: Migrations could not complete. Check the error above."
    echo "Ensure DATABASE_URL is set."
    echo "Aborting startup to avoid running a half-migrated application."
    echo "============================================"
    exit 1
fi

if [ ! -L /app/backend/public/storage ]; then
    php artisan storage:link || true
fi

if [ "${APP_ENV:-production}" = "local" ]; then
    php artisan optimize:clear --no-interaction
else
    php artisan optimize --no-interaction
fi

chown -R www-data:www-data /app/backend/storage /app/backend/bootstrap/cache
chmod -R 775 /app/backend/storage /app/backend/bootstrap/cache

# Supervisor owns the long-running Nginx process. Stop the temporary listener
# first so Supervisor can bind the same port without racing it.
/usr/sbin/nginx -s quit
nginx_shutdown_checks=0
while [ -f /run/nginx/nginx.pid ]; do
    nginx_shutdown_checks=$((nginx_shutdown_checks + 1))

    if [ "$nginx_shutdown_checks" -ge 50 ]; then
        echo "ERROR: Temporary Nginx listener did not stop cleanly."
        exit 1
    fi

    sleep 0.1
done

exec /usr/bin/supervisord -c /etc/supervisord.conf
