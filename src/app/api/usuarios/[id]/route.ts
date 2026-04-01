import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hash } from 'bcryptjs';

// GET - Obtener usuario por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const usuarioId = parseInt(id, 10);
    
    if (isNaN(usuarioId)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }
    
    const usuario = await db.usuario.findUnique({
      where: { id: usuarioId },
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        activo: true,
        telefono: true,
        ultimoAcceso: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    if (!usuario) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(usuario);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    return NextResponse.json(
      { error: 'Error al obtener usuario' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar usuario
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const usuarioId = parseInt(id, 10);
    
    if (isNaN(usuarioId)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }
    
    const data = await request.json();
    const { nombre, email, password, rol, telefono, activo } = data;

    const updateData: Record<string, unknown> = {};

    if (nombre) updateData.nombre = nombre;
    if (email) updateData.email = email.toLowerCase();
    if (rol) updateData.rol = rol;
    if (telefono !== undefined) updateData.telefono = telefono || null;
    if (activo !== undefined) updateData.activo = activo;
    
    // Solo actualizar password si se proporciona uno nuevo
    if (password && password.trim() !== '') {
      updateData.password = await hash(password, 10);
    }

    const usuarioActualizado = await db.usuario.update({
      where: { id: usuarioId },
      data: updateData,
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        activo: true,
        telefono: true,
        updatedAt: true,
      }
    });

    return NextResponse.json(usuarioActualizado);
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    return NextResponse.json(
      { error: 'Error al actualizar usuario' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar usuario
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const usuarioId = parseInt(id, 10);
    
    if (isNaN(usuarioId)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }

    await db.usuario.delete({
      where: { id: usuarioId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    return NextResponse.json(
      { error: 'Error al eliminar usuario' },
      { status: 500 }
    );
  }
}
