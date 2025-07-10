import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { TimeRange } from '../../lib/types';

interface DateRangeFilterProps {
  selectedTimeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
  onDateRangeChange?: (startDate: Date | null, endDate: Date | null) => void;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
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
    
    if (onDateRangeChange) {
      if (!startDate || (startDate && endDate)) {
        onDateRangeChange(date, null);
      } else {
        onDateRangeChange(startDate, date < startDate ? startDate : date);
      }
    }
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

  const handleTimeRangeChange = (range: TimeRange) => {
    onTimeRangeChange(range);
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
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
    <div>
      <div className="mb-4">
        <h3 className="text-sm font-semibold mb-2">Fecha de Creación</h3>
        <div className="flex flex-wrap gap-2">
          {quickDateRanges.map(range => (
            <button
              key={range.value}
              onClick={() => handleTimeRangeChange(range.value as TimeRange)}
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
      </div>

      <div className="grid grid-cols-2 gap-4">
        {renderMonth(currentMonth)}
        {renderMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
      </div>
    </div>
  );
};

export default DateRangeFilter;