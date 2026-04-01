import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Listar enlaces de capacitación
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tipoFalta = searchParams.get('tipoFalta');
    const grupo = searchParams.get('grupo');

    const where: Record<string, unknown> = { activo: true };
    
    if (tipoFalta && tipoFalta !== 'TODOS') {
      where.OR = [
        { tipoFalta },
        { tipoFalta: 'TODOS' }
      ];
    }
    
    if (grupo && grupo !== 'TODOS') {
      where.OR = [
        { grupoDestino: grupo },
        { grupoDestino: 'TODOS' }
      ];
    }

    const enlaces = await db.enlaceCapacitacion.findMany({
      where,
      orderBy: { orden: 'asc' }
    });

    return NextResponse.json(enlaces);
  } catch (error) {
    console.error('Error al obtener enlaces de capacitación:', error);
    return NextResponse.json({ error: 'Error al obtener enlaces' }, { status: 500 });
  }
}

// POST - Crear nuevo enlace de capacitación
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const enlace = await db.enlaceCapacitacion.create({
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion,
        url: data.url,
        tipoFalta: data.tipoFalta || 'TODOS',
        grupoDestino: data.grupoDestino || 'TODOS',
        duracionMinutos: data.duracionMinutos,
        obligatorio: data.obligatorio ?? true,
        orden: data.orden || 0
      }
    });

    return NextResponse.json(enlace);
  } catch (error) {
    console.error('Error al crear enlace de capacitación:', error);
    return NextResponse.json({ error: 'Error al crear enlace' }, { status: 500 });
  }
}

// PUT - Actualizar enlace de capacitación
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();

    if (!data.id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    }

    const enlace = await db.enlaceCapacitacion.update({
      where: { id: data.id },
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion,
        url: data.url,
        tipoFalta: data.tipoFalta,
        grupoDestino: data.grupoDestino,
        duracionMinutos: data.duracionMinutos,
        obligatorio: data.obligatorio,
        orden: data.orden,
        activo: data.activo
      }
    });

    return NextResponse.json(enlace);
  } catch (error) {
    console.error('Error al actualizar enlace:', error);
    return NextResponse.json({ error: 'Error al actualizar enlace' }, { status: 500 });
  }
}

// DELETE - Eliminar (desactivar) enlace de capacitación
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    }

    await db.enlaceCapacitacion.update({
      where: { id },
      data: { activo: false }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al eliminar enlace:', error);
    return NextResponse.json({ error: 'Error al eliminar enlace' }, { status: 500 });
  }
}
