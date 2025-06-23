import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';

type AuthMode = 'login' | 'register' | 'forgot';

const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  
  const renderForm = () => {
    switch (mode) {
      case 'login':
        return (
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-neutral-500" />
                </div>
                <input
                  type="email"
                  id="email"
                  placeholder="tu@email.com"
                  className="w-full pl-10 px-4 py-3 rounded-xl border-2 border-black focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="block text-sm font-medium">
                  Contraseña
                </label>
                <button 
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="text-xs text-secondary hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-neutral-500" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="••••••••••"
                  className="w-full pl-10 px-4 py-3 rounded-xl border-2 border-black focus:outline-none focus:ring-2 focus:ring-secondary"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff size={18} className="text-neutral-500" />
                  ) : (
                    <Eye size={18} className="text-neutral-500" />
                  )}
                </button>
              </div>
            </div>
            
            <button 
              type="submit"
              className="w-full dopamine-btn-secondary"
            >
              Iniciar sesión
            </button>
            
            <div className="relative flex items-center justify-center">
              <div className="w-full border-t border-neutral-300"></div>
              <div className="absolute bg-white px-3 text-sm text-neutral-500">
                o continúa con
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              <button 
                type="button"
                className="w-full px-4 py-3 rounded-xl border-2 border-black hover:bg-neutral-50 transition-colors flex items-center justify-center gap-2"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                <span>Continuar con Google</span>
              </button>
              
              <button 
                type="button"
                className="w-full px-4 py-3 rounded-xl border-2 border-black hover:bg-neutral-50 transition-colors"
              >
                Iniciar con Magic Link
              </button>
            </div>
            
            <p className="text-center text-sm">
              ¿No tienes cuenta?{' '}
              <button 
                type="button"
                onClick={() => setMode('register')}
                className="text-secondary font-medium hover:underline"
              >
                Regístrate aquí
              </button>
            </p>
          </motion.form>
        );
        
      case 'register':
        return (
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Nombre
              </label>
              <input
                type="text"
                id="name"
                placeholder="Tu nombre"
                className="w-full px-4 py-3 rounded-xl border-2 border-black focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
            
            <div>
              <label htmlFor="register-email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-neutral-500" />
                </div>
                <input
                  type="email"
                  id="register-email"
                  placeholder="tu@email.com"
                  className="w-full pl-10 px-4 py-3 rounded-xl border-2 border-black focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="register-password" className="block text-sm font-medium mb-1">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-neutral-500" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="register-password"
                  placeholder="••••••••••"
                  className="w-full pl-10 px-4 py-3 rounded-xl border-2 border-black focus:outline-none focus:ring-2 focus:ring-secondary"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff size={18} className="text-neutral-500" />
                  ) : (
                    <Eye size={18} className="text-neutral-500" />
                  )}
                </button>
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                Mínimo 8 caracteres, incluye una mayúscula y un número
              </p>
            </div>
            
            <button 
              type="submit"
              className="w-full dopamine-btn-secondary"
            >
              Crear cuenta
              <ArrowRight size={18} className="ml-1" />
            </button>
            
            <div className="relative flex items-center justify-center">
              <div className="w-full border-t border-neutral-300"></div>
              <div className="absolute bg-white px-3 text-sm text-neutral-500">
                o continúa con
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              <button 
                type="button"
                className="w-full px-4 py-3 rounded-xl border-2 border-black hover:bg-neutral-50 transition-colors flex items-center justify-center gap-2"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                <span>Continuar con Google</span>
              </button>
            </div>
            
            <p className="text-center text-sm">
              ¿Ya tienes cuenta?{' '}
              <button 
                type="button"
                onClick={() => setMode('login')}
                className="text-secondary font-medium hover:underline"
              >
                Inicia sesión
              </button>
            </p>
          </motion.form>
        );
        
      case 'forgot':
        return (
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold mb-2">¿Olvidaste tu contraseña?</h3>
              <p className="text-neutral-600 text-sm">
                Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña
              </p>
            </div>
            
            <div>
              <label htmlFor="recovery-email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-neutral-500" />
                </div>
                <input
                  type="email"
                  id="recovery-email"
                  placeholder="tu@email.com"
                  className="w-full pl-10 px-4 py-3 rounded-xl border-2 border-black focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>
            </div>
            
            <button 
              type="submit"
              className="w-full dopamine-btn-secondary"
            >
              Enviar enlace de recuperación
            </button>
            
            <p className="text-center text-sm">
              <button 
                type="button"
                onClick={() => setMode('login')}
                className="text-secondary font-medium hover:underline"
              >
                Volver a inicio de sesión
              </button>
            </p>
          </motion.form>
        );
    }
  };
  
  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col">
      <header className="border-b-2 border-black bg-white">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="bg-black text-primary font-bold text-xl p-2 rounded">
              AL
            </div>
            <span className="text-xl font-bold">AdSpy Lite</span>
          </div>
        </div>
      </header>
      
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white border-2 border-black rounded-xl shadow-retro p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold">
                {mode === 'login' ? 'Iniciar sesión' : mode === 'register' ? 'Crear cuenta' : 'Recuperar contraseña'}
              </h2>
              <p className="text-neutral-600 mt-1">
                {mode === 'login' 
                  ? 'Bienvenido de nuevo a AdSpy Lite' 
                  : mode === 'register' 
                    ? 'Empieza a espiar anuncios en un minuto' 
                    : 'Te enviaremos un correo de recuperación'}
              </p>
            </div>
            
            {renderForm()}
          </div>
          
          <p className="text-center text-xs text-neutral-500 mt-4">
            Al continuar, aceptas nuestros Términos de servicio y Política de privacidad
          </p>
        </div>
      </main>
    </div>
  );
};

export default AuthPage;