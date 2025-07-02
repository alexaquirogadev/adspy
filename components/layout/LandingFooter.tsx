/**
 * Footer de la landing principal (AdSpy Lite)
 * Ubicación: /components/layout/LandingFooter.tsx
 */
export default function LandingFooter() {
  return (
    <footer className="bg-black text-white py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="font-bold mb-4">Producto</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Características</a></li>
              <li><a href="#pricing" className="text-neutral-400 hover:text-white transition-colors">Precios</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Roadmap</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Recursos</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Tutoriales</a></li>
              <li><a href="#faq" className="text-neutral-400 hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Empresa</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Sobre nosotros</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Contacto</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Afiliados</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Términos</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Privacidad</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Cookies</a></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-neutral-800">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="bg-primary text-black font-bold text-xl p-2 rounded">
              AL
            </div>
            <span className="text-xl font-bold">AdSpy Lite</span>
          </div>
          <p className="text-neutral-400 text-sm">
            © {new Date().getFullYear()} AdSpy Lite. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
} 