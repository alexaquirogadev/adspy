"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import ClientLayout from '../../components/ClientLayout';

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/');
      }
    };
    checkUser();
  }, [router]);

  return (
    <ClientLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p>Bienvenido al panel de control.</p>
      </div>
    </ClientLayout>
  );
} 