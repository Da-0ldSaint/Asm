# ─────────────────────────────────────────────
# ASM Backend – Node.js / Express
# ─────────────────────────────────────────────
FROM node:20-alpine

# Install dumb-init for proper process handling
RUN apk add --no-cache dumb-init

WORKDIR /app

# Install production dependencies only
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy application source
COPY . .

# Create uploads directory (persisted via volume)
RUN mkdir -p uploads

# Run as non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 5000

# Use dumb-init to handle signals correctly
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "index.js"]
