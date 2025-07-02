"use client"

/**
 * Botón de login con Google para autenticación con Supabase
 * Ubicación: /components/auth/LoginButton.tsx
 * Props opcionales: className, label
 * Al hacer click, inicia OAuth con Google y redirige a /dashboard
 */
import React from "react";
import { supabaseBrowser } from '@/lib/supabaseBrowser';

interface LoginButtonProps {
  className?: string;
  label?: string;
}

export default function LoginButton({ className = "", label = "Continuar con Google" }: LoginButtonProps) {
  const handleLogin = async () => {
    const supabase = supabaseBrowser();
    const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${siteUrl}/auth/callback`
      },
    });
  };

  return (
    <button
      type="button"
      aria-label={label}
      className={`w-full font-bold py-3 rounded-xl shadow-[4px_4px_0_rgba(0,0,0,1)] bg-yellow-400 text-black border-2 border-black flex items-center gap-2 justify-center pl-4 ${className}`}
      onClick={handleLogin}
    >
      <span className="ml-2 flex items-center"><GoogleIcon /></span>
      <span className="flex-1 text-center font-bold">{label}</span>
    </button>
  );
}

// SVG de Google
function GoogleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_17_40)">
        <path d="M21.805 11.227c0-.751-.067-1.473-.192-2.164H11.2v4.095h6.008a5.14 5.14 0 01-2.23 3.373v2.797h3.6c2.106-1.94 3.227-4.8 3.227-8.101z" fill="#4285F4"/>
        <path d="M11.2 22c2.97 0 5.457-.98 7.276-2.662l-3.6-2.797c-1 .67-2.28 1.07-3.676 1.07-2.83 0-5.23-1.91-6.09-4.48H1.39v2.82A10.997 10.997 0 0011.2 22z" fill="#34A853"/>
        <path d="M5.11 13.13A6.6 6.6 0 014.6 11c0-.74.13-1.46.36-2.13V6.05H1.39A10.997 10.997 0 000 11c0 1.74.42 3.39 1.39 4.95l3.72-2.82z" fill="#FBBC05"/>
        <path d="M11.2 4.37c1.62 0 3.07.56 4.22 1.66l3.16-3.16C16.65 1.01 14.17 0 11.2 0A10.997 10.997 0 001.39 6.05l3.72 2.82c.86-2.57 3.26-4.48 6.09-4.48z" fill="#EA4335"/>
      </g>
      <defs>
        <clipPath id="clip0_17_40">
          <rect width="22" height="22" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
} 