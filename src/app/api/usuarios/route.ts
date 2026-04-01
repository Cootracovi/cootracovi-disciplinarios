import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Listar todos los usuarios
export async function GET() {
  try {
    const usuarios = await db.usuario.findMany({
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        activo: true,
        telefono: true,
        ultimoAcceso: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return NextResponse.json(
      { error: 'Error al obtener usuarios' },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo usuario
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { nombre, email, password, rol, telefono } = data;

    if (!nombre || !email || !password || !rol) {
      return NextResponse.json(
        { error: 'Nombre, email, contraseña y rol son requeridos' },
        { status: 400 }
      );
    }

    // Verificar si el email ya existe
    const existeUsuario = await db.usuario.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existeUsuario) {
      return NextResponse.json(
        { error: 'Ya existe un usuario con ese email' },
        { status: 400 }
      );
    }

    // Hashear contraseña
    const { hash } = await import('bcryptjs');
    const passwordHash = await hash(password, 10);

    const nuevoUsuario = await db.usuario.create({
      data: {
        nombre,
        email: email.toLowerCase(),
        password: passwordHash,
        rol,
        telefono: telefono || null,
      },
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        activo: true,
        telefono: true,
        createdAt: true,
      }
    });

    return NextResponse.json(nuevoUsuario, { status: 201 });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    return NextResponse.json(
      { error: 'Error al crear usuario' },
      { status: 500 }
    );
  }
}
