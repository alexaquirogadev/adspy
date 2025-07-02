// lib/supabaseServer.ts
import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import type { Database } from '@/lib/types';

/**
 * Devuelve un cliente Supabase listo para Server Components,
 * Route Handlers y Middleware, usando la API asíncrona de cookies().
 */
export async function supabaseServer() {
  const cookieStore = await cookies(); // 👈 ahora se hace await

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // lee TODAS las cookies de la request ↩️
        getAll() {
          return cookieStore.getAll().map(c => ({ name: c.name, value: c.value }));
        },
        // escribe TODAS las cookies en la response ↪️
        setAll(cookies) {
          cookies.forEach(({ name, value, options }) =>
            cookieStore.set({ name, value, ...options } as CookieOptions & { name: string; value: string })
          );
        },
      },
    }
  );
}