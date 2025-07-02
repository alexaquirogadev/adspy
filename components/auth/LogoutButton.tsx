"use client";
/**
 * Botón de logout para Supabase Auth
 * Ubicación: /components/auth/LogoutButton.tsx
 * Props opcionales: className, label
 * Al hacer click, cierra sesión y redirige a '/'
 */
import React from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from '@/lib/supabaseBrowser';

interface LogoutButtonProps {
  className?: string;
  label?: React.ReactNode;
}

export default function LogoutButton({ className = "", label = "Cerrar sesión" }: LogoutButtonProps) {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = supabaseBrowser();
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <button
      type="button"
      className={`btn btn-neutral w-full ${className}`}
      onClick={handleLogout}
    >
      {label}
    </button>
  );
} 