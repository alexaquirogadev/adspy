import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import SoundCard from '../shared/SoundCard';
import SoundPreviewModal from '../shared/SoundPreviewModal';
import AnimatedBanner from '../shared/AnimatedBanner';
import SortButton, { SortOption } from '../search/SortButton';
import { Ad } from '../../lib/types';
import type { Sound } from '@/lib/types';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

// Mock data for demonstration
const mockAds: Ad[] = [
  {
    id: '1',
    thumbnail: 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg',
    title: 'Nuevo iPhone 13 Pro',
    description: 'La cámara más avanzada en un iPhone. Descubre el nuevo sistema de cámaras Pro.',
    brand: 'Apple',
    platform: 'facebook',
    country: 'US',
    language: 'en',
    views: 1500000,
    engagement: 4.8,
    date: '2025-05-01T09:00:00Z',
    isFavorite: true,
    isEcommerce: true,
    status: 'active',
    adsets: 5,
    spend: 15000,
    mediaType: 'video',
    targetAudience: ['interests', 'demographics'],
    cta: 'shop_now'
  },
  {
    id: '2',
    thumbnail: 'https://images.pexels.com/photos/7691098/pexels-photo-7691098.jpeg',
    title: 'Colección verano 2025',
    description: 'Descubre nuestra nueva colección de verano con diseños exclusivos.',
    brand: 'Zara',
    platform: 'instagram',
    country: 'IT',
    language: 'it',
    views: 2000000,
    engagement: 4.5,
    date: '2025-05-06T10:45:00Z',
    isFavorite: true,
    isEcommerce: true,
    status: 'active',
    adsets: 8,
    spend: 25000,
    mediaType: 'carousel',
    targetAudience: ['interests', 'custom_audiences'],
    cta: 'learn_more'
  },
  {
    id: '3',
    thumbnail: 'https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg',
    title: 'Nike Air Max 2025',
    description: 'Revoluciona tu manera de correr con la nueva tecnología Air.',
    brand: 'Nike',
    platform: 'instagram',
    country: 'US',
    language: 'en',
    views: 3500000,
    engagement: 4.9,
    date: '2025-05-03T15:30:00Z',
    isFavorite: true,
    isEcommerce: true,
    status: 'active',
    adsets: 6,
    spend: 20000,
    mediaType: 'video',
    targetAudience: ['interests', 'lookalikes'],
    cta: 'shop_now'
  },
  {
    id: '4',
    thumbnail: 'https://images.pexels.com/photos/4219654/pexels-photo-4219654.jpeg',
    title: 'PlayStation 5 Pro',
    description: 'La nueva generación de gaming ha llegado. Más potencia, mejores gráficos.',
    brand: 'Sony',
    platform: 'youtube',
    country: 'JP',
    language: 'ja',
    views: 2800000,
    engagement: 4.7,
    date: '2025-05-02T12:00:00Z',
    isFavorite: true,
    isEcommerce: true,
    status: 'active',
    adsets: 7,
    spend: 30000,
    mediaType: 'video',
    targetAudience: ['interests', 'lookalikes'],
    cta: 'learn_more'
  },
  {
    id: '5',
    thumbnail: 'https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg',
    title: 'Tesla Model Y 2025',
    description: 'El futuro de la conducción eléctrica está aquí. Autonomía extendida.',
    brand: 'Tesla',
    platform: 'facebook',
    country: 'US',
    language: 'en',
    views: 4200000,
    engagement: 4.8,
    date: '2025-05-04T09:15:00Z',
    isFavorite: true,
    isEcommerce: false,
    status: 'active',
    adsets: 8,
    spend: 40000,
    mediaType: 'video',
    targetAudience: ['interests', 'custom_audiences'],
    cta: 'learn_more'
  },
  {
    id: '6',
    thumbnail: 'https://images.pexels.com/photos/1162519/pexels-photo-1162519.jpeg',
    title: 'MacBook Air M3',
    description: 'Potencia y portabilidad en perfecta armonía. Nuevo chip M3.',
    brand: 'Apple',
    platform: 'instagram',
    country: 'US',
    language: 'en',
    views: 1800000,
    engagement: 4.6,
    date: '2025-05-05T14:20:00Z',
    isFavorite: true,
    isEcommerce: true,
    status: 'active',
    adsets: 5,
    spend: 18000,
    mediaType: 'image',
    targetAudience: ['interests', 'demographics'],
    cta: 'shop_now'
  },
  {
    id: '7',
    thumbnail: 'https://images.pexels.com/photos/2587054/pexels-photo-2587054.jpeg',
    title: 'Spotify Premium Family',
    description: 'Música ilimitada para toda la familia. 6 cuentas Premium.',
    brand: 'Spotify',
    platform: 'facebook',
    country: 'ES',
    language: 'es',
    views: 950000,
    engagement: 4.4,
    date: '2025-05-07T11:30:00Z',
    isFavorite: true,
    isEcommerce: false,
    status: 'active',
    adsets: 4,
    spend: 12000,
    mediaType: 'image',
    targetAudience: ['demographics', 'behaviors'],
    cta: 'sign_up'
  },
  {
    id: '8',
    thumbnail: 'https://images.pexels.com/photos/5626027/pexels-photo-5626027.jpeg',
    title: 'Samsung Galaxy S25 Ultra',
    description: 'La revolución en fotografía móvil. Zoom espacial 200x.',
    brand: 'Samsung',
    platform: 'youtube',
    country: 'KR',
    language: 'ko',
    views: 3100000,
    engagement: 4.7,
    date: '2025-05-08T16:45:00Z',
    isFavorite: true,
    isEcommerce: true,
    status: 'active',
    adsets: 9,
    spend: 28000,
    mediaType: 'video',
    targetAudience: ['interests', 'lookalikes'],
    cta: 'shop_now'
  }
];

// Mapper Ad -> Sound para usar SoundCard/Modal
const adToSound = (ad: Ad): Sound => ({
  sound_id: ad.id,
  title: ad.title,
  author: ad.brand,
  region: 'ALL',
  rank: null,
  cover_url: ad.thumbnail,
  preview_url: null,
  play_url: null,
  duration: null,
  video_count: null,
  user_count: ad.views ?? 0,
  fetched_at: undefined,
  tiktok_url: null,
});

const FAVORITES_STORAGE_KEY = 'adspy_favorites';

const FavoritesView: React.FC = () => {
  const [favorites, setFavorites] = useState<Ad[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAd, setSelectedAd] = useState<any | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState<SortOption>('date_newest');
  
  useEffect(() => {
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
    const favoriteIds = savedFavorites ? JSON.parse(savedFavorites) : [];
    
    // Get all ads that are in the favorites list
    const favoriteAds = mockAds.filter(ad => favoriteIds.includes(ad.id));
    setFavorites(sortAds(favoriteAds, selectedSort));
    setIsLoading(false);
  }, []);

  // Sort ads based on selected sort option
  const sortAds = (adsToSort: Ad[], sortOption: SortOption): Ad[] => {
    const sorted = [...adsToSort];
    
    switch (sortOption) {
      case 'date_newest':
        return sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      case 'date_oldest':
        return sorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      case 'duration_longest':
        return sorted.sort((a, b) => {
          const aDuration = Date.now() - new Date(a.date).getTime();
          const bDuration = Date.now() - new Date(b.date).getTime();
          return bDuration - aDuration;
        });
      case 'duration_shortest':
        return sorted.sort((a, b) => {
          const aDuration = Date.now() - new Date(a.date).getTime();
          const bDuration = Date.now() - new Date(b.date).getTime();
          return aDuration - bDuration;
        });
      case 'adsets_most':
        return sorted.sort((a, b) => b.adsets - a.adsets);
      case 'adsets_least':
        return sorted.sort((a, b) => a.adsets - b.adsets);
      case 'spend_highest':
        return sorted.sort((a, b) => b.spend - a.spend);
      case 'spend_lowest':
        return sorted.sort((a, b) => a.spend - b.spend);
      case 'likes_most':
        return sorted.sort((a, b) => (b.views * 0.05) - (a.views * 0.05));
      case 'likes_least':
        return sorted.sort((a, b) => (a.views * 0.05) - (b.views * 0.05));
      case 'views_most':
        return sorted.sort((a, b) => b.views - a.views);
      case 'views_least':
        return sorted.sort((a, b) => a.views - b.views);
      default:
        return sorted;
    }
  };

  // Apply sorting whenever sort option changes
  useEffect(() => {
    setFavorites(prevFavorites => sortAds(prevFavorites, selectedSort));
  }, [selectedSort]);
  
  const toggleFavorite = (id: string) => {
    const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
    const favoriteIds = savedFavorites ? JSON.parse(savedFavorites) : [];
    
    // Remove the ad from favorites
    const newFavoriteIds = favoriteIds.filter((favId: string) => favId !== id);
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newFavoriteIds));
    
    // Update state
    setFavorites(prev => prev.filter(ad => ad.id !== id));

    // Update selected ad if it's currently open
    if (selectedAd && selectedAd.id === id) {
      setSelectedAd((prev: any) => prev ? { ...prev, isFavorite: false } : null);
    }
  };

  const handleSoundClick = (sound: Sound) => {
    setSelectedAd(sound);
    setIsPreviewOpen(true);
  };
  
  return (
    <div className="pt-1 md:mt-0">
      <AnimatedBanner 
        text="Anuncios guardados para inspirarte"
        icon={<Heart />}
        gradient="from-primary to-white"
      />

      {/* Sort Button - Only show if there are favorites */}
      {!isLoading && favorites.length > 0 && (
        <div className="px-4 md:px-0 mb-4 flex justify-end">
          <SortButton 
            selectedSort={selectedSort}
            onSortChange={setSelectedSort}
          />
        </div>
      )}
      
      <div className="mt-4">
        {isLoading ? (
          <motion.div 
            className="columns-2 md:columns-4 lg:columns-6 gap-2 md:gap-3 px-1 md:px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {[...Array(12)].map((_, index) => (
              <div key={index} className="break-inside-avoid mb-2 md:mb-3 rounded-lg md:rounded-xl overflow-hidden">
                <div className="w-full aspect-[2/3] bg-neutral-200 animate-pulse"></div>
                <div className="p-2 md:p-3 bg-white">
                  <div className="h-3 md:h-4 bg-neutral-200 rounded animate-pulse mb-2"></div>
                  <div className="h-2 md:h-3 bg-neutral-200 rounded animate-pulse mb-1 w-3/4"></div>
                  <div className="h-2 md:h-3 bg-neutral-200 rounded animate-pulse w-1/2"></div>
                </div>
              </div>
            ))}
          </motion.div>
        ) : favorites.length === 0 ? (
          <motion.div 
            className="bg-white rounded-xl p-6 md:p-8 text-center mx-auto max-w-md"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <motion.div 
              className="text-4xl md:text-6xl mb-4"
              animate={{ 
                y: [0, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              ❤️
            </motion.div>
            <h3 className="text-lg md:text-xl font-bold mb-2">Aún no tienes favoritos</h3>
            <p className="text-neutral-600 text-sm md:text-base mb-4">
              Guarda anuncios que te inspiren para verlos más tarde desde aquí.
            </p>
            <Link 
              href="/dashboard/search" 
              className="dopamine-btn inline-flex items-center gap-2"
            >
              Buscar anuncios
            </Link>
          </motion.div>
        ) : (
          <motion.div 
            className="columns-2 md:columns-4 lg:columns-6 gap-2 md:gap-3 px-1 md:px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.05 }}
          >
            {favorites.map((ad, index) => (
              <SoundCard
                key={ad.id}
                sound={adToSound(ad)}
                onToggleFavorite={toggleFavorite}
                onCardClick={handleSoundClick}
                index={index}
              />
            ))}
          </motion.div>
        )}
      </div>

      {/* Ad Preview Modal */}
      <SoundPreviewModal sound={selectedAd} onClose={() => setIsPreviewOpen(false)} />
    </div>
  );
};

export default FavoritesView;