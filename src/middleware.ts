import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Proteção para rotas administrativas
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Permitir acesso à página de login
    if (request.nextUrl.pathname === '/auth/login') {
      return NextResponse.next();
    }

    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('from', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      // Aqui você pode adicionar validação do token JWT se necessário
      return NextResponse.next();
    } catch (error) {
      console.error('Authentication error:', error);
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('error', 'Sessão expirada');
      return NextResponse.redirect(loginUrl);
    }
  }

  // Proteção para rotas de API
  if (request.nextUrl.pathname.startsWith('/api')) {
    // Lista de rotas públicas da API
    const publicRoutes = [
      '/api/auth/login',
      '/api/eventos',
      '/api/comercios',
      '/api/galeria'
    ];

    // Verificar se é uma rota pública
    if (publicRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
      return NextResponse.next();
    }

    // Verificar token para rotas protegidas
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/:path*'
  ],
};