export const dynamic = 'force-dynamic';
// Handler de callback OAuth: intercambia el código por sesión usando SSR y redirige al dashboard.
// Ubicación: app/api/auth/callback/route.ts

import { NextResponse, type NextRequest } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

export async function GET(req: NextRequest) {
  const requestUrl = new URL(req.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = await supabaseServer();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(new URL('/dashboard', req.url));
} 