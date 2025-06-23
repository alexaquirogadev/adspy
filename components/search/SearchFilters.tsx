import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Globe, Languages, Clock, Calendar, Store, Activity, Layers, DollarSign, Image, Users, MousePointer } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { CountryCode, Language, Platform, TimeRange, AdStatus, MediaType, TargetAudience, CTA } from '../../lib/types';
import DateRangePicker from './DateRangePicker';

interface SearchFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  onFilterChange: (filters: any) => void;
  selectedTimeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ 
  isOpen, 
  onClose, 
  onFilterChange,
  selectedTimeRange,
  onTimeRangeChange 
}) => {
  const [selectedCountries, setSelectedCountries] = useState<CountryCode[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<Language[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isEcommerce, setIsEcommerce] = useState<boolean | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<AdStatus[]>([]);
  const [selectedMediaTypes, setSelectedMediaTypes] = useState<MediaType[]>([]);
  const [selectedTargetAudience, setSelectedTargetAudience] = useState<TargetAudience[]>([]);
  const [selectedCTAs, setSelectedCTAs] = useState<CTA[]>([]);
  const [adsetRange, setAdsetRange] = useState<{ min?: number; max?: number }>({});
  const [spendRange, setSpendRange] = useState<{ min?: number; max?: number }>({});
  
  const countries: { code: CountryCode; name: string }[] = [
    { code: 'US', name: 'Estados Unidos' },
    { code: 'UK', name: 'Reino Unido' },
    { code: 'ES', name: 'España' },
    { code: 'DE', name: 'Alemania' },
    { code: 'FR', name: 'Francia' }
  ];
  
  const languages: { code: Language; name: string }[] = [
    { code: 'en', name: 'Inglés' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Francés' },
    { code: 'de', name: 'Alemán' },
    { code: 'it', name: 'Italiano' }
  ];
  
  const platforms: { code: Platform; name: string }[] = [
    { code: 'facebook', name: 'Facebook' },
    { code: 'instagram', name: 'Instagram' },
    { code: 'youtube', name: 'YouTube' },
    { code: 'tiktok', name: 'TikTok' },
    { code: 'twitter', name: 'Twitter' }
  ];

  const adStatus: { value: AdStatus; label: string }[] = [
    { value: 'active', label: 'Activo' },
    { value: 'inactive', label: 'Inactivo' },
    { value: 'archived', label: 'Archivado' }
  ];

  const mediaTypes: { value: MediaType; label: string }[] = [
    { value: 'image', label: 'Imagen' },
    { value: 'video', label: 'Video' },
    { value: 'carousel', label: 'Carrusel' },
    { value: 'collection', label: 'Colección' },
    { value: 'story', label: 'Historia' }
  ];

  const targetAudiences: { value: TargetAudience; label: string }[] = [
    { value: 'interests', label: 'Intereses' },
    { value: 'behaviors', label: 'Comportamientos' },
    { value: 'demographics', label: 'Demografía' },
    { value: 'custom_audiences', label: 'Audiencias personalizadas' },
    { value: 'lookalikes', label: 'Lookalikes' }
  ];

  const ctas: { value: CTA; label: string }[] = [
    { value: 'shop_now', label: 'Comprar ahora' },
    { value: 'learn_more', label: 'Más información' },
    { value: 'sign_up', label: 'Registrarse' },
    { value: 'download', label: 'Descargar' },
    { value: 'contact_us', label: 'Contactar' },
    { value: 'book_now', label: 'Reservar' },
    { value: 'get_offer', label: 'Ver oferta' }
  ];

  const toggleCountry = (code: CountryCode) => {
    setSelectedCountries(prev => 
      prev.includes(code) 
        ? prev.filter(c => c !== code)
        : [...prev, code]
    );
  };
  
  const toggleLanguage = (code: Language) => {
    setSelectedLanguages(prev => 
      prev.includes(code) 
        ? prev.filter(l => l !== code)
        : [...prev, code]
    );
  };
  
  const togglePlatform = (code: Platform) => {
    setSelectedPlatforms(prev => 
      prev.includes(code) 
        ? prev.filter(p => p !== code)
        : [...prev, code]
    );
  };

  const toggleStatus = (status: AdStatus) => {
    setSelectedStatus(prev => 
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const toggleMediaType = (type: MediaType) => {
    setSelectedMediaTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const toggleTargetAudience = (audience: TargetAudience) => {
    setSelectedTargetAudience(prev =>
      prev.includes(audience)
        ? prev.filter(a => a !== audience)
        : [...prev, audience]
    );
  };

  const toggleCTA = (cta: CTA) => {
    setSelectedCTAs(prev =>
      prev.includes(cta)
        ? prev.filter(c => c !== cta)
        : [...prev, cta]
    );
  };

  const handleDateRangeChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
    if (start && end) {
      onTimeRangeChange('custom');
    }
  };

  const applyFilters = () => {
    onFilterChange({
      countries: selectedCountries,
      languages: selectedLanguages,
      platforms: selectedPlatforms,
      timeRange: selectedTimeRange,
      ...(startDate && endDate ? {
        customDateRange: {
          start: startDate.toISOString(),
          end: endDate.toISOString()
        }
      } : {}),
      isEcommerce: isEcommerce,
      status: selectedStatus,
      adsetRange,
      spendRange,
      mediaTypes: selectedMediaTypes,
      targetAudience: selectedTargetAudience,
      cta: selectedCTAs
    });
    onClose();
  };

  const resetFilters = () => {
    setSelectedCountries([]);
    setSelectedLanguages([]);
    setSelectedPlatforms([]);
    setStartDate(null);
    setEndDate(null);
    setIsEcommerce(null);
    setSelectedStatus([]);
    setSelectedMediaTypes([]);
    setSelectedTargetAudience([]);
    setSelectedCTAs([]);
    setAdsetRange({});
    setSpendRange({});
    onTimeRangeChange('30d');
    onFilterChange({});
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
              {/* Period */}
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

              {/* Platforms */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-bold text-lg">📱</span>
                  <h3 className="font-semibold">Plataformas</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {platforms.map(platform => (
                    <button
                      key={platform.code}
                      onClick={() => togglePlatform(platform.code)}
                      className={twMerge(
                        "px-3 py-1.5 rounded-full text-sm font-medium border-2 border-black transition-colors",
                        selectedPlatforms.includes(platform.code) 
                          ? "bg-primary shadow-[2px_2px_0_rgba(0,0,0,1)]" 
                          : "bg-white hover:bg-neutral-50"
                      )}
                    >
                      {platform.name}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Countries */}
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
              
              {/* Languages */}
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

              {/* E-commerce Filter */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Store size={18} />
                  <h3 className="font-semibold">E-commerce</h3>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEcommerce(true)}
                    className={twMerge(
                      "px-3 py-1.5 rounded-full text-sm font-medium border-2 border-black transition-colors",
                      isEcommerce === true ? "bg-primary shadow-[2px_2px_0_rgba(0,0,0,1)]" : "bg-white hover:bg-neutral-50"
                    )}
                  >
                    Sí
                  </button>
                  <button
                    onClick={() => setIsEcommerce(false)}
                    className={twMerge(
                      "px-3 py-1.5 rounded-full text-sm font-medium border-2 border-black transition-colors",
                      isEcommerce === false ? "bg-primary shadow-[2px_2px_0_rgba(0,0,0,1)]" : "bg-white hover:bg-neutral-50"
                    )}
                  >
                    No
                  </button>
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Activity size={18} />
                  <h3 className="font-semibold">Estado</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {adStatus.map(status => (
                    <button
                      key={status.value}
                      onClick={() => toggleStatus(status.value)}
                      className={twMerge(
                        "px-3 py-1.5 rounded-full text-sm font-medium border-2 border-black transition-colors",
                        selectedStatus.includes(status.value) ? "bg-primary shadow-[2px_2px_0_rgba(0,0,0,1)]" : "bg-white hover:bg-neutral-50"
                      )}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Adsets Range */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Layers size={18} />
                  <h3 className="font-semibold">Total de Adsets</h3>
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Mín"
                    value={adsetRange.min || ''}
                    onChange={(e) => setAdsetRange(prev => ({ ...prev, min: parseInt(e.target.value) || undefined }))}
                    className="w-24 px-3 py-1.5 rounded-lg border-2 border-black text-sm"
                  />
                  <span className="self-center">-</span>
                  <input
                    type="number"
                    placeholder="Máx"
                    value={adsetRange.max || ''}
                    onChange={(e) => setAdsetRange(prev => ({ ...prev, max: parseInt(e.target.value) || undefined }))}
                    className="w-24 px-3 py-1.5 rounded-lg border-2 border-black text-sm"
                  />
                </div>
              </div>

              {/* Spend Range */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign size={18} />
                  <h3 className="font-semibold">Total de Gasto</h3>
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Mín"
                    value={spendRange.min || ''}
                    onChange={(e) => setSpendRange(prev => ({ ...prev, min: parseInt(e.target.value) || undefined }))}
                    className="w-24 px-3 py-1.5 rounded-lg border-2 border-black text-sm"
                  />
                  <span className="self-center">-</span>
                  <input
                    type="number"
                    placeholder="Máx"
                    value={spendRange.max || ''}
                    onChange={(e) => setSpendRange(prev => ({ ...prev, max: parseInt(e.target.value) || undefined }))}
                    className="w-24 px-3 py-1.5 rounded-lg border-2 border-black text-sm"
                  />
                </div>
              </div>

              {/* Media Type */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Image size={18} />
                  <h3 className="font-semibold">Tipo de Medio</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {mediaTypes.map(type => (
                    <button
                      key={type.value}
                      onClick={() => toggleMediaType(type.value)}
                      className={twMerge(
                        "px-3 py-1.5 rounded-full text-sm font-medium border-2 border-black transition-colors",
                        selectedMediaTypes.includes(type.value) ? "bg-primary shadow-[2px_2px_0_rgba(0,0,0,1)]" : "bg-white hover:bg-neutral-50"
                      )}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Audience */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Users size={18} />
                  <h3 className="font-semibold">Público Objetivo</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {targetAudiences.map(audience => (
                    <button
                      key={audience.value}
                      onClick={() => toggleTargetAudience(audience.value)}
                      className={twMerge(
                        "px-3 py-1.5 rounded-full text-sm font-medium border-2 border-black transition-colors",
                        selectedTargetAudience.includes(audience.value) ? "bg-primary shadow-[2px_2px_0_rgba(0,0,0,1)]" : "bg-white hover:bg-neutral-50"
                      )}
                    >
                      {audience.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MousePointer size={18} />
                  <h3 className="font-semibold">CTA</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {ctas.map(cta => (
                    <button
                      key={cta.value}
                      onClick={() => toggleCTA(cta.value)}
                      className={twMerge(
                        "px-3 py-1.5 rounded-full text-sm font-medium border-2 border-black transition-colors",
                        selectedCTAs.includes(cta.value) ? "bg-primary shadow-[2px_2px_0_rgba(0,0,0,1)]" : "bg-white hover:bg-neutral-50"
                      )}
                    >
                      {cta.label}
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