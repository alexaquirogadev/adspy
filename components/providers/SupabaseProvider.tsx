'use client';

import { supabaseBrowser } from '@/lib/supabaseBrowser';
import React, { createContext, useContext } from 'react';

export const SupabaseContext = createContext(supabaseBrowser);

export const useSupabase = () => useContext(SupabaseContext);

export default function SupabaseProvider({ children }: { children: React.ReactNode }) {
  return <SupabaseContext.Provider value={supabaseBrowser}>{children}</SupabaseContext.Provider>;
} 