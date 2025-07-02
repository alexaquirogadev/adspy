import { NextResponse, type NextRequest } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

export const config = {
  matcher: ['/dashboard/:path*', '/favorites', '/account'],
};

export async function middleware(req: NextRequest) {
  // 1. Instancia Supabase y espera a que se cree
  const supabase = await supabaseServer();

  // 2. Obtiene el usuario
  const { data: { user } } = await supabase.auth.getUser();

  // 3. Si no hay sesión, redirige a /auth/login
  if (!user) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = '/auth/login';
    return NextResponse.redirect(loginUrl);
  }

  // 4. Permitir la petición
  return NextResponse.next();
} 