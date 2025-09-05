// Este endpoint gestiona el callback OAuth: intercambia el código por sesión, asegura la creación/actualización idempotente del perfil en Supabase y redirige al dashboard.
// Ubicación: app/auth/callback/route.ts

import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import randomAvatar from '@/lib/randomAvatar';
import type { TablesInsert } from '@/lib/types';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    const supabase = await supabaseServer();

    // Intercambia el código por sesión y la escribe en cookies
    await supabase.auth.exchangeCodeForSession(code);

    // Obtener usuario autenticado
    const { data } = await supabase.auth.getUser();
    const user = data.user;

    if (user?.id) {
      try {
        // Construimos el payload tipado para evitar el 'never'
        const payload: TablesInsert<'profiles'> = {
          id: user.id,
          email: user.email ?? null,
          full_name: (user.user_metadata as any)?.full_name ?? null,
          avatar_url: randomAvatar(user.email ?? ''),
          plan: 'free',
          // created_at es default now() en DB -> no lo enviamos
        };

        // Upsert idempotente por id (cast para evitar 'never' si el cliente no está tipado)
        const { error } = await (supabase
          .from('profiles') as any)
          .upsert([payload], { onConflict: 'id' });

        if (error) console.error('upsert profile failed', error);
      } catch (err) {
        console.error('upsert profile failed', err);
      }
    }
  }

  // Redirige al dashboard
  return NextResponse.redirect(new URL('/dashboard', request.url));
} 