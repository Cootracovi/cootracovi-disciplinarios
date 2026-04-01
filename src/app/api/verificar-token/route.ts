import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Verificar token y obtener información del caso para descargos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Token requerido' }, { status: 400 });
    }

    // Decodificar el token (es el ID del caso en base64)
    let casoId: string;
    try {
      casoId = Buffer.from(token, 'base64').toString('utf-8');
    } catch {
      return NextResponse.json({ error: 'Token inválido' }, { status: 400 });
    }

    // Buscar el caso
    const caso = await db.caso.findUnique({
      where: { id: casoId },
      include: {
        indiciado: true
      }
    });

    if (!caso) {
      return NextResponse.json({ error: 'Caso no encontrado' }, { status: 404 });
    }

    // Verificar que el caso está en estado pendiente de descargos
    if (caso.estado !== 'PENDIENTE_DESCARGOS') {
      return NextResponse.json({ 
        error: 'Este caso ya no está disponible para descargos',
        estado: caso.estado 
      }, { status: 400 });
    }

    // Devolver información del caso para el formulario de descargos
    return NextResponse.json({
      casoId: caso.id,
      numeroCaso: caso.numeroCaso,
      indiciadoNombre: caso.indiciado.nombre,
      indiciadoIdentificacion: caso.indiciado.identificacion,
      fechaSuceso: caso.fechaSuceso.toISOString(),
      descripcionSuceso: caso.descripcionSuceso,
      faltaIdentificada: caso.faltaIdentificada,
      gravedadFalta: caso.gravedadFalta,
      descargosYaPresentados: !!caso.descargos
    });
  } catch (error) {
    console.error('Error al verificar token:', error);
    return NextResponse.json({ error: 'Error al verificar el token' }, { status: 500 });
  }
}
