import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Calendar, Clock, Eye, Heart, Share2, Crown, Medal, Award } from 'lucide-react';
import AdPreviewModal from '../shared/AdPreviewModal';
import AnimatedBanner from '../shared/AnimatedBanner';
import { Ad } from '../../lib/types';

type RankingPeriod = 'day' | 'week' | 'month';

// Mock data for top ranking ads
const mockRankingAds: Ad[] = [
  {
    id: 'rank-1',
    title: 'iPhone 15 Pro Max - Titanio',
    description: 'El iPhone más Pro hasta ahora. Titanio. Chip A17 Pro. Cámara de 48MP.',
    brand: 'Apple',
    thumbnail: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg',
    platform: 'instagram',
    language: 'es',
    country: 'US',
    views: 8500000,
    engagement: 9.2,
    date: '2025-02-15',
    isFavorite: false,
    isEcommerce: true,
    status: 'active',
    adsets: 12,
    spend: 250000,
    mediaType: 'video',
    targetAudience: ['interests', 'demographics'],
    cta: 'shop_now'
  },
  {
    id: 'rank-2',
    title: 'Nike Air Jordan 1 Retro High',
    description: 'El clásico que nunca pasa de moda. Edición limitada disponible ahora.',
    brand: 'Nike',
    thumbnail: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg',
    platform: 'tiktok',
    language: 'en',
    country: 'US',
    views: 7200000,
    engagement: 8.9,
    date: '2025-02-14',
    isFavorite: false,
    isEcommerce: true,
    status: 'active',
    adsets: 8,
    spend: 180000,
    mediaType: 'video',
    targetAudience: ['interests', 'lookalikes'],
    cta: 'shop_now'
  },
  {
    id: 'rank-3',
    title: 'Tesla Model 3 - Autopilot Mejorado',
    description: 'La revolución eléctrica continúa. Ahora con Autopilot de nueva generación.',
    brand: 'Tesla',
    thumbnail: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg',
    platform: 'youtube',
    language: 'en',
    country: 'US',
    views: 6800000,
    engagement: 8.7,
    date: '2025-02-13',
    isFavorite: false,
    isEcommerce: false,
    status: 'active',
    adsets: 10,
    spend: 320000,
    mediaType: 'video',
    targetAudience: ['interests', 'custom_audiences'],
    cta: 'learn_more'
  },
  {
    id: 'rank-4',
    title: 'Samsung Galaxy S25 Ultra',
    description: 'Cámara de 200MP con IA. El futuro de la fotografía móvil.',
    brand: 'Samsung',
    thumbnail: 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg',
    platform: 'facebook',
    language: 'en',
    country: 'US',
    views: 5900000,
    engagement: 8.4,
    date: '2025-02-12',
    isFavorite: false,
    isEcommerce: true,
    status: 'active',
    adsets: 9,
    spend: 200000,
    mediaType: 'carousel',
    targetAudience: ['interests', 'demographics'],
    cta: 'shop_now'
  },
  {
    id: 'rank-5',
    title: 'PlayStation 5 Pro',
    description: 'Gaming de próxima generación. Ray tracing en tiempo real.',
    brand: 'Sony',
    thumbnail: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg',
    platform: 'youtube',
    language: 'en',
    country: 'US',
    views: 5400000,
    engagement: 8.1,
    date: '2025-02-11',
    isFavorite: false,
    isEcommerce: true,
    status: 'active',
    adsets: 7,
    spend: 150000,
    mediaType: 'video',
    targetAudience: ['interests', 'behaviors'],
    cta: 'shop_now'
  }
];

const FAVORITES_STORAGE_KEY = 'adspy_favorites';

const RankingView: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<RankingPeriod>('day');
  const [ads, setAds] = useState<Ad[]>(mockRankingAds);
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const periods = [
    { value: 'day' as RankingPeriod, label: 'Día', icon: <Clock size={14} /> },
    { value: 'week' as RankingPeriod, label: 'Semana', icon: <Calendar size={14} /> },
    { value: 'month' as RankingPeriod, label: 'Mes', icon: <TrendingUp size={14} /> }
  ];

  const toggleFavorite = (id: string) => {
    const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
    const favoriteIds = savedFavorites ? JSON.parse(savedFavorites) : [];
    
    let newFavoriteIds;
    if (favoriteIds.includes(id)) {
      newFavoriteIds = favoriteIds.filter((favId: string) => favId !== id);
    } else {
      newFavoriteIds = [...favoriteIds, id];
    }
    
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newFavoriteIds));
    
    setAds(prev => prev.map(ad => 
      ad.id === id ? { ...ad, isFavorite: !ad.isFavorite } : ad
    ));

    if (selectedAd && selectedAd.id === id) {
      setSelectedAd(prev => prev ? { ...prev, isFavorite: !prev.isFavorite } : null);
    }
  };

  const handleCardClick = (ad: Ad) => {
    setSelectedAd(ad);
    setIsPreviewOpen(true);
  };

  const handleViewDetails = (id: string) => {
    console.log('View details for ad:', id);
    setIsPreviewOpen(false);
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <Crown size={20} className="text-yellow-500" />;
      case 1: return <Medal size={20} className="text-gray-400" />;
      case 2: return <Award size={20} className="text-amber-600" />;
      default: return <span className="text-lg font-bold text-neutral-600">#{index + 1}</span>;
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="pt-1 md:mt-0">
      <AnimatedBanner 
        text="Top 15 anuncios más virales"
        icon={<Trophy />}
        gradient="from-yellow-400 to-orange-500"
      />

      {/* Period Selector */}
      <div className="px-4 md:px-0 mb-4">
        <div className="flex gap-2">
          {periods.map(period => (
            <button
              key={period.value}
              onClick={() => setSelectedPeriod(period.value)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border-2 border-black transition-all inline-flex items-center gap-2 ${
                selectedPeriod === period.value 
                  ? "bg-yellow-400 shadow-[2px_2px_0_rgba(0,0,0,1)]" 
                  : "bg-white hover:bg-neutral-50 shadow-[1px_1px_0_rgba(0,0,0,1)]"
              }`}
            >
              {period.icon}
              <span>{period.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Ranking List */}
      <div className="space-y-3 px-4 md:px-0">
        {ads.slice(0, 15).map((ad, index) => (
          <motion.div
            key={ad.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            onClick={() => handleCardClick(ad)}
            className="bg-white border-2 border-black rounded-xl p-4 shadow-retro hover:shadow-[6px_6px_0_rgba(0,0,0,1)] transition-all duration-300 hover:translate-y-[-2px] cursor-pointer"
          >
            <div className="flex items-center gap-4">
              {/* Rank */}
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-yellow-100 to-yellow-200 border-2 border-black rounded-full flex items-center justify-center">
                {getRankIcon(index)}
              </div>

              {/* Thumbnail */}
              <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 border-black">
                <img 
                  src={ad.thumbnail} 
                  alt={ad.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-sm md:text-base line-clamp-1 mb-1">{ad.title}</h3>
                    <p className="text-xs md:text-sm text-neutral-600 font-medium">{ad.brand}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs bg-gradient-to-r from-secondary/20 to-secondary/10 px-2 py-1 rounded-full border border-secondary/30">
                    <TrendingUp size={12} />
                    <span className="font-bold">{ad.engagement}%</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-xs text-neutral-600">
                  <div className="flex items-center gap-1">
                    <Eye size={12} />
                    <span>{formatNumber(ad.views)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart size={12} />
                    <span>{formatNumber(Math.floor(ad.views * 0.05))}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Share2 size={12} />
                    <span>{formatNumber(Math.floor(ad.views * 0.01))}</span>
                  </div>
                  <div className="hidden md:block text-neutral-400">
                    {new Date(ad.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Ad Preview Modal */}
      <AdPreviewModal
        ad={selectedAd}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onToggleFavorite={toggleFavorite}
        onViewDetails={handleViewDetails}
      />
    </div>
  );
};

export default RankingView;