export const dynamic = 'force-dynamic';
// Este endpoint gestiona la confirmación de magic link (PKCE y legacy) usando SSR para la sesión SSR.
// Ubicación: app/auth/confirm/route.ts

import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import type {
  VerifyEmailOtpParams,
  VerifyMobileOtpParams,
  EmailOtpType,
  MobileOtpType,
} from '@supabase/supabase-js';

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
      let e: any;  // eslint-disable-line @typescript-eslint/no-explicit-any
      if (type === 'sms' || type === 'phone_change') {
        // ----- OTP por SMS / phone -----
        const params: VerifyMobileOtpParams = {
          token,
          type: type as MobileOtpType,
          phone: url.searchParams.get('phone') ?? '',
        };
        ({ error: e } = await supabase.auth.verifyOtp(params));
      } else {
        // ----- OTP por e-mail ----------
        const params: VerifyEmailOtpParams = {
          token,
          type: type as EmailOtpType,
          email,
        };
        ({ error: e } = await supabase.auth.verifyOtp(params));
      }
      error = e?.code ?? null;
    }
  } catch (e: unknown) {
    error = (e as { code?: string }).code?.toString() ?? 'unknown';
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