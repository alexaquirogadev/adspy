import React from 'react';
import { Users, TrendingUp, DollarSign, BarChart3 } from 'lucide-react';
import AnimatedBanner from '../shared/AnimatedBanner';

const AdminView: React.FC = () => {
  // Mock data
  const stats = [
    { label: 'Usuarios totales', value: '1,284', icon: <Users size={24} />, change: '+12%' },
    { label: 'Búsquedas hoy', value: '4,371', icon: <TrendingUp size={24} />, change: '+8%' },
    { label: 'Ingresos mensuales', value: '€9,724', icon: <DollarSign size={24} />, change: '+15%' },
    { label: 'Tasa de conversión', value: '4.2%', icon: <BarChart3 size={24} />, change: '+0.5%' },
  ];
  
  const recentUsers = [
    { id: 1, name: 'María López', email: 'maria@ejemplo.com', plan: 'pro', joinedAt: '2025-05-28' },
    { id: 2, name: 'Carlos Ruiz', email: 'carlos@ejemplo.com', plan: 'basic', joinedAt: '2025-05-27' },
    { id: 3, name: 'Ana García', email: 'ana@ejemplo.com', plan: 'pro', joinedAt: '2025-05-25' },
    { id: 4, name: 'Roberto Martín', email: 'roberto@ejemplo.com', plan: 'basic', joinedAt: '2025-05-24' },
    { id: 5, name: 'Elena Sánchez', email: 'elena@ejemplo.com', plan: 'pro', joinedAt: '2025-05-22' },
  ];
  
  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case 'pro':
        return <span className="px-2 py-1 bg-secondary text-white rounded-full text-xs">PRO</span>;
      case 'basic':
        return <span className="px-2 py-1 bg-primary text-black rounded-full text-xs">BASIC</span>;
      default:
        return <span className="px-2 py-1 bg-neutral-200 text-neutral-700 rounded-full text-xs">FREE</span>;
    }
  };
  
  return (
    <div>
      <AnimatedBanner 
        text="Panel de administración y métricas"
        icon={<BarChart3 />}
        gradient="from-primary to-white"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white border-2 border-black rounded-xl p-6 shadow-retro">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-neutral-100 p-2 rounded-lg">
                {stat.icon}
              </div>
              <div className="px-2 py-1 bg-success/10 text-success rounded-full text-xs">
                {stat.change}
              </div>
            </div>
            <h3 className="text-neutral-600 text-sm mb-1">{stat.label}</h3>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white border-2 border-black rounded-xl shadow-retro overflow-hidden">
          <div className="p-6 border-b border-neutral-200">
            <h2 className="text-xl font-bold">Usuarios recientes</h2>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="text-left pb-3 font-semibold">Usuario</th>
                    <th className="text-left pb-3 font-semibold">Email</th>
                    <th className="text-left pb-3 font-semibold">Plan</th>
                    <th className="text-left pb-3 font-semibold">Registro</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map(user => (
                    <tr key={user.id} className="border-b border-neutral-100">
                      <td className="py-3">{user.name}</td>
                      <td className="py-3">{user.email}</td>
                      <td className="py-3">{getPlanBadge(user.plan)}</td>
                      <td className="py-3">{new Date(user.joinedAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-center">
              <button className="text-secondary font-medium hover:underline">
                Ver todos los usuarios
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-white border-2 border-black rounded-xl shadow-retro overflow-hidden">
          <div className="p-6 border-b border-neutral-200">
            <h2 className="text-xl font-bold">Distribución de planes</h2>
          </div>
          <div className="p-6">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Plan Pro</span>
                <span className="text-sm">45%</span>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-2">
                <div className="bg-secondary h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Plan Básico</span>
                <span className="text-sm">35%</span>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '35%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Plan Free</span>
                <span className="text-sm">20%</span>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-2">
                <div className="bg-neutral-400 h-2 rounded-full" style={{ width: '20%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border-2 border-black rounded-xl shadow-retro p-6">
          <h2 className="text-xl font-bold mb-4">Búsquedas populares</h2>
          <ul className="space-y-3">
            {['zapatillas', 'iphone', 'crema facial', 'cursos online', 'suplementos'].map((term, index) => (
              <li key={index} className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
                <span>{term}</span>
                <span className="text-sm text-neutral-500">{Math.floor(Math.random() * 500) + 100} búsquedas</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-white border-2 border-black rounded-xl shadow-retro p-6">
          <h2 className="text-xl font-bold mb-4">Acciones rápidas</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 border-2 border-black rounded-xl hover:bg-neutral-50 transition-colors text-left">
              <h3 className="font-semibold mb-1">Generar reporte</h3>
              <p className="text-xs text-neutral-500">Exportar datos a CSV</p>
            </button>
            <button className="p-4 border-2 border-black rounded-xl hover:bg-neutral-50 transition-colors text-left">
              <h3 className="font-semibold mb-1">Enviar newsletter</h3>
              <p className="text-xs text-neutral-500">A todos los usuarios</p>
            </button>
            <button className="p-4 border-2 border-black rounded-xl hover:bg-neutral-50 transition-colors text-left">
              <h3 className="font-semibold mb-1">Actualizar cache</h3>
              <p className="text-xs text-neutral-500">Refrescar datos</p>
            </button>
            <button className="p-4 border-2 border-black rounded-xl hover:bg-neutral-50 transition-colors text-left">
              <h3 className="font-semibold mb-1">Ver logs</h3>
              <p className="text-xs text-neutral-500">Sistema y errores</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminView;