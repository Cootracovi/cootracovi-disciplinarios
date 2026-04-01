import { NextRequest, NextResponse } from 'next/server';

// GET - Verificar sesión activa
export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('session');

    if (!sessionCookie?.value) {
      return NextResponse.json(
        { authenticated: false, usuario: null },
        { status: 200 }
      );
    }

    try {
      const usuario = JSON.parse(sessionCookie.value);
      return NextResponse.json({
        authenticated: true,
        usuario
      });
    } catch {
      return NextResponse.json(
        { authenticated: false, usuario: null },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('Error verificando sesión:', error);
    return NextResponse.json(
      { authenticated: false, usuario: null },
      { status: 200 }
    );
  }
}
