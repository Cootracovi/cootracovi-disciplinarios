# COOTRACOVI - Sistema de Procesos Disciplinarios

Sistema web para la gestión de procesos disciplinarios de la Cooperativa de Transporte de Pasajeros Urbano COOTRACOVI.

## 🚀 Despliegue en Vercel

### 1. Configurar Variables de Entorno en Vercel

Antes de desplegar, configure las siguientes variables en Vercel:

| Variable | Valor |
|----------|-------|
| `DATABASE_URL` | `mysql://usuario:password@servidor:3306/disciplinarios` |
| `NEXTAUTH_SECRET` | Generar con: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `https://su-app.vercel.app` |
| `NEXT_PUBLIC_BASE_URL` | `https://su-app.vercel.app` |

### 2. Desplegar

1. Conecte este repositorio a Vercel
2. Vercel detectará automáticamente Next.js
3. Configure las variables de entorno
4. Haga clic en "Deploy"

### 3. Ejecutar Migraciones

Después del primer despliegue, ejecute las migraciones de la base de datos:

```bash
npx prisma migrate deploy
npx prisma db seed
```

## 📋 Usuarios del Sistema

| Email | Rol |
|-------|-----|
| operaciones@cootracovi.com | Líder de Operaciones |
| ggrh@cootracovi.com | Líder de GGHH |
| gerencia@cootracovi.com | Gerencia |
| consejo@cootracovi.com | Consejo de Administración |
| apelaciones@cootracovi.com | Comité de Apelaciones |

**Password inicial:** `Cootracovi2026!`

## 🛠️ Comandos

```bash
# Instalar dependencias
bun install

# Desarrollo local
bun run dev

# Construir para producción
bun run build

# Migraciones de base de datos
npx prisma migrate deploy

# Cargar datos iniciales
bun run db:seed
```

## 📁 Estructura

```
src/
├── app/                    # Páginas y APIs
│   ├── api/               # Endpoints
│   └── page.tsx           # Página principal
├── components/            # Componentes UI
├── lib/                   # Utilidades
└── hooks/                 # Hooks personalizados
prisma/
├── schema.prisma          # Esquema de base de datos
└── seed.ts                # Datos iniciales
```

## 🔧 Tecnologías

- Next.js 16
- TypeScript
- Prisma ORM
- MySQL
- Tailwind CSS
- shadcn/ui
- Z.ai (Inteligencia Artificial)

---

Desarrollado para **COOTRACOVI** - Cooperativa de Transporte de Pasajeros Urbano
