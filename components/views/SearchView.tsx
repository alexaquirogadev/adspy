import { useState } from 'react';
import SearchBar from '../search/SearchBar';
import SearchFilters from '../search/SearchFilters';
import DateRangePicker from '../search/DateRangePicker';
import SortButton, { SortOption } from '../search/SortButton';
import SoundCard from '../shared/SoundCard';
import SoundPreviewModal from '../shared/SoundPreviewModal';
import AnimatedBanner from '../shared/AnimatedBanner';
import { useSounds } from '@/lib/useSounds';
import type { Sound } from '@/lib/types';
import { motion } from 'framer-motion';
import { Zap, Calendar, CalendarDays, Infinity as InfinityIcon } from 'lucide-react';

const formatDate = (d: Date) =>
  `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,'0')}-${d.getDate().toString().padStart(2,'0')}`;

const timeRanges = [
  { value: '7d', label: '7d', icon: <Calendar size={14} /> },
  { value: '30d', label: '30d', icon: <CalendarDays size={14} /> },
  { value: 'all', label: 'Todo', icon: <InfinityIcon size={14} /> }
];

const mobileTimeRanges = [
  { value: 'all', label: 'Todo', icon: <InfinityIcon size={14} /> }
];

const FAVORITES_STORAGE_KEY = 'adspy_favorites';

const SearchView: React.FC = () => {
  const [filters, setFilters] = useState<{ region: string } & Record<string, any>>({ region: 'ES' });
  const { sounds, isLoading } = useSounds(filters.region || 'ES');
  const [selectedSort, setSelectedSort] = useState<SortOption>('date_newest');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [selected, setSelected] = useState<Sound | null>(null);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY) || '[]'); }
    catch { return []; }
  });

  // Helper para propagar el cambio de rango de fechas
  const applyTimeRange = (range: any) => {
    setSelectedTimeRange(range);
    setFilters(f => ({ ...f, timeRange: range }));
  };

  // Ordena los sonidos por fecha si existe
  const sortedSounds = [...sounds].sort((a, b) => {
    if (a.fetched_at && b.fetched_at) {
      return new Date(b.fetched_at).getTime() - new Date(a.fetched_at).getTime();
    }
    return 0;
  });

  // Añade favoritos
  const enrichedSounds = sortedSounds.map(sound => ({ ...sound, isFavorite: favorites.includes(sound.id) }));

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const next = prev.includes(id)
        ? prev.filter(f => f !== id)
        : [...prev, id];
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  return (
    <div className="pt-1 md:mt-0">
      <AnimatedBanner 
        text="Encuentra los sonidos más virales"
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
          if ('__reset' in obj) {
            setFilters({ region: 'ES' });
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
            setFilters(prev => ({ ...prev, timeRange: 'all', startDate: undefined, endDate: undefined }));
            return;
          }
          if (start && end) {
            applyTimeRange('custom');
            setFilters(f => ({ ...f, timeRange: 'custom', startDate: formatDate(start), endDate: formatDate(end) }));
          }
        }}
      />
      <div className="mt-4">
        {isLoading ? (
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
        ) : enrichedSounds.length === 0 ? (
          <motion.div className="bg-white rounded-xl p-6 md:p-8 text-center mx-auto max-w-md">
            <motion.div className="text-4xl md:text-6xl mb-4" animate={{ y: [0, -10, 0], scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}>
              {"🔍"}
            </motion.div>
            <h3 className="text-lg md:text-xl font-bold mb-2">No se encontraron sonidos</h3>
            <p className="text-neutral-600 text-sm md:text-base mb-4">
              Intenta con diferentes palabras clave o ajusta los filtros para ver más sonidos.
            </p>
            <motion.button 
              onClick={() => setFilters({ region: 'ES' })}
              className="dopamine-btn inline-flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Ver todos los sonidos
            </motion.button>
          </motion.div>
        ) : (
          <motion.div className="columns-2 md:columns-4 lg:columns-6 space-y-3 px-1 md:px-4">
            {enrichedSounds.map(sound => (
              <SoundCard 
                key={sound.id} 
                sound={sound}
                onToggleFavorite={toggleFavorite}
                onCardClick={() => setSelected(sound)}
              />
            ))}
          </motion.div>
        )}
      </div>
      {selected && <SoundPreviewModal sound={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};

export default SearchView;