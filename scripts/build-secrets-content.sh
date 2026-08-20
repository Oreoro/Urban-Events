#!/bin/bash
# =============================================================================
# Urban Events — Quick Secrets Content Builder
# =============================================================================
#
# This script generates the exact content needed for each GitHub secret.
# Copy the output and paste it into the respective GitHub secret.
#
# USAGE: ./scripts/build-secrets-content.sh
#
# =============================================================================

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=== Urban Events — Secrets Content Builder ===${NC}"
echo ""
echo "This generates the content you need to paste into GitHub repository secrets."
echo ""

# Check if gh is available
if ! command -v gh &>/dev/null; then
    echo -e "${RED}Error: GitHub CLI (gh) not found. Install it first.${NC}"
    exit 1
fi

# Check if gh is authenticated
if ! gh auth status &>/dev/null; then
    echo -e "${RED}Error: GitHub CLI not authenticated. Run 'gh auth login' first.${NC}"
    exit 1
fi

REPO="Muxoai/Urban-Events"

echo -e "${YELLOW}Step 1: Generate APP_KEY${NC}"
APP_KEY="base64:$(openssl rand -base64 32)"
echo -e "  Generated APP_KEY: ${GREEN}${APP_KEY}${NC}"
echo ""

echo -e "${YELLOW}Step 2: Generate JWT_SECRET${NC}"
JWT_SECRET=$(openssl rand -base64 64)
echo -e "  Generated JWT_SECRET: ${GREEN}${JWT_SECRET:0:40}...${NC}"
echo ""

echo -e "${YELLOW}Step 3: Database URL${NC}"
read -p "  Enter your PostgreSQL URL (format: postgresql://user:pass@host:port/db?sslmode=require): " DATABASE_URL
if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}Error: DATABASE_URL is required${NC}"
    exit 1
fi
echo ""

echo -e "${YELLOW}Step 4: Stripe Keys (optional)${NC}"
read -p "  Enter STRIPE_PUBLIC_KEY (or press Enter to skip): " STRIPE_PUBLIC_KEY
if [ -n "$STRIPE_PUBLIC_KEY" ]; then
    read -p "  Enter STRIPE_SECRET_KEY: " STRIPE_SECRET_KEY
    read -p "  Enter STRIPE_WEBHOOK_SECRET: " STRIPE_WEBHOOK_SECRET
    if [ -z "$STRIPE_SECRET_KEY" ] || [ -z "$STRIPE_WEBHOOK_SECRET" ]; then
        echo -e "${YELLOW}  Warning: Incomplete Stripe keys. Stripe will be disabled.${NC}"
        STRIPE_PUBLIC_KEY=""
        STRIPE_SECRET_KEY=""
        STRIPE_WEBHOOK_SECRET=""
    fi
else
    STRIPE_SECRET_KEY=""
    STRIPE_WEBHOOK_SECRET=""
fi
echo ""

echo -e "${YELLOW}Step 5: R2 Storage${NC}"
read -p "  Enter R2_ACCESS_KEY_ID: " R2_ACCESS_KEY_ID
read -p "  Enter R2_SECRET_ACCESS_KEY: " R2_SECRET_ACCESS_KEY
echo ""

echo -e "${YELLOW}Step 6: Cloudflare API Token${NC}"
read -p "  Enter CLOUDFLARE_API_TOKEN: " CLOUDFLARE_API_TOKEN
echo ""

# =============================================================================
# Build AZURE_APP_SECRETS content
# =============================================================================
echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}AZURE_APP_SECRETS Content${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""

AZURE_CONTENT="APP_KEY=${APP_KEY}"
AZURE_CONTENT+=$'\n'"JWT_SECRET=${JWT_SECRET}"
AZURE_CONTENT+=$'\n'"DATABASE_URL=${DATABASE_URL}"
AZURE_CONTENT+=$'\n'"JWT_ALGO=HS256"
AZURE_CONTENT+=$'\n'"APP_NAME=Urban Events"
AZURE_CONTENT+=$'\n'"APP_ENV=production"
AZURE_CONTENT+=$'\n'"APP_DEBUG=false"
AZURE_CONTENT+=$'\n'"APP_SAAS_MODE_ENABLED=false"
AZURE_CONTENT+=$'\n'"LOG_CHANNEL=stderr"
AZURE_CONTENT+=$'\n'"CACHE_DRIVER=file"
AZURE_CONTENT+=$'\n'"CACHE_STORE=file"
AZURE_CONTENT+=$'\n'"QUEUE_CONNECTION=sync"
AZURE_CONTENT+=$'\n'"SESSION_DRIVER=cookie"
AZURE_CONTENT+=$'\n'"SESSION_SECURE_COOKIE=true"
AZURE_CONTENT+=$'\n'"NEEM_ENABLED=false"

if [ -n "$STRIPE_PUBLIC_KEY" ]; then
    AZURE_CONTENT+=$'\n'"STRIPE_PUBLIC_KEY=${STRIPE_PUBLIC_KEY}"
    AZURE_CONTENT+=$'\n'"STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}"
    AZURE_CONTENT+=$'\n'"STRIPE_WEBHOOK_SECRET=${STRIPE_WEBHOOK_SECRET}"
fi

echo "$AZURE_CONTENT"
echo ""

# =============================================================================
# Build CLOUDFLARE_APP_OVERRIDES content
# =============================================================================
echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}CLOUDFLARE_APP_OVERRIDES Content${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""

CF_CONTENT="APP_ORIGIN=https://app.urbanevents.pk"
CF_CONTENT+=$'\n'"APP_FRONTEND_URL=https://app.urbanevents.pk"
CF_CONTENT+=$'\n'"APP_URL=https://app.urbanevents.pk/api"
CF_CONTENT+=$'\n'"VITE_API_URL_CLIENT=https://app.urbanevents.pk/api"
CF_CONTENT+=$'\n'"VITE_API_URL_SERVER=http://localhost:80/api"
CF_CONTENT+=$'\n'"VITE_FRONTEND_URL=https://app.urbanevents.pk"

echo "$CF_CONTENT"
echo ""

# =============================================================================
# Build STRIPE_APP_SECRETS content (if Stripe is configured)
# =============================================================================
if [ -n "$STRIPE_PUBLIC_KEY" ]; then
    echo -e "${BLUE}============================================${NC}"
    echo -e "${BLUE}STRIPE_APP_SECRETS Content${NC}"
    echo -e "${BLUE}============================================${NC}"
    echo ""

    STRIPE_CONTENT="STRIPE_PUBLIC_KEY=${STRIPE_PUBLIC_KEY}"
    STRIPE_CONTENT+=$'\n'"STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}"
    STRIPE_CONTENT+=$'\n'"STRIPE_WEBHOOK_SECRET=${STRIPE_WEBHOOK_SECRET}"

    echo "$STRIPE_CONTENT"
    echo ""
fi

# =============================================================================
# Summary
# =============================================================================
echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}GitHub Secrets to Set${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""
echo "Run these commands to set the secrets:"
echo ""

echo "# Set AZURE_APP_SECRETS"
echo "echo '$AZURE_CONTENT' | gh secret set AZURE_APP_SECRETS --repo $REPO"
echo ""

echo "# Set CLOUDFLARE_APP_OVERRIDES"
echo "echo '$CF_CONTENT' | gh secret set CLOUDFLARE_APP_OVERRIDES --repo $REPO"
echo ""

if [ -n "$STRIPE_PUBLIC_KEY" ]; then
    echo "# Set STRIPE_APP_SECRETS"
    echo "echo '$STRIPE_CONTENT' | gh secret set STRIPE_APP_SECRETS --repo $REPO"
    echo ""
fi

if [ -n "$R2_ACCESS_KEY_ID" ]; then
    echo "# Set R2_ACCESS_KEY_ID"
    echo "echo '$R2_ACCESS_KEY_ID' | gh secret set R2_ACCESS_KEY_ID --repo $REPO"
    echo ""
fi

if [ -n "$R2_SECRET_ACCESS_KEY" ]; then
    echo "# Set R2_SECRET_ACCESS_KEY"
    echo "echo '$R2_SECRET_ACCESS_KEY' | gh secret set R2_SECRET_ACCESS_KEY --repo $REPO"
    echo ""
fi

if [ -n "$CLOUDFLARE_API_TOKEN" ]; then
    echo "# Set CLOUDFLARE_API_TOKEN"
    echo "echo '$CLOUDFLARE_API_TOKEN' | gh secret set CLOUDFLARE_API_TOKEN --repo $REPO"
    echo ""
fi

echo -e "${GREEN}Done! Now commit and push your changes, then trigger the deploy workflow.${NC}"
