'use client';
import React from 'react';
import { Star, Share2, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface Ad {
  id: string;
  title: string;
  description: string;
  brand: string;
  thumbnail: string;
  platform: string;
  language: string;
  country: string;
  isFavorite: boolean;
  views: number;
  engagement: number;
  date: string;
  imgW: number;
  imgH: number;
}

interface AdCardProps {
  ad: Ad;
  onToggleFavorite?: (id: string) => void;
  onCardClick?: (ad: Ad) => void;
}

const AdCard: React.FC<AdCardProps> = ({ ad, onToggleFavorite, onCardClick }) => {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger card click if clicking on action buttons
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    onCardClick?.(ad);
  };

  // ratio = (alto ÷ ancho) * 100
  const ratio = (ad.imgH / ad.imgW) * 100 || 150; // fallback 150 %

  return (
    <motion.div
      className="break-inside-avoid-column rounded-lg md:rounded-xl overflow-hidden bg-white shadow cursor-pointer mb-3 transition-transform hover:scale-[1.015]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={handleCardClick}
    >
      <div
        className="relative w-full overflow-hidden bg-neutral-200"
        style={{ paddingBottom: `${ratio}%` }}
      >
        <Image
          src={ad.thumbnail}
          alt={ad.title}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 200px, (min-width: 768px) 25vw, 50vw"
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMzAwJyBoZWlnaHQ9JzIwMCcgZmlsbD0nI2U1ZTVlNScvPg=="
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
        <div className="absolute top-1.5 md:top-2 right-1.5 md:right-2 flex gap-1 md:gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite?.(ad.id);
            }}
            className="p-1.5 md:p-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-neutral-100"
          >
            <Star
              size={14}
              fill={ad.isFavorite ? '#FF006F' : 'none'}
              className={ad.isFavorite ? 'text-secondary' : 'text-neutral-600'}
            />
          </button>
          <button
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 md:p-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-neutral-100"
          >
            <Share2 size={14} className="text-neutral-600" />
          </button>
        </div>
      </div>
      <div className="p-2 md:p-3">
        <h3 className="font-medium text-xs md:text-sm line-clamp-2 mb-1">{ad.title}</h3>
        <div className="flex items-center justify-between text-[10px] md:text-xs text-neutral-500">
          <span>{ad.brand}</span>
          <div className="flex items-center gap-1">
            <Users size={10} className="md:w-3 md:h-3" />
            <span>{formatNumber(ad.views)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdCard;