FROM caddy:alpine
COPY dist/events-guard/browser /usr/share/caddy
COPY Caddyfile /etc/caddy/Caddyfile


