'use client';
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, MessageCircle, Heart } from 'lucide-react';
import type { Sound } from '@/lib/types';

// Elimina import Image from 'next/image';

// Helper mm:ss
const toMMSS = (secs?: number | null) => {
  if (!secs && secs !== 0) return null;
  const s = Math.max(0, Math.round(Number(secs)));
  const m = Math.floor(s / 60).toString().padStart(2, '0');
  const r = (s % 60).toString().padStart(2, '0');
  return `${m}:${r}`;
};

type Props = { sound: any | null; onClose: () => void };

const SoundPreviewModal: React.FC<Props> = ({ sound, onClose }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [src, setSrc] = useState<string | null>(sound?.preview_url ?? sound?.play_url ?? null);
  const [preview, setPreview] = useState<any | null>(null);
  const region = sound?.region || 'US';

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    return () => {
      try { audioRef.current?.pause(); } catch {}
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setSrc(sound?.preview_url ?? sound?.play_url ?? null);

    async function load() {
      if (!sound || sound.preview_url) return;
      try {
        const q = new URLSearchParams({ region, title: sound.title || '' }).toString();
        const res = await fetch(`/api/sounds/preview?${q}`, { cache: 'no-store' });
        const json = await res.json();
        if (!cancelled) {
          setPreview(json);
          if (json?.preview_url) setSrc(json.preview_url as string);

          // cachear en DB para próximas visitas
          try {
            await fetch('/api/sounds/cache-preview', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                sound_id: sound.sound_id,
                region,
                preview_url: json?.preview_url ?? null,
                play_url: json?.preview_url ?? null,
                cover_url: json?.cover_url ?? null,
                duration: json?.duration ?? null,
                is_commerce_music: typeof json?.is_commerce_music === 'boolean' ? json.is_commerce_music : null,
                user_count: typeof json?.user_count === 'number' ? json.user_count : null,
              }),
            });
          } catch {}
        }
      } catch {}
    }
    if (sound) load();
    return () => { cancelled = true; };
  }, [sound?.sound_id, region, sound?.preview_url, sound?.title]);

  if (!sound) return null;

  // valores derivados
  const used = Number(preview?.user_count ?? sound?.user_count ?? 0);
  const commercial =
    typeof preview?.is_commerce_music === 'boolean'
      ? preview.is_commerce_music
      : (typeof sound?.is_commerce_music === 'boolean' ? sound.is_commerce_music : null);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <AnimatePresence>
      <>
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
        {/* Contenedor modal */}
        <div
          className="fixed z-50 inset-0 flex items-center justify-center p-4"
          onClick={e => e.stopPropagation()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white rounded-xl shadow-lg max-w-md w-full mx-4 p-6 relative"
          >
            {/* Cerrar */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="absolute right-4 top-4 rounded-full border px-2 py-1 text-sm hover:bg-neutral-100"
            >
              ×
            </button>
            {/* Encabezado: cover, título, autor */}
            <div className="flex flex-col items-center mb-4">
              <div className="mx-auto mb-4 h-28 w-28 md:h-36 md:w-36 overflow-hidden rounded-xl relative border">
                <img
                  src={sound.cover_url ?? '/placeholder.png'}
                  alt={sound.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <h2 className="text-lg font-bold text-center mb-1">{sound.title}</h2>
              <div className="text-neutral-500 text-sm mb-2">{sound.author}</div>
              <div className="flex items-center gap-3 text-xs text-neutral-500 mb-2">
                <span className="inline-flex items-center gap-1">
                  <Users size={12} />
                  {Intl.NumberFormat().format(used)} uses
                </span>

                {typeof sound?.duration === 'number' && (
                  <span className="px-2 py-0.5 rounded bg-neutral-100 border border-neutral-200">
                    {toMMSS(sound.duration)}
                  </span>
                )}
                {typeof preview?.duration === 'number' && !sound?.duration && (
                  <span className="px-2 py-0.5 rounded bg-neutral-100 border border-neutral-200">
                    {toMMSS(preview.duration)}
                  </span>
                )}

                {commercial !== null && (
                  <span className={`px-2 py-0.5 rounded border ${commercial ? 'bg-green-100 text-green-700 border-green-200' : 'bg-orange-100 text-orange-700 border-orange-200'}`}>
                    {commercial ? 'Uso libre (Business)' : 'Licencia requerida'}
                  </span>
                )}
              </div>
            </div>
            {/* Audio */}
            {src && (
              <audio ref={audioRef} controls src={src ?? ''} className="w-full mb-4" />
            )}
            {/* Botón abrir en TikTok */}
            <div className="flex justify-center mb-4">
              <a
                href={sound?.tiktok_url || preview?.tiktok_url_guess || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm hover:bg-neutral-50"
              >
                Usar sonido en TikTok ↗
              </a>
            </div>
            {/* KPIs */}
            <div className="flex justify-center gap-6 mb-2">
              <div className="flex flex-col items-center">
                <Users size={18} className="text-accent mb-1" />
                <span className="font-bold text-base">{formatNumber(used)}</span>
                <span className="text-xs text-neutral-500">Uses</span>
              </div>
            </div>
          </motion.div>
        </div>
      </>
    </AnimatePresence>
  );
};

export default SoundPreviewModal;