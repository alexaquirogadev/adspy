// Cliente Supabase para administración (server-side only)
// Usa la service key (SUPABASE_SERVICE_ROLE_KEY) y permite acceso a supabase.auth.admin
// Seguro solo para uso en el servidor. Para operaciones de administración de usuarios (insert, update, delete), usa supabase.auth.admin
import { createClient } from '@supabase/supabase-js'
 
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
) 