import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

/**
 * Header de la landing principal (AdSpy Lite)
 * Ubicación: /components/layout/LandingHeader.tsx
 */
export default function LandingHeader() {
  return (
    <header className="border-b-2 border-black bg-white sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-black text-primary font-bold text-xl p-2 rounded">
            AL
          </div>
          <span className="text-xl font-bold">AdSpy Lite</span>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <a href="#how-it-works" className="font-medium hover:text-secondary transition-colors">
            Cómo funciona
          </a>
          <a href="#pricing" className="font-medium hover:text-secondary transition-colors">
            Precios
          </a>
          <a href="#faq" className="font-medium hover:text-secondary transition-colors">
            FAQ
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/auth/login" className="hidden md:block font-medium hover:text-secondary transition-colors">
            Iniciar sesión
          </Link>
          <Link href="/auth/login" className="dopamine-btn-secondary">
            Empezar
          </Link>
        </div>
      </div>
    </header>
  );
} 