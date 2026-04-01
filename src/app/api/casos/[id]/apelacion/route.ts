import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// POST - Registrar una apelación
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: casoId } = await params;
    const data = await request.json();

    // Verificar que el caso existe
    const caso = await db.caso.findUnique({
      where: { id: casoId },
      include: { decisiones: true }
    });

    if (!caso) {
      return NextResponse.json({ error: 'Caso no encontrado' }, { status: 404 });
    }

    // Buscar la decisión de primera instancia
    const decisionPrimera = caso.decisiones.find(d => d.instancia === 'PRIMERA');
    
    if (!decisionPrimera) {
      return NextResponse.json({ error: 'No hay decisión de primera instancia para apelar' }, { status: 400 });
    }

    // Actualizar la decisión con la apelación
    await db.decision.update({
      where: { id: decisionPrimera.id },
      data: {
        apelacionSolicitada: true,
        apelacionArgumentos: data.argumentos,
        fechaApelacion: new Date()
      }
    });

    // Actualizar el caso
    await db.caso.update({
      where: { id: casoId },
      data: {
        estado: 'APELACION',
        etapaActual: 6,
        fechaApelacion: new Date()
      }
    });

    // Agregar al historial
    await db.historialEtapa.create({
      data: {
        casoId,
        etapa: 6,
        nombreEtapa: 'Apelación Solicitada',
        observacion: 'El indiciado ha solicitado apelación'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Apelación registrada exitosamente'
    });
  } catch (error) {
    console.error('Error al registrar apelación:', error);
    return NextResponse.json({ error: 'Error al registrar la apelación' }, { status: 500 });
  }
}
