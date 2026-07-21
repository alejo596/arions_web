import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAdminSyncListener } from '../../hooks/useAdminSync';

export const TestimonialsSection: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);

  const { data: testimonials = [], refetch } = useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const res = await api.get('/testimonials');
      return res.data.data || [];
    }
  });

  useAdminSyncListener(refetch);

  const defaultList = [
    {
      authorName: 'Ing. Mateo Silva',
      authorRole: 'Director de Tecnología',
      company: 'Global Industrial Tech',
      avatarWebp: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      quote: 'ARIONS transformó completamente nuestra infraestructura digital. Su equipo combinó rigor técnico y agilidad para entregar soluciones de IA sin contratiempos.',
      rating: 5
    },
    {
      authorName: 'Arq. Sofía Valenzuela',
      authorRole: 'Gerente de Operaciones',
      company: 'Andes Retail Group',
      avatarWebp: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
      quote: 'La ejecución de obras menores y remodelaciones de ARIONS superó nuestras expectativas en tiempos y estándares de calidad.',
      rating: 5
    }
  ];

  const list = testimonials.length > 0 ? testimonials : defaultList;

  // Auto carousel effect
  useEffect(() => {
    if (list.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % list.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [list.length]);

  const current = list[activeIdx];

  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-3">Testimonios</h2>
        <h3 className="text-3xl sm:text-4xl font-extrabold text-white font-display mb-12">
          Lo que dicen nuestros clientes
        </h3>

        <div className="glass-card p-8 sm:p-12 rounded-3xl border border-slate-800 relative">
          <Quote className="w-12 h-12 text-blue-500/20 mx-auto mb-6" />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeIdx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <p className="text-lg sm:text-xl text-slate-200 font-light italic leading-relaxed max-w-3xl mx-auto">
                "{current.quote}"
              </p>

              <div className="flex justify-center space-x-1 text-amber-400">
                {[...Array(current.rating || 5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <div className="flex items-center justify-center space-x-4 pt-4">
                <img
                  src={current.avatarWebp || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                  alt={current.authorName}
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-blue-500/30"
                />
                <div className="text-left">
                  <h4 className="text-base font-bold text-white font-display">{current.authorName}</h4>
                  <p className="text-xs text-blue-400 font-medium">{current.authorRole} • {current.company}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Carousel Controls */}
          {list.length > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-8">
              <button
                onClick={() => setActiveIdx((prev) => (prev === 0 ? list.length - 1 : prev - 1))}
                className="p-2 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-xs text-slate-500">{activeIdx + 1} / {list.length}</span>
              <button
                onClick={() => setActiveIdx((prev) => (prev + 1) % list.length)}
                className="p-2 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
