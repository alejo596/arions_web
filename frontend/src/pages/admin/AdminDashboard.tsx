import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Newspaper, Cpu, Hammer, Users, MessageSquare, ArrowUpRight, ShieldAlert } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await api.get('/dashboard/stats');
      setStats(res.data.data);
    } catch (err) {
      console.error('Error dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-slate-400">Cargando métricas del panel...</div>;
  }

  const summary = stats?.summary || {};

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white font-display">Resumen Ejecutivo</h1>
        <p className="text-xs text-slate-400">Estadísticas y actividad reciente del sistema ARIONS</p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-blue-400">
            <span className="text-xs font-semibold uppercase">Noticias</span>
            <Newspaper className="w-5 h-5" />
          </div>
          <p className="text-3xl font-bold text-white font-display">{summary.totalNews || 0}</p>
          <p className="text-[11px] text-slate-500">Publicadas en blog</p>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-blue-400">
            <span className="text-xs font-semibold uppercase">Innovación</span>
            <Cpu className="w-5 h-5" />
          </div>
          <p className="text-3xl font-bold text-white font-display">{summary.innovationProjects || 0}</p>
          <p className="text-[11px] text-slate-500">Proyectos software e IA</p>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-emerald-400">
            <span className="text-xs font-semibold uppercase">Construcción</span>
            <Hammer className="w-5 h-5" />
          </div>
          <p className="text-3xl font-bold text-white font-display">{summary.constructionProjects || 0}</p>
          <p className="text-[11px] text-slate-500">Obras y remodelaciones</p>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-purple-400">
            <span className="text-xs font-semibold uppercase">Usuarios</span>
            <Users className="w-5 h-5" />
          </div>
          <p className="text-3xl font-bold text-white font-display">{summary.totalUsers || 0}</p>
          <p className="text-[11px] text-slate-500">Admins & Editores</p>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-amber-400">
            <span className="text-xs font-semibold uppercase">Contactos</span>
            <MessageSquare className="w-5 h-5" />
          </div>
          <p className="text-3xl font-bold text-white font-display">{summary.pendingContacts || 0}</p>
          <p className="text-[11px] text-amber-400 font-semibold">Mensajes pendientes</p>
        </div>
      </div>

      {/* Chart.js Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
          <h3 className="text-sm font-bold text-white font-display">Distribución de Proyectos</h3>
          <div className="h-64 flex items-center justify-center">
            {stats?.charts?.projectStatsChart && (
              <Bar
                data={stats.charts.projectStatsChart}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    x: { ticks: { color: '#94a3b8' }, grid: { display: false } },
                    y: { ticks: { color: '#94a3b8' }, grid: { color: '#1e293b' } }
                  }
                }}
              />
            )}
          </div>
        </div>

        <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
          <h3 className="text-sm font-bold text-white font-display">Estado de Mensajes de Contacto</h3>
          <div className="h-64 flex items-center justify-center">
            {stats?.charts?.contactStatusChart && (
              <Doughnut
                data={stats.charts.contactStatusChart}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8' } } }
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity & Contacts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Contacts Table */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white font-display">Últimas Consultas de Contacto</h3>
            <a href="/admin/contacts" className="text-xs text-blue-400 hover:underline">Ver todas</a>
          </div>
          <div className="space-y-3">
            {stats?.recentContacts?.map((c: any) => (
              <div key={c.id} className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold text-white">{c.name} ({c.email})</p>
                  <p className="text-slate-400 text-[11px]">{c.subject}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  c.status === 'PENDING' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Logs Preview */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white font-display flex items-center">
              <ShieldAlert className="w-4 h-4 text-emerald-400 mr-2" /> Log de Auditoría Reciente
            </h3>
            <a href="/admin/audit-logs" className="text-xs text-blue-400 hover:underline">Ver historial</a>
          </div>
          <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
            {stats?.recentAuditLogs?.map((log: any) => (
              <div key={log.id} className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800 text-[11px] flex justify-between items-center">
                <div>
                  <span className="font-bold text-blue-400">{log.action}</span>
                  <span className="text-slate-400"> en {log.entity}</span>
                </div>
                <span className="text-slate-500">{new Date(log.createdAt).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
