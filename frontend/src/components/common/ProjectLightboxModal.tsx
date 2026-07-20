import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, FileText, MapPin, Building, Calendar, DollarSign, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProjectLightboxModalProps {
  project: any | null;
  onClose: () => void;
}

export const ProjectLightboxModal: React.FC<ProjectLightboxModalProps> = ({ project, onClose }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!project) return null;

  const images = project.gallery && project.gallery.length > 0 ? project.gallery : [project.imageWebp];

  const handlePrev = () => {
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl my-8"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-slate-950/60 hover:bg-slate-950 text-slate-300 hover:text-white rounded-full transition-all border border-slate-700"
            aria-label="Cerrar ventana"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Gallery Lightbox Column */}
            <div className="lg:col-span-7 relative bg-slate-950 flex flex-col justify-center min-h-[350px] lg:min-h-[500px]">
              <img
                src={images[activeImageIndex]}
                alt={project.title}
                className="w-full h-full object-cover max-h-[500px]"
              />

              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-slate-900/80 hover:bg-slate-900 text-white rounded-full border border-slate-700 backdrop-blur-md transition-all"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-slate-900/80 hover:bg-slate-900 text-white rounded-full border border-slate-700 backdrop-blur-md transition-all"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                  {/* Thumbnails */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2 bg-slate-900/80 p-2 rounded-2xl border border-slate-800 backdrop-blur-md">
                    {images.map((img: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`w-12 h-10 rounded-lg overflow-hidden border-2 transition-all ${
                          idx === activeImageIndex ? 'border-blue-500 scale-105' : 'border-transparent opacity-60'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Project Details Column */}
            <div className="lg:col-span-5 p-6 lg:p-8 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                    project.type === 'INNOVATION' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {project.type === 'INNOVATION' ? 'Innovación Tecnológica' : 'Construcción & Obras'}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">• {project.category}</span>
                </div>

                <h3 className="text-2xl font-bold text-white mb-3 font-display">{project.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-6 whitespace-pre-line">{project.description}</p>

                {/* Progress Bar for Construction */}
                {project.type === 'CONSTRUCTION' && (
                  <div className="mb-6 bg-slate-800/60 p-4 rounded-2xl border border-slate-800">
                    <div className="flex justify-between items-center text-xs font-semibold text-slate-300 mb-2">
                      <span className="flex items-center"><Activity className="w-4 h-4 mr-1 text-emerald-400" /> Avance Físico de Obra</span>
                      <span className="text-emerald-400 font-bold">{project.progressPercentage || 0}%</span>
                    </div>
                    <div className="w-full bg-slate-700 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all duration-1000"
                        style={{ width: `${project.progressPercentage || 0}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs text-slate-300 mb-6">
                  {project.clientName && (
                    <div className="flex items-center p-2.5 bg-slate-800/40 rounded-xl border border-slate-800">
                      <Building className="w-4 h-4 text-blue-400 mr-2 shrink-0" />
                      <div>
                        <span className="text-slate-500 block">Cliente</span>
                        <span className="font-semibold text-white">{project.clientName}</span>
                      </div>
                    </div>
                  )}
                  {project.location && (
                    <div className="flex items-center p-2.5 bg-slate-800/40 rounded-xl border border-slate-800">
                      <MapPin className="w-4 h-4 text-rose-400 mr-2 shrink-0" />
                      <div>
                        <span className="text-slate-500 block">Ubicación</span>
                        <span className="font-semibold text-white">{project.location}</span>
                      </div>
                    </div>
                  )}
                  {project.budget && (
                    <div className="flex items-center p-2.5 bg-slate-800/40 rounded-xl border border-slate-800">
                      <DollarSign className="w-4 h-4 text-amber-400 mr-2 shrink-0" />
                      <div>
                        <span className="text-slate-500 block">Presupuesto Referencial</span>
                        <span className="font-semibold text-white">${project.budget.toLocaleString()} USD</span>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center p-2.5 bg-slate-800/40 rounded-xl border border-slate-800">
                    <Calendar className="w-4 h-4 text-purple-400 mr-2 shrink-0" />
                    <div>
                      <span className="text-slate-500 block">Estado</span>
                      <span className="font-semibold text-white">{project.status}</span>
                    </div>
                  </div>
                </div>

                {/* Technologies / Specs Badges */}
                {project.technologies && project.technologies.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Tecnologías & Especificaciones</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies.map((tech: string, i: number) => (
                        <span key={i} className="px-2.5 py-1 text-xs bg-slate-800 text-slate-300 rounded-lg border border-slate-700/60">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* PDF Document Download Button */}
              {project.pdfDocument && (
                <a
                  href={project.pdfDocument}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2 w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/20"
                >
                  <FileText className="w-5 h-5" />
                  <span>Descargar Ficha Técnica PDF</span>
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
