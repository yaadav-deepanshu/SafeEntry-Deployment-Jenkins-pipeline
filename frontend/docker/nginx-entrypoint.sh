#!/bin/sh
# Replace API base URL in built JS files
if [ -f /usr/share/nginx/html/assets/api.js ]; then
  envsubst '$VITE_API_BASE_URL' < /usr/share/nginx/html/assets/api.js > /usr/share/nginx/html/assets/api.js.tmp
  mv /usr/share/nginx/html/assets/api.js.tmp /usr/share/nginx/html/assets/api.js
fi

exec "$@"
