import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { History, Target, Compass, Award, Users, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'historia' | 'mision' | 'valores' | 'equipo'>('historia');

  const team = [
    {
      name: 'Alexander Ross',
      role: 'CEO & Software Architect',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      bio: 'Más de 15 años de experiencia en arquitectura cloud, desarrollo de software escalable y liderazgo de proyectos de alta complejidad.'
    },
    {
      name: 'Elena Morales',
      role: 'Directora de Innovación & IA',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      bio: 'Especialista en Machine Learning, procesamiento de lenguaje natural y automatización de procesos industriales.'
    },
    {
      name: 'Carlos Mendoza',
      role: 'Jefe de Obras & Infraestructura',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      bio: 'Ingeniero Constructor con vasta experiencia en dirección de obras menores, construcciones metálicas y mantenimiento corporativo.'
    }
  ];

  return (
    <section id="nosotros" className="py-24 bg-slate-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-400">Sobre ARIONS</h2>
          <p className="text-3xl sm:text-5xl font-extrabold text-white font-display">
            Trayectoria de Excelencia en Innovación y Construcción
          </p>
          <p className="text-slate-400 text-base leading-relaxed">
            Combinamos el pensamiento computacional avanzado con la precisión de la ingeniería en obras para transformar las visiones de nuestros clientes en realidades tangibles.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1.5 bg-slate-900 border border-slate-800 rounded-2xl max-w-full overflow-x-auto">
            <button
              onClick={() => setActiveTab('historia')}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${
                activeTab === 'historia' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              <History className="w-4 h-4" /> <span>Historia & Misión</span>
            </button>
            <button
              onClick={() => setActiveTab('mision')}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${
                activeTab === 'mision' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Target className="w-4 h-4" /> <span>Visión & Objetivos</span>
            </button>
            <button
              onClick={() => setActiveTab('valores')}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${
                activeTab === 'valores' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Award className="w-4 h-4" /> <span>Valores & Experiencia</span>
            </button>
            <button
              onClick={() => setActiveTab('equipo')}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${
                activeTab === 'equipo' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" /> <span>Equipo Liderazgo</span>
            </button>
          </div>
        </div>

        {/* Tab Content Display */}
        <div className="glass-card p-8 lg:p-12 rounded-3xl border border-slate-800">
          {activeTab === 'historia' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs rounded-full">
                  <History className="w-3.5 h-3.5" /> <span>Nuestros Orígenes</span>
                </div>
                <h3 className="text-3xl font-bold text-white font-display">Más de una década conectando la tecnología y la infraestructura física</h3>
                <p className="text-slate-300 text-base leading-relaxed">
                  Fundada con la convención de que el futuro pertenece a las organizaciones adaptables, ARIONS nació como una consultora de ingeniería y desarrollo de software.
                </p>
                <p className="text-slate-400 text-sm leading-relaxed">
                  A lo largo de los años amplió sus operaciones creando la división de Obras Menores y Remodelaciones Industriales, ofreciendo un servicio 360° sin intermediarios.
                </p>
              </div>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
                <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" alt="Equipo ARIONS" className="w-full h-80 object-cover" />
              </div>
            </motion.div>
          )}

          {activeTab === 'mision' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-6 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                  <Target className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-white font-display">Misión Corporativa</h4>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Proveer soluciones de vanguardia en desarrollo de software, inteligencia artificial y ejecución de obras menores que optimicen procesos, maximicen el retorno de inversión y garanticen la máxima seguridad y calidad.
                </p>
              </div>
              <div className="p-6 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
                  <Compass className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-white font-display">Visión a Futuro</h4>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Ser reconocidos internacionalmente como la firma referente de integración tecnológica y constructiva, destacándonos por la innovación continua, la ética profesional y el impacto positivo en nuestros clientes.
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === 'valores' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'Innovación Constante', desc: 'Investigación activa en nuevas tecnologías y materiales.' },
                { title: 'Rigor & Transparencia', desc: 'Cumplimiento estricto de presupuestos y plazos estipulados.' },
                { title: 'Calidad Garantizada', desc: 'Estándares WCAG 2.2, certificaciones eléctricas e industriales.' },
                { title: 'Orientación al Cliente', desc: 'Atención personalizada y acompañamiento post-entrega.' },
                { title: 'Sostenibilidad', desc: 'Uso de materiales eficientes y código optimizado energéticamente.' },
                { title: 'Seguridad Operativa', desc: 'Protocolos rigurosos de prevención de riesgos y ciberseguridad.' }
              ].map((val, idx) => (
                <div key={idx} className="p-5 bg-slate-900/40 rounded-2xl border border-slate-800/80 flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-white text-sm mb-1">{val.title}</h5>
                    <p className="text-slate-400 text-xs">{val.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'equipo' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member, idx) => (
                <div key={idx} className="bg-slate-900/60 rounded-2xl border border-slate-800 overflow-hidden text-center p-6 space-y-4 hover:border-blue-500/30 transition-all">
                  <img src={member.image} alt={member.name} className="w-24 h-24 rounded-full object-cover mx-auto ring-4 ring-blue-500/20" />
                  <div>
                    <h4 className="text-lg font-bold text-white font-display">{member.name}</h4>
                    <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider">{member.role}</p>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed">{member.bio}</p>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};
