import React, { useState, useRef, useEffect } from 'react';
import { Bell, ChevronDown, Settings, User, LogOut, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import NotificationsMenu from './NotificationsMenu';

interface HeaderProps {
  user?: {
    name: string;
    email: string;
    avatarUrl?: string;
    subscription: {
      plan: 'free' | 'basic' | 'pro';
    };
  };
}

const Header: React.FC<HeaderProps> = ({ 
  user = { 
    name: 'Usuario',
    email: 'usuario@ejemplo.com',
    subscription: { plan: 'free' } 
  } 
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  
  const notificationsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'pro': return 'bg-secondary text-white';
      case 'basic': return 'bg-primary text-black';
      default: return 'bg-neutral-200 text-neutral-700';
    }
  };

  return (
    <header className="h-14 bg-transparent sticky top-0 z-50 w-full">
      <motion.div 
        className="flex items-center justify-end h-full max-w-screen-2xl mx-auto px-4"
        initial={{ opacity: 1, y: 0 }}
        animate={{ 
          opacity: isVisible ? 1 : 0,
          y: isVisible ? 0 : -100,
          pointerEvents: isVisible ? 'auto' : 'none'
        }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center gap-2 md:gap-3">
          <div className={`hidden md:block px-2 py-1 rounded-full text-xs font-medium ${getPlanColor(user.subscription.plan)}`}>
            {user.subscription.plan.toUpperCase()}
          </div>
          
          <div className="relative" ref={notificationsRef}>
            <button 
              className="p-1.5 relative hover:bg-white/50 rounded-lg transition-colors"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-secondary"></span>
            </button>

            <AnimatePresence>
              {showNotifications && (
                <NotificationsMenu 
                  notifications={[
                    {
                      id: 1,
                      title: 'Nuevo anuncio viral',
                      message: 'Se ha detectado un nuevo anuncio viral de Nike',
                      time: '5 min',
                      unread: true,
                      icon: '🚀'
                    },
                    {
                      id: 2,
                      title: 'Actualización de plan',
                      message: 'Tu plan Pro se renovará en 7 días',
                      time: '2 horas',
                      unread: true,
                      icon: '💳'
                    },
                    {
                      id: 3,
                      title: 'Nuevo filtro disponible',
                      message: 'Ahora puedes filtrar por engagement rate',
                      time: '1 día',
                      unread: false,
                      icon: '🎯'
                    }
                  ]} 
                  onClose={() => setShowNotifications(false)} 
                />
              )}
            </AnimatePresence>
          </div>
          
          <div className="relative" ref={userMenuRef}>
            <button 
              className="flex items-center gap-2 hover:bg-white/50 p-1.5 rounded-lg transition-colors"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              {user.avatarUrl ? (
                <img 
                  src={user.avatarUrl} 
                  alt={user.name} 
                  className="w-7 h-7 rounded-full border-2 border-black"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center border-2 border-black">
                  <span className="text-xs font-semibold">{user.name.charAt(0)}</span>
                </div>
              )}
              <ChevronDown 
                size={14} 
                className={`transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`}
              />
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-[calc(100vw-2rem)] md:w-56 bg-white border-2 border-black rounded-xl shadow-retro overflow-hidden"
                  style={{ maxWidth: '280px' }}
                >
                  <div className="p-3 border-b border-neutral-200">
                    <p className="font-medium truncate">{user.name}</p>
                    <p className="text-sm text-neutral-600 truncate">{user.email}</p>
                  </div>
                  
                  <div className="p-2">
                    <Link
                      href="/dashboard/account"
                      className="flex items-center gap-2 p-2 hover:bg-neutral-100 rounded-lg transition-colors w-full"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User size={16} />
                      <span className="text-sm">Mi cuenta</span>
                    </Link>
                    
                    <Link
                      href="/dashboard/account"
                      className="flex items-center gap-2 p-2 hover:bg-neutral-100 rounded-lg transition-colors w-full"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <CreditCard size={16} />
                      <span className="text-sm">Facturación</span>
                    </Link>
                    
                    <Link
                      href="/dashboard/account"
                      className="flex items-center gap-2 p-2 hover:bg-neutral-100 rounded-lg transition-colors w-full"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings size={16} />
                      <span className="text-sm">Configuración</span>
                    </Link>
                  </div>
                  
                  <div className="p-2 border-t border-neutral-200">
                    <Link
                      href="/login"
                      className="flex items-center gap-2 p-2 text-red-600 hover:bg-neutral-100 rounded-lg transition-colors w-full"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <LogOut size={16} />
                      <span className="text-sm">Cerrar sesión</span>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </header>
  );
};

export default Header;