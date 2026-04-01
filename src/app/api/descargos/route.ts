import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// POST - Guardar descargos del indiciado
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { token, descargos, firmaDigital, fotoCedula, aceptaTerminos } = data;

    if (!token || !descargos || !firmaDigital || !fotoCedula || !aceptaTerminos) {
      return NextResponse.json({ 
        error: 'Todos los campos son requeridos' 
      }, { status: 400 });
    }

    // Decodificar el token (es el ID del caso en base64)
    let casoId: string;
    try {
      casoId = Buffer.from(token, 'base64').toString('utf-8');
    } catch {
      return NextResponse.json({ error: 'Token inválido' }, { status: 400 });
    }

    // Verificar que el caso existe y está pendiente de descargos
    const caso = await db.caso.findUnique({
      where: { id: casoId }
    });

    if (!caso) {
      return NextResponse.json({ error: 'Caso no encontrado' }, { status: 404 });
    }

    if (caso.estado !== 'PENDIENTE_DESCARGOS') {
      return NextResponse.json({ 
        error: 'Este caso ya no acepta descargos' 
      }, { status: 400 });
    }

    // Guardar los descargos
    await db.caso.update({
      where: { id: casoId },
      data: {
        descargos,
        firmaDigital,
        fotoCedula,
        aceptaTerminos,
        fechaDescargos: new Date(),
        fechaAceptaTerminos: new Date(),
        estado: 'CON_DESCARGOS',
        etapaActual: 4
      }
    });

    // Agregar al historial
    await db.historialEtapa.create({
      data: {
        casoId,
        etapa: 4,
        nombreEtapa: 'Descargos Recibidos',
        observacion: 'El indiciado ha presentado sus descargos con firma digital y foto de cédula'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Descargos registrados exitosamente'
    });
  } catch (error) {
    console.error('Error al guardar descargos:', error);
    return NextResponse.json({ error: 'Error al guardar los descargos' }, { status: 500 });
  }
}
