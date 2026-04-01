import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { compare } from 'bcryptjs';

// POST - Iniciar sesión
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Buscar usuario
    const usuario = await db.usuario.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!usuario) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    if (!usuario.activo) {
      return NextResponse.json(
        { error: 'Usuario inactivo. Contacte al administrador.' },
        { status: 403 }
      );
    }

    // Verificar contraseña
    const passwordValido = await compare(password, usuario.password);

    if (!passwordValido) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Actualizar último acceso
    await db.usuario.update({
      where: { id: usuario.id },
      data: { ultimoAcceso: new Date() }
    });

    // Crear sesión (sin password) - ID como número
    const usuarioSession = {
      id: usuario.id,  // Ahora es número
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
    };

    // Crear respuesta con cookie
    const response = NextResponse.json({
      success: true,
      usuario: usuarioSession
    });

    // Cookie segura para la sesión (dura 24 horas)
    response.cookies.set('session', JSON.stringify(usuarioSession), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 horas
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
