'use client';
import { useEffect, useState } from 'react';

export default function LoginAlert() {
  const [message, setMessage] = useState<string | null>(null);
  const [type,    setType]    = useState<'warning' | 'error'>('warning');

  useEffect(() => {
    // 1. Fragment (#...) – Supabase pone error=..., error_code=...
    const hash = window.location.hash.replace('#', '');
    const params = new URLSearchParams(hash);
    const errCode = params.get('error_code');

    // 2. Query (?reason=...) – si viene de nuestro redirect manual
    const query = new URLSearchParams(window.location.search);
    const reason = query.get('reason');

    if (errCode === 'otp_expired' || reason === 'expired') {
      setMessage('⚠️ Tu enlace ha caducado. Solicita uno nuevo.');
      setType('warning');
    } else if (errCode || reason === 'invalid') {
      setMessage('❌ Enlace no válido o ya usado. Pide uno nuevo.');
      setType('error');
    }
  }, []);

  if (!message) return null;            // nada que mostrar

  return (
    <div className={`alert alert-${type} mb-4`}>
      {message}
    </div>
  );
} 