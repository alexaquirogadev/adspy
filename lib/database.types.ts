/**
 * Tipos de base de datos de Supabase
 * 
 * Este archivo puede ser generado automáticamente con:
 * npx supabase gen types typescript --project-id=TU_PROJECT_ID > lib/database.types.ts
 * 
 * Por ahora usamos un tipo genérico
 */

export interface Database {
  public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
} 