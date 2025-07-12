'use client';
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { UserContextProvider } from '@/components/auth/UserContextProvider';
import type { ViewType } from '@/lib/types';

/**
 * ClientLayout es un componente de layout que envuelve el contenido de la aplicación.
 * Se utiliza para proporcionar un diseño consistente en todas las páginas.
 */
const ClientLayout: React.FC<{ children: React.ReactNode, isAdmin?: boolean, activeView: ViewType, setActiveView: React.Dispatch<React.SetStateAction<ViewType>> }> = ({ children, isAdmin = false, activeView, setActiveView }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <UserContextProvider>
    <div className="flex min-h-screen bg-neutral-100">
      {/* Sidebar for desktop */}
      <div className={`hidden md:block fixed top-0 bottom-0 left-0 transition-all duration-300 z-50 ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}>
        <Sidebar 
          isAdmin={isAdmin} 
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          activeView={activeView}
          setActiveView={setActiveView}
        />
      </div>

      {/* Main content */}
      <div className={`flex-1 transition-all duration-300 pb-16 md:pb-0 ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        <Header />
        <main className="p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
    </UserContextProvider>
  );
};

export default ClientLayout; 