# Use Bun base image
FROM oven/bun:1.1 AS base
WORKDIR /app

# --- Stage 1: Install dependencies ---
FROM base AS deps
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# --- Stage 2: Build the application ---
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# SvelteKit sync and build
RUN bun run build

# --- Stage 3: Production runner ---
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy built app and necessary files for migration/seeding
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/src/lib/server/db ./src/lib/server/db
COPY --from=builder /app/drizzle.config.js ./drizzle.config.js
COPY --from=deps /app/node_modules ./node_modules

# Port for SvelteKit (Node adapter)
EXPOSE 3000

# Execute DB push, Seed, and Start app
CMD ["sh", "-c", "bun run db:push && bun scripts/seed_full.js && bun build/index.js"]
