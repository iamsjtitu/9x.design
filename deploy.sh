#!/usr/bin/env bash
# 9x.design — one-command deploy script
# Triggered either manually (./deploy.sh) or via the /__deploy console.
# Runs as root (inherited from systemd / sudo). Logs to /var/log/9x-deploy.log.

set -eo pipefail

REPO_DIR="/var/www/9x-design"
FRONTEND_DIR="$REPO_DIR/frontend"
SERVICE_NAME="9x-design"

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  9x.design deploy started: $(date -u +"%Y-%m-%d %H:%M:%S UTC")"
echo "═══════════════════════════════════════════════════════════"

cd "$REPO_DIR"

echo ""
echo "[1/4] Pulling latest code from GitHub..."
git fetch --all --prune
BEFORE=$(git rev-parse --short HEAD)
git pull --ff-only
AFTER=$(git rev-parse --short HEAD)
echo "     $BEFORE → $AFTER"

if [ "$BEFORE" = "$AFTER" ]; then
    echo ""
    echo "✓ Already up to date. Nothing to deploy."
    echo "═══════════════════════════════════════════════════════════"
    exit 0
fi

echo ""
echo "[2/4] Installing frontend deps (yarn)..."
cd "$FRONTEND_DIR"
yarn install --frozen-lockfile 2>&1 | tail -5

echo ""
echo "[3/4] Building frontend (yarn build)..."
yarn build 2>&1 | tail -15

echo ""
echo "[4/4] Restarting backend service..."
# Give the HTTP deploy request a moment to finish cleanly before restart.
sleep 2
systemctl restart "$SERVICE_NAME"
sleep 3
systemctl is-active "$SERVICE_NAME" && echo "     ✓ Service active"

echo ""
echo "✓ Deploy complete: $BEFORE → $AFTER at $(date -u +"%Y-%m-%d %H:%M:%S UTC")"
echo "═══════════════════════════════════════════════════════════"
