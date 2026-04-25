FROM oven/bun:1.1.29-alpine AS deps

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile


FROM node:24-alpine AS builder

WORKDIR /app

# Build arguments for Next.js public env vars
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_RECAPTCHA_SITE_KEY
ARG NEXT_PUBLIC_RECAPTCHA_USE_ENTERPRISE
ARG NEXT_PUBLIC_RECAPTCHA_USE_RECAPTCHA_NET

# Set as environment variables for build
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}
ENV NEXT_PUBLIC_RECAPTCHA_SITE_KEY=${NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
ENV NEXT_PUBLIC_RECAPTCHA_USE_ENTERPRISE=${NEXT_PUBLIC_RECAPTCHA_USE_ENTERPRISE}
ENV NEXT_PUBLIC_RECAPTCHA_USE_RECAPTCHA_NET=${NEXT_PUBLIC_RECAPTCHA_USE_RECAPTCHA_NET}
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules

COPY . .

RUN npm run build


FROM node:24-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy build output only (small image)
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.* ./

EXPOSE 3000

# Start with Node runtime
CMD ["npm","start"]
