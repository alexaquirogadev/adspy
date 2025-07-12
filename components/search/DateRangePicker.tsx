import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface DateRangePickerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTimeRange: string; // Changed from TimeRange to string
  onTimeRangeChange: (range: string) => void; // Changed from TimeRange to string
  onDateRangeChange?: (startDate: Date | null, endDate: Date | null) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  isOpen,
  onClose,
  selectedTimeRange,
  onTimeRangeChange,
  onDateRangeChange
}) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const quickDateRanges = [
    { label: 'Últimos 7 días', value: '7d' },
    { label: 'Últimos 15 días', value: '15d' },
    { label: 'Últimos 30 días', value: '30d' }
  ];

  const handleDateClick = (date: Date) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
    } else {
      if (date < startDate) {
        setEndDate(startDate);
        setStartDate(date);
      } else {
        setEndDate(date);
      }
    }
    // Ya no llamamos a onDateRangeChange aquí
  };

  const isDateInRange = (date: Date): boolean => {
    if (!startDate || !endDate) return false;
    return date >= startDate && date <= endDate;
  };

  const isDateSelected = (date: Date): boolean => {
    if (!startDate) return false;
    if (!endDate) return date.getTime() === startDate.getTime();
    return date.getTime() === startDate.getTime() || date.getTime() === endDate.getTime();
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric',
      month: 'short'
    });
  };

  const renderMonth = (date: Date) => {
    const days = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];
    const month = date.getMonth();
    const year = date.getFullYear();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const weeks = Math.ceil((firstDay + daysInMonth) / 7);
    
    const monthDays = [];
    let dayCount = 1;
    
    for (let i = 0; i < weeks * 7; i++) {
      if (i < firstDay || dayCount > daysInMonth) {
        monthDays.push(null);
      } else {
        monthDays.push(new Date(year, month, dayCount));
        dayCount++;
      }
    }
    
    return (
      <div>
        <div className="flex items-center justify-between mb-2">
          <button 
            onClick={prevMonth}
            className="p-1 hover:bg-neutral-100 rounded-full transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm font-medium">
            {date.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </span>
          <button 
            onClick={nextMonth}
            className="p-1 hover:bg-neutral-100 rounded-full transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-0.5 text-center text-xs">
          {days.map(day => (
            <div key={day} className="text-neutral-500 py-1">{day}</div>
          ))}
          {monthDays.map((date, i) => {
            if (!date) {
              return <div key={`empty-${i}`} />;
            }
            
            const isSelected = isDateSelected(date);
            const inRange = isDateInRange(date);
            
            return (
              <button
                key={date.getTime()}
                onClick={() => handleDateClick(date)}
                className={twMerge(
                  "aspect-square rounded-full flex items-center justify-center text-xs transition-colors relative",
                  isSelected && "bg-primary font-bold shadow-[2px_2px_0_rgba(0,0,0,1)]",
                  inRange && "bg-primary/30",
                  !isSelected && !inRange && "hover:bg-neutral-100"
                )}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    );
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
          
          {/* Mobile View */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 35, stiffness: 400 }}
            className="fixed inset-x-0 bottom-0 bg-white border-t-2 border-black rounded-t-2xl z-50 shadow-retro md:hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-neutral-200">
              <h3 className="text-lg font-bold">Seleccionar fechas</h3>
              <button 
                onClick={onClose}
                className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {quickDateRanges.map(range => (
                  <button
                    key={range.value}
                    onClick={() => {
                      onTimeRangeChange(range.value); // solo esto
                      onClose();
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs border-2 border-black ${
                      selectedTimeRange === range.value 
                        ? 'bg-primary shadow-[2px_2px_0_rgba(0,0,0,1)]' 
                        : 'bg-white hover:bg-neutral-50'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>

              <div className="space-y-4 max-h-[calc(100vh-16rem)] overflow-y-auto pb-4">
                {renderMonth(currentMonth)}
                {renderMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-neutral-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-neutral-500">Rango seleccionado</p>
                  <p className="font-medium">
                    {startDate ? (
                      endDate ? (
                        `${formatDate(startDate)} - ${formatDate(endDate)}`
                      ) : (
                        formatDate(startDate)
                      )
                    ) : (
                      'Selecciona las fechas'
                    )}
                  </p>
                </div>
                <button 
                  onClick={() => {
                    setStartDate(null);
                    setEndDate(null);
                    onTimeRangeChange('all');
                    if (onDateRangeChange) {
                      onDateRangeChange(null, null);
                    }
                  }}
                  className="text-xs text-secondary hover:underline"
                >
                  Reiniciar
                </button>
              </div>
              <button 
                onClick={() => {
                  if (startDate && endDate) {
                    onDateRangeChange?.(startDate, endDate); // ahora sí
                    onTimeRangeChange('custom');
                  }
                  onClose();
                }}
                className="w-full py-3 bg-primary border-2 border-black rounded-xl font-medium shadow-retro hover:bg-primary-hover transition-colors"
              >
                Aplicar
              </button>
            </div>
          </motion.div>

          {/* Desktop View */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 35, stiffness: 400 }}
            className="fixed hidden md:flex flex-col inset-x-4 top-20 md:top-24 bg-white border-2 border-black rounded-2xl z-50 shadow-retro md:max-w-xl md:mx-auto max-h-[calc(100vh-10rem)]"
          >
            <div className="flex flex-wrap gap-2 p-4 border-b border-neutral-200">
              {quickDateRanges.map(range => (
                <button
                  key={range.value}
                  onClick={() => {
                    onTimeRangeChange(range.value); // Changed from TimeRange to string
                    onClose();
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs border-2 border-black ${
                    selectedTimeRange === range.value 
                      ? 'bg-primary shadow-[2px_2px_0_rgba(0,0,0,1)]' 
                      : 'bg-white hover:bg-neutral-50'
                  }`}
                >
                  {range.label}
                </button>
              ))}
              <button 
                onClick={onClose}
                className="ml-auto p-1.5 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                {renderMonth(currentMonth)}
                {renderMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
              </div>
            </div>

            <div className="p-4 border-t border-neutral-200 flex gap-3 mt-auto">
              <button 
                onClick={() => {
                  setStartDate(null);
                  setEndDate(null);
                  onTimeRangeChange('all');
                  if (onDateRangeChange) {
                    onDateRangeChange(null, null);
                  }
                }}
                className="flex-1 py-2 text-neutral-700 hover:bg-neutral-100 rounded-xl transition-colors text-sm"
              >
                Reiniciar
              </button>
              <button 
                onClick={() => {
                  if (startDate && endDate) {
                    onDateRangeChange?.(startDate, endDate); // ahora sí
                    onTimeRangeChange('custom');
                  }
                  onClose();
                }}
                className="flex-1 py-2 bg-primary border-2 border-black rounded-xl font-medium shadow-retro hover:bg-primary-hover transition-colors text-sm"
              >
                Aplicar
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DateRangePicker;