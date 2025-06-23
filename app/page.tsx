'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowRight, Check, ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen">
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
            <Link href="/login" className="hidden md:block font-medium hover:text-secondary transition-colors">
              Iniciar sesión
            </Link>
            <Link href="/register" className="dopamine-btn-secondary">
              Empezar
            </Link>
          </div>
        </div>
      </header>
      
      <main>
        {/* Hero Section */}
        <section className="relative bg-white py-16 md:py-24 overflow-hidden border-b-2 border-black">
          <div className="absolute inset-0 -z-10 opacity-20 dotted-pattern"></div>
          <div className="absolute top-20 -left-24 w-64 h-64 bg-primary rounded-full blur-3xl opacity-30"></div>
          <div className="absolute bottom-20 -right-24 w-64 h-64 bg-secondary rounded-full blur-3xl opacity-30"></div>
          
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Espía anuncios virales desde un solo lugar
              </h1>
              <p className="text-lg md:text-xl text-neutral-700 mb-8">
                Descubre los anuncios más exitosos de tus competidores y aprende de las mejores estrategias publicitarias para mejorar tus campañas.
              </p>
              
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
                <input
                  type="email"
                  placeholder="Ingresa tu email para empezar"
                  className="w-full md:w-auto px-6 py-3 rounded-xl border-2 border-black focus:outline-none focus:ring-2 focus:ring-secondary"
                />
                <Link href="/register" className="dopamine-btn-secondary w-full md:w-auto">
                  <span>Empezar por 1€</span>
                  <ArrowRight className="ml-2" size={18} />
                </Link>
              </div>
              
              <div className="flex flex-wrap justify-center gap-4 text-sm text-neutral-600">
                <div className="flex items-center">
                  <Check size={16} className="text-success mr-1" />
                  <span>+10.000 anuncios</span>
                </div>
                <div className="flex items-center">
                  <Check size={16} className="text-success mr-1" />
                  <span>Actualización diaria</span>
                </div>
                <div className="flex items-center">
                  <Check size={16} className="text-success mr-1" />
                  <span>Múltiples plataformas</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center mb-8">
              <div className="w-full max-w-4xl p-2 md:p-4 bg-white border-2 border-black rounded-xl shadow-retro">
                <img 
                  src="https://images.pexels.com/photos/7989742/pexels-photo-7989742.jpeg" 
                  alt="AdSpy Dashboard" 
                  className="w-full rounded-lg"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8 mb-12">
              {["Meta", "TikTok", "Google Ads", "Shopify", "Temu", "Amazon"].map(brand => (
                <div key={brand} className="text-neutral-400 font-medium text-xl">
                  {brand}
                </div>
              ))}
            </div>
            
            <div className="flex justify-center">
              <a 
                href="#how-it-works" 
                className="flex flex-col items-center text-neutral-600 hover:text-secondary transition-colors"
              >
                <span className="mb-2">Conoce más</span>
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <ArrowDown size={24} />
                </motion.div>
              </a>
            </div>
          </div>
        </section>
        
        {/* How it Works */}
        <section id="how-it-works" className="py-16 md:py-24 bg-neutral-100 border-b-2 border-black">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Cómo funciona</h2>
              <p className="text-lg text-neutral-700">
                Espía, analiza y aprende de los mejores anuncios en tres simples pasos
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: "🔍",
                  title: "Busca anuncios",
                  description: "Filtra por país, idioma, plataforma o palabra clave para encontrar los anuncios más relevantes para tu negocio."
                },
                {
                  icon: "💡",
                  title: "Analiza estrategias",
                  description: "Descubre qué hace que los anuncios sean exitosos: mensaje, diseño, llamada a la acción, engagement y más."
                },
                {
                  icon: "🚀",
                  title: "Mejora tus campañas",
                  description: "Aplica lo aprendido para optimizar tus propias campañas publicitarias y aumentar tus conversiones."
                }
              ].map((step, index) => (
                <div key={index} className="retro-card p-6 md:p-8">
                  <div className="flex flex-col items-center text-center">
                    <div className="text-4xl mb-4">{step.icon}</div>
                    <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                    <p className="text-neutral-700">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Testimonials */}
        <section className="py-16 md:py-24 bg-white border-b-2 border-black">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto mb-12">
              <div className="bg-black text-white p-6 md:p-8 rounded-xl">
                <div className="flex items-start gap-4">
                  <img 
                    src="https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg" 
                    alt="Cliente satisfecho" 
                    className="w-16 h-16 rounded-full border-2 border-white"
                  />
                  <div>
                    <div className="flex gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-400">★</span>
                      ))}
                    </div>
                    <p className="mb-4 italic">
                      "AdSpy Lite ha revolucionado nuestra estrategia publicitaria. Ahora podemos ver exactamente qué está funcionando para nuestra competencia y adaptar nuestras campañas en consecuencia."
                    </p>
                    <div>
                      <p className="font-bold">María García</p>
                      <p className="text-neutral-400 text-sm">Marketing Manager, E-commerce Trends</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* FAQ */}
            <div id="faq" className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">Preguntas frecuentes</h2>
              
              <div className="space-y-4">
                {[
                  {
                    question: "¿Cómo obtienen los datos de los anuncios?",
                    answer: "Utilizamos tecnología avanzada de scraping y APIs oficiales para recopilar información pública sobre anuncios en diversas plataformas, siempre cumpliendo con términos legales y de servicio."
                  },
                  {
                    question: "¿Cada cuánto se actualiza la base de datos?",
                    answer: "Nuestra base de datos se actualiza diariamente con nuevos anuncios de todas las plataformas soportadas."
                  },
                  {
                    question: "¿Puedo cancelar mi suscripción en cualquier momento?",
                    answer: "Sí, puedes cancelar tu suscripción en cualquier momento desde tu panel de usuario sin ningún compromiso adicional."
                  },
                  {
                    question: "¿Tienen una versión para agencias o equipos grandes?",
                    answer: "Sí, ofrecemos planes especiales para agencias y equipos con múltiples usuarios. Contacta con nuestro equipo de ventas para más información."
                  }
                ].map((faq, index) => (
                  <details key={index} className="group bg-white border-2 border-black rounded-xl overflow-hidden">
                    <summary className="flex justify-between items-center p-4 cursor-pointer list-none font-medium">
                      {faq.question}
                      <span className="transition group-open:rotate-180">
                        <ArrowDown size={18} />
                      </span>
                    </summary>
                    <div className="p-4 pt-0 text-neutral-700">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* Pricing */}
        <section id="pricing" className="py-16 md:py-24 bg-neutral-100 border-b-2 border-black">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Planes y precios</h2>
              <p className="text-lg text-neutral-700">
                Elige el plan que mejor se adapte a tus necesidades
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  name: "Básico",
                  price: "1€",
                  description: "Perfecto para empezar a explorar anuncios virales",
                  features: [
                    "20 búsquedas diarias",
                    "Acceso a anuncios de los últimos 30 días",
                    "Filtros básicos",
                    "5 anuncios favoritos"
                  ],
                  cta: "Empezar ahora",
                  highlight: false
                },
                {
                  name: "Pro",
                  price: "9.99€",
                  description: "Para profesionales de marketing digital",
                  features: [
                    "Búsquedas ilimitadas",
                    "Acceso a anuncios de los últimos 90 días",
                    "Todos los filtros",
                    "Anuncios favoritos ilimitados",
                    "Alertas de nuevos anuncios"
                  ],
                  cta: "Prueba 7 días gratis",
                  highlight: true
                },
                {
                  name: "Agencia",
                  price: "29.99€",
                  description: "Para equipos y agencias de marketing",
                  features: [
                    "Todo lo del plan Pro",
                    "5 usuarios",
                    "Acceso a anuncios históricos",
                    "Análisis avanzado de competencia",
                    "Soporte prioritario"
                  ],
                  cta: "Contactar ventas",
                  highlight: false
                }
              ].map((plan, index) => (
                <div 
                  key={index}
                  className={`${
                    plan.highlight 
                      ? 'border-secondary scale-105 relative z-10' 
                      : 'border-black'
                  } bg-white border-2 rounded-xl overflow-hidden flex flex-col`}
                >
                  {plan.highlight && (
                    <div className="bg-secondary text-white py-1 text-center text-sm font-bold">
                      Más popular
                    </div>
                  )}
                  
                  <div className="p-6 md:p-8 flex-1">
                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                    <div className="mb-4">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      <span className="text-neutral-600">/mes</span>
                    </div>
                    <p className="text-neutral-700 mb-6">{plan.description}</p>
                    
                    <ul className="space-y-2 mb-8">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check size={18} className="text-success mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="px-6 pb-6 md:px-8 md:pb-8">
                    <Link 
                      href="/register" 
                      className={`w-full py-3 px-4 rounded-xl border-2 border-black font-bold text-center transition-all duration-300 ${
                        plan.highlight 
                          ? 'bg-secondary text-white hover:bg-secondary-hover shadow-retro' 
                          : 'bg-white hover:bg-neutral-100 shadow-retro'
                      }`}
                    >
                      {plan.cta}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Comienza a espiar anuncios hoy mismo
              </h2>
              <p className="text-lg text-neutral-700 mb-8">
                Únete a miles de profesionales del marketing que ya están mejorando sus estrategias publicitarias con AdSpy Lite
              </p>
              <Link href="/register" className="dopamine-btn-secondary text-lg px-8 py-4">
                Empezar por solo 1€
              </Link>
            </div>
          </div>
        </section>
      </main>
      
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
    </div>
  );
};

export default LandingPage;