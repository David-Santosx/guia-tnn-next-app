import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Proteção CORS para rotas de API
  if (request.nextUrl.pathname.startsWith('/api')) {
    const origin = request.headers.get('origin');
    const allowedOrigin = process.env.NEXT_PUBLIC_URL || '';
    
    // Verificar se a origem da requisição é permitida
    // Permitir requisições sem origem (como do Postman) em ambiente de desenvolvimento
    if (origin && origin !== allowedOrigin && process.env.NODE_ENV === 'production') {
      return new NextResponse(null, {
        status: 403,
        statusText: 'Forbidden',
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    }
    
    // Permitir a requisição se a origem for válida ou não existir
    return NextResponse.next({
      headers: {
        'Access-Control-Allow-Origin': origin || '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      },
    });
  }
  
  // Proteção para rotas administrativas
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (request.nextUrl.pathname.startsWith('/auth/login')) {
      return NextResponse.next();
    }

    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    try {
      
      return NextResponse.next();
    } catch (error) {
      console.error('Authentication error:', error);
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
};