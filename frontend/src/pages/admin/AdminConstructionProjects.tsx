import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Search, Plus, Trash2, Edit3, Hammer, X, Activity, DollarSign } from 'lucide-react';
import { useNotifyAdminChange } from '../../hooks/useAdminSync';

export const AdminConstructionProjects: React.FC = () => {
  const { notifyChange } = useNotifyAdminChange();
  const [projects, setProjects] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProj, setEditingProj] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Obras Menores',
    description: '',
    clientName: '',
    location: '',
    budget: '',
    progressPercentage: 50,
    status: 'IN_PROGRESS',
    isFeatured: true
  });
  const [files, setFiles] = useState<FileList | null>(null);

  useEffect(() => {
    fetchProjects();
  }, [search]);

  const fetchProjects = async () => {
    try {
      const res = await api.get(`/projects?type=CONSTRUCTION&search=${encodeURIComponent(search)}`);
      setProjects(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('type', 'CONSTRUCTION');
      data.append('title', formData.title);
      data.append('category', formData.category);
      data.append('description', formData.description);
      data.append('clientName', formData.clientName);
      data.append('location', formData.location);
      data.append('budget', formData.budget);
      data.append('progressPercentage', String(formData.progressPercentage));
      data.append('status', formData.status);
      data.append('isFeatured', String(formData.isFeatured));

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
      alert(err.response?.data?.message || 'Error al guardar proyecto de construcción');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Deseas deshabilitar esta obra?')) {
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
          <h1 className="text-2xl font-bold text-white font-display">Proyectos de Construcción & Obras</h1>
          <p className="text-xs text-slate-400">Obras menores, remodelaciones, mantenciones, pavimentos, pintura y estructuras</p>
        </div>
        <button
          onClick={() => {
            setEditingProj(null);
            setFormData({
              title: '',
              category: 'Obras Menores',
              description: '',
              clientName: '',
              location: '',
              budget: '',
              progressPercentage: 50,
              status: 'IN_PROGRESS',
              isFeatured: true
            });
            setFiles(null);
            setModalOpen(true);
          }}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center space-x-2 shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Obra / Proyecto</span>
        </button>
      </div>

      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center">
        <Search className="w-4 h-4 text-slate-400 mr-2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar obras por nombre, cliente o ubicación..."
          className="w-full bg-transparent text-white placeholder-slate-500 text-sm focus:outline-none"
        />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="p-4">Imagen WebP</th>
              <th className="p-4">Título Obra</th>
              <th className="p-4">Categoría</th>
              <th className="p-4">Cliente</th>
              <th className="p-4">Avance %</th>
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
                  <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden mb-1">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${p.progressPercentage || 0}%` }}></div>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold">{p.progressPercentage || 0}%</span>
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
                        budget: p.budget ? String(p.budget) : '',
                        progressPercentage: p.progressPercentage || 0,
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
                {editingProj ? 'Editar Proyecto de Construcción' : 'Nuevo Proyecto de Construcción'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Título de la Obra *</label>
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
                    <option value="Obras Menores">Obras Menores</option>
                    <option value="Remodelaciones">Remodelaciones</option>
                    <option value="Mantenciones">Mantenciones</option>
                    <option value="Instalaciones Eléctricas">Instalaciones Eléctricas</option>
                    <option value="Construcción Metálica">Construcción Metálica</option>
                    <option value="Pavimentos">Pavimentos</option>
                    <option value="Pintura Industrial">Pintura Industrial</option>
                    <option value="Gasfitería & Redes">Gasfitería & Redes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Cliente</label>
                  <input
                    type="text"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Ubicación de la Obra</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Ej. Santiago, Chile"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Presupuesto (USD Opcional)</label>
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    placeholder="35000"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Porcentaje de Avance Físico de Obra: <span className="text-emerald-400 font-bold">{formData.progressPercentage}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.progressPercentage}
                  onChange={(e) => setFormData({ ...formData, progressPercentage: parseInt(e.target.value, 10) })}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Descripción de la Obra *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Fotografías de Galería (Conversión a WebP)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setFiles(e.target.files)}
                  className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-600 file:text-white hover:file:bg-emerald-500"
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
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold"
                >
                  Guardar Obra
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
