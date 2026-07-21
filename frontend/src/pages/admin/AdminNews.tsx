import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Search, Plus, Trash2, Edit3, Newspaper, X, Upload, Tag } from 'lucide-react';
import { useNotifyAdminChange } from '../../hooks/useAdminSync';

export const AdminNews: React.FC = () => {
  const { notifyChange } = useNotifyAdminChange();
  const [news, setNews] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<any | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    categoryId: '',
    status: 'PUBLISHED',
    tags: '',
    publishedAt: new Date().toISOString().split('T')[0]
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchNews();
    fetchCategories();
  }, [search]);

  const fetchNews = async () => {
    try {
      const res = await api.get(`/news/admin/list?search=${encodeURIComponent(search)}`);
      setNews(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/news/categories');
      setCategories(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('summary', formData.summary);
      data.append('content', formData.content);
      data.append('categoryId', formData.categoryId || (categories[0]?.id || ''));
      data.append('status', formData.status);
      data.append('publishedAt', formData.publishedAt);
      
      const parsedTags = formData.tags.split(',').map(t => t.trim()).filter(Boolean);
      data.append('tags', JSON.stringify(parsedTags));

      if (selectedFile) {
        data.append('image', selectedFile);
      }

      if (editingNews) {
        await api.put(`/news/${editingNews.id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.post('/news', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      }

      setModalOpen(false);
      setEditingNews(null);
      setSelectedFile(null);
      fetchNews();
      notifyChange(['news', 'public-stats']);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al guardar la noticia');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Deseas deshabilitar esta noticia?')) {
      try {
        await api.delete(`/news/${id}`);
        fetchNews();
        notifyChange(['news', 'public-stats']);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">Gestión de Noticias & Blog</h1>
          <p className="text-xs text-slate-400">Publicaciones con conversión automática a WebP y programación</p>
        </div>
        <button
          onClick={() => {
            setEditingNews(null);
            setFormData({
              title: '',
              summary: '',
              content: '',
              categoryId: categories[0]?.id || '',
              status: 'PUBLISHED',
              tags: '',
              publishedAt: new Date().toISOString().split('T')[0]
            });
            setSelectedFile(null);
            setModalOpen(true);
          }}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center space-x-2 shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Noticia</span>
        </button>
      </div>

      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center">
        <Search className="w-4 h-4 text-slate-400 mr-2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar noticias por título o contenido..."
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
              <th className="p-4">Estado</th>
              <th className="p-4">Publicación</th>
              <th className="p-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {news.map((item) => (
              <tr key={item.id} className="hover:bg-slate-800/40">
                <td className="p-4">
                  <img src={item.imageWebp} alt="" className="w-12 h-10 object-cover rounded-lg" />
                </td>
                <td className="p-4 font-bold text-white max-w-xs truncate">{item.title}</td>
                <td className="p-4">{item.category?.name || 'General'}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                    item.status === 'PUBLISHED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="p-4">{new Date(item.publishedAt).toLocaleDateString()}</td>
                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() => {
                      setEditingNews(item);
                      setFormData({
                        title: item.title,
                        summary: item.summary,
                        content: item.content,
                        categoryId: item.categoryId,
                        status: item.status,
                        tags: (item.tags || []).join(', '),
                        publishedAt: new Date(item.publishedAt).toISOString().split('T')[0]
                      });
                      setModalOpen(true);
                    }}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-lg"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
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
                {editingNews ? 'Editar Noticia' : 'Crear Nueva Noticia'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Título *</label>
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
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Categoría *</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Estado de Publicación</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none"
                  >
                    <option value="PUBLISHED">PUBLICADA</option>
                    <option value="DRAFT">BORRADOR</option>
                    <option value="SCHEDULED">PROGRAMADA</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Resumen Corto *</label>
                <input
                  type="text"
                  required
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Contenido HTML / Markdown *</label>
                <textarea
                  rows={5}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none font-mono text-xs"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Etiquetas (Separadas por coma)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="IA, Software, Innovación"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Fecha de Publicación</label>
                  <input
                    type="date"
                    value={formData.publishedAt}
                    onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Imagen Portada (JPG/PNG -&gt; Se convertirá a WebP automáticamente)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
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
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold"
                >
                  Guardar Noticia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
