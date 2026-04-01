import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando carga de datos iniciales...');

  // ==========================================
  // 1. Crear usuarios del sistema
  // ==========================================
  console.log('📝 Creando usuarios del sistema...');

  const passwordHash = await bcrypt.hash('Cootracovi2026!', 10);

  const usuarios = [
    {
      nombre: 'Líder de Operaciones',
      email: 'operaciones@cootracovi.com',
      password: passwordHash,
      rol: 'LIDER_OPERACIONES',
      activo: true
    },
    {
      nombre: 'Líder de Gestión Humana',
      email: 'ggrh@cootracovi.com',
      password: passwordHash,
      rol: 'LIDER_GGRH',
      activo: true
    },
    {
      nombre: 'Gerencia General',
      email: 'gerencia@cootracovi.com',
      password: passwordHash,
      rol: 'GERENCIA',
      activo: true
    },
    {
      nombre: 'Consejo de Administración',
      email: 'consejo@cootracovi.com',
      password: passwordHash,
      rol: 'CONSEJO_ADMINISTRACION',
      activo: true
    },
    {
      nombre: 'Comité de Apelaciones',
      email: 'apelaciones@cootracovi.com',
      password: passwordHash,
      rol: 'COMITE_APELACIONES',
      activo: true
    }
  ];

  for (const usuario of usuarios) {
    await prisma.usuario.upsert({
      where: { email: usuario.email },
      update: {},
      create: usuario
    });
  }

  console.log('   ✓ Usuarios creados');

  // ==========================================
  // 2. Crear enlaces de capacitación
  // ==========================================
  console.log('📝 Creando enlaces de capacitación...');

  const capacitaciones = [
    {
      nombre: 'Capacitación General - Normatividad Disciplinaria',
      descripcion: 'Capacitación obligatoria sobre el reglamento interno y proceso disciplinario para todos los asociados y empleados.',
      url: 'https://forms.office.com/PAGES/RESPONSEPAGE.ASPX?',
      tipoFalta: 'TODOS',
      grupoDestino: 'TODOS',
      duracionMinutos: 30,
      obligatorio: true,
      orden: 1
    },
    {
      nombre: 'Capacitación Conductores - Seguridad Vial',
      descripcion: 'Capacitación sobre normas de seguridad vial y Programa de Seguridad Vial (PESV).',
      url: 'https://forms.office.com/PAGES/RESPONSEPAGE.ASPX?',
      tipoFalta: 'LEVE',
      grupoDestino: 'EMPLEADO',
      duracionMinutos: 45,
      obligatorio: true,
      orden: 2
    },
    {
      nombre: 'Capacitación - Código de Ética y Buen Gobierno',
      descripcion: 'Formación sobre el código de ética, transparencia y buenas prácticas corporativas.',
      url: 'https://forms.office.com/PAGES/RESPONSEPAGE.ASPX?',
      tipoFalta: 'GRAVE',
      grupoDestino: 'TODOS',
      duracionMinutos: 60,
      obligatorio: true,
      orden: 3
    },
    {
      nombre: 'Capacitación Asociados - Estatutos',
      descripcion: 'Capacitación sobre los estatutos de la cooperativa y deberes de los asociados.',
      url: 'https://forms.office.com/PAGES/RESPONSEPAGE.ASPX?',
      tipoFalta: 'LEVE',
      grupoDestino: 'PROPIETARIO',
      duracionMinutos: 40,
      obligatorio: true,
      orden: 4
    },
    {
      nombre: 'Capacitación - Acoso Laboral y Prevención',
      descripcion: 'Capacitación obligatoria sobre prevención de acoso laboral y resolución de conflictos.',
      url: 'https://forms.office.com/PAGES/RESPONSEPAGE.ASPX?',
      tipoFalta: 'GRAVISIMA',
      grupoDestino: 'TODOS',
      duracionMinutos: 90,
      obligatorio: true,
      orden: 5
    }
  ];

  for (const cap of capacitaciones) {
    // Usar upsert por nombre para evitar duplicados
    await prisma.enlaceCapacitacion.upsert({
      where: { nombre: cap.nombre },
      update: {},
      create: cap
    });
  }

  console.log('   ✓ Capacitaciones creadas');

  // ==========================================
  // 3. Crear documentos normativos
  // ==========================================
  console.log('📝 Creando documentos normativos...');

  const documentos = [
    {
      nombre: 'Reglamento Interno de Trabajo',
      tipo: 'RIT',
      grupo: 'EMPLEADO',
      descripcion: 'Reglamento interno de trabajo para empleados de COOTRACOVI. Incluye faltas, sanciones y procedimientos disciplinarios.',
      activo: true
    },
    {
      nombre: 'Estatutos de la Cooperativa',
      tipo: 'ESTATUTO',
      grupo: 'PROPIETARIO',
      descripcion: 'Estatutos vigentes de la Cooperativa COOTRACOVI. Define deberes y obligaciones de asociados y afiliados.',
      activo: true
    },
    {
      nombre: 'Código de Ética',
      tipo: 'ETICA',
      grupo: 'AMBOS',
      descripcion: 'Código de ética y conducta para todos los miembros de la cooperativa.',
      activo: true
    },
    {
      nombre: 'Código de Buen Gobierno',
      tipo: 'BUEN_GOBIERNO',
      grupo: 'AMBOS',
      descripcion: 'Código de buen gobierno corporativo de la cooperativa.',
      activo: true
    },
    {
      nombre: 'Programa de Seguridad Vial (PESV)',
      tipo: 'PESV',
      grupo: 'EMPLEADO',
      descripcion: 'Programa de seguridad vial para conductores y personal operativo.',
      activo: true
    },
    {
      nombre: 'Programa de SST',
      tipo: 'PSST',
      grupo: 'EMPLEADO',
      descripcion: 'Programa de seguridad y salud en el trabajo.',
      activo: true
    },
    {
      nombre: 'Contrato de Uso de Ruta',
      tipo: 'CONTRATO',
      grupo: 'PROPIETARIO',
      descripcion: 'Términos y condiciones del contrato de uso de ruta para propietarios.',
      activo: true
    }
  ];

  for (const doc of documentos) {
    await prisma.documentoNormativo.upsert({
      where: { nombre: doc.nombre },
      update: {},
      create: doc
    });
  }

  console.log('   ✓ Documentos normativos creados');

  // ==========================================
  // 4. Crear configuraciones del sistema
  // ==========================================
  console.log('📝 Creando configuraciones del sistema...');

  const configuraciones = [
    {
      clave: 'DIAS_LIMITE_DESCARGOS',
      valor: '5',
      descripcion: 'Días hábiles para presentar descargos',
      tipo: 'NUMBER'
    },
    {
      clave: 'DIAS_LIMITE_APELACION',
      valor: '5',
      descripcion: 'Días hábiles para interponer apelación',
      tipo: 'NUMBER'
    },
    {
      clave: 'NOTIFICACION_AUTOMATICA',
      valor: 'true',
      descripcion: 'Enviar notificaciones automáticas por email',
      tipo: 'BOOLEAN'
    },
    {
      clave: 'LOGO_URL',
      valor: 'https://i.ibb.co/F4313WXS/LOGO-COOTRACOVI-ODS.jpg',
      descripcion: 'URL del logo de la cooperativa',
      tipo: 'STRING'
    },
    {
      clave: 'NOMBRE_ORGANIZACION',
      valor: 'COOTRACOVI',
      descripcion: 'Nombre de la organización',
      tipo: 'STRING'
    },
    {
      clave: 'TELEFONO_CONTACTO',
      valor: '',
      descripcion: 'Teléfono de contacto para notificaciones',
      tipo: 'STRING'
    },
    {
      clave: 'DIRECCION_ORGANIZACION',
      valor: '',
      descripcion: 'Dirección de la cooperativa',
      tipo: 'STRING'
    }
  ];

  for (const config of configuraciones) {
    await prisma.configuracion.upsert({
      where: { clave: config.clave },
      update: {},
      create: config
    });
  }

  console.log('   ✓ Configuraciones creadas');

  console.log('\n✅ Datos iniciales cargados exitosamente');
  console.log('\n📋 Credenciales de acceso:');
  console.log('   Email: operaciones@cootracovi.com');
  console.log('   Password: Cootracovi2026!');
  console.log('\n   (Cambie las contraseñas después del primer inicio)');
}

main()
  .catch((e) => {
    console.error('❌ Error al cargar datos:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
