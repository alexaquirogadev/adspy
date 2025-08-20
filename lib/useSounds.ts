import useSWR from 'swr';
import type { Sound } from '@/lib/types';

const fetcher = (url: string) => fetch(url).then(res => {
  if (!res.ok) throw new Error('Error al cargar sonidos');
  return res.json();
});

/**
 * Hook para obtener sonidos trending desde la API /api/sounds.
 * @param region Región a consultar (por defecto 'ES')
 * @returns { sounds, isLoading, error }
 */
export function useSounds(region: string = 'ES') {
  const { data, error, isLoading } = useSWR<Sound[]>(
    `/api/sounds?region=${encodeURIComponent(region)}`,
    fetcher
  );
  // Asegura que cada sound tenga id
  const sounds = (data || []).map(s => ({ ...s, id: s.id || s.sound_id }));
  return {
    sounds,
    isLoading,
    error,
  };
} 