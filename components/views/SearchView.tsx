import { useMemo, useState } from 'react';
import SearchBar from '../search/SearchBar';
import SearchFilters from '../search/SearchFilters';
import DateRangePicker from '../search/DateRangePicker';
import SortButton, { SortOption } from '../search/SortButton';
import AdCard from '../shared/AdCard';
import AdPreviewModal from '../shared/AdPreviewModal';
import AnimatedBanner from '../shared/AnimatedBanner';
import { useAds } from '@/lib/useAds';
import type { AdFilters } from '@/lib/types';
import { motion } from 'framer-motion';
import { Zap, Calendar, CalendarDays, Infinity } from 'lucide-react';

const formatDate = (d: Date) =>
  `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,'0')}-${d.getDate().toString().padStart(2,'0')}`;

const timeRanges = [
  { value: '7d', label: '7d', icon: <Calendar size={14} /> },
  { value: '30d', label: '30d', icon: <CalendarDays size={14} /> },
  { value: 'all', label: 'Todo', icon: <Infinity size={14} /> }
];

const mobileTimeRanges = [
  { value: 'all', label: 'Todo', icon: <Infinity size={14} /> }
];

const FAVORITES_STORAGE_KEY = 'adspy_favorites';

const SearchView: React.FC = () => {
  const [filters, setFilters] = useState<AdFilters>({});
  const { ads, loading } = useAds(filters);
  const [selectedSort, setSelectedSort] = useState<SortOption>('date_newest');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [selectedAd, setSelectedAd] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY) || '[]'); }
    catch { return []; }
  });

  // Helper para propagar el cambio de rango de fechas
  const applyTimeRange = (range: any) => {
    setSelectedTimeRange(range);
    setFilters(f => ({ ...f, timeRange: range }));
  };

  // Mantén sortAds como está
  function sortAds(ads: any[], sortOption: string): any[] {
    const sorted = [...ads];
    
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
  }

  const sortedAds = useMemo(() => sortAds(ads, selectedSort), [ads, selectedSort]);
  const enrichedAds = useMemo(
    () => sortedAds.map(ad => ({ ...ad, isFavorite: favorites.includes(ad.id) })),
    [sortedAds, favorites]
  );

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const next = prev.includes(id)
        ? prev.filter(f => f !== id)
        : [...prev, id];
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const handleCardClick = (ad: any) => {
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
        onSearch={q => setFilters(f => ({ ...f, search: q }))}
        onOpenFilters={() => setIsFiltersOpen(true)}
      />
      <div className="px-4 md:px-0 mt-2">
        <div className="flex gap-2 items-center">
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
                onClick={() => applyTimeRange(tr.value)}
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
                onClick={() => applyTimeRange(tr.value)}
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
        onFilterChange={obj => {
          // 👇 Nuevo comportamiento
          if ('__reset' in obj) {
            setFilters({});
          } else {
            setFilters(f => ({ ...f, ...obj }));
          }
        }}
        selectedTimeRange={selectedTimeRange}
        onTimeRangeChange={applyTimeRange}
      />
      <DateRangePicker
        isOpen={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        selectedTimeRange={selectedTimeRange}
        onTimeRangeChange={applyTimeRange}
        onDateRangeChange={(start, end) => {
          if (!start && !end) {
            applyTimeRange('all');
            setFilters(f => { const { startDate, endDate, ...rest } = f; return { ...rest, timeRange: 'all' }; });
            return;
          }
          if (start && end) {
            applyTimeRange('custom');
            setFilters(f => ({ ...f, timeRange: 'custom', startDate: formatDate(start), endDate: formatDate(end) }));
          }
        }}
      />
      <div className="mt-4">
        {loading ? (
          <motion.div className="columns-2 md:columns-4 lg:columns-6 gap-2 md:gap-3 px-1 md:px-4">
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
        ) : enrichedAds.length === 0 ? (
          <motion.div className="bg-white rounded-xl p-6 md:p-8 text-center mx-auto max-w-md">
            <motion.div className="text-4xl md:text-6xl mb-4" animate={{ y: [0, -10, 0] as number[], scale: [1, 1.1, 1] as number[] }} transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}>
              {"🔍"}
            </motion.div>
            <h3 className="text-lg md:text-xl font-bold mb-2">No se encontraron resultados</h3>
            <p className="text-neutral-600 text-sm md:text-base mb-4">
              Intenta con diferentes palabras clave o ajusta los filtros para ver más anuncios.
            </p>
            <motion.button 
              onClick={() => setFilters({})}
              className="dopamine-btn inline-flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Ver todos los anuncios
            </motion.button>
          </motion.div>
        ) : (
          <motion.div className="columns-2 md:columns-4 lg:columns-6 space-y-3 px-1 md:px-4">
            {enrichedAds.map((ad, index) => (
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