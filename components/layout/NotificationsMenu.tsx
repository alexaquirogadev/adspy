import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Check, X } from 'lucide-react';

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  icon: string;
}

interface NotificationsMenuProps {
  notifications: Notification[];
  onClose: () => void;
}

const NotificationsMenu: React.FC<NotificationsMenuProps> = ({ notifications, onClose }) => {
  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-x-4 top-16 md:absolute md:inset-auto md:right-0 md:top-full md:mt-2 bg-white border-2 border-black rounded-xl shadow-retro z-50 max-w-sm md:w-[380px]"
    >
      {/* Header */}
      <div className="p-4 border-b-2 border-black bg-white sticky top-0 z-10 rounded-t-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell size={20} />
            <h3 className="font-bold text-lg">Notificaciones</h3>
            {unreadCount > 0 && (
              <span className="bg-secondary text-white text-xs font-bold px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button 
              className="text-xs text-secondary hover:underline font-medium"
              onClick={(e) => {
                e.stopPropagation();
                // Handle mark all as read
              }}
            >
              <span className="hidden md:inline">Marcar todo como leído</span>
              <Check size={16} className="md:hidden" />
            </button>
            <button 
              onClick={onClose}
              className="md:hidden p-1 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="overflow-y-auto max-h-[calc(100vh-16rem)] md:max-h-[480px]">
        {notifications.map(notification => (
          <motion.div 
            key={notification.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className={`group p-4 hover:bg-neutral-50 transition-all cursor-pointer border-b border-neutral-100 relative ${
              notification.unread ? 'bg-neutral-50' : ''
            }`}
            onClick={(e) => {
              e.stopPropagation();
              // Handle notification click
            }}
          >
            <div className="flex gap-3 items-start">
              <div className="w-10 h-10 flex items-center justify-center bg-neutral-100 rounded-xl text-xl flex-shrink-0">
                {notification.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2 mb-1">
                  <h4 className="font-semibold text-sm truncate">
                    {notification.title}
                  </h4>
                  <span className="text-xs text-neutral-500 whitespace-nowrap flex-shrink-0">
                    {notification.time}
                  </span>
                </div>
                <p className="text-sm text-neutral-600 line-clamp-2">
                  {notification.message}
                </p>
              </div>
              {notification.unread && (
                <div className="absolute right-4 top-4 w-2 h-2 rounded-full bg-secondary"></div>
              )}
            </div>
            
            {/* Hover Actions */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-2 hover:bg-neutral-200 rounded-lg transition-colors">
                <Check size={16} className="text-neutral-600" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-3 text-center border-t border-neutral-200 bg-white sticky bottom-0 rounded-b-xl">
        <button 
          className="w-full py-2 px-4 bg-neutral-100 hover:bg-neutral-200 transition-colors rounded-lg text-sm font-medium"
          onClick={(e) => {
            e.stopPropagation();
            // Handle view all notifications
          }}
        >
          Ver todas las notificaciones
        </button>
      </div>
    </motion.div>
  );
};

export default NotificationsMenu;