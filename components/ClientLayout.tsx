import React from 'react';

/**
 * ClientLayout es un componente de layout que envuelve el contenido de la aplicación.
 * Se utiliza para proporcionar un diseño consistente en todas las páginas.
 */
const ClientLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <main>{children}</main>
    </div>
  );
};

export default ClientLayout; 