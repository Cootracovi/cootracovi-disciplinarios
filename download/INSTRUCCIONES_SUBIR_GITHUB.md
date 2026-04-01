# 📦 INSTRUCCIONES PARA SUBIR EL PROYECTO A GITHUB

## ARCHIVO LISTO PARA DESCARGAR

El archivo ZIP del proyecto está en:
```
/home/z/my-project/download/COOTRACOVI-Procesos-Disciplinarios.zip
```

---

## PASOS PARA SUBIR A GITHUB

### OPCIÓN 1: Subir directamente desde la web de GitHub (MÁS FÁCIL)

1. **Ir a GitHub**: https://github.com/new
2. **Crear repositorio nuevo**:
   - Repository name: `procesos-disciplinarios`
   - Description: `Sistema de Procesos Disciplinarios COOTRACOVI`
   - Dejar PUBLIC o PRIVATE según preferencia
   - **NO** marcar "Add a README file"
   - Click en "Create repository"

3. **Subir el ZIP**:
   - En el repositorio creado, click en "uploading an existing file"
   - Arrastrar el archivo ZIP o seleccionarlo
   - Click en "Commit changes"

---

### OPCIÓN 2: Usando Git desde la terminal (RECOMENDADO)

Si tiene acceso a terminal en el servidor:

```bash
# 1. Descomprimir el ZIP
unzip COOTRACOVI-Procesos-Disciplinarios.zip -d procesos-disciplinarios
cd procesos-disciplinarios

# 2. Inicializar git
git init

# 3. Configurar usuario
git config user.email "Cootracovi@jbyd.com.co"
git config user.name "COOTRACOVI"

# 4. Agregar archivos
git add .

# 5. Crear commit
git commit -m "Sistema de Procesos Disciplinarios COOTRACOVI"

# 6. Crear repositorio en GitHub primero, luego:
git remote add origin https://github.com/TU-USUARIO/procesos-disciplinarios.git
git branch -M main
git push -u origin main
```

---

## PASOS PARA CONECTAR CON VERCEL

1. **Ir a Vercel**: https://vercel.com/new
2. **Importar repositorio**:
   - Click en "Import Git Repository"
   - Seleccionar el repositorio `procesos-disciplinarios`
3. **Configurar variables de entorno**:
   - Click en "Environment Variables"
   - Agregar las variables del archivo `.env.example`:

```
DATABASE_URL=mysql://usuario:password@localhost:3306/cootracovi_disciplinarios
NEXTAUTH_URL=https://tu-dominio.vercel.app
NEXTAUTH_SECRET=generar_con_openssl_rand_base64_32
```

4. **Click en Deploy**

---

## CONFIGURACIÓN DE BASE DE DATOS MYSQL

Antes de ejecutar la aplicación:

```sql
-- Crear base de datos
CREATE DATABASE cootracovi_disciplinarios CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Crear usuario (si no existe)
CREATE USER 'cootracovi'@'localhost' IDENTIFIED BY 'tu_password_seguro';
GRANT ALL PRIVILEGES ON cootracovi_disciplinarios.* TO 'cootracovi'@'localhost';
FLUSH PRIVILEGES;
```

---

## DESPUÉS DEL DESPLIEGUE

1. Ejecutar migraciones de Prisma:
```bash
npx prisma migrate deploy
npx prisma db seed
```

2. Acceder a la aplicación en el puerto 3000

---

## DATOS INICIALES

El sistema incluye estos usuarios de prueba:
- **Líder Operaciones**: lider.operaciones@cootracovi.com
- **Líder GGHH**: lider.gghh@cootracovi.com  
- **Gerencia**: gerencia@cootracovi.com
- **Consejo Administración**: consejo@cootracovi.com
- **Comité Apelaciones**: apelaciones@cootracovi.com

Password para todos: `Cootracovi2024!`

---

## CONTACTO

Si tiene problemas, revise:
- El archivo `README.md` dentro del ZIP
- El archivo `Guia_Instalacion_Servidor_COOTRACOVI.docx`
