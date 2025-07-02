'use client';
// Hook para obtener el perfil del usuario desde Supabase usando SWR.
// Ubicación: /lib/useProfile.ts
// Uso: import { useProfile } from '@/lib/useProfile';
import useSWR from 'swr';
import { supabaseBrowser } from '@/lib/supabaseBrowser';

export function useProfile(userId?: string) {
  return useSWR(
    userId ? ['profile', userId] : null,
    async () => {
      const supabase = supabaseBrowser();
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, avatar_url, plan, created_at')
        .eq('id', userId!)
        .single();
      if (error) throw error;
      return data;
    },
    { revalidateOnFocus: false }
  );
} 