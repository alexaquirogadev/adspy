export const dynamic = 'force-dynamic';
// Este endpoint gestiona la confirmación de magic link (PKCE y legacy) usando SSR para la sesión SSR.
// Ubicación: app/api/auth/confirm/route.ts

import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

export async function GET(req: Request) {
  const url   = new URL(req.url);
  const code  = url.searchParams.get('code');   // magic-link con PKCE
  const token = url.searchParams.get('token');  // magic-link legacy / recovery
  const type  = url.searchParams.get('type');   // optional: 'magiclink', 'recovery', …
  const email = url.searchParams.get('email') ?? '';

  let error: string | null = null;

  try {
    const supabase = await supabaseServer();
    if (code) {
      const { error: e } = await supabase.auth.exchangeCodeForSession(code);
      error = e?.code ?? null;
    } else if (token && type) {
      const { error: e } = await supabase.auth.verifyOtp({ token, type: type as any, email });
      error = e?.code ?? null;
    }
  } catch (e: any) {
    error = e?.code?.toString() ?? 'unknown';
  }

  // si hubo error ➜ login con query ?reason=expired
  if (error) {
    const loginUrl = new URL('/auth/login', url.origin);
    // mapear códigos de Supabase a razones legibles
    if (error === 'expired_token') loginUrl.searchParams.set('reason', 'expired');
    else                           loginUrl.searchParams.set('reason', 'invalid');
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.redirect(new URL('/dashboard', url.origin));
} 