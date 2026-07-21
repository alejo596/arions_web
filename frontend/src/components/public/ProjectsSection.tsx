import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { ProjectLightboxModal } from '../common/ProjectLightboxModal';
import { Cpu, Hammer, ExternalLink, Calendar, MapPin, Activity, FileText } from 'lucide-react';
import { useAdminSyncListener } from '../../hooks/useAdminSync';

export const ProjectsSection: React.FC = () => {
  const [filterType, setFilterType] = useState<'ALL' | 'INNOVATION' | 'CONSTRUCTION'>('ALL');
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  const { data: projects = [], isLoading: loading, refetch } = useQuery({
    queryKey: ['projects', filterType],
    queryFn: async () => {
      const typeParam = filterType !== 'ALL' ? `?type=${filterType}` : '';
      const res = await api.get(`/projects${typeParam}`);
      return res.data.data || [];
    }
  });

  useAdminSyncListener(refetch);

  return (
    <section id="proyectos" className="py-24 bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 space-y-4 md:space-y-0">
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-400">Portafolio de Éxito</h2>
            <h3 className="text-3xl sm:text-5xl font-extrabold text-white font-display">
              Proyectos Destacados
            </h3>
            <p className="text-slate-400 text-base max-w-xl">
              Explora nuestras ejecuciones más recientes en innovación digital e infraestructura física.
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="inline-flex p-1.5 bg-slate-900 border border-slate-800 rounded-2xl">
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filterType === 'ALL' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilterType('INNOVATION')}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filterType === 'INNOVATION' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" /> <span>Innovación</span>
            </button>
            <button
              onClick={() => setFilterType('CONSTRUCTION')}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filterType === 'CONSTRUCTION' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Hammer className="w-3.5 h-3.5" /> <span>Construcción</span>
            </button>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="text-center py-20 text-slate-400">Cargando proyectos...</div>
        )}

        {/* Projects Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((proj: any) => (
              <motion.div
                key={proj.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-3xl overflow-hidden border border-slate-800 flex flex-col justify-between group cursor-pointer"
                onClick={() => setSelectedProject(proj)}
              >
                <div>
                  {/* WebP Image & Badge Overlay */}
                  <div className="relative h-56 overflow-hidden bg-slate-900">
                    <img
                      src={proj.imageWebp}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className={`px-3 py-1 text-[11px] font-bold rounded-full backdrop-blur-md ${
                        proj.type === 'INNOVATION'
                          ? 'bg-blue-600/80 text-white border border-blue-400/40'
                          : 'bg-emerald-600/80 text-white border border-emerald-400/40'
                      }`}>
                        {proj.type === 'INNOVATION' ? 'Innovación' : 'Construcción'}
                      </span>
                    </div>

                    {proj.pdfDocument && (
                      <div className="absolute top-3 right-3 p-1.5 bg-slate-950/80 text-blue-400 rounded-lg backdrop-blur-md border border-slate-700">
                        <FileText className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>{proj.category}</span>
                      {proj.location && (
                        <span className="flex items-center text-slate-400">
                          <MapPin className="w-3.5 h-3.5 mr-1 text-rose-400" /> {proj.location}
                        </span>
                      )}
                    </div>

                    <h4 className="text-xl font-bold text-white font-display group-hover:text-blue-400 transition-colors">
                      {proj.title}
                    </h4>

                    <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed">
                      {proj.description}
                    </p>

                    {/* Progress Bar for Construction */}
                    {proj.type === 'CONSTRUCTION' && (
                      <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 space-y-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-400 flex items-center"><Activity className="w-3 h-3 mr-1 text-emerald-400" /> Avance</span>
                          <span className="text-emerald-400 font-bold">{proj.progressPercentage || 0}%</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${proj.progressPercentage || 0}%` }}></div>
                        </div>
                      </div>
                    )}

                    {/* Tech Badges */}
                    {proj.technologies && proj.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {proj.technologies.slice(0, 3).map((tech: string, idx: number) => (
                          <span key={idx} className="px-2 py-0.5 text-[10px] bg-slate-900 text-slate-300 rounded-md border border-slate-800">
                            {tech}
                          </span>
                        ))}
                        {proj.technologies.length > 3 && (
                          <span className="px-2 py-0.5 text-[10px] bg-slate-900 text-slate-400 rounded-md">
                            +{proj.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="px-6 py-4 bg-slate-900/50 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-blue-400 group-hover:text-blue-300">
                  <span>Ver Galería y Detalles</span>
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Lightbox Modal */}
        <ProjectLightboxModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      </div>
    </section>
  );
};
