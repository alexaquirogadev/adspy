import React from 'react';
import { Search, Star, User, BarChart, ChevronLeft, Trophy, Target } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import LogoutButton from '@/components/auth/LogoutButton';
import type { ViewType } from '@/lib/types';

interface SidebarProps {
  isAdmin?: boolean;
  onClose?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  activeView: ViewType;
  setActiveView: React.Dispatch<React.SetStateAction<ViewType>>;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isAdmin = false, 
  onClose,
  isCollapsed = false,
  onToggleCollapse,
  activeView,
  setActiveView
}) => {
  const navItems: { view: ViewType; icon: React.ReactNode; label: string }[] = [
    //{ view: 'search', icon: <Search size={24} />, label: 'Buscar' },
    { view: 'ranking', icon: <Trophy size={24} />, label: 'Top Ranking' },
    //{ view: 'problems', icon: <Target size={24} />, label: 'Por Problema' },
    //{ view: 'favorites', icon: <Star size={24} />, label: 'Favoritos' },
    { view: 'account', icon: <User size={24} />, label: 'Mi cuenta' },
  ];  
  if (isAdmin) {
    navItems.push({ view: 'admin', icon: <BarChart size={24} />, label: 'Admin' });
  }
  
  return (
    <div className={twMerge(
      "h-screen bg-white border-r-2 border-black flex flex-col transition-all duration-300 relative",
      isCollapsed ? "w-20" : "w-[280px] md:w-64"
    )}>
      <div className="h-16 flex items-center px-4">
        <div 
          className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
          onClick={() => setActiveView('search')}
        >
          <div className="bg-black text-primary font-bold text-xl p-2 rounded flex-shrink-0">
            AL
          </div>
          {!isCollapsed && (
            <span className="text-xl font-bold truncate">AdSpy Lite</span>
          )}
        </div>
      </div>

      {/* Collapse button */}
      <button
        onClick={onToggleCollapse}
        className={twMerge(
          "hidden md:flex absolute -right-4 top-8 w-8 h-8 bg-primary hover:bg-primary-hover border-2 border-black rounded-full items-center justify-center transition-all duration-300 z-50 shadow-[2px_2px_0_rgba(0,0,0,1)]",
          isCollapsed ? "rotate-180" : ""
        )}
        aria-label={isCollapsed ? "Expandir menú" : "Colapsar menú"}
      >
        <ChevronLeft size={16} className="text-black" />
      </button>
      
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.view}>
              <div
                onClick={() => {
                  setActiveView(item.view);
                  onClose?.();
                }}
                className={twMerge(
                  "flex items-center gap-3 p-3 rounded-xl transition-all duration-300 hover:bg-neutral-100 cursor-pointer",
                  activeView === item.view && "bg-primary border-2 border-black shadow-retro"
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <span className={activeView === item.view ? "text-black" : "text-neutral-700"}>
                  {item.icon}
                </span>
                {!isCollapsed && (
                  <span className={twMerge(
                    "font-medium truncate",
                    activeView === item.view ? "text-black" : "text-neutral-700"
                  )}>
                    {item.label}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t-2 border-black mt-auto">
        <LogoutButton 
          className={isCollapsed ? 'justify-center' : ''}
          label={isCollapsed ? '' : 'Cerrar sesión'}
        />
      </div>
    </div>
  );
};

export default Sidebar;