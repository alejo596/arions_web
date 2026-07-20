import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { MessageSquare, Search, Eye, CheckCircle2, Clock, Mail } from 'lucide-react';

export const AdminContacts: React.FC = () => {
  const [contacts, setContacts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedContact, setSelectedContact] = useState<any | null>(null);
  const [replyNotes, setReplyNotes] = useState('');

  useEffect(() => {
    fetchContacts();
  }, [search]);

  const fetchContacts = async () => {
    try {
      const res = await api.get(`/contacts/admin/list?search=${encodeURIComponent(search)}`);
      setContacts(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (status: string) => {
    if (!selectedContact) return;
    try {
      await api.put(`/contacts/${selectedContact.id}/status`, { status, replyNotes });
      setSelectedContact(null);
      fetchContacts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white font-display">Mensajes de Contacto</h1>
        <p className="text-xs text-slate-400">Consultas de clientes recibidas a través del formulario web</p>
      </div>

      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center">
        <Search className="w-4 h-4 text-slate-400 mr-2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por remitente, correo o asunto..."
          className="w-full bg-transparent text-white placeholder-slate-500 text-sm focus:outline-none"
        />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="p-4">Remitente</th>
              <th className="p-4">Correo / Teléfono</th>
              <th className="p-4">Asunto</th>
              <th className="p-4">Estado</th>
              <th className="p-4">Fecha</th>
              <th className="p-4 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {contacts.map((c) => (
              <tr key={c.id} className="hover:bg-slate-800/40">
                <td className="p-4 font-bold text-white">{c.name} {c.company ? `(${c.company})` : ''}</td>
                <td className="p-4">{c.email} <br /><span className="text-slate-500">{c.phone || 'Sin tel'}</span></td>
                <td className="p-4 font-semibold text-slate-200">{c.subject}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    c.status === 'PENDING' ? 'bg-amber-500/20 text-amber-400' :
                    c.status === 'READ' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {c.status}
                  </span>
                </td>
                <td className="p-4 text-slate-400">{new Date(c.createdAt).toLocaleString()}</td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => {
                      setSelectedContact(c);
                      setReplyNotes(c.replyNotes || '');
                    }}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-lg flex items-center space-x-1 text-xs font-semibold ml-auto"
                  >
                    <Eye className="w-4 h-4 mr-1" /> Ver Detalle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white font-display">Detalle del Mensaje</h3>
            
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <p><strong>De:</strong> {selectedContact.name} ({selectedContact.email})</p>
              {selectedContact.phone && <p><strong>Teléfono:</strong> {selectedContact.phone}</p>}
              <p><strong>Asunto:</strong> {selectedContact.subject}</p>
              <div className="pt-2 border-t border-slate-800 text-slate-300 whitespace-pre-wrap">
                {selectedContact.message}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Notas de Respuesta Interna</label>
              <textarea
                rows={3}
                value={replyNotes}
                onChange={(e) => setReplyNotes(e.target.value)}
                placeholder="Escribe comentarios de seguimiento o respuesta enviada..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none"
              ></textarea>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => setSelectedContact(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cerrar
              </button>
              
              <div className="space-x-2">
                <button
                  onClick={() => handleUpdateStatus('READ')}
                  className="px-3 py-2 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-xl text-xs font-semibold"
                >
                  Marcar Leído
                </button>
                <button
                  onClick={() => handleUpdateStatus('REPLIED')}
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold"
                >
                  Marcar Respondido
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
