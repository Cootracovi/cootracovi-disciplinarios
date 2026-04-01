# Guía de Despliegue - Sistema de Procesos Disciplinarios COOTRACOVI

## Índice
1. [Requisitos Previos](#requisitos-previos)
2. [Paso 1: Crear Cuenta en GitHub](#paso-1-crear-cuenta-en-github)
3. [Paso 2: Crear Cuenta en Vercel](#paso-2-crear-cuenta-en-vercel)
4. [Paso 3: Subir el Código a GitHub](#paso-3-subir-el-código-a-github)
5. [Paso 4: Desplegar en Vercel](#paso-4-desplegar-en-vercel)
6. [Paso 5: Configurar Variables de Entorno](#paso-5-configurar-variables-de-entorno)
7. [Paso 6: Verificar el Despliegue](#paso-6-verificar-el-despliegue)
8. [Preguntas Frecuentes](#preguntas-frecuentes)

---

## Requisitos Previos

Solo necesita:
- Una cuenta de correo electrónico
- Acceso a internet
- Un navegador web (Chrome, Firefox, Edge, etc.)

**NO necesita:**
- Tarjeta de crédito
- Conocimientos técnicos avanzados
- Servidor propio

---

## Paso 1: Crear Cuenta en GitHub

GitHub es donde se almacenará el código de su aplicación. Es como un Google Drive para programadores.

1. Vaya a [github.com](https://github.com)
2. Haga clic en **"Sign up"** (Registrarse)
3. Ingrese su correo electrónico
4. Cree una contraseña segura
5. Elija un nombre de usuario (ejemplo: cootracovi)
6. Complete el proceso de verificación

**¡Listo! Ya tiene su cuenta de GitHub.**

---

## Paso 2: Crear Cuenta en Vercel

Vercel es el servicio que publicará su aplicación en internet de forma gratuita.

1. Vaya a [vercel.com](https://vercel.com)
2. Haga clic en **"Sign Up"** (Registrarse)
3. Seleccione **"Continue with GitHub"** (Continuar con GitHub)
4. Autorice la conexión con su cuenta de GitHub
5. Complete la información básica

**¡Listo! Ya tiene su cuenta de Vercel conectada a GitHub.**

---

## Paso 3: Subir el Código a GitHub

Esta es la parte donde el código de su aplicación se sube a GitHub. El equipo técnico le proporcionará los archivos del proyecto.

### Opción A: Si el equipo técnico le envió un archivo ZIP

1. Descomprima el archivo ZIP en su computadora
2. En GitHub, haga clic en el botón **"+"** y seleccione **"New repository"**
3. Nombre el repositorio: `cootracovi-disciplinarios`
4. Deje las opciones por defecto y haga clic en **"Create repository"**
5. En la página del repositorio, haga clic en **"uploading an existing file"**
6. Arrastre todos los archivos descomprimidos al área de carga
7. Haga clic en **"Commit changes"**

### Opción B: Si el equipo técnico le dio acceso directo al repositorio

Simplemente acepte la invitación que llegó a su correo.

---

## Paso 4: Desplegar en Vercel

Ahora vamos a publicar su aplicación en internet.

1. En Vercel, haga clic en **"Add New..."** → **"Project"**
2. Verá su repositorio `cootracovi-disciplinarios` en la lista
3. Haga clic en **"Import"**
4. Deje todas las opciones por defecto (no cambie nada)
5. Haga clic en **"Deploy"**

**Vercel comenzará a procesar su aplicación.** Esto tomará aproximadamente 2-5 minutos.

Verá una barra de progreso y al finalizar aparecerá un mensaje de felicitaciones.

---

## Paso 5: Configurar Variables de Entorno

Las variables de entorno son configuraciones privadas de la aplicación.

1. En el panel de Vercel, vaya a su proyecto
2. Haga clic en **"Settings"** (Configuración)
3. En el menú lateral, seleccione **"Environment Variables"**
4. Agregue las siguientes variables:

| Variable | Valor |
|----------|-------|
| `DATABASE_URL` | `file:./db/custom.db` |
| `NEXTAUTH_SECRET` | (Vercel lo genera automáticamente) |

**Nota:** La variable `DATABASE_URL` ya está configurada para usar SQLite.

---

## Paso 6: Verificar el Despliegue

1. En Vercel, haga clic en **"Deployments"**
2. Verá una URL como: `cootracovi-disciplinarios.vercel.app`
3. Haga clic en la URL para abrir su aplicación

**¡Felicidades! Su aplicación ya está en internet.**

---

## Preguntas Frecuentes

### ¿Cuánto cuesta mantener la aplicación?
El plan gratuito de Vercel es generoso para proyectos pequeños. Si COOTRACOVI crece significativamente, puede considerar un plan de pago, pero para el uso normal de una cooperativa de transporte, el plan gratuito es suficiente.

### ¿Puedo cambiar el nombre de la aplicación?
Sí. En Vercel:
1. Vaya a Settings → Domains
2. Puede agregar un dominio personalizado (ejemplo: `disciplinarios.cootracovi.com`)

### ¿Qué pasa si necesito hacer cambios?
Los cambios los debe realizar el equipo técnico. Una vez actualizado el código en GitHub, Vercel automáticamente publicará la nueva versión en 1-2 minutos.

### ¿Es segura la aplicación?
Sí. La aplicación:
- Usa HTTPS (conexión segura)
- Las contraseñas están encriptadas
- Los datos están protegidos
- La firma digital tiene validez legal según la Ley 527/1999

### ¿Dónde se guardan los datos?
Los datos se guardan en una base de datos SQLite dentro del proyecto. Para mayor seguridad y respaldo, se recomienda posteriormente migrar a una base de datos externa como PostgreSQL o MongoDB.

### ¿Puedo hacer respaldos de la información?
Sí. El equipo técnico puede configurar respaldos automáticos. Consulte con ellos para esta configuración adicional.

---

## Contacto de Soporte

Si tiene problemas con el despliegue, consulte con el equipo técnico que desarrolló la aplicación, o consulte la documentación oficial:

- [Documentación de Vercel](https://vercel.com/docs)
- [Documentación de GitHub](https://docs.github.com)

---

**Desarrollado para COOTRACOVI - Cooperativa de Transporte de Pasajeros Urbano**
