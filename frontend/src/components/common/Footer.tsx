import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { Mail, Phone, MapPin, Linkedin, Github, Twitter, Instagram, ArrowUpRight } from 'lucide-react';
import { useAdminSyncListener } from '../../hooks/useAdminSync';

export const Footer: React.FC = () => {
  const { data: settings, refetch } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const res = await api.get('/settings');
      return res.data.data;
    }
  });

  useAdminSyncListener(refetch);

  const address = settings?.address || 'Av. Providencia 1234, Of. 501, Santiago, Chile';
  const phone = settings?.contactPhone || '+56 9 1234 5678';
  const email = settings?.contactEmail || 'contacto@arions.tech';
  const logoUrl = settings?.logoWebp || '/logo.png';
  const companyName = settings?.companyName || 'Arions Builds AI SpA';
  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-900">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-1.5 px-2 rounded-xl bg-slate-900/90 border border-slate-800 shadow-md flex items-center justify-center">
                <img src={logoUrl} alt={companyName} className="h-10 w-auto object-contain filter drop-shadow-[0_0_6px_rgba(59,130,246,0.5)] brightness-110 contrast-125" />
              </div>
              <div>
                <span className="font-display text-lg font-bold tracking-tight text-white block leading-none">ARIONS</span>
                <span className="text-[10px] font-semibold text-blue-400 tracking-widest uppercase block">BUILDS AI SPA.</span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              <strong>{companyName}</strong> — Líderes en el desarrollo de proyectos de innovación tecnológica, Inteligencia Artificial, desarrollo de software y ejecución de obras menores de construcción.
            </p>
            <div className="flex space-x-3 pt-2">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 hover:text-white text-slate-400 transition-all border border-slate-800">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-700 hover:text-white text-slate-400 transition-all border border-slate-800">
                <Github className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-slate-900 hover:bg-sky-500 hover:text-white text-slate-400 transition-all border border-slate-800">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-slate-900 hover:bg-pink-600 hover:text-white text-slate-400 transition-all border border-slate-800">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 font-display">Nuestra Empresa</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#inicio" className="hover:text-blue-400 transition-colors">Inicio</a></li>
              <li><a href="#nosotros" className="hover:text-blue-400 transition-colors">Nosotros</a></li>
              <li><a href="#servicios" className="hover:text-blue-400 transition-colors">Servicios</a></li>
              <li><a href="#proyectos" className="hover:text-blue-400 transition-colors">Proyectos</a></li>
              <li><a href="#noticias" className="hover:text-blue-400 transition-colors">Noticias & Blog</a></li>
              <li><a href="#contacto" className="hover:text-blue-400 transition-colors">Contacto</a></li>
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 font-display">Áreas de Especialidad</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#servicios" className="hover:text-blue-400 transition-colors">Desarrollo de Software</a></li>
              <li><a href="#servicios" className="hover:text-blue-400 transition-colors">Inteligencia Artificial</a></li>
              <li><a href="#servicios" className="hover:text-blue-400 transition-colors">IoT & Automatización</a></li>
              <li><a href="#servicios" className="hover:text-blue-400 transition-colors">Obras Menores & Pintura</a></li>
              <li><a href="#servicios" className="hover:text-blue-400 transition-colors">Construcción Metálica</a></li>
              <li><a href="#servicios" className="hover:text-blue-400 transition-colors">Instalaciones Eléctricas</a></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 font-display">Contacto Directo</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-blue-400 mt-1 shrink-0" />
                <span>{address}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{phone}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{email}</span>
              </div>
              <div className="pt-2">
                <a
                  href="/admin/login"
                  className="inline-flex items-center text-xs text-blue-400 hover:underline font-semibold"
                >
                  Acceso Administrativo <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs space-y-4 md:space-y-0">
          <p>© {new Date().getFullYear()} ARIONS Technologies & Construction Corp. Todos los derechos reservados.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-slate-200 transition-colors">Política de Privacidad</a>
            <a href="#" className="hover:text-slate-200 transition-colors">Términos de Servicio</a>
            <a href="#" className="hover:text-slate-200 transition-colors">Accesibilidad WCAG 2.2</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
