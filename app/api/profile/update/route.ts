import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

/** Devuelve una URL de avatar SVG única */
function randomAvatar() {
  const seed = Math.random().toString(36).slice(2, 10);
  return `https://source.boringavatars.com/beam/160/${seed}?colors=ff006f,fff538,00d1ff,000000,f1f1f1`;
}

// Endpoint para actualizar el perfil del usuario autenticado (full_name, avatar_url)
// Ubicación: /app/api/profile/update/route.ts
// Responde con { success: true } o { error }
export async function POST(req: Request) {
  const { full_name, email } = await req.json();        // avatar lo generamos aquí si falta
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });

  // Lee avatar actual; si está vacío genera uno nuevo
  const current = await supabase
    .from('profiles')
    .select('avatar_url')
    .eq('id', user.id)
    .single();

  const avatar_url = current.data?.avatar_url || randomAvatar();

  const { error: errProfile } = await supabase
    .from('profiles')
    .update({ full_name, avatar_url })
    .eq('id', user.id);

  let errEmail = null;
  if (email && email !== user.email) {
    const { error } = await supabase.auth.updateUser({ email });
    errEmail = error;
  }

  if (errProfile || errEmail) return NextResponse.json({ error: errProfile || errEmail }, { status: 400 });
  return NextResponse.json({ success: true, avatar_url });
} 