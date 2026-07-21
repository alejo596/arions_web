import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { Calendar, User, Tag, ArrowRight, X, Newspaper } from 'lucide-react';
import { useAdminSyncListener } from '../../hooks/useAdminSync';

export const NewsSection: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);

  const { data: newsList = [], isLoading: loading, refetch } = useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      const res = await api.get('/news?limit=3');
      return res.data.data || [];
    }
  });

  useAdminSyncListener(refetch);

  return (
    <section id="noticias" className="py-24 bg-slate-950/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400">Noticias & Novedades</h2>
          <p className="text-3xl sm:text-5xl font-extrabold text-white font-display">
            Artículos & Publicaciones Recientes
          </p>
          <p className="text-slate-400 text-base leading-relaxed">
            Mantente al día con los últimos avances en tecnología, tendencias en construcción y noticias corporativas.
          </p>
        </div>

        {loading && <div className="text-center py-12 text-slate-400">Cargando publicaciones...</div>}

        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {newsList.map((item: any) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-3xl overflow-hidden border border-slate-800 flex flex-col justify-between group cursor-pointer"
                onClick={() => setSelectedArticle(item)}
              >
                <div>
                  <div className="relative h-48 overflow-hidden bg-slate-900">
                    <img
                      src={item.imageWebp}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 px-3 py-1 bg-slate-950/80 text-emerald-400 text-[11px] font-bold rounded-full backdrop-blur-md border border-emerald-500/30">
                      {item.category?.name || 'Corporativo'}
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center space-x-4 text-xs text-slate-400">
                      <span className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-1 text-blue-400" /> {new Date(item.publishedAt).toLocaleDateString('es-ES')}</span>
                      <span className="flex items-center"><User className="w-3.5 h-3.5 mr-1 text-emerald-400" /> {item.author?.name || 'Equipo ARIONS'}</span>
                    </div>

                    <h4 className="text-lg font-bold text-white font-display group-hover:text-emerald-400 transition-colors line-clamp-2">
                      {item.title}
                    </h4>

                    <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">
                      {item.summary}
                    </p>
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-emerald-400 group-hover:text-emerald-300">
                  <span>Leer Artículo Completo</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {/* Article Full View Modal */}
        <AnimatePresence>
          {selectedArticle && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl my-8 max-h-[85vh] flex flex-col"
              >
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="absolute top-4 right-4 z-10 p-2 bg-slate-950/70 hover:bg-slate-950 text-slate-300 rounded-full border border-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
                  <img src={selectedArticle.imageWebp} alt="" className="w-full h-64 object-cover rounded-2xl" />
                  
                  <div className="space-y-2">
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/30">
                      {selectedArticle.category?.name}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display leading-snug">
                      {selectedArticle.title}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Publicado el {new Date(selectedArticle.publishedAt).toLocaleDateString('es-ES')} por {selectedArticle.author?.name}
                    </p>
                  </div>

                  <div
                    className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-4"
                    dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
                  />

                  {selectedArticle.tags && selectedArticle.tags.length > 0 && (
                    <div className="pt-4 border-t border-slate-800 flex flex-wrap gap-2">
                      {selectedArticle.tags.map((tag: string, i: number) => (
                        <span key={i} className="flex items-center px-2.5 py-1 text-xs bg-slate-800 text-slate-300 rounded-lg">
                          <Tag className="w-3 h-3 mr-1 text-emerald-400" /> {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
