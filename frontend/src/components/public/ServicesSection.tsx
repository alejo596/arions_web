import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Hammer, Code2, Bot, Network, Lightbulb, Wrench, Paintbrush, Zap, Droplet, Shield, Layers, ArrowUpRight } from 'lucide-react';

export const ServicesSection: React.FC = () => {
  const [activeModule, setActiveModule] = useState<'innovation' | 'construction'>('innovation');

  const innovationServices = [
    {
      icon: Code2,
      title: 'Desarrollo de Software',
      desc: 'Sistemas a medida, arquitecturas cloud nativas, APIs REST/GraphQL y aplicaciones móviles de alto impacto.'
    },
    {
      icon: Bot,
      title: 'Inteligencia Artificial',
      desc: 'Modelos predictivos, chatbots con IA generativa, análisis de sentimiento y automatización cognitiva.'
    },
    {
      icon: Layers,
      title: 'Automatización',
      desc: 'RPA, flujos de trabajo optimizados e integración de sistemas legacy sin fricción.'
    },
    {
      icon: Network,
      title: 'Internet de las Cosas (IoT)',
      desc: 'Sensores inteligentes, telemetría industrial, Edge Computing y monitoreo ambiental en tiempo real.'
    },
    {
      icon: Shield,
      title: 'Transformación Digital',
      desc: 'Auditoría tecnológica, migración a la nube, ciberseguridad avanzada y consultoría estratégica.'
    },
    {
      icon: Lightbulb,
      title: 'Investigación & Desarrollo (I+D)',
      desc: 'Prototipado rápido de conceptos emergentes, Web3 y prueba de concepto para startups y corporativos.'
    }
  ];

  const constructionServices = [
    {
      icon: Wrench,
      title: 'Obras Menores',
      desc: 'Ejecución rápida y limpia de reformas de mediana y pequeña escala para oficinas y naves.'
    },
    {
      icon: Paintbrush,
      title: 'Remodelaciones',
      desc: 'Rehabilitación integral de interiores, diseño de plantas libres, tabiquería y aislación termoacústica.'
    },
    {
      icon: Shield,
      title: 'Mantenciones Preventivas',
      desc: 'Planes integrales de mantenimiento para instalaciones industriales y centros corporativos.'
    },
    {
      icon: Zap,
      title: 'Instalaciones Eléctricas',
      desc: 'Tableros, redes de fuerza, iluminación LED de bajo consumo y certificación SEC.'
    },
    {
      icon: Hammer,
      title: 'Construcción Metálica',
      desc: 'Fabricación y montaje de estructuras de acero, galpones, mezzanines y cobertizos.'
    },
    {
      icon: Layers,
      title: 'Pavimentos Técnicos',
      desc: 'Aplicación de resinas epóxicas, hormigón pulido y revestimientos de alta resistencia.'
    },
    {
      icon: Paintbrush,
      title: 'Pintura Industrial',
      desc: 'Tratamiento anticorrosivo, demarcación de vías operativas y recubrimientos especializados.'
    },
    {
      icon: Droplet,
      title: 'Gasfitería & Redes',
      desc: 'Instalación de redes sanitarias, aire comprimido y detección de fugas.'
    }
  ];

  return (
    <section id="servicios" className="py-24 bg-slate-950/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-400">Servicios Integrales</h2>
          <p className="text-3xl sm:text-5xl font-extrabold text-white font-display">
            Dos Grandes Módulos de Especialidad
          </p>
          <p className="text-slate-400 text-base leading-relaxed">
            Selecciona el módulo de tu interés para conocer nuestras capacidades tecnológicas y soluciones constructivas.
          </p>
        </div>

        {/* Module Selector Controls */}
        <div className="flex justify-center mb-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-2 bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl">
            <button
              onClick={() => setActiveModule('innovation')}
              className={`flex items-center justify-center space-x-3 py-4 px-6 rounded-2xl font-bold text-base transition-all ${
                activeModule === 'innovation'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-xl shadow-blue-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Cpu className="w-5 h-5 text-blue-300" />
              <span>Innovación Tecnológica</span>
            </button>

            <button
              onClick={() => setActiveModule('construction')}
              className={`flex items-center justify-center space-x-3 py-4 px-6 rounded-2xl font-bold text-base transition-all ${
                activeModule === 'construction'
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-xl shadow-emerald-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Hammer className="w-5 h-5 text-emerald-300" />
              <span>Construcción & Obras</span>
            </button>
          </div>
        </div>

        {/* Services Grid Display */}
        <motion.div
          key={activeModule}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {activeModule === 'innovation'
            ? innovationServices.map((srv, idx) => {
                const IconComponent = srv.icon;
                return (
                  <div
                    key={idx}
                    className="glass-card p-8 rounded-3xl space-y-4 border border-slate-800 hover:border-blue-500/40 transition-all group relative overflow-hidden"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-white font-display group-hover:text-blue-400 transition-colors">
                      {srv.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{srv.desc}</p>
                    <div className="pt-2">
                      <a href="#contacto" className="inline-flex items-center text-xs font-semibold text-blue-400 hover:text-blue-300">
                        Consultar servicio <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                      </a>
                    </div>
                  </div>
                );
              })
            : constructionServices.map((srv, idx) => {
                const IconComponent = srv.icon;
                return (
                  <div
                    key={idx}
                    className="glass-card p-8 rounded-3xl space-y-4 border border-slate-800 hover:border-emerald-500/40 transition-all group relative overflow-hidden"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-white font-display group-hover:text-emerald-400 transition-colors">
                      {srv.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{srv.desc}</p>
                    <div className="pt-2">
                      <a href="#contacto" className="inline-flex items-center text-xs font-semibold text-emerald-400 hover:text-emerald-300">
                        Solicitar cotización <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                      </a>
                    </div>
                  </div>
                );
              })}
        </motion.div>
      </div>
    </section>
  );
};
