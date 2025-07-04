// Este endpoint gestiona el callback OAuth: intercambia el código por sesión, asegura la creación/actualización idempotente del perfil en Supabase y redirige al dashboard.
// Ubicación: app/auth/callback/route.ts

import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import randomAvatar from '@/lib/randomAvatar';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  // Intercambia el código por la sesión y la escribe en cookies
  const code = searchParams.get('code');
  let user = null;
  if (code) {
    const supabase = await supabaseServer();
    await supabase.auth.exchangeCodeForSession(code);
    // Obtener usuario autenticado
    const { data } = await supabase.auth.getUser();
    user = data.user;
    if (user?.id) {
      try {
        // Upsert idempotente en la tabla profiles
        const { error } = await supabase.from('profiles').upsert(
          {
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name ?? '',
            avatar_url: randomAvatar(user.email),
            plan: 'free',
          },
          { onConflict: 'id' }
        );
        if (error) {
          console.error('upsert profile failed', error);
        }
      } catch (err) {
        console.error('upsert profile failed', err);
      }
    }
  }
  // Redirige al dashboard
  return NextResponse.redirect(new URL('/dashboard', request.url));
} 