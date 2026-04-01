import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Generar informe de casos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const formato = searchParams.get('formato') || 'json';
    const fechaInicio = searchParams.get('fechaInicio');
    const fechaFin = searchParams.get('fechaFin');
    const estado = searchParams.get('estado');
    const grupo = searchParams.get('grupo');

    // Construir filtros
    const where: Record<string, unknown> = {};
    
    if (fechaInicio || fechaFin) {
      where.fechaInicio = {};
      if (fechaInicio) {
        where.fechaInicio.gte = new Date(fechaInicio);
      }
      if (fechaFin) {
        where.fechaInicio.lte = new Date(fechaFin);
      }
    }
    
    if (estado && estado !== 'todos') {
      where.estado = estado;
    }

    // Obtener casos con relaciones
    const casos = await db.caso.findMany({
      where,
      include: {
        indiciado: true,
        decisiones: true,
        historial: {
          orderBy: { fecha: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Filtrar por grupo si se especifica
    let casosFiltrados = casos;
    if (grupo && grupo !== 'todos') {
      casosFiltrados = casos.filter(c => c.indiciado.grupo === grupo);
    }

    // Calcular estadísticas
    const estadisticas = {
      totalCasos: casosFiltrados.length,
      porEstado: {} as Record<string, number>,
      porGravedad: {} as Record<string, number>,
      porGrupo: {} as Record<string, number>,
      porRol: {} as Record<string, number>,
      porMes: {} as Record<string, number>,
      tiempoPromedioResolucion: 0,
      tasaAbsolucion: 0,
      tasaSancion: 0
    };

    let diasResolucionTotal = 0;
    let casosConResolucion = 0;
    let absoluciones = 0;
    let sanciones = 0;

    casosFiltrados.forEach(caso => {
      // Por estado
      estadisticas.porEstado[caso.estado] = (estadisticas.porEstado[caso.estado] || 0) + 1;
      
      // Por gravedad
      if (caso.gravedadFalta) {
        estadisticas.porGravedad[caso.gravedadFalta] = (estadisticas.porGravedad[caso.gravedadFalta] || 0) + 1;
      }
      
      // Por grupo
      estadisticas.porGrupo[caso.indiciado.grupo] = (estadisticas.porGrupo[caso.indiciado.grupo] || 0) + 1;
      
      // Por rol
      estadisticas.porRol[caso.indiciado.rol] = (estadisticas.porRol[caso.indiciado.rol] || 0) + 1;
      
      // Por mes
      const mes = caso.fechaInicio.toISOString().slice(0, 7);
      estadisticas.porMes[mes] = (estadisticas.porMes[mes] || 0) + 1;
      
      // Tiempo de resolución
      if (caso.fechaCierre) {
        const dias = Math.floor((caso.fechaCierre.getTime() - caso.fechaInicio.getTime()) / (1000 * 60 * 60 * 24));
        diasResolucionTotal += dias;
        casosConResolucion++;
      }
      
      // Decisiones
      const decision1 = caso.decisiones.find(d => d.instancia === 'PRIMERA');
      if (decision1) {
        if (decision1.tipoDecision === 'ABSOLVER') absoluciones++;
        if (decision1.tipoDecision === 'SANCIONAR') sanciones++;
      }
    });

    // Calcular promedios y tasas
    estadisticas.tiempoPromedioResolucion = casosConResolucion > 0 
      ? Math.round(diasResolucionTotal / casosConResolucion) 
      : 0;
    
    const totalDecisiones = absoluciones + sanciones;
    estadisticas.tasaAbsolucion = totalDecisiones > 0 
      ? Math.round((absoluciones / totalDecisiones) * 100) 
      : 0;
    estadisticas.tasaSancion = totalDecisiones > 0 
      ? Math.round((sanciones / totalDecisiones) * 100) 
      : 0;

    // Preparar datos para exportación
    const datosExportacion = casosFiltrados.map(caso => ({
      numeroCaso: caso.numeroCaso,
      fechaInicio: caso.fechaInicio.toISOString().split('T')[0],
      fechaCierre: caso.fechaCierre?.toISOString().split('T')[0] || 'En proceso',
      indiciado: {
        identificacion: caso.indiciado.identificacion,
        nombre: caso.indiciado.nombre,
        rol: caso.indiciado.rol,
        grupo: caso.indiciado.grupo
      },
      descripcionSuceso: caso.descripcionSuceso,
      faltaIdentificada: caso.faltaIdentificada || 'Sin análisis',
      gravedadFalta: caso.gravedadFalta || 'Sin determinar',
      estado: caso.estado,
      etapaActual: caso.etapaActual,
      decision1: caso.decisiones.find(d => d.instancia === 'PRIMERA') ? {
        tipo: caso.decisiones.find(d => d.instancia === 'PRIMERA')?.tipoDecision,
        sancion: caso.decisiones.find(d => d.instancia === 'PRIMERA')?.tipoSancion,
        fecha: caso.decisiones.find(d => d.instancia === 'PRIMERA')?.fecha.toISOString().split('T')[0]
      } : null,
      decision2: caso.decisiones.find(d => d.instancia === 'SEGUNDA') ? {
        tipo: caso.decisiones.find(d => d.instancia === 'SEGUNDA')?.tipoDecision,
        sancion: caso.decisiones.find(d => d.instancia === 'SEGUNDA')?.tipoSancion,
        fecha: caso.decisiones.find(d => d.instancia === 'SEGUNDA')?.fecha.toISOString().split('T')[0]
      } : null,
      apelacion: caso.decisiones.some(d => d.apelacionSolicitada),
      responsable: caso.nombreResponsable || caso.responsable
    }));

    // Responder según formato
    if (formato === 'csv') {
      // Generar CSV
      const headers = [
        'No. Caso', 'Fecha Inicio', 'Fecha Cierre', 'Identificación', 
        'Nombre Indiciado', 'Rol', 'Grupo', 'Descripción', 'Falta', 
        'Gravedad', 'Estado', 'Decisión 1ª', 'Sanción', 'Apelacion', 'Responsable'
      ];
      
      const rows = datosExportacion.map(c => [
        c.numeroCaso,
        c.fechaInicio,
        c.fechaCierre,
        c.indiciado.identificacion,
        c.indiciado.nombre,
        c.indiciado.rol,
        c.indiciado.grupo,
        `"${c.descripcionSuceso.replace(/"/g, '""')}"`,
        `"${c.faltaIdentificada.replace(/"/g, '""')}"`,
        c.gravedadFalta,
        c.estado,
        c.decision1?.tipo || '',
        c.decision1?.sancion || '',
        c.apelacion ? 'Sí' : 'No',
        c.responsable
      ]);
      
      const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="informe_disciplinarios_${new Date().toISOString().split('T')[0]}.csv"`
        }
      });
    }

    // JSON por defecto
    return NextResponse.json({
      estadisticas,
      casos: datosExportacion,
      generado: new Date().toISOString(),
      filtros: { fechaInicio, fechaFin, estado, grupo }
    });
  } catch (error) {
    console.error('Error al generar informe:', error);
    return NextResponse.json({ error: 'Error al generar informe' }, { status: 500 });
  }
}
