#!/usr/bin/env bash
set -Eeuo pipefail
release_id="${GITHUB_SHA:?Missing SHA}"
[[ "$release_id" =~ ^[0-9a-f]{40}$ ]]
base=/var/www/mini-games
release="$base/releases/$release_id"
test -s "$release/index.html"
test "$(cat "$release/version.txt")" = "$release_id"
previous=$(readlink "$base/current" || true)
config=/etc/nginx/conf.d/game.penggeai.conf
created=false
if [ ! -f "$config" ]; then
  cat > "$config" <<'NGINX'
server {
    listen 80;
    server_name game.penggeai.com;
    root /var/www/mini-games/current;
    index index.html;
    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;
    location / { try_files $uri $uri/ =404; }
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }
    location = /index.html { add_header Cache-Control "no-cache"; }
    location = /version.txt { add_header Cache-Control "no-store"; }
}
NGINX
  created=true
fi
if ! nginx -t; then
  if "$created"; then rm "$config"; fi
  exit 1
fi
ln -sfn "$release" "$base/current-next"
mv -Tf "$base/current-next" "$base/current"
if ! systemctl reload nginx; then
  if [ -n "$previous" ]; then ln -sfn "$previous" "$base/current-next"; mv -Tf "$base/current-next" "$base/current"; fi
  exit 1
fi
response=$(mktemp)
trap 'rm -f "$response"' EXIT
for attempt in {1..10}; do
  if curl --fail --silent -H 'Host: game.penggeai.com' http://127.0.0.1/index.html > "$response" && cmp -s "$release/index.html" "$response"; then
    test "$(curl --fail --silent -H 'Host: game.penggeai.com' http://127.0.0.1/version.txt)" = "$release_id"
    if [ -n "$previous" ]; then printf '%s\n' "$previous" > "$base/previous-release"; fi
    echo "Published $release_id at http://game.penggeai.com"
    exit 0
  fi
  sleep 1
done
if [ -n "$previous" ]; then
  ln -sfn "$previous" "$base/current-next"
  mv -Tf "$base/current-next" "$base/current"
  systemctl reload nginx
fi
echo 'Health check failed; previous release restored where available' >&2
exit 1
