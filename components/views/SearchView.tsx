import React, { useState, useEffect } from 'react';
import SearchBar from '../search/SearchBar';
import SearchFilters from '../search/SearchFilters';
import DateRangePicker from '../search/DateRangePicker';
import SortButton, { SortOption } from '../search/SortButton';
import AdCard from '../shared/AdCard';
import AdPreviewModal from '../shared/AdPreviewModal';
import AnimatedBanner from '../shared/AnimatedBanner';
import { Ad, TimeRange } from '../../lib/types';
import { motion } from 'framer-motion';
import { Zap, Calendar, CalendarDays, Infinity } from 'lucide-react';

const timeRanges: { value: TimeRange; label: string; icon: React.ReactNode }[] = [
  { value: '7d', label: '7d', icon: <Calendar size={14} /> },
  { value: '30d', label: '30d', icon: <CalendarDays size={14} /> },
  { value: 'all', label: 'Todo', icon: <Infinity size={14} /> }
];

const mobileTimeRanges = [
  { value: 'all', label: 'Todo', icon: <Infinity size={14} /> }
];

// Mock data
const mockAds: Ad[] = [
  {
    id: '1',
    title: 'Nike Air Max 2025 Collection',
    description: 'Descubre la nueva colección de Nike Air Max. Diseño revolucionario para un rendimiento excepcional.',
    brand: 'Nike',
    thumbnail: 'https://images.pexels.com/photos/2529147/pexels-photo-2529147.jpeg',
    platform: 'instagram',
    language: 'es',
    country: 'ES',
    views: 1500000,
    engagement: 4.8,
    date: '2025-02-15',
    isFavorite: false,
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
    title: 'Apple MacBook Pro M3',
    description: 'El portátil más potente de Apple. Rendimiento revolucionario con el nuevo chip M3.',
    brand: 'Apple',
    thumbnail: 'https://images.pexels.com/photos/303383/pexels-photo-303383.jpeg',
    platform: 'facebook',
    language: 'en',
    country: 'US',
    views: 2000000,
    engagement: 4.5,
    date: '2025-02-14',
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
    title: 'Samsung Galaxy S25 Ultra',
    description: 'El futuro de la fotografía móvil está aquí. Cámara de 200MP con IA avanzada.',
    brand: 'Samsung',
    thumbnail: 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg',
    platform: 'youtube',
    language: 'en',
    country: 'UK',
    views: 3000000,
    engagement: 4.7,
    date: '2025-02-13',
    isFavorite: false,
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
    title: 'Spotify Premium Family',
    description: 'Música ilimitada para toda la familia. 6 cuentas Premium por el precio de 2.',
    brand: 'Spotify',
    thumbnail: 'https://images.pexels.com/photos/1626481/pexels-photo-1626481.jpeg',
    platform: 'instagram',
    language: 'es',
    country: 'ES',
    views: 800000,
    engagement: 4.2,
    date: '2025-02-12',
    isFavorite: false,
    isEcommerce: false,
    status: 'active',
    adsets: 4,
    spend: 10000,
    mediaType: 'image',
    targetAudience: ['demographics', 'behaviors'],
    cta: 'sign_up'
  },
  {
    id: '5',
    title: 'BMW iX M60',
    description: 'El futuro de la conducción eléctrica. Potencia y lujo en perfecta armonía.',
    brand: 'BMW',
    thumbnail: 'https://images.pexels.com/photos/892522/pexels-photo-892522.jpeg',
    platform: 'facebook',
    language: 'de',
    country: 'DE',
    views: 1200000,
    engagement: 4.6,
    date: '2025-02-11',
    isFavorite: true,
    isEcommerce: false,
    status: 'active',
    adsets: 7,
    spend: 30000,
    mediaType: 'video',
    targetAudience: ['custom_audiences', 'lookalikes'],
    cta: 'learn_more'
  },
  {
    id: '6',
    title: 'Adidas 4DFWD 3',
    description: 'La revolución en el running. Tecnología de impresión 3D para una amortiguación perfecta.',
    brand: 'Adidas',
    thumbnail: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg',
    platform: 'instagram',
    language: 'en',
    country: 'US',
    views: 900000,
    engagement: 4.4,
    date: '2025-02-10',
    isFavorite: false,
    isEcommerce: true,
    status: 'active',
    adsets: 5,
    spend: 12000,
    mediaType: 'carousel',
    targetAudience: ['interests', 'behaviors'],
    cta: 'shop_now'
  },
  {
    id: '7',
    title: 'Netflix - Stranger Things 5',
    description: 'La batalla final comienza. La última temporada de la serie más exitosa.',
    brand: 'Netflix',
    thumbnail: 'https://images.pexels.com/photos/2726370/pexels-photo-2726370.jpeg',
    platform: 'youtube',
    language: 'en',
    country: 'US',
    views: 5000000,
    engagement: 4.9,
    date: '2025-02-09',
    isFavorite: true,
    isEcommerce: false,
    status: 'active',
    adsets: 10,
    spend: 50000,
    mediaType: 'video',
    targetAudience: ['interests', 'demographics'],
    cta: 'sign_up'
  },
  {
    id: '8',
    title: 'PlayStation 6',
    description: 'La próxima generación de gaming. Realidad virtual sin límites.',
    brand: 'Sony',
    thumbnail: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg',
    platform: 'twitter',
    language: 'ja',
    country: 'JP',
    views: 2500000,
    engagement: 4.7,
    date: '2025-02-08',
    isFavorite: false,
    isEcommerce: true,
    status: 'active',
    adsets: 8,
    spend: 35000,
    mediaType: 'video',
    targetAudience: ['interests', 'lookalikes'],
    cta: 'learn_more'
  },
  {
    id: '9',
    title: 'Coca-Cola Zero Sugar Plus',
    description: 'El mismo sabor que amas, ahora con vitaminas y minerales añadidos.',
    brand: 'Coca-Cola',
    thumbnail: 'https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg',
    platform: 'instagram',
    language: 'es',
    country: 'ES',
    views: 1800000,
    engagement: 4.3,
    date: '2025-02-07',
    isFavorite: false,
    isEcommerce: false,
    status: 'active',
    adsets: 6,
    spend: 15000,
    mediaType: 'image',
    targetAudience: ['demographics', 'behaviors'],
    cta: 'learn_more'
  },
  {
    id: '10',
    title: 'Amazon Prime Day 2025',
    description: '48 horas de ofertas increíbles. Los mejores descuentos del año.',
    brand: 'Amazon',
    thumbnail: 'https://images.pexels.com/photos/1667088/pexels-photo-1667088.jpeg',
    platform: 'facebook',
    language: 'en',
    country: 'US',
    views: 4000000,
    engagement: 4.6,
    date: '2025-02-06',
    isFavorite: true,
    isEcommerce: true,
    status: 'active',
    adsets: 15,
    spend: 100000,
    mediaType: 'carousel',
    targetAudience: ['custom_audiences', 'lookalikes'],
    cta: 'shop_now'
  },
  {
    id: '11',
    title: 'Tesla Model Y 2025',
    description: 'El SUV eléctrico más vendido, ahora con mayor autonomía y nuevas características.',
    brand: 'Tesla',
    thumbnail: 'https://images.pexels.com/photos/7674867/pexels-photo-7674867.jpeg',
    platform: 'instagram',
    language: 'en',
    country: 'US',
    views: 2200000,
    engagement: 4.8,
    date: '2025-02-05',
    isFavorite: false,
    isEcommerce: false,
    status: 'active',
    adsets: 7,
    spend: 40000,
    mediaType: 'video',
    targetAudience: ['interests', 'custom_audiences'],
    cta: 'learn_more'
  },
  {
    id: '12',
    title: 'Zara Summer Collection 2025',
    description: 'Descubre las últimas tendencias en moda sostenible para este verano.',
    brand: 'Zara',
    thumbnail: 'https://images.pexels.com/photos/5709661/pexels-photo-5709661.jpeg',
    platform: 'pinterest',
    language: 'es',
    country: 'ES',
    views: 1600000,
    engagement: 4.5,
    date: '2025-02-04',
    isFavorite: true,
    isEcommerce: true,
    status: 'active',
    adsets: 9,
    spend: 25000,
    mediaType: 'carousel',
    targetAudience: ['interests', 'demographics'],
    cta: 'shop_now'
  }
];

const FAVORITES_STORAGE_KEY = 'adspy_favorites';

const SearchView: React.FC = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('30d');
  const [selectedSort, setSelectedSort] = useState<SortOption>('date_newest');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
    const favoriteIds = savedFavorites ? JSON.parse(savedFavorites) : [];
    
    // Initialize ads with favorite status from localStorage
    setAds(mockAds.map(ad => ({
      ...ad,
      isFavorite: favoriteIds.includes(ad.id)
    })));
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
        // Mock duration calculation based on date difference from today
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

  // Apply sorting whenever ads or sort option changes
  useEffect(() => {
    setAds(prevAds => sortAds(prevAds, selectedSort));
  }, [selectedSort]);
  
  const handleSearch = (query: string) => {
    setIsLoading(true);
    
    setTimeout(() => {
      const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
      const favoriteIds = savedFavorites ? JSON.parse(savedFavorites) : [];
      
      let filteredAds;
      if (query.trim() === '') {
        filteredAds = mockAds.map(ad => ({
          ...ad,
          isFavorite: favoriteIds.includes(ad.id)
        }));
      } else {
        filteredAds = mockAds
          .filter(ad => 
            ad.title.toLowerCase().includes(query.toLowerCase()) || 
            ad.description.toLowerCase().includes(query.toLowerCase()) ||
            ad.brand.toLowerCase().includes(query.toLowerCase())
          )
          .map(ad => ({
            ...ad,
            isFavorite: favoriteIds.includes(ad.id)
          }));
      }
      
      setAds(sortAds(filteredAds, selectedSort));
      setIsLoading(false);
    }, 800);
  };

  const handleImageSearch = (file: File) => {
    setIsLoading(true);
    
    setTimeout(() => {
      const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
      const favoriteIds = savedFavorites ? JSON.parse(savedFavorites) : [];
      
      const filteredAds = mockAds.slice(0, 2).map(ad => ({
        ...ad,
        isFavorite: favoriteIds.includes(ad.id)
      }));
      
      setAds(sortAds(filteredAds, selectedSort));
      setIsLoading(false);
    }, 1500);
  };
  
  const handleFilterChange = (filters: any) => {
    setIsLoading(true);
    
    setTimeout(() => {
      const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
      const favoriteIds = savedFavorites ? JSON.parse(savedFavorites) : [];
      
      let filteredAds = [...mockAds];
      
      if (filters.countries && filters.countries.length > 0) {
        filteredAds = filteredAds.filter(ad => filters.countries.includes(ad.country));
      }
      
      if (filters.languages && filters.languages.length > 0) {
        filteredAds = filteredAds.filter(ad => filters.languages.includes(ad.language));
      }
      
      if (filters.platforms && filters.platforms.length > 0) {
        filteredAds = filteredAds.filter(ad => filters.platforms.includes(ad.platform));
      }
      
      const adsWithFavorites = filteredAds.map(ad => ({
        ...ad,
        isFavorite: favoriteIds.includes(ad.id)
      }));
      
      setAds(sortAds(adsWithFavorites, selectedSort));
      setIsLoading(false);
    }, 800);
  };
  
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

    // Update selected ad if it's currently open
    if (selectedAd && selectedAd.id === id) {
      setSelectedAd(prev => prev ? { ...prev, isFavorite: !prev.isFavorite } : null);
    }
  };

  const handleDateRangeChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleCardClick = (ad: Ad) => {
    setSelectedAd(ad);
    setIsPreviewOpen(true);
  };

  const handleViewDetails = (id: string) => {
    // Here you would navigate to a detailed view page
    console.log('View details for ad:', id);
    setIsPreviewOpen(false);
  };
  
  return (
    <div className="pt-1 md:mt-0">
      <AnimatedBanner 
        text="Encuentra los anuncios más virales"
        icon={<Zap />}
        gradient="from-primary to-white"
      />
      
      <SearchBar 
        onSearch={handleSearch}
        onImageSearch={handleImageSearch}
        onOpenFilters={() => setIsFiltersOpen(true)} 
      />

      <div className="px-4 md:px-0 mt-2">
        <div className="flex gap-2 items-center">
          {/* Mobile Layout - 3 botones del mismo tamaño */}
          <div className="flex md:hidden gap-2 flex-1">
            <button
              onClick={() => setIsDatePickerOpen(true)}
              className="flex-1 px-3 py-2 rounded-full text-xs font-medium border-2 border-black transition-all inline-flex items-center gap-1 justify-center whitespace-nowrap bg-white hover:bg-neutral-50 shadow-[1px_1px_0_rgba(0,0,0,1)]"
            >
              <Calendar size={14} />
              <span>Periodo</span>
            </button>
            
            {mobileTimeRanges.map(tr => (
              <button
                key={tr.value}
                onClick={() => setSelectedTimeRange(tr.value)}
                className={`flex-1 px-3 py-2 rounded-full text-xs font-medium border-2 border-black transition-all inline-flex items-center gap-1 justify-center whitespace-nowrap ${
                  selectedTimeRange === tr.value 
                    ? "bg-primary shadow-[2px_2px_0_rgba(0,0,0,1)]" 
                    : "bg-white hover:bg-neutral-50 shadow-[1px_1px_0_rgba(0,0,0,1)]"
                }`}
              >
                {tr.icon}
                <span>{tr.label}</span>
              </button>
            ))}
            
            <div className="flex-1">
              <SortButton 
                selectedSort={selectedSort}
                onSortChange={setSelectedSort}
              />
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex gap-2 flex-1">
            <button
              onClick={() => setIsDatePickerOpen(true)}
              className="px-3 py-1.5 rounded-full text-sm font-medium border-2 border-black transition-all inline-flex items-center gap-2 bg-white hover:bg-neutral-50 shadow-[1px_1px_0_rgba(0,0,0,1)]"
            >
              <Calendar size={14} />
              <span>Periodo</span>
            </button>
            {timeRanges.map(tr => (
              <button
                key={tr.value}
                onClick={() => setSelectedTimeRange(tr.value)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border-2 border-black transition-all inline-flex items-center gap-2 ${
                  selectedTimeRange === tr.value 
                    ? "bg-primary shadow-[2px_2px_0_rgba(0,0,0,1)]" 
                    : "bg-white hover:bg-neutral-50 shadow-[1px_1px_0_rgba(0,0,0,1)]"
                }`}
              >
                {tr.icon}
                <span>{tr.label}</span>
              </button>
            ))}
          </div>

          {/* Sort Button - Desktop only (mobile está integrado arriba) */}
          <div className="hidden md:block flex-shrink-0">
            <SortButton 
              selectedSort={selectedSort}
              onSortChange={setSelectedSort}
            />
          </div>
        </div>
      </div>
      
      <SearchFilters 
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        onFilterChange={handleFilterChange}
        selectedTimeRange={selectedTimeRange}
        onTimeRangeChange={setSelectedTimeRange}
      />

      <DateRangePicker
        isOpen={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        selectedTimeRange={selectedTimeRange}
        onTimeRangeChange={setSelectedTimeRange}
        onDateRangeChange={handleDateRangeChange}
      />
      
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
        ) : ads.length === 0 ? (
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
              🔍
            </motion.div>
            <h3 className="text-lg md:text-xl font-bold mb-2">No se encontraron resultados</h3>
            <p className="text-neutral-600 text-sm md:text-base mb-4">
              Intenta con diferentes palabras clave o ajusta los filtros para ver más anuncios.
            </p>
            <motion.button 
              onClick={() => setAds(sortAds(mockAds, selectedSort))}
              className="dopamine-btn inline-flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Ver todos los anuncios
            </motion.button>
          </motion.div>
        ) : (
          <motion.div 
            className="columns-2 md:columns-4 lg:columns-6 gap-2 md:gap-3 px-1 md:px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.05 }}
          >
            {ads.map((ad, index) => (
              <AdCard 
                key={ad.id} 
                ad={ad} 
                onToggleFavorite={toggleFavorite}
                onCardClick={handleCardClick}
                index={index}
              />
            ))}
          </motion.div>
        )}
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

export default SearchView;