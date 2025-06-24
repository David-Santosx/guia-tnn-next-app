import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();

  (await
        cookieStore).set({
    name: 'auth_token',
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
        });
  
        (await
          cookieStore).set({
      name: 'user_data',
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 0,
    });

  const loginUrl = new URL('/admin/auth/login', req.url);
  return NextResponse.redirect(loginUrl);
}