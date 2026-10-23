# Build stage: install the locked production dependency set.
FROM node:20-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts

# Runtime stage: serve the existing SPA without development/test files.
FROM node:20-alpine AS production

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder --chown=node:node /app/package.json ./package.json
COPY --from=builder --chown=node:node /app/package-lock.json ./package-lock.json
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node public ./public
COPY --chown=node:node src ./src
COPY --chown=node:node server.js ./server.js

USER node
EXPOSE 5000
CMD ["node", "server.js"]
