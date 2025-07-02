'use client';
import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabaseBrowser';
import { Mail } from 'lucide-react';

export default function MagicLinkForm() {
  const [email, setEmail] = useState('');
  const [sent,  setSent]  = useState(false);
  const [load,  setLoad]  = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return setError('Email inválido');

    setLoad(true); setError(null);
    const supabase = supabaseBrowser();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
      },
    });

    if (error) setError(error.message);
    else       setSent(true);

    setLoad(false);
  };

  if (sent) return <p className="text-sm">📬 Revisa tu correo y haz clic en el enlace.</p>;

  return (
    <div className="space-y-2 w-full">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Mail size={18} className="text-neutral-500" />
        </div>
        <input
          type="email"
          className="w-full pl-10 px-4 py-3 rounded-xl border-2 border-black focus:outline-none focus:ring-2 focus:ring-secondary"
          placeholder="correo@ejemplo.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </div>
      <button
        className="w-full dopamine-btn-secondary shadow-[4px_4px_0_rgba(0,0,0,1)] font-bold text-white py-3 rounded-xl"
        disabled={load}
        onClick={send}
        type="button"
      >
        {load ? 'Enviando…' : 'Iniciar con Magic Link'}
      </button>
      {error && <p className="text-error text-xs">{error}</p>}
    </div>
  );
} 