import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  // Intercambia el código por la sesión y la escribe en cookies
  const code = searchParams.get('code');
  if (code) {
    const supabase = await supabaseServer();
    await supabase.auth.exchangeCodeForSession(code);
  }
  // Redirige al dashboard o a la página original si la traes por query
  return NextResponse.redirect(new URL('/dashboard', request.url));
} 