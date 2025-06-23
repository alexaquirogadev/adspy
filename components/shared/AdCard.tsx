'use client';
import React from 'react';
import { Star, Share2, Clock, Users } from 'lucide-react';
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
}

interface AdCardProps {
  ad: Ad;
  onToggleFavorite?: (id: string) => void;
  onCardClick?: (ad: Ad) => void;
  index: number;
}

const AdCard: React.FC<AdCardProps> = ({ ad, onToggleFavorite, onCardClick, index }) => {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // Alternate between different aspect ratios like Pinterest
  const getAspectRatio = () => {
    const ratios = ['aspect-[3/4]', 'aspect-square', 'aspect-[4/5]', 'aspect-[2/3]'];
    return ratios[index % ratios.length];
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger card click if clicking on action buttons
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    onCardClick?.(ad);
  };

  return (
    <motion.div 
      className="break-inside-avoid mb-2 md:mb-3 cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={handleCardClick}
    >
      <div className="group relative rounded-lg md:rounded-xl overflow-hidden bg-white hover:shadow-lg transition-all duration-300">
        <div className={`relative ${getAspectRatio()} overflow-hidden`}>
          <Image 
            src={ad.thumbnail}
            alt={ad.title}
            width={500}
            height={500}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
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
      </div>
    </motion.div>
  );
};

export default AdCard;