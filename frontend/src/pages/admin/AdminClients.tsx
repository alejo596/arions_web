import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Search, Plus, Trash2, Edit3, X, Upload, Globe } from 'lucide-react';
import { useNotifyAdminChange } from '../../hooks/useAdminSync';

export const AdminClients: React.FC = () => {
  const { notifyChange } = useNotifyAdminChange();
  const [clients, setClients] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<any | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    websiteUrl: '',
    order: 0
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await api.get('/clients');
      setClients(res.data.data || []);
      setSelectedIds([]);
    } catch (err) {
      console.error('Error fetching clients:', err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('El nombre es obligatorio');
      return;
    }
    if (!editingClient && !logoFile) {
      alert('Debes seleccionar un logotipo');
      return;
    }

    try {
      const data = new FormData();
      data.append('name', formData.name.trim());
      data.append('websiteUrl', formData.websiteUrl.trim());
      data.append('order', String(formData.order));
      if (logoFile) {
        data.append('logo', logoFile);
      }

      if (editingClient) {
        await api.put(`/clients/${editingClient.id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/clients', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      setModalOpen(false);
      setEditingClient(null);
      setLogoFile(null);
      setLogoPreview(null);
      fetchClients();
      notifyChange(['clients']);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al guardar cliente');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Deseas eliminar esta empresa de la lista?')) {
      try {
        await api.delete(`/clients/${id}`);
        fetchClients();
        notifyChange(['clients']);
      } catch (err) {
        console.error('Error deleting client:', err);
      }
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    const visibleIds = filteredClients.map(c => c.id);
    const allVisibleSelected = visibleIds.length > 0 && visibleIds.every(id => selectedIds.includes(id));

    if (allVisibleSelected) {
      setSelectedIds(prev => prev.filter(id => !visibleIds.includes(id)));
    } else {
      setSelectedIds(prev => {
        const otherSelected = prev.filter(id => !visibleIds.includes(id));
        return [...otherSelected, ...visibleIds];
      });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (confirm(`¿Deseas eliminar las ${selectedIds.length} empresas seleccionadas?`)) {
      try {
        await Promise.all(selectedIds.map(id => api.delete(`/clients/${id}`)));
        fetchClients();
        notifyChange(['clients']);
      } catch (err) {
        console.error('Error deleting multiple clients:', err);
        alert('Ocurrió un error al eliminar algunas empresas.');
      }
    }
  };

  const filteredClients = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">Empresas e Instituciones</h1>
          <p className="text-xs text-slate-400">Administra las marcas, logos y enlaces de las empresas que confían en ARION</p>
        </div>
        <button
          onClick={() => {
            setEditingClient(null);
            setFormData({
              name: '',
              websiteUrl: '',
              order: clients.length + 1
            });
            setLogoFile(null);
            setLogoPreview(null);
            setModalOpen(true);
          }}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center space-x-2 shadow-lg shadow-blue-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar Empresa</span>
        </button>
      </div>

      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 mr-2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar empresas por nombre..."
            className="w-full bg-transparent text-white placeholder-slate-500 text-sm focus:outline-none"
          />
        </div>
        {selectedIds.length > 0 && (
          <button
            onClick={handleBulkDelete}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl flex items-center space-x-2 shadow-lg shadow-rose-500/20 transition-all self-end sm:self-auto"
          >
            <Trash2 className="w-4 h-4" />
            <span>Eliminar Seleccionados ({selectedIds.length})</span>
          </button>
        )}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={filteredClients.length > 0 && filteredClients.every(c => selectedIds.includes(c.id))}
                    onChange={handleToggleSelectAll}
                    className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </th>
                <th className="p-4">Logo</th>
                <th className="p-4">Nombre</th>
                <th className="p-4">Sitio Web</th>
                <th className="p-4">Orden</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No se encontraron empresas registradas.
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 w-12 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(client.id)}
                        onChange={() => handleToggleSelect(client.id)}
                        className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </td>
                    <td className="p-4">
                      <div className="p-2 bg-slate-950/60 border border-slate-800/60 rounded-xl inline-flex items-center justify-center w-16 h-12">
                        <img
                          src={client.logoWebp}
                          alt={client.name}
                          className="h-8 max-w-full object-contain filter invert opacity-80"
                        />
                      </div>
                    </td>
                    <td className="p-4 font-bold text-white max-w-xs truncate">
                      {client.name}
                    </td>
                    <td className="p-4">
                      {client.websiteUrl ? (
                        <a
                          href={client.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 hover:underline flex items-center space-x-1"
                        >
                          <Globe className="w-3.5 h-3.5" />
                          <span className="truncate max-w-[150px]">{client.websiteUrl}</span>
                        </a>
                      ) : (
                        <span className="text-slate-500">N/A</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-400">
                        {client.order}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => {
                            setEditingClient(client);
                            setFormData({
                              name: client.name,
                              websiteUrl: client.websiteUrl || '',
                              order: client.order
                            });
                            setLogoFile(null);
                            setLogoPreview(client.logoWebp);
                            setModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          title="Editar"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(client.id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CRUD Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-base font-bold text-white font-display">
                {editingClient ? 'Editar Empresa' : 'Nueva Empresa'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-850 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nombre de la Empresa / Institución *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Tesla Energy"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-blue-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Sitio Web (Opcional)
                </label>
                <input
                  type="url"
                  value={formData.websiteUrl}
                  onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                  placeholder="Ej: https://tesla.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-blue-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Orden de Visualización
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value, 10) || 0 })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-blue-500/50"
                />
              </div>

              {/* Logo upload */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Logotipo (Recomendado: Fondo Transparente o Contraste Alto) *
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-800 border-dashed rounded-2xl bg-slate-950/40 hover:bg-slate-950/60 transition-colors relative">
                  <div className="space-y-1 text-center">
                    {logoPreview ? (
                      <div className="flex flex-col items-center">
                        <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl inline-flex justify-center items-center h-16 w-32 mb-2">
                          <img
                            src={logoPreview}
                            alt="Vista previa"
                            className="max-h-full max-w-full object-contain filter invert"
                          />
                        </div>
                        <p className="text-[10px] text-slate-400">Click para cambiar el logotipo</p>
                      </div>
                    ) : (
                      <>
                        <Upload className="mx-auto h-8 w-8 text-slate-500" />
                        <div className="flex text-xs text-slate-400">
                          <span className="text-blue-500 hover:underline cursor-pointer">Sube un archivo</span>
                          <p className="pl-1">o arrastra y suelta</p>
                        </div>
                        <p className="text-[10px] text-slate-500">PNG, JPG, SVG o WebP hasta 5MB</p>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-850 hover:bg-slate-850 text-slate-300 text-xs font-bold transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition-all"
                >
                  {editingClient ? 'Guardar Cambios' : 'Registrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
