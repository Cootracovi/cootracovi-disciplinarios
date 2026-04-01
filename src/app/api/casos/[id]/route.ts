import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Obtener un caso específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const casoId = parseInt(id, 10);
    
    if (isNaN(casoId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }
    
    const caso = await db.caso.findUnique({
      where: { id: casoId },
      include: {
        indiciado: true,
        decisiones: {
          orderBy: { createdAt: 'asc' }
        },
        historial: {
          orderBy: { fecha: 'asc' }
        }
      }
    });

    if (!caso) {
      return NextResponse.json({ error: 'Caso no encontrado' }, { status: 404 });
    }

    // Formatear para el frontend
    const casoFormateado = {
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
      atenuantes: caso.atenuantes,
      agravantes: caso.agravantes,
      sancionesSugeridas: caso.sancionesSugeridas,
      estado: caso.estado,
      etapaActual: caso.etapaActual,
      responsable: caso.nombreResponsable,
      rolResponsable: caso.rolResponsable,
      fechaInicio: caso.fechaInicio.toISOString(),
      fechaNotificacion: caso.fechaNotificacion?.toISOString(),
      fechaDescargos: caso.fechaDescargos?.toISOString(),
      fechaDecision1: caso.fechaDecision1?.toISOString(),
      fechaApelacion: caso.fechaApelacion?.toISOString(),
      fechaDecision2: caso.fechaDecision2?.toISOString(),
      fechaCierre: caso.fechaCierre?.toISOString(),
      descargos: caso.descargos,
      firmaDigital: caso.firmaDigital,
      fotoCedula: caso.fotoCedula,
      aceptaTerminos: caso.aceptaTerminos,
      enlaceCapacitacion: caso.enlaceCapacitacion,
      capacitacionCompletada: caso.capacitacionCompletada,
      decision1: caso.decisiones.find(d => d.instancia === 'PRIMERA') ? {
        tipo: caso.decisiones.find(d => d.instancia === 'PRIMERA')?.tipoDecision,
        tipoSancion: caso.decisiones.find(d => d.instancia === 'PRIMERA')?.tipoSancion,
        diasSuspension: caso.decisiones.find(d => d.instancia === 'PRIMERA')?.diasSuspension,
        fundamentacion: caso.decisiones.find(d => d.instancia === 'PRIMERA')?.fundamentacion,
      } : null,
      decision2: caso.decisiones.find(d => d.instancia === 'SEGUNDA') ? {
        tipo: caso.decisiones.find(d => d.instancia === 'SEGUNDA')?.tipoDecision,
        tipoSancion: caso.decisiones.find(d => d.instancia === 'SEGUNDA')?.tipoSancion,
        diasSuspension: caso.decisiones.find(d => d.instancia === 'SEGUNDA')?.diasSuspension,
        fundamentacion: caso.decisiones.find(d => d.instancia === 'SEGUNDA')?.fundamentacion,
      } : null,
      apelacionSolicitada: caso.decisiones.some(d => d.apelacionSolicitada),
      apelacionArgumentos: caso.decisiones.find(d => d.apelacionSolicitada)?.apelacionArgumentos,
      historial: caso.historial.map(h => ({
        etapa: h.etapa,
        nombreEtapa: h.nombreEtapa,
        fecha: h.fecha.toISOString(),
        observacion: h.observacion
      }))
    };

    return NextResponse.json(casoFormateado);
  } catch (error) {
    console.error('Error al obtener caso:', error);
    return NextResponse.json({ error: 'Error al obtener el caso' }, { status: 500 });
  }
}

// PUT - Actualizar un caso (descargos, estado, etc.)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const casoId = parseInt(id, 10);
    
    if (isNaN(casoId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }
    
    const data = await request.json();

    const casoActual = await db.caso.findUnique({
      where: { id: casoId }
    });

    if (!casoActual) {
      return NextResponse.json({ error: 'Caso no encontrado' }, { status: 404 });
    }

    // Preparar datos de actualización
    const updateData: Record<string, unknown> = {};
    const historialData: { etapa: number; nombreEtapa: string; observacion: string }[] = [];

    // Si se están guardando descargos
    if (data.descargos !== undefined) {
      updateData.descargos = data.descargos;
      updateData.firmaDigital = data.firmaDigital;
      updateData.fotoCedula = data.fotoCedula;
      updateData.aceptaTerminos = data.aceptaTerminos;
      updateData.fechaDescargos = new Date();
      updateData.fechaAceptaTerminos = new Date();
      updateData.estado = 'CON_DESCARGOS';
      updateData.etapaActual = 4;
      
      historialData.push({
        etapa: 4,
        nombreEtapa: 'Descargos Recibidos',
        observacion: 'El indiciado ha presentado sus descargos'
      });
    }

    // Si se está notificando
    if (data.notificar) {
      updateData.fechaNotificacion = new Date();
      updateData.estado = 'PENDIENTE_DESCARGOS';
      updateData.etapaActual = 3;
      
      historialData.push({
        etapa: 3,
        nombreEtapa: 'Notificación Enviada',
        observacion: 'Se ha notificado al indiciado'
      });
    }

    // Si se está cerrando el caso
    if (data.cerrar) {
      updateData.estado = 'CERRADO';
      updateData.etapaActual = 8;
      updateData.fechaCierre = new Date();
      
      historialData.push({
        etapa: 8,
        nombreEtapa: 'Caso Cerrado',
        observacion: data.observacionCierre || 'Proceso disciplinario finalizado'
      });
    }

    // Actualizar el caso
    const casoActualizado = await db.caso.update({
      where: { id: casoId },
      data: updateData
    });

    // Crear registros de historial
    for (const hist of historialData) {
      await db.historialEtapa.create({
        data: {
          casoId: casoId,
          etapa: hist.etapa,
          nombreEtapa: hist.nombreEtapa,
          observacion: hist.observacion
        }
      });
    }

    return NextResponse.json({
      success: true,
      caso: casoActualizado
    });
  } catch (error) {
    console.error('Error al actualizar caso:', error);
    return NextResponse.json({ error: 'Error al actualizar el caso' }, { status: 500 });
  }
}
