import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Search, Plus, Trash2, Edit3, Cpu, X, FileText } from 'lucide-react';
import { useNotifyAdminChange } from '../../hooks/useAdminSync';

export const AdminInnovationProjects: React.FC = () => {
  const { notifyChange } = useNotifyAdminChange();
  const [projects, setProjects] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProj, setEditingProj] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Desarrollo de Software',
    description: '',
    clientName: '',
    location: '',
    technologies: '',
    status: 'IN_PROGRESS',
    isFeatured: true
  });
  const [files, setFiles] = useState<FileList | null>(null);

  useEffect(() => {
    fetchProjects();
  }, [search]);

  const fetchProjects = async () => {
    try {
      const res = await api.get(`/projects?type=INNOVATION&search=${encodeURIComponent(search)}`);
      setProjects(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('type', 'INNOVATION');
      data.append('title', formData.title);
      data.append('category', formData.category);
      data.append('description', formData.description);
      data.append('clientName', formData.clientName);
      data.append('location', formData.location);
      data.append('status', formData.status);
      data.append('isFeatured', String(formData.isFeatured));

      const techArray = formData.technologies.split(',').map(t => t.trim()).filter(Boolean);
      data.append('technologies', JSON.stringify(techArray));

      if (files) {
        Array.from(files).forEach(file => data.append('files', file));
      }

      if (editingProj) {
        await api.put(`/projects/${editingProj.id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.post('/projects', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      }

      setModalOpen(false);
      setEditingProj(null);
      setFiles(null);
      fetchProjects();
      notifyChange(['projects', 'public-stats']);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al guardar proyecto de innovación');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Deseas deshabilitar este proyecto?')) {
      try {
        await api.delete(`/projects/${id}`);
        fetchProjects();
        notifyChange(['projects', 'public-stats']);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">Proyectos de Innovación Tecnológica</h1>
          <p className="text-xs text-slate-400">Software, IA, IoT, Automatización y Transformación Digital</p>
        </div>
        <button
          onClick={() => {
            setEditingProj(null);
            setFormData({
              title: '',
              category: 'Desarrollo de Software',
              description: '',
              clientName: '',
              location: '',
              technologies: '',
              status: 'IN_PROGRESS',
              isFeatured: true
            });
            setFiles(null);
            setModalOpen(true);
          }}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center space-x-2 shadow-lg shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Proyecto Innovación</span>
        </button>
      </div>

      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center">
        <Search className="w-4 h-4 text-slate-400 mr-2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar proyectos por nombre, cliente o descripción..."
          className="w-full bg-transparent text-white placeholder-slate-500 text-sm focus:outline-none"
        />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="p-4">Imagen WebP</th>
              <th className="p-4">Título</th>
              <th className="p-4">Categoría</th>
              <th className="p-4">Cliente</th>
              <th className="p-4">Tecnologías</th>
              <th className="p-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {projects.map((p) => (
              <tr key={p.id} className="hover:bg-slate-800/40">
                <td className="p-4">
                  <img src={p.imageWebp} alt="" className="w-12 h-10 object-cover rounded-lg" />
                </td>
                <td className="p-4 font-bold text-white max-w-xs truncate">{p.title}</td>
                <td className="p-4">{p.category}</td>
                <td className="p-4">{p.clientName || 'N/A'}</td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-1">
                    {(p.technologies || []).slice(0, 2).map((t: string, idx: number) => (
                      <span key={idx} className="px-2 py-0.5 bg-slate-800 rounded text-[10px]">{t}</span>
                    ))}
                  </div>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() => {
                      setEditingProj(p);
                      setFormData({
                        title: p.title,
                        category: p.category,
                        description: p.description,
                        clientName: p.clientName || '',
                        location: p.location || '',
                        technologies: (p.technologies || []).join(', '),
                        status: p.status,
                        isFeatured: p.isFeatured
                      });
                      setModalOpen(true);
                    }}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-lg"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-1.5 bg-slate-800 hover:bg-rose-950 text-rose-400 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl my-8">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white font-display">
                {editingProj ? 'Editar Proyecto de Innovación' : 'Nuevo Proyecto de Innovación'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre del Proyecto *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Categoría</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none"
                  >
                    <option value="Desarrollo de Software">Desarrollo de Software</option>
                    <option value="Inteligencia Artificial">Inteligencia Artificial</option>
                    <option value="IoT & Edge Computing">IoT & Edge Computing</option>
                    <option value="Automatización">Automatización</option>
                    <option value="Transformación Digital">Transformación Digital</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Cliente</label>
                  <input
                    type="text"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    placeholder="Empresa cliente"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Descripción Detallada *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tecnologías (Separadas por coma)</label>
                <input
                  type="text"
                  value={formData.technologies}
                  onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                  placeholder="React 19, TypeScript, PostgreSQL, Python, Docker"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Imágenes Galería & PDF (JPG/PNG a WebP automático o PDF)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*,application/pdf"
                  onChange={(e) => setFiles(e.target.files)}
                  className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold"
                >
                  Guardar Proyecto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
