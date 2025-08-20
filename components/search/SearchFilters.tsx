import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Globe, Languages, Clock, Calendar } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import DateRangePicker from './DateRangePicker';

/**
 * TODO: Cuando mode==='sounds', ocultar los paneles de filtros (plataforma, idioma, etc.).
 * Actualmente los filtros solo aplican a anuncios.
 */
interface SearchFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  onFilterChange: (filters: Record<string, unknown>) => void;
  selectedTimeRange: string; // Changed from TimeRange to string
  onTimeRangeChange: (range: string) => void; // Changed from TimeRange to string
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ 
  isOpen, 
  onClose, 
  onFilterChange,
  selectedTimeRange,
  onTimeRangeChange 
}) => {
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  
  const countries: { code: string; name: string }[] = [
    { code: 'US', name: 'Estados Unidos' },
    { code: 'UK', name: 'Reino Unido' },
    { code: 'ES', name: 'España' },
    { code: 'DE', name: 'Alemania' },
    { code: 'FR', name: 'Francia' }
  ];
  
  const languages: { code: string; name: string }[] = [
    { code: 'en', name: 'Inglés' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Francés' },
    { code: 'de', name: 'Alemán' },
    { code: 'it', name: 'Italiano' }
  ];

  const toggleCountry = (code: string) => {
    setSelectedCountries(prev => 
      prev.includes(code) 
        ? prev.filter(c => c !== code)
        : [...prev, code]
    );
  };
  
  const toggleLanguage = (code: string) => {
    setSelectedLanguages(prev => 
      prev.includes(code) 
        ? prev.filter(l => l !== code)
        : [...prev, code]
    );
  };

  const formatDate = (d: Date) =>
    `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,'0')}-${d.getDate().toString().padStart(2,'0')}`;

  const handleDateRangeChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  const applyFilters = () => {
    onFilterChange({
      countries: selectedCountries,
      languages: selectedLanguages,
      timeRange: selectedTimeRange,
      ...(startDate && endDate ? {
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
      } : {})
    });
    onClose();
  };

  const resetFilters = () => {
    setSelectedCountries([]);
    setSelectedLanguages([]);
    setStartDate(null);
    setEndDate(null);
    onTimeRangeChange('30d');
    onFilterChange({});
    onFilterChange({ __reset: true });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 35, stiffness: 400 }}
            className="fixed inset-x-4 top-20 md:top-24 bg-white border-2 border-black rounded-2xl z-50 shadow-retro max-h-[calc(100vh-6rem)] overflow-y-auto md:max-w-2xl md:mx-auto"
          >
            <div className="sticky top-0 bg-white/80 backdrop-blur-sm px-4 py-3 border-b border-neutral-200 flex items-center justify-between">
              <h3 className="text-lg font-bold">Filtros</h3>
              <button 
                onClick={onClose}
                className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-4 space-y-6">
              {/* Periodo */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Clock size={18} />
                  <h3 className="font-semibold">Periodo</h3>
                </div>
                <button
                  onClick={() => setIsDatePickerOpen(true)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border-2 border-black bg-white hover:bg-neutral-50 transition-colors"
                >
                  <Calendar size={14} />
                  <span>Seleccionar periodo</span>
                </button>
              </div>
              {/* Países */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Globe size={18} />
                  <h3 className="font-semibold">Países</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {countries.map(country => (
                    <button
                      key={country.code}
                      onClick={() => toggleCountry(country.code)}
                      className={twMerge(
                        "px-3 py-1.5 rounded-full text-sm font-medium border-2 border-black transition-colors",
                        selectedCountries.includes(country.code) 
                          ? "bg-primary shadow-[2px_2px_0_rgba(0,0,0,1)]" 
                          : "bg-white hover:bg-neutral-50"
                      )}
                    >
                      {country.name}
                    </button>
                  ))}
                </div>
              </div>
              {/* Idiomas */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Languages size={18} />
                  <h3 className="font-semibold">Idiomas</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => toggleLanguage(lang.code)}
                      className={twMerge(
                        "px-3 py-1.5 rounded-full text-sm font-medium border-2 border-black transition-colors",
                        selectedLanguages.includes(lang.code) 
                          ? "bg-primary shadow-[2px_2px_0_rgba(0,0,0,1)]" 
                          : "bg-white hover:bg-neutral-50"
                      )}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 bg-white border-t border-neutral-200 p-4 flex gap-3">
              <button 
                onClick={resetFilters}
                className="flex-1 py-2 text-neutral-700 hover:bg-neutral-100 rounded-xl transition-colors text-sm"
              >
                Reiniciar
              </button>
              <button 
                onClick={applyFilters}
                className="flex-1 py-2 bg-primary border-2 border-black rounded-xl font-medium shadow-retro hover:bg-primary-hover transition-colors text-sm"
              >
                Aplicar
              </button>
            </div>
          </motion.div>
          <DateRangePicker
            isOpen={isDatePickerOpen}
            onClose={() => setIsDatePickerOpen(false)}
            selectedTimeRange={selectedTimeRange}
            onTimeRangeChange={onTimeRangeChange}
            onDateRangeChange={handleDateRangeChange}
          />
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchFilters;