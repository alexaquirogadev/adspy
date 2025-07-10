'use client';
import { useState, useEffect } from 'react';
import { User, CreditCard, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedBanner from '../shared/AnimatedBanner';
import LogoutButton from '@/components/auth/LogoutButton';
import { useUser } from '@/components/auth/UserContextProvider';
import { useProfile } from '@/lib/useProfile';
import EditProfileModal from '@/components/account/EditProfileModal';
import Avatar from 'boring-avatars';

const AccountView = () => {
  const { user: authUser } = useUser();
  const { data: profile } = useProfile(authUser?.id);
  const [editOpen, setEditOpen] = useState(false);

  // Si no tiene nombre -> fuerza completar
  useEffect(() => {
    if (profile && !profile.full_name) setEditOpen(true);
  }, [profile]);

  if (!authUser || !profile) return <p className="p-6">Cargando…</p>;

  // Forzar a TypeScript a saber que profile está definido
  const safeProfile = profile!;

  const planColor = {
    free: 'bg-neutral-200 text-neutral-700',
    basic: 'bg-primary text-black',
    pro: 'bg-secondary text-white',
  }[safeProfile.plan as 'free' | 'basic' | 'pro'];

  const getPlanDetails = () => {
    switch (safeProfile.plan) {
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
    <>
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
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full mx-auto mb-4 border-2 border-black overflow-hidden flex items-center justify-center bg-neutral-100">
              <Avatar
                size={128}
                name={safeProfile.full_name || authUser.email}
                variant="beam"
                colors={["#ff006f", "#fff538", "#00d1ff", "#000000", "#f1f1f1"]}
                square={false}
              />
            </div>
            <h2 className="text-xl md:text-2xl font-bold mb-1">
              {safeProfile.full_name || 'Sin nombre'}
            </h2>
            <p className="text-neutral-600">{authUser.email}</p>
          </div>
          
          <div className="p-6">
            <div className="mb-4">
              <h3 className="text-sm text-neutral-500 mb-1">Miembro desde</h3>
              <p className="text-lg">
                {safeProfile.created_at ? new Date(safeProfile.created_at).toLocaleDateString() : '—'}
              </p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-sm text-neutral-500 mb-1">Suscripción actual</h3>
              <div
                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${planColor}`}
              >
                {(safeProfile.plan || 'free').toUpperCase()}
              </div>
            </div>
            
            <button className="w-full dopamine-btn-secondary mb-3">
              Actualizar suscripción
            </button>
            
            <button
              className="w-full dopamine-btn-secondary mb-3"
              onClick={() => setEditOpen(true)}
            >
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
            <LogoutButton 
              className="bg-white border-2 border-black rounded-xl p-4 text-left hover:bg-neutral-50 transition-colors shadow-retro flex items-center gap-4"
              label={<div><h3 className="font-semibold mb-1">Cerrar sesión</h3><p className="text-sm text-neutral-600">Salir de tu cuenta</p></div>}
            />
          </div>
        </motion.div>
      </div>

      {/* Modal */}
      <EditProfileModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        userId={authUser.id}
      />
    </>
  );
};

export default AccountView;