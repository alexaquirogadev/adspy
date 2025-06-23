import React from 'react';
import { User, CreditCard, Package, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedBanner from '../shared/AnimatedBanner';

const AccountView: React.FC = () => {
  // Mock user data
  const user = {
    name: 'Juan Pérez',
    email: 'juan@ejemplo.com',
    subscription: {
      plan: 'pro',
      status: 'active',
      renewDate: '2025-06-15',
    },
    memberSince: '2025-01-10',
  };
  
  const getPlanDetails = () => {
    switch (user.subscription.plan) {
      case 'pro':
        return {
          name: 'Plan Pro',
          color: 'bg-secondary text-white',
          features: [
            'Búsquedas ilimitadas',
            'Acceso a anuncios de los últimos 90 días',
            'Todos los filtros',
            'Anuncios favoritos ilimitados',
            'Alertas de nuevos anuncios'
          ]
        };
      case 'basic':
        return {
          name: 'Plan Básico',
          color: 'bg-primary text-black',
          features: [
            '20 búsquedas diarias',
            'Acceso a anuncios de los últimos 30 días',
            'Filtros básicos',
            '5 anuncios favoritos'
          ]
        };
      default:
        return {
          name: 'Plan Free',
          color: 'bg-neutral-200 text-neutral-700',
          features: [
            '5 búsquedas diarias',
            'Acceso a anuncios de los últimos 7 días',
            'Sin filtros avanzados',
            'Sin favoritos'
          ]
        };
    }
  };
  
  const planDetails = getPlanDetails();
  
  return (
    <div>
      <AnimatedBanner 
        text="Gestiona tu perfil y suscripción"
        icon={<User />}
        gradient="from-primary to-white"
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Perfil */}
        <motion.div 
          className="bg-white border-2 border-black rounded-xl shadow-retro overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-6 text-center border-b-2 border-black">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-black text-white rounded-full flex items-center justify-center text-4xl font-bold mx-auto mb-4">
              {user.name.charAt(0)}
            </div>
            <h2 className="text-xl md:text-2xl font-bold mb-1">{user.name}</h2>
            <p className="text-neutral-600">{user.email}</p>
          </div>
          
          <div className="p-6">
            <div className="mb-4">
              <h3 className="text-sm text-neutral-500 mb-1">Miembro desde</h3>
              <p className="text-lg">{new Date(user.memberSince).toLocaleDateString()}</p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-sm text-neutral-500 mb-1">Suscripción actual</h3>
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${planDetails.color}`}>
                {planDetails.name}
              </div>
            </div>
            
            <button className="w-full dopamine-btn-secondary mb-3">
              Actualizar suscripción
            </button>
            
            <button className="w-full px-4 py-2 border-2 border-black rounded-xl hover:bg-neutral-100 transition-colors">
              Editar perfil
            </button>
          </div>
        </motion.div>
        
        {/* Detalles de suscripción */}
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="bg-white border-2 border-black rounded-xl shadow-retro mb-6">
            <div className="p-6">
              <h2 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-2">
                <Package size={24} />
                <span>Detalles de suscripción</span>
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-neutral-50 rounded-xl">
                  <h3 className="text-sm text-neutral-500 mb-1">Plan actual</h3>
                  <p className="text-lg font-semibold">{planDetails.name}</p>
                </div>
                <div className="p-4 bg-neutral-50 rounded-xl">
                  <h3 className="text-sm text-neutral-500 mb-1">Estado</h3>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-success"></span>
                    <p className="text-lg font-semibold">Activo</p>
                  </div>
                </div>
                <div className="p-4 bg-neutral-50 rounded-xl">
                  <h3 className="text-sm text-neutral-500 mb-1">Próxima renovación</h3>
                  <p className="text-lg">{new Date(user.subscription.renewDate).toLocaleDateString()}</p>
                </div>
                <div className="p-4 bg-neutral-50 rounded-xl">
                  <h3 className="text-sm text-neutral-500 mb-1">Método de pago</h3>
                  <p className="text-lg">Tarjeta terminada en 4242</p>
                </div>
              </div>
              
              <div className="border-t-2 border-black pt-6">
                <h3 className="text-lg font-bold mb-4">Características incluidas:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {planDetails.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-neutral-50 rounded-xl">
                      <span className="text-success">✓</span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button className="bg-white border-2 border-black rounded-xl p-4 text-left hover:bg-neutral-50 transition-colors shadow-retro flex items-center gap-4">
              <CreditCard size={24} />
              <div>
                <h3 className="font-semibold mb-1">Gestionar método de pago</h3>
                <p className="text-sm text-neutral-600">Actualiza tu tarjeta o forma de pago</p>
              </div>
            </button>
            
            <button className="bg-white border-2 border-black rounded-xl p-4 text-left hover:bg-neutral-50 transition-colors shadow-retro flex items-center gap-4">
              <LogOut size={24} />
              <div>
                <h3 className="font-semibold mb-1">Cerrar sesión</h3>
                <p className="text-sm text-neutral-600">Salir de tu cuenta</p>
              </div>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AccountView;