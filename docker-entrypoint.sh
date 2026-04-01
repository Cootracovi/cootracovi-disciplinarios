#!/bin/bash
# ============================================
# COOTRACOVI - Script de entrada Docker
# Sistema de Procesos Disciplinarios
# ============================================

set -e

echo "========================================"
echo "COOTRACOVI - Sistema Disciplinario"
echo "========================================"

# Esperar a que MySQL esté listo
if [ -n "$DATABASE_URL" ]; then
    echo "⏳ Esperando conexión a MySQL..."
    
    # Extraer host del DATABASE_URL
    DB_HOST=$(echo $DATABASE_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
    DB_PORT=$(echo $DATABASE_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
    
    # Esperar hasta 60 segundos
    for i in {1..60}; do
        if nc -z $DB_HOST $DB_PORT 2>/dev/null; then
            echo "✅ MySQL está listo!"
            break
        fi
        echo "   Intento $i/60..."
        sleep 1
    done
fi

# Ejecutar migraciones
echo "📦 Ejecutando migraciones de base de datos..."
npx prisma migrate deploy || npx prisma db push --accept-data-loss

# Ejecutar seed si es necesario
if [ "$RUN_SEED" = "true" ]; then
    echo "🌱 Cargando datos iniciales..."
    npx prisma db seed
fi

echo "🚀 Iniciando aplicación..."
echo "========================================"

# Ejecutar la aplicación
exec "$@"
