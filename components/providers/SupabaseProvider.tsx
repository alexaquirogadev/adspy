'use client';

import { supabase } from '@/lib/supabase-browser';
import React, { createContext, useContext } from 'react';

export const SupabaseContext = createContext(supabase);

export const useSupabase = () => useContext(SupabaseContext);

export default function SupabaseProvider({ children }: { children: React.ReactNode }) {
  return <SupabaseContext.Provider value={supabase}>{children}</SupabaseContext.Provider>;
} 