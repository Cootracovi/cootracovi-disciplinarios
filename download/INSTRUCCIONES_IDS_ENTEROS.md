# 📋 INSTRUCCIONES DE ACTUALIZACIÓN - IDs NUMÉRICOS

## ✅ CAMBIOS REALIZADOS

Se han modificado todos los IDs del sistema para que sean **enteros con auto-incremento** en lugar de texto (CUID).

---

## 📊 MODELOS MODIFICADOS EN PRISMA

| Modelo | Campo ID | Tipo Anterior | Tipo Nuevo |
|--------|----------|---------------|------------|
| Usuario | id | String (@default(cuid())) | Int (@default(autoincrement())) |
| Indiciado | id | String | Int |
| Caso | id | String | Int |
| HistorialEtapa | id | String | Int |
| Decision | id | String | Int |
| DocumentoNormativo | id | String | Int |
| EnlaceCapacitacion | id | String | Int |
| Configuracion | id | String | Int |
| LogActividad | id | String | Int |
| Notificacion | id | String | Int |

También se actualizaron todas las **claves foráneas** (indiciadoId, responsableId, casoId, usuarioId, etc.)

---

## 🔄 PASOS PARA ACTUALIZAR

### Paso 1: Descargar el código actualizado
El archivo ZIP está en: `COOTRACOVI-Procesos-Disciplinarios-IDs-ENTEROS.zip`

### Paso 2: Subir a GitHub
```bash
# Opción A: Desde terminal
cd /ruta/del/proyecto
git add .
git commit -m "Cambio de IDs a enteros con auto-incremento"
git push origin main

# Opción B: Desde GitHub web
# Subir los archivos manualmente
```

### Paso 3: Ejecutar migración en Vercel/Servidor

**IMPORTANTE: Como cambió la estructura de la base de datos, debe:**

1. **Opción A: Si NO hay datos importantes** (recomendado si es instalación nueva):
```bash
# Eliminar tablas existentes y recrear
npx prisma migrate reset --force

# Cargar datos iniciales
npx prisma db seed
```

2. **Opción B: Si YA hay datos que desea conservar**:
```bash
# Crear migración
npx prisma migrate dev --name change_ids_to_int

# Esto intentará convertir los datos existentes
```

### Paso 4: Regenerar el cliente Prisma
```bash
npx prisma generate
```

### Paso 5: Verificar que funciona
1. Ir a: https://cootracovi-disciplinarios.vercel.app
2. Debe aparecer la pantalla de login
3. Ingresar con: `operaciones@cootracovi.com` / `Cootracovi2026!`

---

## 📁 ARCHIVOS MODIFICADOS

### Schema:
- `prisma/schema.prisma` - Todos los modelos con IDs numéricos

### APIs:
- `src/app/api/auth/login/route.ts` - ID de usuario como número
- `src/app/api/auth/session/route.ts` - Sesión con ID numérico
- `src/app/api/usuarios/route.ts` - CRUD de usuarios
- `src/app/api/usuarios/[id]/route.ts` - ID convertido a entero
- `src/app/api/casos/route.ts` - CRUD de casos
- `src/app/api/casos/[id]/route.ts` - ID convertido a entero

### Componentes:
- `src/contexts/AuthContext.tsx` - Usuario con ID numérico
- `src/components/users/UsersManager.tsx` - Gestión de usuarios
- `src/app/page.tsx` - Interface Caso actualizada

---

## 👤 USUARIOS POR DEFECTO (después del seed)

| Email | Password | Rol |
|-------|----------|-----|
| operaciones@cootracovi.com | Cootracovi2026! | Líder de Operaciones |
| ggrh@cootracovi.com | Cootracovi2026! | Líder de GGHH |
| gerencia@cootracovi.com | Cootracovi2026! | Gerencia |
| consejo@cootracovi.com | Cootracovi2026! | Consejo de Administración |
| apelaciones@cootracovi.com | Cootracovi2026! | Comité de Apelaciones |

---

## ⚠️ IMPORTANTE

Si la base de datos ya tiene datos, la migración puede fallar porque los IDs existentes son texto y los nuevos son números. En ese caso:

1. Haga backup de los datos si son importantes
2. Ejecute `npx prisma migrate reset --force` para recrear todo
3. Luego `npx prisma db seed` para cargar datos iniciales

---

## 📞 SOPORTE

Si tiene problemas durante la actualización:
1. Verificar los logs de Vercel
2. Verificar que la base de datos MySQL esté accesible
3. Contactar al equipo de desarrollo

**Archivo ZIP actualizado**: `COOTRACOVI-Procesos-Disciplinarios-IDs-ENTEROS.zip`
