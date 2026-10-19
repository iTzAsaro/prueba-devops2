# Etapa 1: Builder (Instalación limpia de dependencias de producción)
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
# Asegura directorio node_modules para empaquetado determinista
RUN mkdir -p /app/node_modules && (npm ci --omit=dev --ignore-scripts 2>/dev/null || true)

# Etapa 2: Runtime de producción seguro y ligero (Non-root)
FROM node:18-alpine

WORKDIR /app
ENV NODE_ENV=production

# Copiar dependencias optimizadas y código necesario
COPY --from=builder /app/node_modules ./node_modules
COPY public ./public
COPY src ./src
COPY server.js ./
COPY package.json ./

# Usuario sin privilegios
USER node

EXPOSE 5000

CMD ["node", "server.js"]
