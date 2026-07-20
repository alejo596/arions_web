import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown, Sparkles, ShieldCheck, Zap } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden bg-slate-950">
      
      {/* Background Graphic Effects */}
      <div className="absolute inset-0 z-0 opacity-40">
        <img
          src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=2000&q=80"
          alt="ARIONS Innovation Background"
          className="w-full h-full object-cover filter brightness-50 contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/30 via-slate-950/60 to-slate-950"></div>
      </div>

      {/* Floating Animated Ambient Glows */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-blue-600/20 rounded-full filter blur-[120px] pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-emerald-600/15 rounded-full filter blur-[120px] pointer-events-none animate-pulse-slow"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        
        {/* Company Logo Showcase */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-2"
        >
          <img src="/logo.png" alt="Arions Builds AI SpA Logo" className="h-28 sm:h-36 w-auto object-contain filter drop-shadow-[0_10px_25px_rgba(59,130,246,0.3)]" />
        </motion.div>

        {/* Top Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-slate-900/80 border border-blue-500/30 text-blue-400 text-xs font-semibold backdrop-blur-md shadow-xl"
        >
          <Sparkles className="w-4 h-4 text-blue-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Arions Builds AI SpA • Transformación Digital & Construcción</span>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
        </motion.div>

        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-4 max-w-5xl mx-auto"
        >
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white font-display leading-[1.1]">
            Innovación Tecnológica & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400">
              Obras de Construcción
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-light">
            Impulsamos el futuro empresarial mediante desarrollo de software avanzado, soluciones de Inteligencia Artificial, automatización IoT y ejecución experta de obras menores.
          </p>
        </motion.div>

        {/* Dual CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-5 pt-4"
        >
          <a
            href="#proyectos"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-base shadow-2xl shadow-blue-500/30 transition-all flex items-center justify-center space-x-2 group"
          >
            <span>Conoce nuestros proyectos</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#contacto"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white font-bold text-base border border-slate-700/80 backdrop-blur-md shadow-xl transition-all flex items-center justify-center space-x-2"
          >
            <span>Contáctanos</span>
          </a>
        </motion.div>

        {/* Trust Feature Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto pt-10 border-t border-slate-800/60"
        >
          <div className="flex items-center justify-center space-x-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/40 backdrop-blur-sm">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-semibold text-slate-300">Garantía de Calidad WCAG & ISO</span>
          </div>
          <div className="flex items-center justify-center space-x-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/40 backdrop-blur-sm">
            <Zap className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-semibold text-slate-300">Despliegue Rápido & Alto Rendimiento</span>
          </div>
          <div className="flex items-center justify-center space-x-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/40 backdrop-blur-sm">
            <Sparkles className="w-5 h-5 text-blue-400" />
            <span className="text-xs font-semibold text-slate-300">Soluciones 100% Personalizadas</span>
          </div>
        </motion.div>
      </div>

      {/* Down Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-1 text-slate-400 text-xs">
        <span className="text-[11px] uppercase tracking-widest font-semibold">Descubre más</span>
        <ChevronDown className="w-5 h-5 animate-bounce text-blue-400" />
      </div>
    </section>
  );
};
