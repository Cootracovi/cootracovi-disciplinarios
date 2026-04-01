import { NextResponse } from 'next/server';

// POST - Cerrar sesión
export async function POST() {
  try {
    const response = NextResponse.json({ success: true });
    
    // Eliminar cookie de sesión
    response.cookies.set('session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error en logout:', error);
    return NextResponse.json(
      { error: 'Error al cerrar sesión' },
      { status: 500 }
    );
  }
}
