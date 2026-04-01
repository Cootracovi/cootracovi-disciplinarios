# ============================================
# COOTRACOVI - Dockerfile para Producción
# Sistema de Procesos Disciplinarios
# ============================================

FROM node:20-alpine AS base

# Instalar dependencias necesarias
RUN apk add --no-cache libc6-compat openssl

# ============================================
# Etapa 1: Instalar dependencias
# ============================================
FROM base AS deps

WORKDIR /app

# Copiar archivos de dependencias
COPY package.json bun.lock ./
COPY prisma ./prisma/

# Instalar bun
RUN npm install -g bun

# Instalar dependencias
RUN bun install --frozen-lockfile

# Generar cliente Prisma
RUN npx prisma generate

# ============================================
# Etapa 2: Construir la aplicación
# ============================================
FROM base AS builder

WORKDIR /app

# Copiar dependencias
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma
COPY . .

# Instalar bun
RUN npm install -g bun

# Generar cliente Prisma nuevamente
RUN npx prisma generate

# Establecer variables de entorno para build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Construir la aplicación
RUN bun run build

# ============================================
# Etapa 3: Imagen de producción
# ============================================
FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Crear usuario no-root para seguridad
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar archivos necesarios
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Crear directorio para respaldos
RUN mkdir -p /var/backups/cootracovi && chown -R nextjs:nodejs /var/backups/cootracovi

# Copiar script de inicio
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Cambiar propietario
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["node", "server.js"]
