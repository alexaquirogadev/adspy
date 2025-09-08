// Cliente Supabase admin con inicialización diferida (lazy) usando Proxy.
// Mantiene el mismo import { supabaseAdmin } evitando explotar en build.
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let _client: SupabaseClient | null = null;
function ensure(): SupabaseClient {
  if (_client) return _client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    // Se evalúa SOLO cuando alguien usa el cliente (en runtime), no en build.
    throw new Error('Missing Supabase admin envs (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)');
  }
  _client = createClient(url, serviceKey, { auth: { persistSession: false } });
  return _client;
}

export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_t, prop, recv) {
    const c = ensure() as any;
    return Reflect.get(c, prop, recv);
  },
}) as SupabaseClient; 