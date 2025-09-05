'use client';

import useSWR from 'swr';
import { createBrowserClient } from '@supabase/ssr';
import type { Database, Tables } from '@/lib/types';

// Tipo de fila de la tabla public.profiles
export type ProfileRow = Tables<'profiles'>;

// Cliente Supabase de navegador (NEXT_PUBLIC_* disponible en cliente)
const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Fetcher tipado para SWR
async function fetchProfile(_key: string, userId: string): Promise<ProfileRow | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  // Si no hay fila, devolvemos null (evita throws innecesarios)
  // PGRST116 = "Results contain 0 rows"
  if (error && (error as any)?.code === 'PGRST116') return null;
  if (error) throw error;

  return (data ?? null) as ProfileRow | null;
}

/**
 * Hook: useProfile
 * @param userId UUID del usuario
 * @returns { data, error, isLoading, mutate } tipado correctamente
 */
export function useProfile(userId?: string | null) {
  const key = userId ? (['profile', userId] as const) : null;

  const { data, error, isLoading, mutate } = useSWR<ProfileRow | null>(
    key,
    fetchProfile,
    { revalidateOnFocus: false }
  );

  return { data, error, isLoading, mutate };
} 