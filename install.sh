#!/bin/bash
# ============================================
# COOTRACOVI - Script de Instalación
# Sistema de Procesos Disciplinarios
# ============================================
# Ejecutar como root o con sudo
# Uso: sudo ./install.sh

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Variables de configuración
APP_NAME="cootracovi-disciplinarios"
APP_DIR="/opt/cootracovi"
DB_NAME="disciplinarios"
DB_USER="cootracovi"
DB_PASS="Cootracovi2026!"

echo -e "${BLUE}========================================"
echo "COOTRACOVI - Sistema Disciplinario"
echo "Script de Instalación para Servidor"
echo -e "========================================${NC}"

# ------------------------------------------
# 1. Verificar requisitos
# ------------------------------------------
echo -e "\n${YELLOW}[1/8] Verificando requisitos del sistema...${NC}"

# Verificar si es root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Por favor ejecute como root o con sudo${NC}"
    exit 1
fi

# Verificar sistema operativo
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$NAME
    VER=$VERSION_ID
    echo -e "   Sistema: ${GREEN}$OS $VER${NC}"
else
    echo -e "${RED}No se pudo detectar el sistema operativo${NC}"
    exit 1
fi

# ------------------------------------------
# 2. Instalar dependencias del sistema
# ------------------------------------------
echo -e "\n${YELLOW}[2/8] Instalando dependencias del sistema...${NC}"

if [[ "$OS" == *"Ubuntu"* ]] || [[ "$OS" == *"Debian"* ]]; then
    apt-get update
    apt-get install -y curl wget git build-essential openssl libssl-dev
elif [[ "$OS" == *"CentOS"* ]] || [[ "$OS" == *"Red Hat"* ]]; then
    yum update -y
    yum install -y curl wget git gcc-c++ make openssl-devel
else
    echo -e "${YELLOW}   Instale manualmente: curl, wget, git, build-essential, openssl${NC}"
fi

echo -e "${GREEN}   ✓ Dependencias instaladas${NC}"

# ------------------------------------------
# 3. Instalar Node.js
# ------------------------------------------
echo -e "\n${YELLOW}[3/8] Instalando Node.js 20 LTS...${NC}"

if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs || yum install -y nodejs
fi

NODE_VERSION=$(node -v)
echo -e "   Node.js: ${GREEN}$NODE_VERSION${NC}"
echo -e "   npm: ${GREEN}$(npm -v)${NC}"

# ------------------------------------------
# 4. Instalar Bun
# ------------------------------------------
echo -e "\n${YELLOW}[4/8] Instalando Bun (runtime)...${NC}"

if ! command -v bun &> /dev/null; then
    curl -fsSL https://bun.sh/install | bash
    export PATH="$HOME/.bun/bin:$PATH"
fi

echo -e "   Bun: ${GREEN}$(bun -v)${NC}"

# ------------------------------------------
# 5. Configurar MySQL
# ------------------------------------------
echo -e "\n${YELLOW}[5/8] Configurando MySQL...${NC}"

if command -v mysql &> /dev/null; then
    echo -e "   MySQL ya está instalado: ${GREEN}$(mysql --version)${NC}"
    
    # Crear base de datos y usuario
    echo -e "   Creando base de datos y usuario..."
    mysql -u root -p <<EOF
-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS ${DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Crear usuario si no existe
CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';

-- Otorgar permisos
GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'localhost';
FLUSH PRIVILEGES;

SELECT 'Base de datos configurada correctamente' AS mensaje;
EOF
    
    echo -e "${GREEN}   ✓ Base de datos configurada${NC}"
else
    echo -e "${RED}   MySQL no está instalado. Por favor instale MySQL 8.0${NC}"
    echo -e "   En Ubuntu: sudo apt install mysql-server"
    exit 1
fi

# ------------------------------------------
# 6. Crear directorio de la aplicación
# ------------------------------------------
echo -e "\n${YELLOW}[6/8] Creando directorio de la aplicación...${NC}"

mkdir -p $APP_DIR
mkdir -p $APP_DIR/backups
mkdir -p $APP_DIR/documentos
mkdir -p $APP_DIR/logs

echo -e "${GREEN}   ✓ Directorios creados en $APP_DIR${NC}"

# ------------------------------------------
# 7. Copiar archivos de la aplicación
# ------------------------------------------
echo -e "\n${YELLOW}[7/8] Copiando archivos de la aplicación...${NC}"

# Obtener el directorio donde está el script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Copiar todos los archivos
cp -r $SCRIPT_DIR/* $APP_DIR/
cp $SCRIPT_DIR/.env.example $APP_DIR/.env

# Establecer permisos
chown -R www-data:www-data $APP_DIR || chown -R nginx:nginx $APP_DIR
chmod -R 755 $APP_DIR
chmod +x $APP_DIR/scripts/*.sh 2>/dev/null || true

echo -e "${GREEN}   ✓ Archivos copiados${NC}"

# ------------------------------------------
# 8. Instalar dependencias y construir
# ------------------------------------------
echo -e "\n${YELLOW}[8/8] Instalando dependencias y construyendo...${NC}"

cd $APP_DIR

# Instalar dependencias
bun install

# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate deploy || npx prisma db push

# Construir aplicación
bun run build

echo -e "${GREEN}   ✓ Aplicación construida${NC}"

# ------------------------------------------
# Configurar servicio systemd
# ------------------------------------------
echo -e "\n${YELLOW}Configurando servicio del sistema...${NC}"

cat > /etc/systemd/system/cootracovi.service << 'EOF'
[Unit]
Description=COOTRACOVI - Sistema de Procesos Disciplinarios
After=network.target mysql.service

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/opt/cootracovi
ExecStart=/usr/bin/node /opt/cootracovi/.next/standalone/server.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=3000
Environment=DATABASE_URL=mysql://cootracovi:Cootracovi2026!@localhost:3306/disciplinarios

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable cootracovi
systemctl start cootracovi

echo -e "${GREEN}   ✓ Servicio configurado${NC}"

# ------------------------------------------
# Verificar instalación
# ------------------------------------------
echo -e "\n${BLUE}========================================"
echo -e "✅ INSTALACIÓN COMPLETADA"
echo -e "========================================${NC}"

echo -e "\n${GREEN}La aplicación está disponible en:${NC}"
echo -e "   http://localhost:3000"
echo -e "   http://$(hostname -I | awk '{print $1}'):3000"

echo -e "\n${YELLOW}Comandos útiles:${NC}"
echo -e "   Estado del servicio: ${BLUE}sudo systemctl status cootracovi${NC}"
echo -e "   Reiniciar servicio:  ${BLUE}sudo systemctl restart cootracovi${NC}"
echo -e "   Ver logs:            ${BLUE}sudo journalctl -u cootracovi -f${NC}"

echo -e "\n${YELLOW}Archivos importantes:${NC}"
echo -e "   Aplicación:  ${BLUE}$APP_DIR${NC}"
echo -e "   Configuración: ${BLUE}$APP_DIR/.env${NC}"
echo -e "   Respaldos:   ${BLUE}$APP_DIR/backups${NC}"
echo -e "   Documentos:  ${BLUE}$APP_DIR/documentos${NC}"

echo -e "\n${YELLOW}⚠️  IMPORTANTE:${NC}"
echo -e "   1. Edite el archivo ${BLUE}$APP_DIR/.env${NC} y cambie los secretos"
echo -e "   2. Configure el firewall para permitir el puerto 3000"
echo -e "   3. Configure HTTPS con certificado SSL"

echo -e "\n${GREEN}¡Gracias por usar COOTRACOVI!${NC}"
