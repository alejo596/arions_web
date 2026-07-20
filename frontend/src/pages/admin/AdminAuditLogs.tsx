import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { ShieldAlert, Download, RefreshCw, FileText } from 'lucide-react';

export const AdminAuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/dashboard/audit-logs');
      setLogs(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadBackup = async () => {
    try {
      const res = await api.get('/dashboard/backup', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `arions_db_backup_${Date.now()}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Error al descargar backup');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">Logs de Auditoría & Respaldo</h1>
          <p className="text-xs text-slate-400">Historial completo de acciones y exportación de copias de seguridad de PostgreSQL</p>
        </div>

        <button
          onClick={handleDownloadBackup}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center space-x-2 shadow-lg shadow-emerald-500/20"
        >
          <Download className="w-4 h-4" />
          <span>Descargar Backup Base de Datos (JSON)</span>
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
          <span className="text-xs font-bold text-slate-300 uppercase">Registro de Eventos y Acciones</span>
          <button onClick={fetchLogs} className="p-1.5 bg-slate-800 text-slate-400 hover:text-white rounded-lg">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="p-4">Usuario</th>
              <th className="p-4">Acción Realizada</th>
              <th className="p-4">Entidad Afectada</th>
              <th className="p-4">IP Origen</th>
              <th className="p-4">Fecha y Hora</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-800/40">
                <td className="p-4 font-bold text-white">
                  {log.user ? `${log.user.name} (${log.user.email})` : 'Sistema / Anónimo'}
                </td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-md font-bold text-[10px]">
                    {log.action}
                  </span>
                </td>
                <td className="p-4 text-slate-300">{log.entity} {log.entityId ? `[${log.entityId.slice(0, 8)}...]` : ''}</td>
                <td className="p-4 text-slate-500 font-mono text-[11px]">{log.ipAddress || '127.0.0.1'}</td>
                <td className="p-4 text-slate-400">{new Date(log.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
