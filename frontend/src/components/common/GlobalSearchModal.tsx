import React, { useState, useEffect } from 'react';
import { Search, X, Layers, Newspaper, ExternalLink } from 'lucide-react';
import { api } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ news: any[]; projects: any[] }>({ news: [], projects: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ news: [], projects: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.get(`/dashboard/search?q=${encodeURIComponent(query)}`);
        setResults(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-2xl bg-slate-900 border border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Input Bar */}
          <div className="flex items-center px-4 py-3.5 border-b border-slate-800 bg-slate-900/50">
            <Search className="w-5 h-5 text-blue-400 mr-3 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar proyectos, noticias, tecnologías..."
              className="w-full bg-transparent text-slate-100 placeholder-slate-400 focus:outline-none text-base"
              autoFocus
            />
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Results List */}
          <div className="max-h-[60vh] overflow-y-auto p-4 space-y-6">
            {loading && (
              <div className="text-center py-8 text-slate-400">Buscando resultados...</div>
            )}

            {!loading && query && results.projects.length === 0 && results.news.length === 0 && (
              <div className="text-center py-8 text-slate-400">No se encontraron resultados para "{query}"</div>
            )}

            {/* Projects Section */}
            {results.projects.length > 0 && (
              <div>
                <h4 className="flex items-center text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  <Layers className="w-4 h-4 mr-2 text-blue-400" /> Proyectos ({results.projects.length})
                </h4>
                <div className="space-y-2">
                  {results.projects.map((proj) => (
                    <a
                      key={proj.id}
                      href={`#proyectos`}
                      onClick={onClose}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/30 transition-all group"
                    >
                      <div className="flex items-center space-x-3">
                        <img src={proj.imageWebp} alt={proj.title} className="w-10 h-10 object-cover rounded-lg" />
                        <div>
                          <p className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                            {proj.title}
                          </p>
                          <span className="text-xs text-slate-400">{proj.type === 'INNOVATION' ? 'Innovación' : 'Construcción'} • {proj.category}</span>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-400" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* News Section */}
            {results.news.length > 0 && (
              <div>
                <h4 className="flex items-center text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  <Newspaper className="w-4 h-4 mr-2 text-emerald-400" /> Noticias & Artículos ({results.news.length})
                </h4>
                <div className="space-y-2">
                  {results.news.map((item) => (
                    <a
                      key={item.id}
                      href={`#noticias`}
                      onClick={onClose}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/30 transition-all group"
                    >
                      <div className="flex items-center space-x-3">
                        <img src={item.imageWebp} alt={item.title} className="w-10 h-10 object-cover rounded-lg" />
                        <div>
                          <p className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">
                            {item.title}
                          </p>
                          <p className="text-xs text-slate-400 line-clamp-1">{item.summary}</p>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-400" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
