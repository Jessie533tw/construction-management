# Multi-stage build for Node.js backend and React frontend
FROM node:18-alpine AS backend-builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy backend source
COPY . .
RUN npm run build

# Frontend builder stage
FROM node:18-alpine AS frontend-builder

WORKDIR /app/client

# Copy client package files
COPY client/package*.json ./
RUN npm install

# Copy client source and build
COPY client/ ./
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Install PostgreSQL client (for potential database operations)
RUN apk add --no-cache postgresql-client

# Copy backend build and dependencies
COPY --from=backend-builder /app/dist ./dist
COPY --from=backend-builder /app/node_modules ./node_modules
COPY --from=backend-builder /app/prisma ./prisma
COPY --from=backend-builder /app/package*.json ./

# Copy frontend build
COPY --from=frontend-builder /app/client/dist ./client/dist

# Create uploads directory
RUN mkdir -p uploads

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership of the app directory
RUN chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "const http = require('http'); http.get('http://localhost:3001/health', (res) => process.exit(res.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

CMD ["npm", "start"]