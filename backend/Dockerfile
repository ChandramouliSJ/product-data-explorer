# ✅ Base image includes Playwright + Chromium/Firefox/WebKit preinstalled
FROM mcr.microsoft.com/playwright:v1.38.0-focal

# Set working directory
WORKDIR /app

# Copy package files first (better cache for Docker builds)
COPY package*.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy the rest of the backend code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build NestJS app (compiles TypeScript -> dist/)
RUN npm run build

# Expose the port (must match PORT env var, default 3001)
EXPOSE 3001

# Run migrations automatically before starting (safe for production)
CMD npx prisma migrate deploy && npm run start
