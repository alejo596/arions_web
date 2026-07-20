import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Sun, Moon, Search, Menu, X, Shield, PhoneCall, Cpu, Hammer } from 'lucide-react';
import { GlobalSearchModal } from './GlobalSearchModal';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 py-3 shadow-2xl' : 'bg-transparent py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center space-x-3 group">
            <img
              src="/logo.png"
              alt="Arions Builds AI SpA Logo"
              className="h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <div>
              <span className="font-display text-lg font-bold tracking-tight text-white block leading-none">ARIONS</span>
              <span className="text-[10px] font-semibold text-blue-400 tracking-widest uppercase block">BUILDS AI SPA.</span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
            <a href="#inicio" className="hover:text-blue-400 transition-colors">Inicio</a>
            <a href="#nosotros" className="hover:text-blue-400 transition-colors">Nosotros</a>
            <a href="#servicios" className="hover:text-blue-400 transition-colors flex items-center">
              <Cpu className="w-4 h-4 mr-1 text-blue-400" /> Servicios
            </a>
            <a href="#proyectos" className="hover:text-blue-400 transition-colors flex items-center">
              <Hammer className="w-4 h-4 mr-1 text-emerald-400" /> Proyectos
            </a>
            <a href="#noticias" className="hover:text-blue-400 transition-colors">Noticias</a>
            <a href="#contacto" className="hover:text-blue-400 transition-colors">Contacto</a>
          </nav>

          {/* Right Action Icons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Global Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all flex items-center space-x-2 text-xs"
              title="Buscar (Ctrl+K)"
            >
              <Search className="w-4 h-4 text-blue-400" />
              <span className="text-slate-400">Buscar...</span>
            </button>

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-800 transition-all"
              title="Cambiar Modo Claro / Oscuro"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-blue-400" />}
            </button>

            {/* Admin Panel link or Login */}
            {user ? (
              <a
                href="/admin"
                className="px-4 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-xs font-semibold flex items-center space-x-1.5 transition-all"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Panel Admin</span>
              </a>
            ) : (
              <a
                href="/admin/login"
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold flex items-center space-x-1.5 transition-all"
              >
                <Shield className="w-3.5 h-3.5 text-blue-400" />
                <span>Acceso Admin</span>
              </a>
            )}

            {/* Contact CTA */}
            <a
              href="#contacto"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold text-xs shadow-lg shadow-blue-500/25 transition-all flex items-center space-x-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Cotizar Proyecto</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-3">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-xl bg-slate-900 text-slate-300 border border-slate-800"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-900 text-slate-300 border border-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-950/95 backdrop-blur-2xl border-b border-slate-800 px-4 pt-4 pb-6 space-y-4 shadow-2xl">
            <a
              href="#inicio"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-200 hover:text-blue-400 font-medium text-base"
            >
              Inicio
            </a>
            <a
              href="#nosotros"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-200 hover:text-blue-400 font-medium text-base"
            >
              Nosotros
            </a>
            <a
              href="#servicios"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-200 hover:text-blue-400 font-medium text-base"
            >
              Servicios
            </a>
            <a
              href="#proyectos"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-200 hover:text-blue-400 font-medium text-base"
            >
              Proyectos
            </a>
            <a
              href="#noticias"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-200 hover:text-blue-400 font-medium text-base"
            >
              Noticias
            </a>
            <a
              href="#contacto"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-200 hover:text-blue-400 font-medium text-base"
            >
              Contacto
            </a>
            <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
              <a
                href="/admin/login"
                className="text-xs text-blue-400 font-semibold flex items-center"
              >
                <Shield className="w-4 h-4 mr-1" /> Acceso Panel Administrativo
              </a>
              <button
                onClick={toggleTheme}
                className="p-2 bg-slate-900 rounded-lg text-amber-400 border border-slate-800"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};
