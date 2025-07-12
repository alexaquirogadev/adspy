import { useState, useEffect, useRef } from 'react';
import type { Ad, AdFilters } from '@/lib/types';

// Convierte filtros a URLSearchParams, omitiendo claves vacías
function filtersToQuery(filters: AdFilters): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, String(value));
    }
  });
  return params.toString();
}

export function useAds(filters: AdFilters, debounceMs = 300): { ads: Ad[]; loading: boolean } {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const abortRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Limpieza previa: aborta fetch y limpia timeout
    if (abortRef.current) abortRef.current.abort();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setLoading(true);
    const controller = new AbortController();
    abortRef.current = controller;

    // Debounce fetch
    timeoutRef.current = setTimeout(() => {
      const qs = filtersToQuery(filters);
      fetch('/api/ads?' + qs, { signal: controller.signal })
        .then(async (res) => {
          if (!res.ok) throw new Error('Error al cargar anuncios');
          return res.json();
        })
        .then((data: Ad[]) => {
          setAds(Array.isArray(data) ? data : []);
        })
        .catch((err) => {
          if (err.name !== 'AbortError') {
            setAds([]);
            // Opcional: console.error(err);
          }
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false);
        });
    }, debounceMs);

    // Limpieza al desmontar o cambiar filtros
    return () => {
      if (abortRef.current) abortRef.current.abort();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [JSON.stringify(filters), debounceMs]);

  return { ads, loading };
} 