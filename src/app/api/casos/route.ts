import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Listar todos los casos
export async function GET(request: NextRequest) {
  try {
    const casos = await db.caso.findMany({
      include: {
        indiciado: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transformar datos para el frontend
    const casosFormateados = casos.map(caso => ({
      id: caso.id,
      numeroCaso: caso.numeroCaso,
      indiciadoId: caso.indiciadoId,
      indiciadoNombre: caso.indiciado.nombre,
      indiciadoIdentificacion: caso.indiciado.identificacion,
      indiciadoRol: caso.indiciado.rol,
      indiciadoGrupo: caso.indiciado.grupo,
      fechaSuceso: caso.fechaSuceso.toISOString(),
      descripcionSuceso: caso.descripcionSuceso,
      faltaIdentificada: caso.faltaIdentificada,
      gravedadFalta: caso.gravedadFalta,
      articulosVulnerados: caso.articulosVulnerados,
      estado: caso.estado,
      etapaActual: caso.etapaActual,
      responsable: caso.nombreResponsable,
      rolResponsable: caso.rolResponsable,
      fechaInicio: caso.fechaInicio.toISOString(),
      descargos: caso.descargos,
      firmaDigital: caso.firmaDigital,
      fotoCedula: caso.fotoCedula,
      decision1: null,
      decision2: null,
      apelacionSolicitada: false,
      apelacionArgumentos: null,
    }));

    return NextResponse.json(casosFormateados);
  } catch (error) {
    console.error('Error al obtener casos:', error);
    return NextResponse.json({ error: 'Error al obtener casos' }, { status: 500 });
  }
}

// POST - Crear nuevo caso
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Generar número de caso
    const año = new Date().getFullYear();
    const casosExistentes = await db.caso.count();
    const numeroCaso = `PD-${año}-${String(casosExistentes + 1).padStart(4, '0')}`;

    // Crear o buscar indiciado
    let indiciado = await db.indiciado.findUnique({
      where: { identificacion: data.identificacion }
    });

    if (!indiciado) {
      indiciado = await db.indiciado.create({
        data: {
          identificacion: data.identificacion,
          nombre: data.nombreIndiciado,
          rol: data.rolIndiciado,
          grupo: data.grupoIndiciado,
        }
      });
    }

    // Crear usuario temporal si no existe
    let usuario = await db.usuario.findFirst();
    if (!usuario) {
      usuario = await db.usuario.create({
        data: {
          nombre: data.responsable,
          email: `${data.responsable.toLowerCase().replace(/\s/g, '.')}@cootracovi.com`,
          password: 'temp',
          rol: data.rolResponsable,
        }
      });
    }

    // Crear el caso
    const nuevoCaso = await db.caso.create({
      data: {
        numeroCaso,
        fechaSuceso: new Date(data.fechaSuceso),
        descripcionSuceso: data.descripcionSuceso,
        faltaIdentificada: data.faltaIdentificada || null,
        gravedadFalta: data.gravedad || null,
        articulosVulnerados: data.articulos || null,
        atenuantes: data.atenuantes || null,
        agravantes: data.agravantes || null,
        sancionesSugeridas: data.sancionesSugeridas || null,
        estado: data.faltaIdentificada ? 'PENDIENTE_NOTIFICACION' : 'INICIADO',
        etapaActual: data.faltaIdentificada ? 2 : 1,
        indiciadoId: indiciado.id,
        responsableId: usuario.id,
        nombreResponsable: data.responsable,
        rolResponsable: data.rolResponsable,
        analisisGenerado: data.faltaIdentificada ? new Date() : null,
      },
      include: {
        indiciado: true,
      }
    });

    // Crear registro en historial
    await db.historialEtapa.create({
      data: {
        casoId: nuevoCaso.id,
        etapa: 1,
        nombreEtapa: 'Inicio del Proceso',
        observacion: 'Caso registrado en el sistema',
      }
    });

    // Si hay análisis de IA, actualizar etapa
    if (data.faltaIdentificada) {
      await db.historialEtapa.create({
        data: {
          casoId: nuevoCaso.id,
          etapa: 2,
          nombreEtapa: 'Análisis con IA',
          observacion: `Falta identificada: ${data.faltaIdentificada}`,
        }
      });
    }

    return NextResponse.json({
      id: nuevoCaso.id,
      numeroCaso: nuevoCaso.numeroCaso,
      indiciadoId: nuevoCaso.indiciadoId,
      indiciadoNombre: nuevoCaso.indiciado.nombre,
      indiciadoIdentificacion: nuevoCaso.indiciado.identificacion,
      indiciadoRol: nuevoCaso.indiciado.rol,
      indiciadoGrupo: nuevoCaso.indiciado.grupo,
      fechaSuceso: nuevoCaso.fechaSuceso.toISOString(),
      descripcionSuceso: nuevoCaso.descripcionSuceso,
      faltaIdentificada: nuevoCaso.faltaIdentificada,
      gravedadFalta: nuevoCaso.gravedadFalta,
      articulosVulnerados: nuevoCaso.articulosVulnerados,
      estado: nuevoCaso.estado,
      etapaActual: nuevoCaso.etapaActual,
      responsable: nuevoCaso.nombreResponsable,
      rolResponsable: nuevoCaso.rolResponsable,
      fechaInicio: nuevoCaso.fechaInicio.toISOString(),
      descargos: null,
      firmaDigital: null,
      fotoCedula: null,
      decision1: null,
      decision2: null,
      apelacionSolicitada: false,
      apelacionArgumentos: null,
    });

  } catch (error) {
    console.error('Error al crear caso:', error);
    return NextResponse.json({ error: 'Error al crear el caso' }, { status: 500 });
  }
}
