import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNotifyAdminChange } from '../../hooks/useAdminSync';
import { 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  X, 
  FileText, 
  Calculator, 
  Mail, 
  User, 
  FolderGit, 
  Eye, 
  Download, 
  PlusCircle, 
  MinusCircle 
} from 'lucide-react';

interface BudgetItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export const AdminBudgets: React.FC = () => {
  const { user } = useAuth();
  const { notifyChange } = useNotifyAdminChange();

  // State
  const [budgets, setBudgets] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [loading, setLoading] = useState(true);

  // Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<any | null>(null);
  const [viewingBudget, setViewingBudget] = useState<any | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    clientName: '',
    clientRut: '',
    clientEmail: '',
    projectType: 'CONSTRUCTION', // default
    projectId: ''
  });
  const [items, setItems] = useState<BudgetItem[]>([
    { description: '', quantity: 1, unitPrice: 0 }
  ]);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  // Authorization checks
  const canEdit = user?.role === 'ADMIN' || user?.role === 'EDITOR';
  const canDelete = user?.role === 'ADMIN';

  // Load data
  useEffect(() => {
    fetchBudgets();
    fetchProjects();
  }, []);

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const res = await api.get('/budgets');
      setBudgets(res.data.data || []);
    } catch (err) {
      console.error('Error fetching budgets:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      // Get a large list of projects to link
      const res = await api.get('/projects?limit=1000');
      setProjects(res.data.data || []);
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };

  // Calculations
  const calculateTotals = (itemList: BudgetItem[]) => {
    const subtotal = itemList.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
    const iva = Math.round(subtotal * 0.19 * 100) / 100;
    const total = Math.round((subtotal + iva) * 100) / 100;
    return { subtotal, iva, total };
  };

  const totals = calculateTotals(items);

  // Form item handlers
  const handleAddItem = () => {
    setItems([...items, { description: '', quantity: 1, unitPrice: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof BudgetItem, value: any) => {
    const updated = [...items];
    if (field === 'quantity') {
      updated[index].quantity = parseInt(value, 10) || 0;
    } else if (field === 'unitPrice') {
      updated[index].unitPrice = parseFloat(value) || 0;
    } else {
      updated[index][field] = value;
    }
    setItems(updated);
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPdfFile(e.target.files[0]);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingBudget(null);
    setFormData({
      clientName: '',
      clientRut: '',
      clientEmail: '',
      projectType: 'CONSTRUCTION',
      projectId: ''
    });
    setItems([{ description: '', quantity: 1, unitPrice: 0 }]);
    setPdfFile(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (budget: any) => {
    setEditingBudget(budget);
    setFormData({
      clientName: budget.clientName,
      clientRut: budget.clientRut || '',
      clientEmail: budget.clientEmail,
      projectType: budget.projectType,
      projectId: budget.projectId || ''
    });
    
    // Parse items if they come as a string, otherwise use directly
    let parsedItems = budget.items;
    if (typeof parsedItems === 'string') {
      try {
        parsedItems = JSON.parse(parsedItems);
      } catch (e) {
        parsedItems = [];
      }
    }
    setItems(parsedItems.length > 0 ? parsedItems : [{ description: '', quantity: 1, unitPrice: 0 }]);
    setPdfFile(null);
    setModalOpen(true);
  };

  const handleOpenDetailModal = (budget: any) => {
    setViewingBudget(budget);
    setDetailModalOpen(true);
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clientNameTrimmed = (formData.clientName || '').trim();
    const clientEmailTrimmed = (formData.clientEmail || '').trim();
    const clientRutTrimmed = (formData.clientRut || '').trim();

    if (!clientNameTrimmed || !clientEmailTrimmed || !formData.projectType) {
      alert('Por favor rellena todos los campos requeridos (*)');
      return;
    }

    // Validate items
    const invalidItems = items.some(item => !(item.description || '').trim() || item.quantity <= 0 || item.unitPrice < 0);
    if (invalidItems) {
      alert('Por favor completa la descripción, cantidad y precio unitario de todos los ítems.');
      return;
    }

    try {
      const data = new FormData();
      data.append('clientName', clientNameTrimmed);
      data.append('clientRut', clientRutTrimmed);
      data.append('clientEmail', clientEmailTrimmed);
      data.append('projectType', formData.projectType);
      data.append('projectId', formData.projectId || '');
      data.append('items', JSON.stringify(items));
      if (pdfFile) {
        data.append('pdf', pdfFile);
      }

      if (editingBudget) {
        await api.put(`/budgets/${editingBudget.id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/budgets', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      setModalOpen(false);
      setEditingBudget(null);
      setPdfFile(null);
      fetchBudgets();
      notifyChange(['budgets']);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Error al guardar el presupuesto');
    }
  };

  // Delete Handler
  const handleDelete = async (id: string) => {
    if (confirm('¿Deseas eliminar este presupuesto de forma permanente?')) {
      try {
        await api.delete(`/budgets/${id}`);
        fetchBudgets();
        notifyChange(['budgets']);
      } catch (err: any) {
        console.error(err);
        alert(err.response?.data?.message || 'Error al eliminar presupuesto');
      }
    }
  };

  // Filtered list
  const filteredBudgets = budgets.filter(b => {
    const matchesSearch = 
      b.clientName.toLowerCase().includes(search.toLowerCase()) ||
      b.clientEmail.toLowerCase().includes(search.toLowerCase()) ||
      (b.clientRut && b.clientRut.toLowerCase().includes(search.toLowerCase()));
    
    const matchesType = typeFilter === '' || b.projectType === typeFilter;

    return matchesSearch && matchesType;
  });

  // Filter projects by selected type for dropdown, keeping the currently selected one in editing mode
  const filteredProjectsForDropdown = projects.filter(
    p => (p.type === formData.projectType && p.isActive) || p.id === formData.projectId
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-display flex items-center gap-2">
            <Calculator className="w-7 h-7 text-blue-500" />
            <span>Presupuestos y Cotizaciones</span>
          </h1>
          <p className="text-xs text-slate-400">
            Administra las cotizaciones formales e ítems detallados para clientes
          </p>
        </div>
        {canEdit && (
          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center space-x-2 shadow-lg shadow-blue-500/20 transition-all animate-fade-in"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Presupuesto</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center flex-1 w-full max-w-lg bg-slate-950 px-3.5 py-2.5 rounded-xl border border-slate-800 focus-within:border-blue-500 transition-colors">
          <Search className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por cliente, rut o email..."
            className="w-full bg-transparent text-white placeholder-slate-500 text-sm focus:outline-none"
          />
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full md:w-48 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="">Todos los tipos</option>
            <option value="CONSTRUCTION">Construcción y Obras</option>
            <option value="INNOVATION">Innovación y TI</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 text-center text-slate-400">
            <div className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-blue-500 rounded-full mb-4" role="status" aria-label="loading"></div>
            <p className="text-sm">Cargando presupuestos...</p>
          </div>
        ) : filteredBudgets.length === 0 ? (
          <div className="py-20 text-center text-slate-400">
            <FileText className="w-12 h-12 mx-auto text-slate-600 mb-3" />
            <p className="text-sm">No se encontraron presupuestos registrados</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">Cliente</th>
                  <th className="p-4">Tipo</th>
                  <th className="p-4">Proyecto Relacionado</th>
                  <th className="p-4">Subtotal</th>
                  <th className="p-4">Total (IVA Incl.)</th>
                  <th className="p-4">Doc. PDF</th>
                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredBudgets.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-white">{b.clientName}</div>
                      {b.clientRut && <div className="text-[10px] text-slate-400">RUT: {b.clientRut}</div>}
                      <div className="text-[10px] text-slate-400">{b.clientEmail}</div>
                    </td>
                    <td className="p-4">
                      {b.projectType === 'INNOVATION' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          Innovación
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Construcción
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-slate-300">
                      {b.project?.title ? (
                        <span className="font-medium text-slate-200">{b.project.title}</span>
                      ) : (
                        <span className="text-slate-500 italic">Ninguno</span>
                      )}
                    </td>
                    <td className="p-4 text-slate-400 font-medium">
                      ${b.subtotal.toLocaleString('es-CL')}
                    </td>
                    <td className="p-4 font-bold text-white">
                      ${b.total.toLocaleString('es-CL')}
                    </td>
                    <td className="p-4">
                      {b.pdfUrl ? (
                        <a
                          href={`${api.defaults.baseURL?.replace('/api/v1', '')}${b.pdfUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1.5 text-blue-400 hover:text-blue-300 font-semibold"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>PDF</span>
                        </a>
                      ) : (
                        <span className="text-slate-600 italic">Sin PDF</span>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenDetailModal(b)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                        title="Ver detalle"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      {canEdit && (
                        <button
                          onClick={() => handleOpenEditModal(b)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      )}

                      {canDelete && (
                        <button
                          onClick={() => handleDelete(b.id)}
                          className="p-1.5 bg-slate-800 hover:bg-rose-950 text-rose-400 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl my-8">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
                <Calculator className="w-5 h-5 text-blue-500" />
                <span>{editingBudget ? 'Editar Presupuesto' : 'Nuevo Presupuesto'}</span>
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Cliente Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre del Cliente *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={formData.clientName}
                      onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                      placeholder="Ej. Juan Pérez / Empresa S.A."
                      className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">RUT Cliente (Opcional)</label>
                  <input
                    type="text"
                    value={formData.clientRut}
                    onChange={(e) => setFormData({ ...formData, clientRut: e.target.value })}
                    placeholder="Ej. 12.345.678-9"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Correo Electrónico *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={formData.clientEmail}
                      onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                      placeholder="cliente@correo.com"
                      className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Proyecto Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Tipo de Proyecto *</label>
                  <select
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value, projectId: '' })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="CONSTRUCTION">Construcción y Obras</option>
                    <option value="INNOVATION">Innovación y TI</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Vincular a Proyecto (Opcional)</label>
                  <div className="relative">
                    <FolderGit className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                    <select
                      value={formData.projectId}
                      onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-blue-500"
                    >
                      <option value="">Ninguno (General / Sin vincular)</option>
                      {filteredProjectsForDropdown.map(proj => (
                        <option key={proj.id} value={proj.id}>
                          {proj.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* PDF Document Upload */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                <label className="block text-xs font-semibold text-slate-300 mb-1">Documento PDF del Presupuesto Oficial</label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handlePdfChange}
                    className="w-full text-slate-400 text-xs file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-600/10 file:text-blue-400 hover:file:bg-blue-600/20"
                  />
                  {editingBudget && editingBudget.pdfUrl && (
                    <div className="text-[10px] text-slate-400 flex items-center space-x-1 whitespace-nowrap">
                      <span className="font-bold">PDF Actual:</span>
                      <a 
                        href={`${api.defaults.baseURL?.replace('/api/v1', '')}${editingBudget.pdfUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-400 underline hover:text-blue-300"
                      >
                        Ver Documento
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Items Section */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Detalle del Presupuesto (Ítems)</span>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="px-3 py-1.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 text-xs font-bold rounded-lg flex items-center space-x-1.5 transition-all"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Agregar Ítem</span>
                  </button>
                </div>

                <div className="overflow-x-auto border border-slate-850 rounded-2xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="p-3">Descripción *</th>
                        <th className="p-3 w-24">Cant *</th>
                        <th className="p-3 w-36">Precio Unitario *</th>
                        <th className="p-3 w-32">Total</th>
                        <th className="p-3 w-12 text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50 bg-slate-950/40">
                      {items.map((item, index) => (
                        <tr key={index} className="hover:bg-slate-950/20">
                          <td className="p-3">
                            <input
                              type="text"
                              required
                              value={item.description}
                              onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                              placeholder="Ej. Desarrollo de módulo de cotizaciones / Materiales de construcción"
                              className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none"
                            />
                          </td>
                          <td className="p-3">
                            <input
                              type="number"
                              required
                              min="1"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                              className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs text-center focus:outline-none"
                            />
                          </td>
                          <td className="p-3">
                            <input
                              type="number"
                              required
                              min="0"
                              value={item.unitPrice}
                              onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                              className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none"
                            />
                          </td>
                          <td className="p-3 text-slate-300 font-bold">
                            ${(item.quantity * item.unitPrice).toLocaleString('es-CL')}
                          </td>
                          <td className="p-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(index)}
                              disabled={items.length === 1}
                              className={`text-rose-500 hover:text-rose-400 p-1 rounded-lg ${items.length === 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
                            >
                              <MinusCircle className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totales Card */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 max-w-xs ml-auto space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-slate-300">${totals.subtotal.toLocaleString('es-CL')}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>IVA (19%):</span>
                  <span className="font-semibold text-slate-300">${totals.iva.toLocaleString('es-CL')}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white border-t border-slate-800 pt-2">
                  <span>Total Neto:</span>
                  <span>${totals.total.toLocaleString('es-CL')}</span>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex justify-end gap-3 border-t border-slate-800 pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-colors shadow-lg shadow-blue-500/20"
                >
                  {editingBudget ? 'Guardar Cambios' : 'Crear Presupuesto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailModalOpen && viewingBudget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl my-8">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white font-display">Detalle del Presupuesto</h3>
                <span className="text-[10px] text-slate-500">ID: {viewingBudget.id}</span>
              </div>
              <button onClick={() => setDetailModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-2">
                <span className="text-[10px] font-bold text-blue-400 uppercase">Información del Cliente</span>
                <div className="text-xs space-y-1 text-slate-300">
                  <p><span className="text-slate-500">Nombre:</span> <strong className="text-white">{viewingBudget.clientName}</strong></p>
                  {viewingBudget.clientRut && <p><span className="text-slate-500">RUT:</span> <strong>{viewingBudget.clientRut}</strong></p>}
                  <p><span className="text-slate-500">Email:</span> <strong>{viewingBudget.clientEmail}</strong></p>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-2">
                <span className="text-[10px] font-bold text-blue-400 uppercase">Información del Proyecto</span>
                <div className="text-xs space-y-1 text-slate-300">
                  <p>
                    <span className="text-slate-500">Área:</span>{' '}
                    <strong>{viewingBudget.projectType === 'INNOVATION' ? 'Innovación' : 'Construcción'}</strong>
                  </p>
                  <p>
                    <span className="text-slate-500">Proyecto Vinculado:</span>{' '}
                    <strong>{viewingBudget.project?.title || 'Ninguno'}</strong>
                  </p>
                  <p>
                    <span className="text-slate-500">Documentación:</span>{' '}
                    {viewingBudget.pdfUrl ? (
                      <a 
                        href={`${api.defaults.baseURL?.replace('/api/v1', '')}${viewingBudget.pdfUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-400 underline hover:text-blue-300 font-bold inline-flex items-center space-x-1"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Descargar Presupuesto Oficial</span>
                      </a>
                    ) : (
                      <span className="text-slate-500 italic">No se ha cargado documento PDF</span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Items Table View */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Ítems Detallados</span>
              <div className="overflow-hidden border border-slate-850 rounded-2xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="p-3">Descripción</th>
                      <th className="p-3 text-center w-24">Cant.</th>
                      <th className="p-3 text-right w-36">Precio Unitario</th>
                      <th className="p-3 text-right w-32">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-slate-950/20">
                    {(typeof viewingBudget.items === 'string' ? JSON.parse(viewingBudget.items) : viewingBudget.items).map((item: any, idx: number) => (
                      <tr key={idx}>
                        <td className="p-3 text-white">{item.description}</td>
                        <td className="p-3 text-center text-slate-300">{item.quantity}</td>
                        <td className="p-3 text-right text-slate-300">${item.unitPrice.toLocaleString('es-CL')}</td>
                        <td className="p-3 text-right font-bold text-white">${(item.quantity * item.unitPrice).toLocaleString('es-CL')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Final totals */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 max-w-xs ml-auto space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Subtotal:</span>
                <span className="font-semibold text-slate-300">${viewingBudget.subtotal.toLocaleString('es-CL')}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>IVA (19%):</span>
                <span className="font-semibold text-slate-300">${viewingBudget.iva.toLocaleString('es-CL')}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white border-t border-slate-800 pt-2">
                <span>Total Neto:</span>
                <span className="text-blue-400">${viewingBudget.total.toLocaleString('es-CL')}</span>
              </div>
            </div>

            <div className="flex justify-end border-t border-slate-800 pt-4">
              <button
                type="button"
                onClick={() => setDetailModalOpen(false)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
