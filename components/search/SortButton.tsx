import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpDown, Calendar, Clock, Layers, DollarSign, Heart, Eye, ChevronDown } from 'lucide-react';

export type SortOption = 
  | 'date_newest' 
  | 'date_oldest' 
  | 'duration_longest' 
  | 'duration_shortest' 
  | 'adsets_most' 
  | 'adsets_least' 
  | 'spend_highest' 
  | 'spend_lowest' 
  | 'likes_most' 
  | 'likes_least' 
  | 'views_most' 
  | 'views_least';

interface SortButtonProps {
  selectedSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const sortOptions = [
  {
    group: 'Fecha de publicación',
    options: [
      { value: 'date_newest' as SortOption, label: 'Más recientes', icon: <Calendar size={14} /> },
      { value: 'date_oldest' as SortOption, label: 'Más antiguos', icon: <Calendar size={14} /> }
    ]
  },
  {
    group: 'Tiempo de duración',
    options: [
      { value: 'duration_longest' as SortOption, label: 'Mayor duración', icon: <Clock size={14} /> },
      { value: 'duration_shortest' as SortOption, label: 'Menor duración', icon: <Clock size={14} /> }
    ]
  },
  {
    group: 'Número de adsets',
    options: [
      { value: 'adsets_most' as SortOption, label: 'Más adsets', icon: <Layers size={14} /> },
      { value: 'adsets_least' as SortOption, label: 'Menos adsets', icon: <Layers size={14} /> }
    ]
  },
  {
    group: 'Gasto total',
    options: [
      { value: 'spend_highest' as SortOption, label: 'Mayor gasto', icon: <DollarSign size={14} /> },
      { value: 'spend_lowest' as SortOption, label: 'Menor gasto', icon: <DollarSign size={14} /> }
    ]
  },
  {
    group: 'Likes',
    options: [
      { value: 'likes_most' as SortOption, label: 'Más likes', icon: <Heart size={14} /> },
      { value: 'likes_least' as SortOption, label: 'Menos likes', icon: <Heart size={14} /> }
    ]
  },
  {
    group: 'Impresiones',
    options: [
      { value: 'views_most' as SortOption, label: 'Más vistas', icon: <Eye size={14} /> },
      { value: 'views_least' as SortOption, label: 'Menos vistas', icon: <Eye size={14} /> }
    ]
  }
];

const SortButton: React.FC<SortButtonProps> = ({ selectedSort, onSortChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getSelectedLabel = () => {
    for (const group of sortOptions) {
      const option = group.options.find(opt => opt.value === selectedSort);
      if (option) return option.label;
    }
    return 'Ordenar';
  };

  const getSelectedIcon = () => {
    for (const group of sortOptions) {
      const option = group.options.find(opt => opt.value === selectedSort);
      if (option) return option.icon;
    }
    return <ArrowUpDown size={14} />;
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white border-2 border-black rounded-full hover:bg-neutral-50 transition-colors text-xs font-medium shadow-[1px_1px_0_rgba(0,0,0,1)] hover:shadow-[2px_2px_0_rgba(0,0,0,1)]"
      >
        {getSelectedIcon()}
        <span className="hidden sm:inline">{getSelectedLabel()}</span>
        <span className="sm:hidden">Ordenar</span>
        <ChevronDown 
          size={14} 
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile View */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 35, stiffness: 400 }}
              className="fixed inset-x-0 bottom-0 md:hidden bg-white border-t-2 border-black rounded-t-2xl z-50 shadow-retro"
              style={{ maxHeight: 'calc(100vh - 64px)' }}
            >
              <div className="sticky top-0 bg-white border-b border-neutral-200 px-4 py-3 flex items-center justify-between">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <ArrowUpDown size={20} />
                  Ordenar por
                </h3>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-8rem)]">
                {sortOptions.map((group, groupIndex) => (
                  <div key={groupIndex}>
                    <h4 className="text-sm font-semibold text-neutral-600 mb-2 px-2">
                      {group.group}
                    </h4>
                    <div className="space-y-1">
                      {group.options.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            onSortChange(option.value);
                            setIsOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left ${
                            selectedSort === option.value
                              ? 'bg-primary border-2 border-black shadow-[2px_2px_0_rgba(0,0,0,1)]'
                              : 'hover:bg-neutral-50'
                          }`}
                        >
                          {option.icon}
                          <span className="font-medium">{option.label}</span>
                          {selectedSort === option.value && (
                            <div className="ml-auto w-2 h-2 rounded-full bg-black"></div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Desktop View */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ type: "spring", damping: 35, stiffness: 400 }}
              className="absolute hidden md:block right-0 top-full mt-2 w-64 bg-white border-2 border-black rounded-xl z-50 shadow-retro overflow-hidden"
            >
              <div className="max-h-80 overflow-y-auto">
                {sortOptions.map((group, groupIndex) => (
                  <div key={groupIndex}>
                    <div className="px-3 py-2 bg-neutral-50 border-b border-neutral-200">
                      <h4 className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
                        {group.group}
                      </h4>
                    </div>
                    {group.options.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          onSortChange(option.value);
                          setIsOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 p-3 hover:bg-neutral-50 transition-colors text-left border-b border-neutral-100 last:border-b-0 ${
                          selectedSort === option.value ? 'bg-primary/20 font-semibold' : ''
                        }`}
                      >
                        {option.icon}
                        <span className="text-sm">{option.label}</span>
                        {selectedSort === option.value && (
                          <div className="ml-auto w-2 h-2 rounded-full bg-black"></div>
                        )}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SortButton;