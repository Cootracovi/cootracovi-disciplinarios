import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Total de casos
    const totalCasos = await db.caso.count();
    
    // Casos por estado
    const casosPorEstado = await db.caso.groupBy({
      by: ['estado'],
      _count: { id: true },
    });
    
    // Contar estados específicos
    const estadoMap = new Map(casosPorEstado.map(e => [e.estado, e._count.id]));
    
    const casosActivos = totalCasos - (estadoMap.get('CERRADO') || 0);
    const casosCerrados = estadoMap.get('CERRADO') || 0;
    const pendientesDescargos = estadoMap.get('PENDIENTE_DESCARGOS') || 0;
    const pendientesDecision = estadoMap.get('CON_DESCARGOS') || 0;
    const enApelacion = estadoMap.get('APELACION') || 0;

    return NextResponse.json({
      totalCasos,
      casosActivos,
      casosCerrados,
      pendientesDescargos,
      pendientesDecision,
      enApelacion,
      porRol: [],
      porEstado: casosPorEstado.map(e => ({ estado: e.estado, cantidad: e._count.id })),
    });

  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    return NextResponse.json({ 
      totalCasos: 0,
      casosActivos: 0,
      casosCerrados: 0,
      pendientesDescargos: 0,
      pendientesDecision: 0,
      enApelacion: 0,
      porRol: [],
      porEstado: [],
    });
  }
}
