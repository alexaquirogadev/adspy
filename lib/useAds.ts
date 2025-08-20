import { useState, useEffect, useRef } from 'react';
import type { Ad, AdFilters } from '@/lib/types';

// Utilidad para formatear fechas en YYYY-MM-DD sin desfase de zona
const formatDate = (d: Date) =>
  `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,'0')}-${d.getDate().toString().padStart(2,'0')}`;

function filtersToQuery(filters: AdFilters): string {
  const params = new URLSearchParams();

  const add = (k: string, v: any) => {
    if (v === undefined || v === null || v === '') return;
    if (Array.isArray(v) && v.length === 0) return;
    if (Array.isArray(v)) v.forEach(x => params.append(k, String(x)));
    else                  params.append(k, String(v));
  };

  Object.entries(filters).forEach(([k, v]) => {
    if (k === 'customDateRange' && typeof v === 'object' && v) {
      add('startDate', (v as any).start);
      add('endDate',   (v as any).end);
    } else if (k === 'adsetRange' || k === 'spendRange') {
      if ((v as any).min !== undefined) add(`${k}Min`, (v as any).min);
      if ((v as any).max !== undefined) add(`${k}Max`, (v as any).max);
    } else {
      add(k, v);
    }
  });

  return params.toString();
}

export function useAds(filters: AdFilters, debounceMs = 300): { ads: Ad[]; loading: boolean } {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
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
      // Si en el futuro se usa para sonidos, cambiar a /api/sounds
      const url = qs ? `/api/ads?${qs}` : '/api/ads';
      fetch(url, { signal: controller.signal })
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