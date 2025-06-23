🧠 AdSpy Lite – Instrucciones para CursorAI

Stack y Arquitectura

Proyecto en Next.js 14 con App Router

TailwindCSS + DaisyUI

Supabase Auth + DB (para login y favoritos)

UX/UI original exportada desde Bolt (React + Vite)

Objetivo

Migrar toda la UX de Bolt como SPA visual usando componentes en Next.js 14.
Luego conectar funcionalidad por fases (login, API Apify, favoritos, etc).

Estructura de navegación SPA

El dashboard tiene múltiples secciones renderizadas como tabs internas:

Buscar (SearchView)

Top Ranking (RankingView)

Por Problema (ProblemsView)

Favoritos (FavoritesView)

Mi cuenta (AccountView)

Todo se renderiza dentro de Dashboard.tsx como contenedor principal, usando useState o useSearchParams.

No se navega entre rutas, todo es navegación visual (SPA).

Páginas y rutas esperadas:

/ → Landing pública

/auth → Login/registro (sin funcionalidad todavía)

/dashboard → Contenedor SPA de secciones

Migración por pasos (Fase 2.1)

Crear ClientLayout.tsx (layout principal) dentro de /components/layout/

Migrar Sidebar.tsx desde Bolt con todas las secciones visuales

Crear app/(protected)/dashboard/page.tsx y renderizar Dashboard.tsx

Dentro de Dashboard.tsx, mostrar las secciones importadas (views/SearchView, views/FavoritesView, etc.) según el estado activo

Reutilizar todos los componentes (Header, AdCard, SearchBar, etc.) dentro de cada vista

Reglas clave:

No eliminar lógica que ya funciona

No sobreescribir estructuras existentes

No conectar Supabase aún (hasta Fase 1 completa)

No migrar estilos, Tailwind ya está activo

Toda la navegación debe mantenerse en la vista /dashboard (SPA total)

Seguridad (Fase futura)

Nunca exponer claves en frontend

Rate-limiting para búsquedas

Validación de user_id en acciones como favoritos

Stripe solo se conecta vía webhooks (no guardar tarjetas localmente)

Uso de variables .env bien gestionadas
