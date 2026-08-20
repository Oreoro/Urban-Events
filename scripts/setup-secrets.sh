#!/bin/bash
# =============================================================================
# Urban Events — Cloudflare Secrets Setup Script
# =============================================================================
#
# This script helps you set up all required GitHub repository secrets for
# the Cloudflare Container deployment.
#
# USAGE:
#   1. Copy this file and edit the values below
#   2. Run: ./scripts/setup-secrets.sh
#
# Or use it interactively:
#   ./scripts/setup-secrets.sh --interactive
#
# =============================================================================

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Repository info
REPO="Muxoai/Urban-Events"
BRANCH="development"

# =============================================================================
# REQUIRED SECRETS — Fill in your actual values below
# =============================================================================

# --- Core Application Secrets ---
# APP_KEY: Laravel encryption key (base64 encoded 32-byte random string)
# Generate with: php artisan key:generate --show
APP_KEY="${APP_KEY:-base64:REPLACE_ME_WITH_ACTUAL_KEY}"

# JWT_SECRET: Secret for JWT token signing
# Generate with: openssl rand -base64 64
JWT_SECRET="${JWT_SECRET:-REPLACE_ME_WITH_JWT_SECRET}"

# --- Database ---
# DATABASE_URL: PostgreSQL connection string
# Format: postgresql://username:password@host:port/database?sslmode=require
DATABASE_URL="${DATABASE_URL:-REPLACE_ME}"

# --- Stripe (Optional — leave all empty to disable) ---
STRIPE_PUBLIC_KEY="${STRIPE_PUBLIC_KEY:-}"
STRIPE_SECRET_KEY="${STRIPE_SECRET_KEY:-}"
STRIPE_WEBHOOK_SECRET="${STRIPE_WEBHOOK_SECRET:-}"

# --- R2 Storage ---
# These come from Cloudflare Dashboard > R2 > Manage R2 API Tokens
R2_ACCESS_KEY_ID="${R2_ACCESS_KEY_ID:-}"
R2_SECRET_ACCESS_KEY="${R2_SECRET_ACCESS_KEY:-}"

# --- Cloudflare API Token ---
# This is used by the GitHub Action to deploy
CLOUDFLARE_API_TOKEN="${CLOUDFLARE_API_TOKEN:-}"

# --- Azure App Secrets (env file format) ---
# This is a multi-line env file string containing your app secrets
# Used by the CI pipeline to build APP_SECRETS_JSON
AZURE_APP_SECRETS="${AZURE_APP_SECRETS:-}"

# --- Cloudflare App Overrides (env file format) ---
# Override any values from AZURE_APP_SECRETS for Cloudflare deployment
CLOUDFLARE_APP_OVERRIDES="${CLOUDFLARE_APP_OVERRIDES:-}"

# --- Neem Payments (optional — disabled by default) ---
NEEM_APP_SECRETS="${NEEM_APP_SECRETS:-}"

# =============================================================================
# FUNCTION: Show usage
# =============================================================================
show_usage() {
    echo -e "${BLUE}Urban Events — Cloudflare Secrets Setup${NC}"
    echo ""
    echo "Usage:"
    echo "  $0                    # Show this help"
    echo "  $0 --check            # Check which secrets are set"
    echo "  $0 --set <name> <val> # Set a single secret"
    echo "  $0 --set-all          # Set all secrets interactively"
    echo "  $0 --generate-app-key # Generate a new Laravel APP_KEY"
    echo "  $0 --generate-jwt     # Generate a new JWT_SECRET"
    echo "  $0 --validate         # Validate all secrets are properly set"
    echo ""
}

# =============================================================================
# FUNCTION: Generate APP_KEY
# =============================================================================
generate_app_key() {
    # Generate 32 random bytes and base64 encode
    local key
    key=$(openssl rand -base64 32)
    echo "base64:${key}"
}

# =============================================================================
# FUNCTION: Generate JWT_SECRET
# =============================================================================
generate_jwt_secret() {
    openssl rand -base64 64
}

# =============================================================================
# FUNCTION: Check existing secrets
# =============================================================================
check_secrets() {
    echo -e "${BLUE}Checking GitHub repository secrets for ${REPO}...${NC}"
    echo ""

    local secrets=(
        "CLOUDFLARE_API_TOKEN"
        "AZURE_APP_SECRETS"
        "CLOUDFLARE_APP_OVERRIDES"
        "NEEM_APP_SECRETS"
        "STRIPE_APP_SECRETS"
        "R2_ACCESS_KEY_ID"
        "R2_SECRET_ACCESS_KEY"
    )

    for secret in "${secrets[@]}"; do
        if gh secret list --repo "$REPO" 2>/dev/null | grep -q "$secret"; then
            echo -e "  ${GREEN}✓${NC} $secret"
        else
            echo -e "  ${RED}✗${NC} $secret (not set)"
        fi
    done

    echo ""
    echo -e "${YELLOW}Note: AZURE_APP_SECRETS should contain:${NC}"
    echo "  APP_KEY, JWT_SECRET, DATABASE_URL, and other app secrets"
    echo "  in KEY=VALUE format (one per line)"
    echo ""
}

# =============================================================================
# FUNCTION: Set a single secret
# =============================================================================
set_secret() {
    local name="$1"
    local value="$2"

    if [ -z "$name" ] || [ -z "$value" ]; then
        echo -e "${RED}Error: Secret name and value are required${NC}"
        return 1
    fi

    echo "$value" | gh secret set "$name" --repo "$REPO"
    echo -e "${GREEN}✓ Set $name${NC}"
}

# =============================================================================
# FUNCTION: Build AZURE_APP_SECRETS from components
# =============================================================================
build_azure_app_secrets() {
    local app_key="$1"
    local jwt_secret="$2"
    local database_url="$3"
    local stripe_public="${4:-}"
    local stripe_secret="${5:-}"
    local stripe_webhook="${6:-}"

    local secrets=""
    secrets+="APP_KEY=${app_key}"$'\n'
    secrets+="JWT_SECRET=${jwt_secret}"$'\n'
    secrets+="DATABASE_URL=${database_url}"$'\n'
    secrets+="JWT_ALGO=HS256"$'\n'
    secrets+="APP_NAME=Urban Events"$'\n'
    secrets+="APP_ENV=production"$'\n'
    secrets+="APP_DEBUG=false"$'\n'
    secrets+="APP_SAAS_MODE_ENABLED=false"$'\n'
    secrets+="LOG_CHANNEL=stderr"$'\n'
    secrets+="CACHE_DRIVER=file"$'\n'
    secrets+="CACHE_STORE=file"$'\n'
    secrets+="QUEUE_CONNECTION=sync"$'\n'
    secrets+="SESSION_DRIVER=cookie"$'\n'
    secrets+="SESSION_SECURE_COOKIE=true"$'\n'

    if [ -n "$stripe_public" ] && [ -n "$stripe_secret" ] && [ -n "$stripe_webhook" ]; then
        secrets+="STRIPE_PUBLIC_KEY=${stripe_public}"$'\n'
        secrets+="STRIPE_SECRET_KEY=${stripe_secret}"$'\n'
        secrets+="STRIPE_WEBHOOK_SECRET=${stripe_webhook}"$'\n'
    fi

    echo "$secrets"
}

# =============================================================================
# FUNCTION: Set all secrets interactively
# =============================================================================
set_all_interactive() {
    echo -e "${BLUE}=== Urban Events — Cloudflare Secrets Setup ===${NC}"
    echo ""
    echo "This will set up all required GitHub repository secrets."
    echo ""

    # Check if gh is authenticated
    if ! gh auth status &>/dev/null; then
        echo -e "${RED}Error: GitHub CLI not authenticated. Run 'gh auth login' first.${NC}"
        exit 1
    fi

    # --- APP_KEY ---
    echo -e "${YELLOW}1. Laravel APP_KEY${NC}"
    echo "   This is used for encryption. If you don't have one, I'll generate it."
    read -p "   Enter APP_KEY (or press Enter to generate): " app_key
    if [ -z "$app_key" ]; then
        app_key=$(generate_app_key)
        echo -e "   Generated: ${app_key}"
    fi
    echo ""

    # --- JWT_SECRET ---
    echo -e "${YELLOW}2. JWT_SECRET${NC}"
    read -p "   Enter JWT_SECRET (or press Enter to generate): " jwt_secret
    if [ -z "$jwt_secret" ]; then
        jwt_secret=$(generate_jwt_secret)
        echo -e "   Generated: ${jwt_secret:0:20}..."
    fi
    echo ""

    # --- DATABASE_URL ---
    echo -e "${YELLOW}3. DATABASE_URL${NC}"
    echo "   Format: postgresql://username:password@host:port/database?sslmode=require"
    read -p "   Enter DATABASE_URL: " database_url
    if [ -z "$database_url" ]; then
        echo -e "${RED}Error: DATABASE_URL is required${NC}"
        exit 1
    fi
    echo ""

    # --- Stripe (Optional) ---
    echo -e "${YELLOW}4. Stripe Keys (optional — press Enter to skip)${NC}"
    read -p "   Enter STRIPE_PUBLIC_KEY: " stripe_public
    if [ -n "$stripe_public" ]; then
        read -p "   Enter STRIPE_SECRET_KEY: " stripe_secret
        read -p "   Enter STRIPE_WEBHOOK_SECRET: " stripe_webhook

        if [ -z "$stripe_secret" ] || [ -z "$stripe_webhook" ]; then
            echo -e "${YELLOW}   Warning: Incomplete Stripe keys. Stripe will be disabled.${NC}"
            stripe_public=""
            stripe_secret=""
            stripe_webhook=""
        fi
    else
        stripe_secret=""
        stripe_webhook=""
    fi
    echo ""

    # --- R2 Storage ---
    echo -e "${YELLOW}5. R2 Storage Credentials${NC}"
    echo "   Get these from: Cloudflare Dashboard > R2 > Manage R2 API Tokens"
    read -p "   Enter R2_ACCESS_KEY_ID: " r2_access_key
    read -p "   Enter R2_SECRET_ACCESS_KEY: " r2_secret_key
    echo ""

    # --- Cloudflare API Token ---
    echo -e "${YELLOW}6. Cloudflare API Token${NC}"
    echo "   Get this from: Cloudflare Dashboard > My Profile > API Tokens"
    echo "   Required permissions: Workers, Containers, R2, D1, Durable Objects"
    read -p "   Enter CLOUDFLARE_API_TOKEN: " cf_token
    echo ""

    # --- Build AZURE_APP_SECRETS ---
    azure_secrets=$(build_azure_app_secrets "$app_key" "$jwt_secret" "$database_url" "$stripe_public" "$stripe_secret" "$stripe_webhook")

    # --- Build CLOUDFLARE_APP_OVERRIDES ---
    cloudflare_overrides="APP_ORIGIN=https://app.urbanevents.pk"$'\n'
    cloudflare_overrides+="APP_FRONTEND_URL=https://app.urbanevents.pk"$'\n'
    cloudflare_overrides+="APP_URL=https://app.urbanevents.pk/api"$'\n'
    cloudflare_overrides+="VITE_API_URL_CLIENT=https://app.urbanevents.pk/api"$'\n'
    cloudflare_overrides+="VITE_API_URL_SERVER=http://localhost:80/api"$'\n'
    cloudflare_overrides+="VITE_FRONTEND_URL=https://app.urbanevents.pk"$'\n'

    # --- Build STRIPE_APP_SECRETS ---
    stripe_secrets=""
    if [ -n "$stripe_public" ]; then
        stripe_secrets="STRIPE_PUBLIC_KEY=${stripe_public}"$'\n'
        stripe_secrets+="STRIPE_SECRET_KEY=${stripe_secret}"$'\n'
        stripe_secrets+="STRIPE_WEBHOOK_SECRET=${stripe_webhook}"$'\n'
    fi

    # --- Summary ---
    echo -e "${BLUE}=== Summary ===${NC}"
    echo ""
    echo "Secrets to set:"
    echo "  - AZURE_APP_SECRETS (env format with APP_KEY, JWT_SECRET, DATABASE_URL, etc.)"
    echo "  - CLOUDFLARE_APP_OVERRIDES (env format with Cloudflare-specific values)"
    if [ -n "$stripe_secrets" ]; then
        echo "  - STRIPE_APP_SECRETS (env format with Stripe keys)"
    fi
    echo "  - R2_ACCESS_KEY_ID"
    echo "  - R2_SECRET_ACCESS_KEY"
    echo "  - CLOUDFLARE_API_TOKEN"
    echo ""

    read -p "Proceed with setting these secrets? (y/N): " confirm
    if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
        echo "Aborted."
        exit 0
    fi

    echo ""
    echo "Setting secrets..."

    # Set secrets
    echo "$azure_secrets" | gh secret set "AZURE_APP_SECRETS" --repo "$REPO"
    echo -e "${GREEN}✓ Set AZURE_APP_SECRETS${NC}"

    echo "$cloudflare_overrides" | gh secret set "CLOUDFLARE_APP_OVERRIDES" --repo "$REPO"
    echo -e "${GREEN}✓ Set CLOUDFLARE_APP_OVERRIDES${NC}"

    if [ -n "$stripe_secrets" ]; then
        echo "$stripe_secrets" | gh secret set "STRIPE_APP_SECRETS" --repo "$REPO"
        echo -e "${GREEN}✓ Set STRIPE_APP_SECRETS${NC}"
    fi

    if [ -n "$r2_access_key" ]; then
        echo "$r2_access_key" | gh secret set "R2_ACCESS_KEY_ID" --repo "$REPO"
        echo -e "${GREEN}✓ Set R2_ACCESS_KEY_ID${NC}"
    fi

    if [ -n "$r2_secret_key" ]; then
        echo "$r2_secret_key" | gh secret set "R2_SECRET_ACCESS_KEY" --repo "$REPO"
        echo -e "${GREEN}✓ Set R2_SECRET_ACCESS_KEY${NC}"
    fi

    if [ -n "$cf_token" ]; then
        echo "$cf_token" | gh secret set "CLOUDFLARE_API_TOKEN" --repo "$REPO"
        echo -e "${GREEN}✓ Set CLOUDFLARE_API_TOKEN${NC}"
    fi

    echo ""
    echo -e "${GREEN}All secrets set successfully!${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Commit and push your changes to trigger the build"
    echo "  2. Manually trigger the 'Cloudflare Container' workflow with deploy=true"
    echo ""
}

# =============================================================================
# FUNCTION: Validate secrets
# =============================================================================
validate_secrets() {
    echo -e "${BLUE}Validating secrets for ${REPO}...${NC}"
    echo ""

    local errors=0

    # Check required secrets
    for secret in CLOUDFLARE_API_TOKEN AZURE_APP_SECRETS; do
        if gh secret list --repo "$REPO" 2>/dev/null | grep -q "$secret"; then
            echo -e "  ${GREEN}✓${NC} $secret"
        else
            echo -e "  ${RED}✗${NC} $secret (MISSING)"
            errors=$((errors + 1))
        fi
    done

    # Check optional secrets
    for secret in CLOUDFLARE_APP_OVERRIDES R2_ACCESS_KEY_ID R2_SECRET_ACCESS_KEY STRIPE_APP_SECRETS; do
        if gh secret list --repo "$REPO" 2>/dev/null | grep -q "$secret"; then
            echo -e "  ${GREEN}✓${NC} $secret"
        else
            echo -e "  ${YELLOW}○${NC} $secret (not set — optional)"
        fi
    done

    echo ""
    if [ $errors -gt 0 ]; then
        echo -e "${RED}Error: $errors required secrets are missing${NC}"
        echo "Run: $0 --set-all"
        exit 1
    else
        echo -e "${GREEN}All required secrets are set!${NC}"
    fi
}

# =============================================================================
# MAIN
# =============================================================================

case "${1:-}" in
    --check)
        check_secrets
        ;;
    --set)
        set_secret "${2:-}" "${3:-}"
        ;;
    --set-all)
        set_all_interactive
        ;;
    --generate-app-key)
        echo "Generated APP_KEY:"
        generate_app_key
        ;;
    --generate-jwt)
        echo "Generated JWT_SECRET:"
        generate_jwt_secret
        ;;
    --validate)
        validate_secrets
        ;;
    --help|-h)
        show_usage
        ;;
    *)
        show_usage
        ;;
esac
