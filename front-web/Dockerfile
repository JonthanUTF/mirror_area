# Stage 1: Build the React application
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy APK file for mobile client download
# This file should be built from client-mobile and placed in client-web directory
# If the file doesn't exist, use a placeholder
COPY client.ap[k] /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
