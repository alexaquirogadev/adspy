'use client';
import React from 'react';
import { Users, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import type { Sound, Ad } from '@/lib/types';

/**
 * SoundCard
 * Componente de tarjeta visual para mostrar sonidos trending (Sound).
 * - La prop 'sound' es de tipo Sound.
 * - Si el objeto tiene 'preview_url', muestra un reproductor <audio>.
 * - Ubicación: /components/shared/SoundCard.tsx
 */
export interface SoundCardProps {
  /** Puedes pasar un Sound o un Ad. Con uno de los dos basta. */
  sound?: Sound;
  ad?: Ad;
  onToggleFavorite?: (id: string) => void;
  /** Acepta Sound o Ad para no romper llamadas existentes. */
  onCardClick?: (item: any) => void;
  /** posición en la lista para stagger animation (opcional) */
  index?: number;
}

const SoundCard: React.FC<SoundCardProps> = ({
  sound,
  ad,
  onToggleFavorite,
  onCardClick,
  index = 0,
}) => {
  // Acepta cualquiera de las dos fuentes
  const item: any = sound ?? ad;
  if (!item) return null;

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num?.toString() ?? '0';
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    onCardClick?.(item);
  };

  const ratio = 133;
  // cover_url (Sound) | thumbnail (Ad) | cover_thumb (fallback api)
  const thumbnail =
    item.cover_url ??
    item.thumbnail ??
    item.cover_thumb ??
    "/placeholder.png";
  const duration = item.duration;
  const title = item.title;
  const author = item.author ?? item.brand ?? '';
  const id = item.id ?? item.sound_id;
  const count = item.video_count ?? item.user_count ?? item.views ?? 0;

  return (
    <motion.div
      className="break-inside-avoid-column rounded-lg md:rounded-xl overflow-hidden bg-white shadow cursor-pointer mb-3 transition-transform hover:scale-[1.015]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={handleCardClick}
    >
      <div
        className="relative w-full overflow-hidden rounded-lg bg-neutral-200"
        style={{ paddingBottom: `${ratio}%` }}
      >
        <Image
          src={thumbnail}
          alt={title}
          fill
          sizes="(max-width:768px) 100vw, 300px"
          className="object-cover"
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMzAwJyBoZWlnaHQ9JzIwMCcgZmlsbD0nI2U1ZTVlNScvPg=="
          unoptimized
        />
        {duration && (
          <span className="absolute bottom-2 right-2 bg-black/60 text-xs text-white px-1.5 rounded">
            {duration}s
          </span>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
        {onToggleFavorite && id && (
          <button
            type="button"
            className="absolute top-2 right-2 z-10 btn btn-xs btn-circle btn-ghost"
            onClick={e => {
              e.stopPropagation();
              onToggleFavorite?.(id);
            }}
            aria-label="Favorito"
          >
            <Heart
              size={18}
              fill={item.isFavorite ? '#FF006F' : 'none'}
              className={item.isFavorite ? 'text-secondary' : 'text-neutral-600'}
            />
          </button>
        )}
      </div>
      {item.preview_url && (
        <audio controls src={item.preview_url} className="mt-2 w-full" />
      )}
      <div className="p-2 md:p-3">
        <h3 className="font-medium text-xs md:text-sm line-clamp-2 mb-1">{title}</h3>
        <div className="flex items-center justify-between text-[10px] md:text-xs text-neutral-500">
          <span>{author}</span>
          <div className="flex items-center gap-1">
            <Users size={10} className="md:w-3 md:h-3" />
            <span>{formatNumber(count)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SoundCard;