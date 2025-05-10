import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {

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
  matcher: ['/admin/:path*'],
};