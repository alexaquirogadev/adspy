import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export const config = {
  matcher: ['/dashboard/:path*', '/favorites', '/account'],
};

export async function middleware(req: NextRequest) {
  // Preparamos la response para poder setear cookies
  const res = NextResponse.next();

  // Cliente Supabase Edge-safe usando cookies del request/response
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          // Next 15: req.cookies.getAll() devuelve { name, value }
          return req.cookies.getAll().map((c) => ({ name: c.name, value: c.value }));
        },
        setAll(cookies) {
          cookies.forEach(({ name, value, options }) => {
            res.cookies.set({ name, value, ...(options as CookieOptions) });
          });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // 3. Si no hay sesión, redirige a /auth/login
  if (!user) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = '/auth/login';
    // conserva destino original
    loginUrl.searchParams.set('next', req.nextUrl.pathname + req.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  // 4. Permitir la petición (y devolver cookies actualizadas)
  return res;
} 