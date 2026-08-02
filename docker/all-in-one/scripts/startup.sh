#!/bin/sh

set -eu

cd /app/backend

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

exec /usr/bin/supervisord -c /etc/supervisord.conf
