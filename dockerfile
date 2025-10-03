# Stage 1: Build Node app
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files from frontend/
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm ci && npm cache clean --force

# Copy source code and build
COPY frontend/ .
RUN npm run build

# Stage 2: Serve with NGINX
FROM nginx:alpine

# Install wget for healthcheck
RUN apk add --no-cache wget

# Remove default NGINX website
RUN rm -rf /usr/share/nginx/html/*

# Copy built frontend from Stage 1
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom entrypoint script
COPY frontend/docker/nginx-entrypoint.sh /docker-entrypoint.d/99-envsubst.sh
RUN chmod +x /docker-entrypoint.d/99-envsubst.sh

# Add healthcheck for ECS
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

# Expose port 80
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]