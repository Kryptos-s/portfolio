#!/usr/bin/env bash
#
# Auto-deploy for the Nuxt portfolio.
# Pulls the latest commit on $BRANCH and, only if there is one, reinstalls deps
# (when the lockfile changed), rebuilds, and restarts the systemd service.
# Safe to run from cron: it exits quietly when already up to date and uses a lock
# so overlapping runs can't collide.
#
# The whole thing runs inside main() which bash parses before executing, so it is
# safe even though the git pull may rewrite this very file mid-run.

set -euo pipefail

# ------------------------------------------------------------------ config ----
SERVICE="portfolio.service"           # your systemd unit name
BRANCH="main"
HEALTH_URL="http://127.0.0.1:3000/"   # set to "" to skip the post-restart check
LOCK="/tmp/portfolio-deploy.lock"

# cron runs with a bare PATH; make sure git/node/npm/systemctl are findable.
export PATH="/usr/local/bin:/usr/bin:/bin:${PATH:-}"
# If node/npm come from nvm instead, comment the line above and use:
#   export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; nvm use --lts >/dev/null
# ------------------------------------------------------------------------------

log() { printf '%s  %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$*"; }

main() {
  # Resolve the repo root from this script's location (scripts/ -> repo root).
  local script_dir repo
  script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  repo="$(git -C "$script_dir" rev-parse --show-toplevel)"
  cd "$repo"

  # Single instance only.
  exec 9>"$LOCK"
  flock -n 9 || exit 0

  trap 'log "ERROR near line $LINENO (exit $?)"' ERR

  # Refuse to touch a repo with uncommitted changes to tracked files.
  if [ -n "$(git status --porcelain --untracked-files=no)" ]; then
    log "tracked files modified locally; aborting so nothing gets clobbered"
    exit 1
  fi

  git fetch --quiet origin "$BRANCH"

  local before after
  before="$(git rev-parse HEAD)"
  after="$(git rev-parse "origin/$BRANCH")"

  # Nothing new -> stay silent so the cron log only records real deploys.
  [ "$before" = "$after" ] && exit 0

  log "update found: ${before:0:7} -> ${after:0:7}"
  git pull --ff-only --quiet origin "$BRANCH"

  # Reinstall only when the lockfile actually changed (npm ci is slow).
  if git diff --name-only "$before" "$after" | grep -q '^package-lock\.json$'; then
    log "lockfile changed -> npm ci"
    npm ci
  fi

  log "building"
  npm run build

  log "restarting $SERVICE"
  local sudo=""
  [ "$(id -u)" -ne 0 ] && sudo="sudo"
  $sudo systemctl restart "$SERVICE"

  # Best-effort health check.
  if [ -n "$HEALTH_URL" ] && command -v curl >/dev/null 2>&1; then
    sleep 3
    local i
    for i in 1 2 3 4 5; do
      if curl -fsS -o /dev/null --max-time 5 "$HEALTH_URL"; then
        log "healthy; now running ${after:0:7}"
        exit 0
      fi
      sleep 2
    done
    log "WARNING: service did not answer $HEALTH_URL after restart"
    exit 1
  fi

  log "done; now running ${after:0:7}"
}

main "$@"
