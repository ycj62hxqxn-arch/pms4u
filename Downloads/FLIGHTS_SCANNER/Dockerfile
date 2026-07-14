# Multi-stage Dockerfile for Flight Price Location Comparator
# Supports development and production builds with optimized layer caching

# ============================================================================
# Stage 1: Dependencies (shared by all stages)
# ============================================================================
FROM node:18-alpine AS dependencies

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with npm ci for reproducible builds
RUN npm ci --only=production && \
    npm cache clean --force

# ============================================================================
# Stage 2: Development Dependencies
# ============================================================================
FROM dependencies AS dev-dependencies

# Copy package files again
COPY package*.json ./

# Install all dependencies (including dev)
RUN npm ci && \
    npm cache clean --force

# ============================================================================
# Stage 3: Builder - Compile TypeScript and build Next.js
# ============================================================================
FROM dev-dependencies AS builder

WORKDIR /app

# Copy source code
COPY . .

# Set build arguments
ARG NODE_ENV=production
ARG DATABASE_URL="postgresql://localhost/flights"

ENV NODE_ENV=$NODE_ENV \
    DATABASE_URL=$DATABASE_URL \
    NEXT_TELEMETRY_DISABLED=1

# Generate Prisma client
RUN npx prisma generate

# Build Next.js application
RUN npm run build

# ============================================================================
# Stage 4: Development Runtime
# ============================================================================
FROM dev-dependencies AS development

WORKDIR /app

# Copy source code
COPY . .

# Expose development port
EXPOSE 3000

# Set environment
ENV NODE_ENV=development \
    NEXT_TELEMETRY_DISABLED=1

# Start dev server with hot reload
CMD ["npm", "run", "dev"]

# ============================================================================
# Stage 5: Production Runtime - Minimal Image
# ============================================================================
FROM node:18-alpine AS production

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Copy production dependencies from dependencies stage
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/package*.json ./

# Copy built application from builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Expose production port
EXPOSE 3000

# Set environment
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start production server
CMD ["node_modules/.bin/next", "start"]
